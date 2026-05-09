# Watch Pipeline Upgrades: Frame Retention & Dedicated Agent

**Date:** 2026-04-29
**Type:** Architecture analysis & proposal
**Context:** After first successful end-to-end test of /watch auto-watch pipeline on Brad Bonanno's video

---

## Part 1: Frame Retention Strategy

### Current Behavior
Frames are extracted to a temp directory (`/tmp/watch-*/frames/`), read by Claude's multimodal vision, then deleted after the report is written. Only the structured notes survive.

### Problem
- Follow-up questions ("what was on screen at 3:45?") require full re-download + re-extraction
- Re-analysis with different prompts needs the frames again
- Cross-video visual comparison impossible without frames
- Content creation (pulling a frame for a blog/thumbnail) needs raw files

### Frame Budget Reference (from frames.py auto_fps)

| Video length | Frame budget | FPS | Approx storage |
|---|---|---|---|
| Under 30s | 1/sec (up to max) | 1-2 fps | ~1-3 MB |
| 30s - 1 min | 40 frames | ~0.67 fps | ~3-5 MB |
| 1 - 3 min | 60 frames | ~0.33-1 fps | ~4-7 MB |
| 3 - 10 min | 80 frames | ~0.13-0.44 fps | ~5-10 MB |
| Over 10 min | 100 frames (hard cap) | varies | ~8-12 MB |

At 512px resolution, typical JPEG frames are 60-120KB each.

### Proposed: Permanent Frame Archive

Store all frames permanently in a structured archive:

```
store/watch-cache/
  <video-id>/
    metadata.json       # title, URL, date, duration, frame count, timestamps
    contact-sheet.jpg   # single mosaic image (8x10 grid or similar)
    frames/
      frame_0001.jpg
      frame_0002.jpg
      ...
```

**Storage math:**
- Average video: ~8MB of frames
- 10 videos/week = ~80MB/week
- 52 weeks = ~4.2GB/year
- With 4TB available, that's 0.1% of disk per year

**Contact sheet:** ffmpeg can generate a mosaic grid from all frames into one image (~200-500KB). This serves as a quick visual reference without opening individual frames.

**Retention policy options:**
- Keep everything forever (storage is negligible on 4TB)
- Annual review: after 12 months, consider pruning videos that are no longer relevant (tech content ages fast)
- Metadata-driven: tag frames with domain/topic at save time, prune by domain (e.g. keep "trading" indefinitely, prune "tech tutorials" after 12 months)

### Pipeline Change Required
1. After watch.py completes, move frames from `/tmp/watch-*/frames/` to `store/watch-cache/<video-id>/`
2. Generate contact sheet via ffmpeg
3. Save contact sheet alongside the report in reports/ and Obsidian
4. Write metadata.json with video info + per-frame timestamps
5. Report cleanup only deletes the download dir (video.mp4 + subtitles), not the frames

---

## Part 2: Dedicated Watch Agent

### The Context Window Problem

Each 512px JPEG frame costs ~800-1200 tokens when Claude reads it via multimodal vision:
- 80 frames = ~80K tokens consumed by images alone
- Transcript = ~5K tokens
- Report writing + saves = ~5K tokens
- **Total per video: ~90K tokens**

With a 1M context limit and ~50K baseline (system prompt + memory), one video eats ~10% of usable context. Three videos in one conversation = 30%+ consumed. That's context the main agent can't use for anything else.

### Proposed Architecture

```
User sends YouTube URL via Telegram
         │
    Main agent detects URL
         │
    Creates mission task ──→  mission_tasks table
    "Processing video..."      (status: queued, assigned_agent: watch)
         │                          │
    Main agent continues      Watch agent picks up task
    normal conversation       within 2-30 seconds (adaptive polling)
         │                          │
    User keeps chatting       Watch agent runs full pipeline:
    zero context waste         1. Download (yt-dlp)
         │                     2. Extract frames (ffmpeg)
         │                     3. Read all frames (multimodal vision)
         │                     4. Read transcript (captions or Whisper)
         │                     5. Write structured notes
         │                     6. Save to reports + Obsidian + Open Brain
         │                     7. Move frames to store/watch-cache/
         │                     8. Generate contact sheet
         │                          │
         │                    completeMissionTask(id, summary)
         │                          │
    User gets Telegram notification with summary
```

### Components Needed

| Component | Path | Purpose |
|---|---|---|
| `agents/watch/agent.yaml` | Config | Model (sonnet), MCP servers (open-brain), skills allowlist (watch) |
| `agents/watch/CLAUDE.md` | System prompt | Video analysis expert, auto-watch pipeline, save-everywhere, frame archival |
| Bot token | .env `WATCH_BOT_TOKEN` | From @BotFather (or run headless via mission tasks only) |
| Service file | launchd/systemd | Keep watch agent running as daemon |
| Main CLAUDE.md update | Auto-watch section | Change from "do it yourself" to "delegate to watch agent via mission-cli" |

### Watch Agent CLAUDE.md Responsibilities

1. Pick up mission tasks assigned to "watch" agent
2. Run /watch skill on the provided URL
3. Read ALL extracted frames (no exceptions -- frames + transcript always)
4. Write structured report following the auto-watch template:
   - Title, channel, duration, summary (3-5 bullets)
   - Key points, tools/people/concepts, notable timestamps
   - Visual-only insights (stuff not in transcript)
5. Save everywhere (reports + Obsidian + Open Brain)
6. Archive frames to store/watch-cache/<video-id>/
7. Generate contact sheet mosaic
8. Return tight summary as mission task result

### Benefits

- **Main agent stays clean:** Zero context waste on video processing
- **Parallel processing:** User keeps chatting while video processes in background
- **Context resets between videos:** Watch agent's context doesn't accumulate across videos
- **Batch capable:** Queue 5 URLs, watch agent processes them sequentially
- **Specialized prompt:** Tuned for video analysis = better quality output
- **Scalable:** Add more watch agents if throughput becomes a bottleneck

### Considerations

- Mission tasks are async -- user gets result when done, not streaming progress
- Processing time: 2-5 minutes per video (download + extract + read all frames + write)
- Watch agent needs its own Telegram bot token if we want it to send messages directly; otherwise results route through main bot via mission task completion notification
- Recommendation: start headless (mission tasks only), add dedicated bot later if needed

---

## Implementation Priority

1. **Frame retention** (quick win): Modify pipeline to move frames to `store/watch-cache/`, add contact sheet generation, write metadata.json. ~30 minutes.
2. **Watch agent** (bigger but high-value): Create agent config, system prompt, service file, update main CLAUDE.md. ~1 hour.
3. **Contact sheet in reports** (nice-to-have): Embed contact sheet image in Obsidian notes for quick visual reference.

---

## Storage Projection (4TB disk)

| Timeframe | Videos (est.) | Frame storage | Cumulative |
|---|---|---|---|
| 1 month | ~40 | ~320 MB | 320 MB |
| 6 months | ~240 | ~1.9 GB | 1.9 GB |
| 1 year | ~480 | ~3.8 GB | 3.8 GB |
| 5 years | ~2400 | ~19 GB | 19 GB |

At 10 videos/week, 5 years of permanent frame storage = ~19 GB = 0.5% of 4TB. Storage is a non-issue.
