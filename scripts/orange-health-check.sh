#!/bin/bash
# Orange Neemo Agent Health Monitor
# Runs from Rhino, SSHes into Orange, checks all 4 agents.
# Alerts via Telegram + Email + WhatsApp if any agent is down or Orange is unreachable.
#
# Usage: Run via cron or scheduled task every 5 minutes.
# Requires: ssh orange configured, .env with alerting credentials.

set -uo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"
STATE_FILE="/tmp/orange-health-state"

# Load .env
if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi

TELEGRAM_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
CHAT_ID="${ALLOWED_CHAT_ID:-}"
EVO_URL="${EVOLUTION_API_URL:-}"
EVO_KEY="${EVOLUTION_API_KEY:-}"
EVO_INSTANCE="${EVOLUTION_INSTANCE_NAME:-}"
WA_NUMBER="${OWNER_WHATSAPP:-}"
GMAIL_FROM="${GMAIL_ADDRESS:-}"
GMAIL_PASS="${GMAIL_PASSWORD:-}"
GMAIL_TO="${ERIC_GMAIL_ADDRESS:-}"

AGENTS=("bob" "victor" "glory" "peter")

# --- Alert Functions ---

send_telegram() {
  local msg="$1"
  if [[ -n "$TELEGRAM_TOKEN" && -n "$CHAT_ID" ]]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
      -d "chat_id=${CHAT_ID}" \
      -d "text=${msg}" \
      -d "parse_mode=HTML" > /dev/null 2>&1
  fi
}

send_whatsapp() {
  local msg="$1"
  if [[ -n "$EVO_URL" && -n "$EVO_KEY" && -n "$EVO_INSTANCE" && -n "$WA_NUMBER" ]]; then
    curl -s -X POST "${EVO_URL}/message/sendText/${EVO_INSTANCE}" \
      -H "apikey: ${EVO_KEY}" \
      -H "Content-Type: application/json" \
      -d "{\"number\": \"${WA_NUMBER}\", \"text\": \"${msg}\"}" > /dev/null 2>&1
  fi
}

send_email() {
  local subject="$1"
  local body="$2"
  if [[ -n "$GMAIL_FROM" && -n "$GMAIL_PASS" && -n "$GMAIL_TO" ]]; then
    python3 -c "
import smtplib
from email.mime.text import MIMEText
msg = MIMEText('''$body''')
msg['Subject'] = '$subject'
msg['From'] = '$GMAIL_FROM'
msg['To'] = '$GMAIL_TO'
try:
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login('$GMAIL_FROM', '$GMAIL_PASS')
    s.sendmail('$GMAIL_FROM', '$GMAIL_TO', msg.as_string())
    s.quit()
except Exception as e:
    pass
" 2>/dev/null
  fi
}

alert_all() {
  local msg="$1"
  local subject="${2:-[ALERT] Orange Neemo Agent Down}"
  send_telegram "$msg"
  send_whatsapp "$(echo "$msg" | sed 's/<[^>]*>//g')"  # strip HTML for WA
  send_email "$subject" "$(echo "$msg" | sed 's/<[^>]*>//g')"
}

# --- State Management (avoid spamming) ---

get_state() {
  if [[ -f "$STATE_FILE" ]]; then
    cat "$STATE_FILE"
  else
    echo "ok"
  fi
}

set_state() {
  echo "$1" > "$STATE_FILE"
}

# --- Main Check ---

# Test SSH connectivity
if ! ssh -o ConnectTimeout=10 -o BatchMode=yes orange "echo ok" > /dev/null 2>&1; then
  prev_state=$(get_state)
  if [[ "$prev_state" != "unreachable" ]]; then
    alert_all "🚨 <b>Orange Neemo UNREACHABLE</b>

SSH connection failed. Server may be down or network issue.

Time: $(date '+%Y-%m-%d %H:%M:%S %Z')" "[CRITICAL] Orange Neemo Unreachable"
    set_state "unreachable"
  fi
  exit 1
fi

# Check each agent
failed_agents=()
for agent in "${AGENTS[@]}"; do
  status=$(ssh -o ConnectTimeout=10 orange "systemctl --user is-active claudeclaw-${agent} 2>/dev/null; true") || status="unreachable"
  status=$(echo "$status" | head -1 | xargs)  # clean whitespace, first line only
  if [[ "$status" != "active" ]]; then
    failed_agents+=("${agent}:${status}")
  fi
done

# Evaluate results
if [[ ${#failed_agents[@]} -eq 0 ]]; then
  # All good
  prev_state=$(get_state)
  if [[ "$prev_state" != "ok" ]]; then
    # Recovery alert
    alert_all "✅ <b>Orange Neemo RECOVERED</b>

All 4 agents are running again.

Time: $(date '+%Y-%m-%d %H:%M:%S %Z')" "[RECOVERED] Orange Neemo Agents OK"
  fi
  set_state "ok"
else
  # Something is down
  prev_state=$(get_state)
  failed_list=$(printf '%s, ' "${failed_agents[@]}")
  failed_list="${failed_list%, }"

  if [[ "$prev_state" == "ok" ]]; then
    # First failure detection — alert
    alert_all "🚨 <b>Orange Neemo Agent(s) DOWN</b>

Failed: ${failed_list}
Total down: ${#failed_agents[@]}/4

Time: $(date '+%Y-%m-%d %H:%M:%S %Z')
Action: Check manually or wait for auto-recovery (5 restarts max in 10 min)." "[ALERT] Orange Agent Down: ${failed_list}"
    set_state "alerting:${failed_list}"
  fi
  # If already in alerting state, don't spam — only alert once until recovery
fi
