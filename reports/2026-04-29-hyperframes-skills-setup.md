# Hyperframes Skills Installation & Usage Guide

**Date:** 2026-04-29
**Status:** All 8 skills installed and active

---

## What Was Installed

### Core Skills (via `npx skills add heygen-com/hyperframes`)

Installed to `~/claudeclaw-os/.agents/skills/` with symlinks to Claude Code and OpenClaw.

| Skill | Slash Command | Purpose |
|-------|--------------|---------|
| hyperframes | `/hyperframes` | Full composition authoring, visual identity gate, layout-before-animation workflow |
| hyperframes-cli | `/hyperframes-cli` | CLI reference: init, lint, inspect, preview, render, transcribe, tts, doctor, browser, info, upgrade |
| gsap | `/gsap` | GSAP animation timelines, easing, stagger, plugins, audio-reactive effects |
| hyperframes-registry | `/hyperframes-registry` | Install and wire 38+ blocks and 3 components from the catalog |
| website-to-hyperframes | `/website-to-hyperframes` | 7-step pipeline: capture URL, design, script, storyboard, VO, build, validate |
| remotion-to-hyperframes | `/remotion-to-hyperframes` | Convert Remotion (React) video projects to Hyperframes HTML |

### Student Kit Exclusives (manual install to `~/.claude/skills/`)

| Skill | Slash Command | Purpose |
|-------|--------------|---------|
| make-a-video | `/make-a-video` | Beginner 8-gate flow from concept to finished MP4 (interview, brief, scaffold, build, render) |
| short-form-video | `/short-form-video` | TikTok/Reels/Shorts vertical (9:16) video workflow with face-mode choreography |

---

## How To Use

### Make Your First Video
Say "make a video" or invoke `/make-a-video`. It walks through 8 gates:
1. Intent interview
2. Format selection
3. Script writing
4. Voice selection
5. Style/brand intake
6. Asset gathering
7. Pacing decisions
8. Build and render

### Turn a Website Into a Video
Say "turn [URL] into a video" or invoke `/website-to-hyperframes`. 7-step pipeline:
1. Capture and understand the site
2. Write DESIGN.md (brand spec)
3. Write SCRIPT.md
4. Write STORYBOARD.md
5. Generate VO and map timing
6. Build compositions
7. Validate output

### Make a TikTok/Reel
Invoke `/short-form-video` for vertical 9:16 content with talking-head + motion graphics.

### Quick CLI Reference
```bash
npx hyperframes init          # new project scaffold
npx hyperframes preview       # live preview at localhost:3002
npx hyperframes render        # produce final video
npx hyperframes lint          # check composition validity
npx hyperframes doctor        # verify environment (Node, FFmpeg, Chrome)
npx hyperframes add <block>   # install catalog block
npx hyperframes catalog       # browse available blocks
npx hyperframes tts           # text-to-speech
npx hyperframes transcribe    # audio transcription
```

### Install a Catalog Block
```bash
npx hyperframes catalog                    # see what's available
npx hyperframes add shader-glitch          # install a block
```
Then wire it into your index.html per `/hyperframes-registry` instructions.

---

## Prerequisites

- Node.js 22+
- FFmpeg on PATH
- Chrome (auto-installed by Puppeteer)
- ~5 GB disk, 16 GB RAM recommended

---

## Source Repos

- Core framework: https://github.com/heygen-com/hyperframes
- Student kit (12 projects): https://github.com/nateherkai/hyperframes-student-kit
- Launch video example: https://github.com/heygen-com/hyperframes-launch-video
- Hyperframes site: https://hyperframes.heygen.com
