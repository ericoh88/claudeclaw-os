# My Claude Code Can INSTANTLY Watch Any Video (Here's How)

**Date:** 2026-04-29
**Channel:** Brad | AI & Automation (Brad Bonanno)
**URL:** https://youtu.be/QZMljuD10sU
**Duration:** 8:36
**Upload:** 2026-04-29

## Summary

- Brad introduces his open-source `/watch` Claude Code skill that gives Claude the ability to "watch" any video by decomposing it into JPEG frames + timestamped transcript
- The skill uses two battle-tested CLI tools (yt-dlp + ffmpeg) running locally on your machine with zero third-party API for the core pipeline
- Transcription is free for YouTube (native captions pulled by yt-dlp); for videos without captions, Whisper via Groq's free tier handles it
- Frame count auto-scales by duration (capped at 100 frames), keeping cost around $1 per run on Claude Code Max subscription
- Brad's killer use case: feeding a second brain in Obsidian automatically by having Claude watch competitor videos and write structured notes

## Key Points

1. **"A video is just two things"** -- frames and a transcript. Instead of using an expensive video model (like Gemini), the skill splits the video into images + text, both of which Claude already understands natively via multimodal vision.

2. **yt-dlp + ffmpeg do all the heavy lifting locally.** No MCPs, no wrappers, no third-party services. yt-dlp downloads from 1000+ sites (YouTube, Twitch, Vimeo, TikTok, X, Instagram, Facebook, Reddit, SoundCloud, Dailymotion). ffmpeg extracts frames as JPEGs and audio for transcription.

3. **Transcription is practically free.** YouTube/many platforms provide captions for free (yt-dlp just pulls them). For videos without captions (local files, Looms, Instagram reels), Groq's Whisper API free tier gives 2 hours of transcription per hour. Brad has used the skill daily for 2 weeks and is still on the free tier.

4. **Cost structure:** Frame count scales with duration and caps at 100 frames for 30+ minute videos. Brad quotes ~$1 per run on Max subscription. A 30-minute video and a 1-hour video cost roughly the same because of the 100-frame cap.

5. **Frame + transcript timestamps align exactly.** Claude flips through screenshots like a flip book while reading the transcript like a script. It knows what's on screen when something is being said.

6. **Zoom/focus flag (--start/--end):** You can target a specific 10-second segment of a 2-hour video without burning the entire context window. Frame extraction becomes denser in the focused range.

7. **Use cases demonstrated:**
   - Content research: Break down hooks, visual setups, pattern interrupts from competitor videos
   - Developer debugging: Drop a 30-second screen recording, ask "what happens before the crash", Claude identifies the exact frame of the state change
   - Second brain: Auto-watch competitor content and feed structured notes into Obsidian knowledge graph

8. **Compounding knowledge system:** The more videos Claude watches and writes up, the smarter and richer the second brain becomes. Brad shows his Obsidian graph view with interconnected notes from watched videos.

## Tools, People & Concepts Mentioned

- **Tools:** yt-dlp, ffmpeg, ffprobe, Whisper (Groq + OpenAI), Claude Code, Obsidian
- **People:** Brad Bonanno (creator), Sam Altman (shown in YC lecture demo)
- **Platforms:** YouTube, Twitch, Vimeo, TikTok, X, Instagram, Facebook, Reddit, SoundCloud, Dailymotion
- **Concepts:** Multimodal vision, frame extraction, auto-scaling fps, token budgeting, second brain, content research pipeline, context compounding
- **Repo:** github.com/bradautomates/claude-video (free, open source, MIT)

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 0:00 | Hook: "When you give Claude Code the ability to instantly watch any video on the internet for free, it becomes genuinely unstoppable" |
| 0:52 | Live demo: 45-min YC lecture by Sam Altman processed in under 2 minutes |
| 1:15 | Why frames matter: graphs/slides in the lecture are invisible to transcript-only tools |
| 2:35 | Setup: skill is free on GitHub, install commands, setup script handles deps |
| 3:04 | "Claude can't actually watch video" -- Anthropic has no video model; this is the clever workaround |
| 3:20 | Core insight: "A video is just two things -- frames and a transcript" (infographic shown) |
| 3:41 | yt-dlp + ffmpeg explained with diagrams |
| 4:36 | Transcription cost breakdown: free captions, Groq Whisper free tier fallback |
| 5:05 | Token math: frame count scales to length, caps at 100 frames, ~$1/run |
| 5:25 | "Over 5 hours of video watched live... burned less than 10% of my session" |
| 6:17 | Platform support: works on 1000+ sites via yt-dlp |
| 6:34 | Content research demo: Instagram reel hook breakdown |
| 6:52 | Developer debugging demo: screen recording of UI bug |
| 7:07 | Zoom flag (--start/--end) for focused frame extraction |
| 7:28 | Second brain use case intro |
| 7:36 | Obsidian knowledge graph shown, auto-feeding competitor video notes |
| 8:08 | "The skill and your second brain are watching more and more videos... getting smarter automatically" |
| 8:31 | CTA: subscribe, next video on second brain system |

## Visual-Only Insights (not in transcript)

These details are visible in the frames but never spoken aloud:

1. **Infographic design:** Brad uses clean, dark-themed infographics with neon accent colors (blue, green, orange) to explain concepts. The "A video is just two things" slide shows a film frame icon splitting into "1. Frames" and "2. Transcript" with visual flow arrows.

2. **YTDLP diagram:** Shows a universal download funnel with the yt-dlp logo funneling content from multiple platform icons into a single video file.

3. **Caption pipeline diagram:** Three-step flow: "Video with captions" -> "Skill pulls the captions" -> "Transcript Ready (Free)" with green checkmarks at each stage.

4. **Cost timeline graphic:** Visual bar chart showing: 1 min / 60 frames / $0.70, 10 min / 80 frames / $0.82, 30 min / 100 frames / $0.95, 1 hour / 100 frames / $1.62. The 30-min and 1-hour bars are nearly the same height, visually reinforcing the cap.

5. **Platform grid:** Clean grid of 10+ platform logos (YouTube, Twitch, Vimeo, TikTok, X, Instagram, Facebook, Reddit, SoundCloud, Dailymotion) showing breadth of support.

6. **Live demos show real terminal output:** Claude Code running in VS Code terminal with actual watch.py output, showing frame extraction progress and transcript parsing in real-time.

7. **Obsidian graph view:** Brad's knowledge graph is densely interconnected with hundreds of nodes, showing video notes linked to concepts, people, and content ideas. The graph is clearly being fed by automated watch + note pipeline.

8. **Loom demo:** Brad demonstrates watching a Loom recording of a sales dashboard. The dashboard has charts, metrics, and UI elements that would be completely invisible to transcript-only analysis.

9. **End card:** "WATCH NEXT" card pointing to Brad's second brain system video, with subscribe button overlay.

## Analysis: How This Maps to Our Setup

Our auto-watch pipeline in ClaudeClaw implements exactly what Brad describes:
- `/watch` skill installed from his repo (bradautomates/claude-video)
- yt-dlp + ffmpeg running locally
- Groq Whisper API configured as fallback
- Auto-trigger on any video URL
- Frames + transcript always (matching Brad's philosophy: "you're only getting half the information" without frames)
- Save-everywhere pattern (reports + Obsidian + Open Brain) mirrors his second brain approach but adds a third persistence layer
