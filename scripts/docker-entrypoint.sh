#!/bin/bash
# ClaudeClaw Docker Entrypoint
# Fix A: Pre-start Telegram session cleanup
# Clears stale getUpdates long-poll sessions that cause Grammy 409 conflicts
# when a container restarts before the old session expires (~30s).

set -e

# Clean stale Telegram session before starting the bot
if [ -n "$TELEGRAM_BOT_TOKEN" ]; then
  echo "[entrypoint] Clearing stale Telegram sessions..."
  curl -sf --max-time 10 \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook?drop_pending_updates=true" \
    > /dev/null 2>&1 || echo "[entrypoint] Warning: Could not clear Telegram session (non-fatal)"
  # Brief pause to let Telegram finalize the session cleanup
  sleep 2
fi

# Graceful shutdown: forward SIGTERM/SIGINT to the node process
# This ensures child processes (claude CLI) get cleaned up properly
exec node dist/index.js "$@"
