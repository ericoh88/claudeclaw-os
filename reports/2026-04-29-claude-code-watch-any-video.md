# My Claude Code Can INSTANTLY Watch Any Video (Here's How)

**Source:** https://youtu.be/QZMljuD10sU
**Channel:** Brad | AI & Automation (@bradbonanno)
**Duration:** 8:35
**Published:** April 29, 2026
**Watched via:** /watch skill (80 frames + full transcript)

---

## Summary

- Brad built a free Claude Code skill called `/watch` that lets Claude "watch" any video by splitting it into frames (ffmpeg screenshots) + transcript (YouTube captions or Whisper), giving Claude full visual + audio context
- The pipeline uses two battle-tested CLI tools: yt-dlp (downloads from 1000+ sites) and ffmpeg (extracts frames + audio) -- no third-party APIs, no MCPs, runs entirely local
- Transcription is essentially free: YouTube captions are pulled for free, Groq Whisper free tier covers 2 hours of transcription per hour as a fallback
- Cost is surprisingly low: ~$0.70-$1.62 per video depending on length, with a 100-frame cap on videos over 30 minutes. Brad ran all tests in the video 3x in parallel and burned less than 10% of his Claude Max session
- Brad's killer use case: auto-feeding his Obsidian "second brain" with structured notes from competitor videos, building a compounding knowledge layer over time

## Key Points

1. **The core insight**: A video is just two things -- frames and a transcript. Instead of paying for an expensive video model (like Gemini), split the video into pictures + text, which Claude already knows how to read natively.

2. **Why frames matter**: Transcript-only tools miss half the information. Graphs, UI states, on-screen text, visual hooks -- none of that shows up in audio. Brad demos this with Sam Altman's Stanford lecture where graphs are shown on slides that the transcript never mentions.

3. **Pipeline architecture**:
   - yt-dlp downloads the video from any supported URL (1000+ sites)
   - ffmpeg extracts frames at auto-scaled FPS (caps at 100 frames max, 2 FPS max)
   - ffmpeg extracts audio track
   - Captions pulled free from YouTube/supported sites, or Whisper transcribes the audio via Groq
   - Claude reads all frames as images + transcript as text, with aligned timestamps

4. **Cost breakdown** (shown on screen as infographic):
   - 1 min video: ~60 frames, ~$0.70
   - 10 min video: ~80 frames, ~$0.82
   - 30 min video: ~100 frames (cap), ~$0.95
   - 1 hour video: ~100 frames (cap), ~$1.62
   - NOTE: These are Max plan subscription context-burn estimates, not literal API billing. Actual API cost is ~$0.10/video on Sonnet.

5. **Supported platforms** (shown on screen): YouTube, Twitch, Vimeo, TikTok, X/Twitter, Instagram, Facebook, Reddit, SoundCloud, Dailymotion -- basically anything yt-dlp supports

6. **Advanced features**: `--start`/`--end` time flags for focused extraction on specific segments, zoom flag for higher resolution on text-heavy content

7. **Second brain integration**: Brad feeds every competitor video through the watch skill into Obsidian, creating a searchable knowledge layer that compounds over time. Claude watches, summarizes with structure, and writes directly into the vault.

## Visual Content (Not in Transcript)

- **[00:52-01:14]** Split-screen demo: YouTube playing Sam Altman's "How to Start a Startup" Stanford lecture on the left, VS Code terminal running watch.py on the right. Shows Claude ingesting the entire 45-min lecture in under 2 minutes.
- **[01:21-01:25]** The Stanford lecture shows a graph on screen ("Intensity of like" curve) that Brad points out would be missed by transcript-only tools.
- **[02:43-02:54]** VS Code terminal showing the setup process: `.config/watch/.env` being created with GROQ_API_KEY, `setup.py` running the preflight check.
- **[03:20-03:23]** Clean infographic: "A video is just two things" with visual of stacked frames and a transcript document.
- **[03:56-04:03]** YTDLP infographic showing it as a "Universal Video Downloader" with a browser right-click "Save video" context menu.
- **[04:38-04:50]** Transcript pipeline flow diagram: "Video with captions" -> "Skill pulls the captions" -> "Transcript Ready (Free)". Then Groq logo with "Transcribe using Whisper AI" as fallback.
- **[05:07-05:18]** Cost/duration chart as a horizontal timeline showing frame counts and costs at 1min/10min/30min/1hr milestones, with yellow "100 frame cap" callout.
- **[06:19-06:31]** Supported platforms grid showing logos: YouTube, Twitch, Vimeo, TikTok, X, Instagram, Facebook, Reddit, SoundCloud, Dailymotion.
- **[06:34-06:50]** Instagram demo: scraping a post by "cooper peterson" about Anthropic dropping a free program, Claude analyzing the content directly.
- **[06:50-07:00]** Loom demo: analyzing a sales dashboard video from April 27, 2026 showing $448K revenue metrics.
- **[07:00-07:13]** YouTube demo: analyzing "Parallel Claude Code + Git Worktrees" by cole medin.
- **[07:36-08:08]** Obsidian graph view showing an interconnected knowledge base with many nodes -- Brad's "second brain" populated by the watch skill. Claude is shown writing structured notes directly into the vault.
- **[08:31-08:35]** End screen: "WATCH NEXT" and "SUBSCRIBE" with Brad in a small video frame.

## Tools & Concepts Mentioned

- **yt-dlp**: Universal video downloader, supports 1000+ sites
- **ffmpeg**: Video processing engine, extracts frames + audio
- **Groq Whisper**: Free-tier transcription API (2 hrs/hr of transcription)
- **Claude Code skills**: The mechanism for extending Claude with custom capabilities
- **Obsidian**: Knowledge management / second brain
- **Claude Max plan**: Subscription plan Brad uses ($1/run is context-burn, not API billing)
- **Gemini**: Mentioned as alternative but more expensive and doesn't integrate with Claude

## Notable Timestamps

- 0:00 - Hook + value proposition
- 0:52 - Live demo on 45-min Stanford lecture
- 2:37 - Setup walkthrough (free on GitHub)
- 3:01 - How the pipeline works under the hood
- 3:20 - "A video is just two things" explanation
- 3:41 - yt-dlp and ffmpeg breakdown
- 4:36 - Transcription (free captions + Groq fallback)
- 5:07 - Cost breakdown with frame/duration chart
- 6:17 - Works on 1000+ sites (platform grid)
- 6:34 - Use cases: content research, debugging screen recordings
- 7:29 - Second brain / Obsidian integration
- 8:31 - End screen / CTA

---

*Analyzed with /watch skill: 80 frames @ 512px + full YouTube captions. Total cost: ~$0.10 on Sonnet API.*
