# ClaudeClaw-OS Git Fork Setup — 2026-05-09

## What Was Done

### Problem
Local clone of `earlyaidopters/claudeclaw-os` had diverged:
- **39 commits ahead** — custom local work (HyperFrames, GitNexus, watch agent, Discord adapter, slash-command dispatch, etc.)
- **217 commits behind** — upstream community updates
- Only one remote (`origin`) pointed at the community repo — risky for accidental pushes

### Solution: Fork + Dual Remote Setup

1. **Created personal fork**: `github.com/ericoh88/claudeclaw-os`
2. **Renamed remotes** for clarity:
   - `origin` (community) → renamed to `upstream`
   - New `origin` → points to personal fork (`ericoh88/claudeclaw-os`)
3. **Force-pushed** all 39 local commits to the personal fork

### Current Remote Layout
```
origin   → github.com/ericoh88/claudeclaw-os       (YOUR fork — PUSH here)
upstream → github.com/earlyaidopters/claudeclaw-os  (community — PULL only)
```

### Daily Workflow
```bash
# Get latest community updates
git pull upstream main

# Save your work to your fork
git push origin main
```

### Still TODO
- Merge the 217 upstream commits into local (`git pull upstream main`)
  - May have merge conflicts — review carefully
- Update Claude Code from v2.1.123 → v2.1.133

## Claude Code Version Info
- Currently running: **v2.1.123**
- Installed: 2.1.92, 2.1.101, 2.1.105, 2.1.122, 2.1.123, 2.1.126
- Latest available: **2.1.133**

## API Keys Added
- `OPENAI_API_KEY` added to `/home/rhino/claudeclaw-os/.env` (copied from telegram-bridge)
- Used for: DALL-E image generation, Whisper STT, TTS

## Local Custom Commits (39 commits, not in upstream)
Key changes include:
- HyperFrames + GitNexus skills
- Watch agent
- Influencer monitor
- Discord adapter
- Shared platform capabilities propagation
- Deterministic slash-command skill dispatch + per-agent allowlist
- AGENT_TIMEOUT_MS raised to 30 min
- Signal option in setup

## Key Rules
1. **NEVER push to `upstream`** (earlyaidopters/claudeclaw-os) — it's a public template
2. **Only push to `origin`** (ericoh88/claudeclaw-os) — your personal fork
3. **Pull from `upstream`** freely to get community updates
4. Before merging upstream, always check for conflicts in files you've customized
