# Hermes Deployment Vault - Credentials Finalized

**Date:** 2026-05-22
**Location:** Denzel (100.86.14.92) at ~/hermes-deploy/vault.env

## Summary

Completed credential audit and update for the Hermes agent deployment vault. All shared API keys have been refreshed and a company Kimi API key has been added as the default LLM provider for new agents.

## Vault Contents (verified)

| Credential | Purpose | Status |
|---|---|---|
| OPENROUTER_API_KEY | LLM fallback provider | Updated |
| OPENAI_API_KEY | LLM fallback | Updated |
| GOOGLE_API_KEY | Gemini / Google services | Updated |
| KIMI_API_KEY | Default LLM for Hermes agents (company key) | **NEW** - Added |
| GROQ_API_KEY | STT via Whisper transcription | Updated |
| ELEVENLABS_API_KEY | TTS voice output | Updated |
| ELEVENLABS_VOICE_ID | Default ElevenLabs voice (cgSgspJ2msm6clMCkdW9) | Unchanged |

## Per-Agent Credentials (not in vault)

These stay in each agent's YAML manifest:
- TELEGRAM_BOT_TOKEN - unique per agent
- TELEGRAM_ALLOWED_USERS - set after pairing
- KIMI_API_KEY (optional override) - if agent needs a different Kimi key

## Live Fleet on Denzel

| Container | Dashboard Port | Status |
|---|---|---|
| ethan-bot | 9118 | Up 41h |
| samadhi-bot | 9119 | Up 41h (healthy) |
| stephanie-bot | 9120 | Up 42h |
| kelly-bot | 9121 | Up 17h (healthy) |

## Deployment Workflow

New agent setup is now 4 steps:
1. Provide: owner name, agent name, Telegram token
2. Optionally provide per-agent Kimi key (otherwise inherits from vault)
3. Write YAML manifest to ~/hermes-deploy/manifests/
4. Run: `~/hermes-deploy/deploy-hermes.sh manifests/<name>.yaml`

deploy-hermes.sh handles everything: filesystem prep, Docker run with all critical flags (HERMES_UID/GID, dashboard, gateway run), health check, port assignment, and verification.

## Next Steps

- Build the "Agent in a Box" dashboard for web-based agent spin-up
- Dashboard will read the same YAML manifests and vault.env
- Template registry pattern: adding new platforms = new YAML, no code changes
