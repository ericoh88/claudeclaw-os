# Skool Course Downloader Fix & ClaudeClaw Course Hosting

**Date:** 2026-05-08
**Status:** Completed

## Skool URL Scheme Change (Root Cause)

Skool changed their classroom URL routing. Course pages now use **short IDs** (e.g., `6c720663`) instead of full UUIDs (e.g., `30970f9e82d44ee6b9e68ec19b1b2a1a`).

- The main course URL (`/classroom/FULL_UUID`) still works -- Skool redirects to the short ID
- Per-module URLs (`/classroom/FULL_UUID?md=MODULE_ID`) now return **HTTP 400**
- The fix: `/classroom/SHORT_ID?md=MODULE_ID` returns 200 with video playback tokens

### Fix Applied to `download-course.py`

1. `fetch_course_structure()` now returns `(pageProps, short_course_id)` tuple
2. Short ID extracted from `pageProps.currentPage.query.course` or the redirect URL
3. `download_video()` uses the short ID for all per-module page fetches
4. `process_course()` threads the short ID through the pipeline

### Verification

- "Community Hackathon Assets" course downloaded successfully (1 video, 14.8MB)
- Progress reset in `course-progress.json` to clear falsely completed entries

## Everything ClaudeClaw Course

Downloaded and hosted the full "Everything ClaudeClaw" course from Skool Early AI Dopters.

### Course Structure

- **Skool URL:** `https://www.skool.com/earlyaidopters/classroom/f1a72e71`
- **Short ID:** `f1a72e71` | **Full UUID:** `0b12aa0976a64bfb9e2c48d3f7e3cad1`
- **9 modules**, 18 pinned community posts, 1 Loom video (37m44s)

### Key Difference from Standard Courses

Standard Skool courses use **Mux-hosted videos** with playback tokens in `metadata.videoId`. The ClaudeClaw course is different:

- Uses a **Loom video link** (`metadata.videoLink`) for the Setup Guide
- Content lives in **pinned community posts** (`pinnedPosts[].post.metadata.content`)
- No Mux videos at all -- the standard downloader would find nothing to download

This required a custom approach:
1. Extracted all 18 pinned posts across 9 modules
2. Downloaded the Loom video (37min, 1080p, 579MB) via yt-dlp
3. Built an HTML browser with dark theme matching other course browsers
4. Local `<video>` player with fallback link to original Loom

### Hosting

- **URL:** `http://100.105.94.83:8090/early-ai-dopters/everything-claudeclaw/`
- Served on port 8090 via Tailscale on hornbill
- All 10 pages verified serving (HTTP 200)
- Video streams with range request support (HTTP 206)

### Files

| Path | Contents |
|------|----------|
| `/home/rhino/courses/early-ai-dopters/download-course.py` | Fixed downloader script |
| `/home/rhino/courses/early-ai-dopters/everything-claudeclaw/` | HTML browser (10 pages + 1 video) |
| `/home/rhino/courses/early-ai-dopters/Everything ClaudeClaw/notes/` | 9 markdown note files |
| `/home/rhino/courses/early-ai-dopters/Everything ClaudeClaw/course_data.json` | Full structured course data |

### Skool Data Structure Notes

- Post content is at `pinnedPosts[].post.metadata.content` (NOT `metadata.body`)
- Module descriptions are in `metadata.desc` (rich text JSON with `[v2]` prefix)
- Loom videos are in `metadata.videoLink` (vs standard Mux in `metadata.videoId`)
- Short course ID available at `pageProps.currentPage.query.course`
