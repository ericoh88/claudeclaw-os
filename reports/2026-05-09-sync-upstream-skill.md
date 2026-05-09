# Sync Upstream Skill — Created 2026-05-09

## What It Does
Safely syncs your personal fork (ericoh88/claudeclaw-os) with the community upstream repo (earlyaidopters/claudeclaw-os). Fetches, merges, handles conflicts, builds, and pushes.

## Trigger Phrases
"sync upstream", "pull latest", "update from community", "sync fork", "get latest claudeclaw"

## Location
`~/.claude/skills/sync-upstream/SKILL.md`

## Workflow
1. Pre-flight: checks remotes, uncommitted changes
2. Fetch upstream
3. Show incoming commits summary
4. Merge upstream/main into local
5. Handle conflicts (asks user, never auto-resolves)
6. Build (`npm run build`)
7. Push to origin (your fork)
8. Report summary

## Safety Rules
- Never pushes to upstream (community repo)
- Never force pushes
- Never auto-resolves conflicts
- Warns if build fails before pushing

## Remote Layout
```
origin   → github.com/ericoh88/claudeclaw-os       (push here)
upstream → github.com/earlyaidopters/claudeclaw-os  (pull only)
```
