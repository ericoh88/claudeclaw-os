# Claude + HeyGen Just Changed Content Creation Forever

**Date:** 2026-04-30
**Channel:** Nate Herk | AI Automation (Nate Herk)
**URL:** https://www.youtube.com/watch?v=EbJu9T30nfI
**Duration:** 20:17
**Transcript:** captions (668 segments)

---

## Summary

- Nate demonstrates a fully automated pipeline that takes raw scripts and produces finished, edited videos using Claude Code as the orchestration layer around HeyGen, ElevenLabs, and Remotion
- The video itself is narrated by an AI avatar clone of Nate (Avatar 5), making it a live demo of the exact tech being explained
- HeyGen's new Avatar 5 model is the key unlock — significantly better lip sync and natural movement than Avatar 3/4
- ElevenLabs is used for voice cloning (not HeyGen's built-in voice, which sounds worse even with imported 11Labs voices) — audio is generated separately then fed into HeyGen via the API
- Remotion handles the final video composition and motion graphics layer; a full Remotion breakdown video is promised as a follow-up

---

## Key Points

1. **The 3-tool pipeline:** Claude Code (orchestration) → ElevenLabs (voice audio) → HeyGen (avatar video generation) → Remotion (editing + motion graphics). Claude Code drives all three via APIs.

2. **HeyGen Avatar 5** is what makes the quality jump. Avatar 3/4 had robotic gestures and bad lip sync. Avatar 5 learns head movement patterns from your footage. Nate uploaded 10GB of footage for his custom avatar (trained on more data = better result). For a quick start: 15-second webcam recording is enough.

3. **Voice cloning workflow:** Create a Professional Voice Clone in ElevenLabs (not Instant — put in 30min minimum, Nate put in 2 hours). Generate audio via ElevenLabs Text-to-Speech API. Feed that audio directly into HeyGen API — do NOT import the voice into HeyGen's dashboard because the quality degrades.

4. **Claude Code as orchestration layer:** Claude Code runs Python scripts to batch-generate scripts, call ElevenLabs API for audio, call HeyGen API for video generation, then hand off to Remotion. The CLAUDE.md and Python files in the project define this workflow.

5. **Project file structure visible in VS Code:**
   - `generate_videos.py` — main generation script
   - `heygen_update.py` — HeyGen API wrapper / update logic
   - `redownload_videos.py` — retry/download script
   - `state.json` — tracks generation state per video
   - `avatar_update_progress.json` — tracks avatar progress
   - `download.txt` — download queue
   - `requirements.txt`
   - `CLAUDE.md` — Claude Code context/instructions
   - `output/` folder → `audio/`, `scripts/`, `videos/` subfolders
   - Lesson scripts are named `lesson-X.X-part-Y.txt`

6. **Claude Code version shown:** v2.1.105, running Opus 4.6 (1M context), Claude Max plan

7. **HeyGen API cost gotcha:** API credits are billed separately from dashboard credits. 1-minute clip ≈ $4 via API. 10-minute video ≈ ~$50. HeyGen dashboard shows "premium credits" (dashboard usage) vs API spend separately in Settings > Usage & History.

8. **Production stack cost breakdown (monthly):**
   - HeyGen Creator plan: ~$30/mo (limited Avatar 5 generations)
   - ElevenLabs Creator plan: ~$22/mo (100 min audio)
   - Claude Code: $20-200/mo
   - HeyGen API: pay-per-use (~$4/min of video)
   - Total baseline: ~$251/mo
   - Human alternative for a 10-min video: $300+ (freelance editor) + VO studio costs

9. **Nate's use case:** Course material for "AI Automation Society" — automating batch production of lesson videos (Lesson 5.0 through 5.4, multiple parts each). Not using AI avatar for YouTube (he stated he'll keep making videos himself).

10. **Remotion teaser:** Future video coming on Remotion. Visible in frames as part of the tech stack diagram alongside HeyGen and ElevenLabs. Used for professional motion graphics / video editing layer.

---

## Tools, People & Concepts Mentioned

**Tools:**
- **HeyGen** — avatar video generation, Avatar 5 model, Quick Create, AI Studio, Photo-to-video, Script-to-video
- **ElevenLabs** — Professional Voice Clone, Eleven Multilingual v2 model, Text-to-Speech API
- **Remotion** — React-based video editing / motion graphics (teased, not demoed)
- **Claude Code** — v2.1.105, Opus 4.6, 1M context, Claude Max plan — orchestration layer
- **VS Code** — IDE shown throughout
- **HeyGen API** — used for programmatic video generation (separate billing from dashboard)

**Concepts:**
- Avatar 5 (HeyGen's new motion model)
- Professional Voice Clone vs Instant Voice Clone (ElevenLabs)
- Multi-stage audio/video pipeline (generate audio separately, then combine in HeyGen)
- Claude Code as workflow orchestration (CLAUDE.md-driven Python execution)
- Buyback Matrix (referenced for ROI justification of $6/hr to buy your time back)
- AI avatar for course material / short-form vs YouTube (different use cases)

**People:**
- Nate Herk (creator, AI Automation Society)

---

## Tools & API Integration Details (Special Focus)

### HeyGen API Patterns (from frames + transcript)
- API billing is **separate** from dashboard credits — check Settings > Usage & History > API tab
- Avatar generation via API uses different pricing than dashboard plan credits
- Voice in API calls: feed raw audio file (ElevenLabs output) directly rather than using HeyGen's imported voice feature
- Motion Engine options visible: Avatar V Premium (moves like you, motion adapts to script), Avatar IV Premium, Avatar III (unlimited usage)
- Python files (`heygen_update.py`, `generate_videos.py`) wrap the HeyGen API

### ElevenLabs Settings Visible (Frame 21)
- Voice: Nate Voice Clone
- Model: Eleven Multilingual v2
- Output Format: MP3 44.1 kHz 128kbps
- Settings: Speed, Stability, Similarity, Style Exaggeration, Language Override sliders

### Claude Code Project Files (Frame 35/36/37/38/41)
```
project/
├── CLAUDE.md
├── .env
├── .gitignore
├── generate_videos.py          ← main pipeline script
├── heygen_update.py            ← HeyGen API wrapper
├── redownload_videos.py        ← retry failed downloads
├── requirements.txt
├── state.json                  ← generation state tracking
├── avatar_update_progress.json ← avatar job tracking
├── download.txt
├── output/
│   ├── audio/                  ← ElevenLabs generated audio
│   ├── lesson five final/
│   ├── scripts/                ← lesson-X.X-part-Y.txt files
│   └── videos/                 ← final generated videos
├── browser-data/
├── claude/
└── screenshots/
```

### No GitHub repo shared — but Nate mentions downloadable files (HeyGen Studio + Word doc template) available in description

---

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 0:00 | AI avatar intro — reveals it's a clone of Nate, first time on the channel |
| 0:40 | Explains the 3-tool stack: HeyGen + ElevenLabs + Remotion, orchestrated by Claude Code |
| 1:05 | Plays sample output — Lesson 5.0 course material |
| 2:30 | Explains why Avatar 5 is the unlock vs Avatar 3/4 |
| 3:25 | Demo: HeyGen avatar creation flow (webcam 15s or upload footage) |
| 4:13 | Reveals he uploaded 10GB of footage for his avatar |
| 5:00 | Why NOT to use HeyGen's imported voice — shows it sounds bad vs ElevenLabs native |
| 5:10 | ElevenLabs voice clone setup (Professional Clone, 30min minimum, he used 2 hours) |
| 7:00 | Claude Code VS Code session — shows project file structure |
| 8:00 | Shows `generate_videos.py` and `output/scripts/` folder with all lesson txt files |
| 9:00 | Shows generated video playing in VS Code |
| 17:00 | Cost breakdown — HeyGen API ~$4/min, 10-min video ~$50 |
| 18:00 | Full stack monthly cost: ~$251 |
| 19:44 | Teases upcoming Remotion full breakdown video |

---

## Visual-Only Insights (not in transcript)

1. **Tech stack diagram (Frames 3-4):** Shows HeyGen + Remotion + ElevenLabs all feeding into a central pixel-art alien icon (Claude?) with bidirectional arrows. Label in top-left corner reads "Claude Code Visuals" — suggests this diagram was itself generated by Claude Code.

2. **HeyGen Projects dashboard (Frames 1, 2, 11, 14):** Shows dozens of generated videos — "Lesson 5.4 Part 9 (new)", "VT Intro", and full "Lesson 5.0 through 5.4" series. Videos have "4 seconds ago" to "1 hour ago" timestamps, confirming rapid batch generation. Some have "Make AI" buttons visible.

3. **HeyGen Motion Engine options (Frame 26):** Dropdown clearly shows three tiers — "Avatar V Premium" (selected), "Avatar IV Premium", "Avatar III Unlimited usage" — suggesting Avatar III has no usage caps but lower quality.

4. **ElevenLabs UI (Frame 21):** The intro script text is fully readable in the TTS input field — confirms the exact copy used for the AI intro segment.

5. **VS Code file structure detail (Frames 35-41):** `browser-data/` and `screenshots/` folders alongside main files suggest Claude Code is doing browser automation (possibly for HeyGen web scraping or authentication). `state.json` and `avatar_update_progress.json` confirm stateful pipeline with resume capability.

6. **Claude Code terminal (Frame 35/41):** Shows "Opus 4.6 (1M context) · Claude Max" — confirms he's on the top-tier Claude Max plan. Working directory shown: `OneDrive\Desktop\HeyGen Studio` — Windows machine, OneDrive synced.

7. **HeyGen API usage screen (visible briefly):** Shows spent credits, error rate, total requests metrics — confirms heavy API testing has already been done.

8. **AI Automation Society slide deck (Frames 5-8):** Presentation slides visible: "The Audit Is How You Become a Partner", "The One-Off Project Cycle" (Project → Invoice loop), "The Cycle Trap" (send invoice → work wraps up → back to looking), "Skills You Already Have" (discovery calls). These are the actual course lesson slides being used as scripts for the avatar videos.

---

## Saved to

- Reports: `reports/2026-04-30-nate-herk-claude-heygen-content-automation.md`
