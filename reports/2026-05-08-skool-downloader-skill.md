# Skool Downloader Skill

**Date:** 2026-05-08
**Skill location:** `~/.claude/skills/skool-downloader/SKILL.md`

## What It Does

Downloads any Skool classroom course (videos, notes, pinned posts) and builds a self-hosted HTML browser. Works across any Skool community, not just Early AI Dopters.

## Key Knowledge Encoded

### Skool URL Scheme (May 2026 breaking change)
- Full UUID + `?md=MODULE_ID` = HTTP 400 (broken)
- Short ID + `?md=MODULE_ID` = HTTP 200 (correct)
- Extract short ID from `pageProps.currentPage.query.course` or redirect URL

### Two Course Types
1. **Mux video courses** (standard) -- `metadata.videoId`, download via signed HLS URL
2. **Loom/post-based courses** -- `metadata.videoLink` + `pinnedPosts[].post.metadata.content`

### Data Paths
- Post content: `pinnedPosts[].post.metadata.content` (NOT `metadata.body`)
- Module descriptions: `metadata.desc` (strip `[v2]` prefix before JSON parse)
- Loom URLs: `metadata.videoLink`

### Gotchas
- Web server doesn't follow symlinks -- copy files directly
- Next.js `_next/data` routes lack video tokens -- use full page fetch
- Pause 90s between downloads to avoid rate limits
- Cookies expire ~30 days

## Adapting for New Communities

1. Change `BASE_URL` to `https://www.skool.com/COMMUNITY_SLUG/classroom`
2. Create directory at `/home/rhino/courses/COMMUNITY_SLUG`
3. Copy `download-course.py`, update `COURSES_QUEUE` with new course UUIDs
4. Run or set up nightly cron

## Reference Files
- Script: `/home/rhino/courses/early-ai-dopters/download-course.py`
- HTML reference: `/home/rhino/courses/early-ai-dopters/everything-claudeclaw/`
- Hosting: `http://100.105.94.83:8090/` via port 8090 on Tailscale
