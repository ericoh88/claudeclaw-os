# HeyGen Hyperframes & Student Kit - Research Summary

**Date:** 2026-04-29
**Source:** GitHub repos by HeyGen + Nate Herk (AI Automation Society)

---

## What Is Hyperframes

Open-source (Apache 2.0) video rendering framework by HeyGen. Write HTML, render video. Agent-native: AI agents write HTML natively, so video creation becomes a coding task rather than a design task.

**Pipeline:** HTML + CSS + GSAP animations -> headless Chrome frame-by-frame capture -> FFmpeg encoding -> MP4/WebM/MOV

**No per-render fees. No React. No build step. No framework lock-in.**

### Key Repos

| Repo | URL | Purpose |
|------|-----|---------|
| Hyperframes (core) | https://github.com/heygen-com/hyperframes | Framework + CLI + 50+ blocks |
| Student Kit | https://github.com/nateherkai/hyperframes-student-kit | 12 finished projects for learning |
| Launch Video | https://github.com/heygen-com/hyperframes-launch-video | Production example |

### Requirements

- Node.js 22+
- FFmpeg on PATH
- Chrome (auto-installed by Puppeteer)
- ~5 GB disk, 16 GB RAM recommended

### CLI Commands

```bash
npx hyperframes init      # scaffold new project
npx hyperframes preview   # live preview at localhost:3002
npx hyperframes render    # produce final video
npx hyperframes lint      # check composition validity
npx hyperframes doctor    # verify environment
npx hyperframes add       # install catalog blocks
npx hyperframes catalog   # browse available blocks
npx hyperframes tts       # text-to-speech
npx hyperframes transcribe # audio transcription
```

### Output Formats

- MP4 (H.264)
- MOV (ProRes 4444 with transparency)
- WebM (VP9 with transparency)
- PNG sequence

---

## Student Kit: 12 Projects

### Short-Form Vertical (9:16, 1080x1920)

**1. may-shorts-19** - TikTok talking-head + motion graphics + karaoke captions
- Most polished project. The `/short-form-video` skill was written around its iteration history.
- Teaches: face-mode choreography, audio-synced scene timing, karaoke word-level captions, Ken Burns zoom, per-scene overlays.

**2. may-shorts-18** - Earlier iteration of above
- Compare against may-shorts-19 to see refinement between iterations.

### Short-Form Landscape (16:9)

**3. may-shorts-6** - Landscape talking-head short
- Same workflow adapted to different aspect ratio.
- Includes transcription script.

### Product Promos

**4. clickup-demo** - 60s SaaS product demo
- Heavy registry block usage. Five render versions show iteration from draft to final.
- Own DESIGN.md (ClickUp brand spec), automation scripts for screen capture.

**5. linear-promo-30s** - 30s Linear-style promo ("Infinite Payments" aesthetic)
- Ships as a DRAFT (CRF 28) - finishing it is a deliberate student exercise.
- 8 scene compositions. Multiple diagnostic/debugging scripts.

**6. hyperframes-sizzle** - Hyperframes x Claude Code sizzle reel
- Uses `/website-to-hyperframes` flow (7-step capture-to-video pipeline).
- Most composition-heavy: 25+ sub-compositions including shader transitions, social overlays, data viz.
- Full Anthropic website capture included.

**7. first-agent-promo** - 32s "Your First AI Agent" launch film
- Uses React-via-Babel approach (JSX) instead of standard HTML.
- Deliberate counter-example showing alternative authoring.

### Educational Lessons

**8. aisoc-lesson-5-1** - Full 1:52 educational lesson
- 9 section compositions. Face-cam + motion graphics.
- Detailed STORYBOARD.md with exact word-onset timestamps.

**9. golden-ratio-demo** - AIS lesson on proportion
- Ships as polished draft with two open items (title card kerning + standard render).
- 6 scene compositions + ambient spiral background.

**10. claude-edit-intro** - Promo intro to editing workflow
- RECOMMENDED FIRST PROJECT. Minimal brand hardcoding, clean template.
- 5 scene compositions: hook, text-on-screen, karaoke, charts, PiP.

### Brand Hype / Launch

**11. aisoc-hype** - 30s brand hype film
- Scaffold project referenced by other AIS projects.
- 5 scene compositions + grain overlay + shimmer sweep.

**12. aisoc-app-release** - 30s app release promo
- MOST DOCUMENTED PROJECT. HANDOFF.md covers v1->v2->v3 with exhaustive debugging docs.
- Documents: CSS scoping bugs, FFmpeg artifacts, GSAP inheritance, track conflicts, flicker reduction.

---

## 7 Claude Code Skills Included

| Skill | What It Does |
|-------|-------------|
| `/hyperframes` | Full composition authoring with Visual Identity Gate, Layout Before Animation |
| `/hyperframes-cli` | CLI reference (init, lint, preview, render, transcribe, tts, doctor) |
| `/gsap` | GSAP timelines, easing, stagger, plugins, audio-reactive effects |
| `/hyperframes-registry` | Installing and wiring 38 blocks + 3 components |
| `/website-to-hyperframes` | 7-step URL-to-video pipeline |
| `/make-a-video` | End-to-end beginner flow: 8-gate concept-to-MP4 |
| `/short-form-video` | 9:16 vertical talking-head with face-mode choreography |

---

## Key Teaching Document: MOTION_PHILOSOPHY.md

4,000+ word deconstruction of a professional 30s motion graphics spot:

- **Section 0:** 11 Laws of motion graphics (memorize-level)
- **Section 1:** Complete reference timeline (30s, beat-by-beat)
- **Section 2:** Visual vocabulary (11 backgrounds, type system, color story, 15+ motion moves with GSAP recipes, transition catalog, pacing rules, audio mix defaults)
- **Section 3:** Concrete Hyperframes build recipes
- **Section 4:** Pre-flight checklist

---

## Recommended Learning Path

**Beginners:**
1. Start with `claude-edit-intro`
2. Use `/make-a-video` skill as step-by-step guide
3. Watch each `final.mp4` before reading `index.html`

**Intermediate:**
1. Finish `linear-promo-30s` (ships as draft)
2. Complete `golden-ratio-demo` open items
3. Compare may-shorts-18 vs may-shorts-19 for iteration discipline

**Advanced:**
1. Study `aisoc-app-release` HANDOFF.md (3 versions of real debugging)
2. Study `hyperframes-sizzle` for multi-composition orchestration
3. Build from scratch following MOTION_PHILOSOPHY.md 11 Laws

---

## Setup Quickstart

```bash
git clone https://github.com/nateherkai/hyperframes-student-kit hyperframes-editor
cd hyperframes-editor
npm install
npx hyperframes doctor
cd video-projects/claude-edit-intro
npx hyperframes preview   # opens Studio at localhost:3002
```

Optional .env keys: `CLICKUP_API_KEY`, `OPENAI_API_KEY` (only for specific projects).
