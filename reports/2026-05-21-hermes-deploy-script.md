# Hermes Agent One-Shot Deployment Script

**Date:** 2026-05-21
**Status:** Built and tested
**Location:** `~/hermes-deploy/` on Denzel (100.86.14.92)

---

## What was built

### Files on Denzel (~/hermes-deploy/):
- `deploy-hermes.sh` — main deployment script (bash, ~250 lines)
- `vault.env` — shared API keys (OpenRouter, OpenAI, Google, Groq, ElevenLabs) all agents inherit
- `manifests/TEMPLATE.yaml` — blank manifest template for new agents
- `manifests/kelly.yaml` — reference manifest from proven kelly-bot deployment

### Updated on Hornbill:
- `~/.claude/skills/container-launcher/templates/hermes.yaml` — upgraded from stub to production template with all failure modes documented

## How it works

1. Copy TEMPLATE.yaml, fill in 4 fields: owner name, agent name, Telegram token, Kimi API key
2. Run: `~/hermes-deploy/deploy-hermes.sh manifest.yaml`
3. Script does everything: validates token, auto-assigns port, creates .env from vault + manifest, runs docker with all correct flags hardcoded, writes SOUL.md, configures model/TTS/STT, waits for health check

## Key design decisions

- **4 critical flags hardcoded** (HERMES_UID=1000, HERMES_GID=1000, HERMES_DASHBOARD=1, `gateway run`) — never configurable, can't be forgotten
- **Shared credentials vault** (vault.env) — 5 API keys typed once, inherited by all agents
- **Per-agent Kimi keys** — each agent gets their own, required in manifest
- **Auto port assignment** — scans existing containers, takes next available (floor: 9118)
- **Idempotent** — detects existing containers, suggests --recreate
- **Dry run** — `--dry-run` flag shows summary without deploying
- **Telegram validation** — checks token via getMe API before creating anything

## Tested scenarios
- Idempotency: running against existing kelly-bot correctly detects and exits
- Dry run: shows full summary with auto-assigned port 9122, no changes made
- Port auto-assignment: correctly found max port 9121 and assigned 9122

## Workflow for new agent

```
1. Eric provides: owner name, agent name, Telegram token, Kimi key
2. Write 6-line YAML manifest
3. Run one command
4. Agent is live with Telegram, TTS, STT, dashboard
5. Have user message bot -> get pairing code -> approve
```

## Manifest template

```yaml
owner: ""                    # Person's name (e.g. "Kelly Yan")
agent_name: ""               # AI agent name (e.g. "Orange" -- NOT the owner's name)
telegram_bot_token: ""       # From @BotFather
llm_provider: kimi           # "kimi" (direct API) or "openrouter"
kimi_api_key: ""             # Required if llm_provider=kimi
```

## Port map on Denzel
- 9118: ethan-bot
- 9119: samadhi-bot
- 9120: stephanie-bot
- 9121: kelly-bot (Orange)
- 9122+: next agents

## deploy-hermes.sh phases

1. **Parse & Validate** — read manifest, load vault, validate Telegram token, auto-assign port, check conflicts
2. **Prepare Filesystem** — create data dir, generate .env, archive manifest
3. **Docker Run** — hardcoded critical flags (HERMES_UID, gateway run, health check), env-file from generated .env
4. **Wait & Configure** — wait for gateway, fix ownership, write SOUL.md, configure model/TTS/STT in config.yaml, restart
5. **Verify & Report** — wait for health, print summary with next steps for pairing

## Known failure modes (all handled by script)

| Symptom | Root Cause | How script prevents it |
|---|---|---|
| PermissionError on /opt/data | Missing HERMES_UID/GID | Hardcoded in docker run |
| Container exits with "Goodbye!" | Missing gateway run | Hardcoded in docker run |
| No user allowlists warning | Missing TELEGRAM_ALLOWED_USERS | Documented in next steps |
| Provider kimi-coding no API key | KIMI_API_KEY missing | Validated in Phase 1 |
| No voice responses | auto_tts: false default | Set to true in Phase 4 |

## Future: Agent in a Box Dashboard

This script is the engine. The future web dashboard will:
1. Present a form with the same fields as the manifest YAML
2. Generate the YAML
3. Call deploy-hermes.sh
4. Show real-time deployment progress

Same backend, better frontend.
