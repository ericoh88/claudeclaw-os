# /watch Video Skill - Cost Breakdown & How It Works

**Date:** 2026-04-29
**Source:** Brad Bonanno (bradautomates/claude-video)
**Video:** https://youtu.be/QZMljuD10sU
**Pricing source:** https://platform.claude.com/docs/en/about-claude/pricing + https://platform.claude.com/docs/en/build-with-claude/vision

## How Claude "Watches" a Video

The /watch skill does NOT use a video model. It decomposes video into two things Claude already understands: images and text.

### Pipeline

1. **yt-dlp** downloads the video to a temp folder
2. **ffmpeg** extracts JPEG screenshots at auto-scaled intervals (max 100 frames, max 2fps)
3. **Transcript** pulled from free captions (yt-dlp) or Whisper API fallback (Groq/OpenAI)
4. Script prints frame file paths + timestamped transcript as markdown
5. **Claude reads each JPEG using the Read tool** -- it literally sees the raw images (multimodal vision)
6. Claude answers grounded in both what's on screen AND what's being said

### Key insight
There is NO tagging, NO labeling, NO intermediate AI processing. Raw JPEG frames go straight into Claude's context window as images. Claude's own vision capability interprets them directly.

### Are frames saved permanently?
**NO.** Frames live in a temp directory (`/tmp/watch-xxxxx/`). After Claude answers, the directory is deleted. Zero permanent storage.

## Image Token Formula (Anthropic Official)

```
tokens_per_image = width x height / 750
```

Max native resolution: 1568px on long edge (non-Opus 4.7), 2576px (Opus 4.7).
Images larger than this are downscaled first.

## Cost Math for /watch

### Assumptions (typical YouTube video)
- 80 frames at 512px wide, 16:9 aspect ratio (512x288px)
- ~10 minute video with transcript
- Single question + answer (no follow-ups)

### Token breakdown
| Component | Tokens |
|-----------|--------|
| 80 frames (512x288 each, ~197 tok/frame) | ~15,700 |
| Transcript (~10 min video) | ~3,000 |
| System prompt + tool overhead | ~5,000 |
| **Total input** | **~24,000** |
| Claude's answer (output) | ~2,000 |

### Cost per model (single run, no follow-ups)

| Model | Input $/MTok | Output $/MTok | Input cost | Output cost | **Total** |
|-------|-------------|---------------|------------|-------------|-----------|
| Opus 4.7/4.6 | $5 | $25 | $0.12 | $0.05 | **$0.17** |
| Sonnet 4.6 | $3 | $15 | $0.07 | $0.03 | **$0.10** |
| Haiku 4.5 | $1 | $5 | $0.02 | $0.01 | **$0.04** |

### With --resolution 1024 (for reading on-screen text)
Frame size: 1024x576px = ~787 tokens/frame
80 frames = ~63,000 image tokens

| Model | Total with 1024px |
|-------|-------------------|
| Opus 4.7/4.6 | ~$0.47 |
| Sonnet 4.6 | ~$0.28 |
| Haiku 4.5 | ~$0.09 |

## Why Brad Says "$1 Per Run"

Brad uses Claude Code on a Max subscription ($100-200/month), not API billing. His "$1" is subscription-context-equivalent, not literal API cost. The inflation comes from:

1. **Context accumulation**: In Claude Code, frames stay in context. Every follow-up re-sends all image tokens. 3 follow-ups = 4x the image token cost.
2. **Session overhead**: Claude Code's system prompt, tools, skills, CLAUDE.md all consume tokens alongside frames.
3. **Proportional budget**: On Max plan, context window burns translate to proportional subscription cost, not per-call dollars.

## Comparison: /watch vs Pure Transcription

| | /watch (frames + transcript) | Pure transcript only |
|---|---|---|
| Visual content (graphs, UI, slides) | Captured in 80 frames | Completely missed |
| Audio/spoken content | Full timestamped transcript | Full timestamped transcript |
| Cost (Sonnet, single run) | ~$0.10 | ~$0.01 |
| Richness | Both channels | Audio only (50% of content) |
| Best for | Content analysis, bug diagnosis, anything visual | Podcasts, interviews, audio-only content |

## Optimization Tips

- Use `--start`/`--end` for focused time ranges (denser frames, lower total cost)
- Use `--max-frames 40` to halve the frame budget for simple summaries
- Use `--no-whisper` for YouTube (free captions, no API needed)
- Only use `--resolution 1024` when Claude needs to read on-screen text
- Don't re-run the skill for follow-up questions -- frames are already in context

## Dependencies (all installed)
- yt-dlp: v2026.03.17 (via pipx, symlinked to /usr/local/bin)
- ffmpeg: v6.1.1 (system)
- GROQ_API_KEY: configured in ~/.config/watch/.env
- Skill location: ~/.claude/skills/watch/
