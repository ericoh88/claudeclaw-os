# The Ultimate Local AI Tier List For 2026

**Date:** 2026-03-16
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=pr9fsrK8nmQ
**Duration:** 22:38
**Processed:** 2026-04-30

---

## Summary

- Zen van Riel ranks 15 local AI use cases based on real engineering experience (hundreds of hours on high-end hardware)
- The key insight: "boring" use cases (code autocomplete, image gen, speech) consistently outperform the hyped ones (AI agents, vibe coding) for local models
- S tier use cases can match or beat cloud; D tier (vibe coding) is essentially broken with local models
- He expects C/B tier items to improve significantly over the next couple of years as models scale

---

## Final Tier List

| Tier | Use Cases |
|------|-----------|
| **S** | Code Autocomplete, Image Generation, Speech-to-Text |
| **A** | Photo Enhancement, Home Automation, Text-to-Speech, AI Chat |
| **B** | OCR/Doc Processing, Agentic Coding, RAG/Doc Chat, AI Assistants |
| **C** | Video Generation, Voice Agents, AI Agents |
| **D** | Vibe Coding |

---

## Key Points by Category

### S Tier

**1. Code Autocomplete**
- Model: Qwen 2.5 Coder 7B (runs on a few GB of VRAM)
- Tool: Continue.dev for IDE integration
- Sub-100ms latency possible -- can actually beat cloud-based autocomplete because there's no network round trip
- Not as capable as Claude Code / Copilot for agentic features, but for pure autocomplete it wins on speed
- Self-hosted Copilot replacement that costs nothing after hardware

**2. Image Generation**
- Model: Flux 2D via ComfyUI on RTX 5090
- 71% win rate over older MidJourney versions in blind tests for editorial photo realism
- Can generate hundreds of variants in a short time (unlike video gen) -- crucial for iteration
- Supports inpainting, outpainting, image-to-image editing
- Community fine-tuned models available for custom characters and styles
- Can train custom LoRA with only 15-20 images on consumer hardware
- Caveat: iterative editing on complex gradients/textures still falls short; he uses the latest Firefly model or Photoshop for those cases

**3. Speech-to-Text**
- Model: Faster Whisper Large V3 Turbo (4x faster than original Whisper)
- Near-solved for English
- Zen's workflow: Whisper for raw transcription → local LLM to clean up filler words and extract meaning → store in Obsidian vault
- Main gap vs cloud: speaker diarization (identifying who said what in multi-speaker recordings)
- Runs in background -- transcription is nearly instant

---

### A Tier

**4. Photo Enhancement**
- Tool: Upscaly (free, open-source desktop app using RealESRGAN models)
- No Python or CLI needed to get started -- drag and drop
- 4x or 8x upscaling in seconds on any dedicated GPU with 4GB+ VRAM
- Whole category strong: upscaling, face restoration, background removal, noise reduction, colorization

**5. Home Automation**
- Stack: Frigate NVR + Home Assistant
- Most mature local AI ecosystem for beginners
- Can detect: people, vehicles, pets, packages, license plates, basic facial recognition
- All processed entirely on local hardware -- no cloud subscription, no footage leaving your network
- Stats: 2M+ active Home Assistant installs, 30K+ GitHub stars for Frigate
- Kept from S tier by setup complexity (Docker, camera streams, detection zones) and occasional breakage from rapid updates

**6. Text-to-Speech**
- Model: Chatterbox from Resemble AI
- Beats ElevenLabs in blind tests with 60%+ listener preference
- Chatterbox multilingual covers 23+ languages
- Near-solved problem for English -- gap versus cloud is largely closed
- Caveat: quality degrades past ~1000 characters; solve by splitting text into batches
- Category also covers music generation and sound effects (not his specialty)

**7. AI Chat**
- General local LLM chat: works well, models getting better fast
- Good for personal assistant queries, brainstorming, quick lookups

---

### B Tier

**8. OCR / Doc Processing**
- Tools: Surya or DeepSeek OCR model
- Covers table extraction, formula recognition, scanned document to structured data
- Works well for practical tasks like invoice processing
- Use cases "on the boring side" but functional

**9. Agentic Coding**
- More hyped than it currently delivers locally
- Requires strong hardware -- most YouTube demos cherry-pick simple Python scripts
- Real agentic coding means: read entire codebase, write code, run tests, iterate autonomously
- Improving fast -- B tier for now, could move up with better local models

**10. RAG / Doc Chat**
- Context window limits hurt quality for large doc sets
- Chunking and multi-step reasoning remain challenging
- Works well enough for personal use cases but not quite cloud-level

**11. AI Assistants**
- Example tool: OpenClaw (local always-on personal AI)
- "Sounds great on paper" -- manages calendar, email, daily summaries
- Security concerns are the primary issue: prompt injection attacks can compromise accounts
- Placed in B tier rather than higher due to security complexity
- Exception: using OpenClaw with a cloud model is safer (cloud models better at resisting jailbreaks)
- One good local use case: well-defined cron jobs (e.g., daily digest summarization, email classification) where a 14B model works fine and risk is low

---

### C Tier

**12. Video Generation**
- Model: WAN 2.1 from Alibaba (can beat Sora on several benchmarks)
- Problem: even RTX 5090 can't comfortably run the full 14B model; has to drop to 5B parameter version with lower quality
- Very slow generation -- can't iterate quickly like image gen
- Usable for experimental social media clips / concept work only
- Professional production remains cloud territory

**13. Voice Agents**
- Framework: Pipecat (chains STT + LLM + TTS into one pipeline)
- Can achieve sub-800ms voice-to-voice latency on standard hardware (e.g., macOS)
- Problem: model size constraint forces smaller/dumber LLMs, responses are noticeably worse
- Also an issue with cloud voice agents (they use GPT-4o-level, not frontier models)
- Context window limits kill quality in long conversations -- best for single-command execution
- Works OK for: hands-free home automation, one-shot commands

**14. AI Agents**
- Highly hyped but reliability with local models is poor
- Most "AI agents" people run locally are actually regular LLM workflows with some automation
- Models under 14B parameters can't use tool calling reliably -- a hard requirement for true agents
- Context window constraints, hallucinations, and reliability issues compound
- Exception: well-defined cron-style jobs with constrained output

---

### D Tier

**15. Vibe Coding**
- Completely non-functional with local models
- Vibe coding = describe app in plain English, AI builds entire thing, you never review the code
- Requires frontier model to cover for lack of code review -- local models have no chance
- Even cloud vibe coding has serious problems (1 in 10 Lovable-generated apps have security vulnerabilities per researcher findings)
- Models under 14B can't even do proper tool calling, let alone unsupervised multi-file code generation

---

## Tools, People & Concepts Mentioned

**Tools:**
- Qwen 2.5 Coder (7B) -- code autocomplete
- Continue.dev -- VS Code extension for local code autocomplete
- Upscaly -- free desktop photo enhancement (RealESRGAN)
- Frigate NVR -- local AI camera system
- Home Assistant -- home automation platform
- WAN 2.1 (Alibaba) -- local video generation
- Flux 2D / ComfyUI -- local image generation
- Pipecat -- open-source voice agent framework
- Chatterbox (Resemble AI) -- TTS that beats ElevenLabs
- Faster Whisper Large V3 Turbo -- speech-to-text
- Surya / DeepSeek OCR -- document processing
- OpenClaw -- local AI assistant (Claude Code-based?)
- Devstral (Mistral) -- mentioned for agentic coding

**Concepts:**
- Tier list format (S/A/B/C/D)
- "Boring use cases > hyped ones" for local AI
- Vibe coding vs agentic coding distinction
- Speaker diarization
- LoRA fine-tuning
- Cron jobs as the sweet spot for local agents
- Prompt injection / jailbreak risks for local AI assistants

---

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 0:00 | Intro: tier list reveal teaser with blurred icons |
| 0:24 | Code Autocomplete placed S tier |
| 1:51 | Photo Enhancement placed A tier |
| 2:56 | Home Automation placed A tier |
| 4:39 | Video Generation placed C tier |
| 5:57 | Image Generation placed S tier |
| 7:57 | Voice Agents placed C tier |
| 9:35 | Text-to-Speech placed A tier |
| 11:08 | Speech-to-Text placed S tier |
| 12:33 | OCR/Doc Processing placed B tier |
| 13:01 | Agentic Coding placed B tier |
| ~15:00 | AI Chat discussed |
| ~16:00 | RAG/Doc Chat discussed |
| ~17:00 | AI Agents discussed |
| ~20:00 | AI Assistants/OpenClaw discussed |
| 21:09 | Vibe Coding placed D tier |
| 22:03 | Final recap of full tier list |

---

## Visual-Only Insights (not in transcript)

- The tier list UI is a polished interactive drag-and-drop interface with colored tier rows (S=red, A=yellow, B=light green, C=yellow, D=light green). Items have small blue icons (curly braces for code, house for home automation, film clapperboard for video gen, etc.). The categories start blurred and are revealed at the start.
- The reveal sequence at 0:04 shows the "final" tier list as a preview -- all categories placed -- before resetting to build up from scratch. This is a smart visual hook used in tier list videos.
- Speaker is a young man with short brown hair and glasses, wearing a green polo shirt. He speaks from a rounded picture-in-picture overlay on the right side of screen while the tier list fills the left side.
- When placing items in tiers, individual category icons get highlighted/animated as he discusses them -- providing a clear visual anchor for each topic transition.
- The final tier list populated state (visible clearly around 22:03) confirms: S=3 items, A=4 items, B=4 items, C=3 items, D=1 item.
- GPU hardware: refers to "RTX 1590" in audio (likely transcription artifact for RTX 5090, which he explicitly says for ComfyUI image gen at ~6:27). This confirms he's running a top-tier consumer GPU.

---

## Key Insight: The Pattern

> "The three S tier use cases generally match or sometimes even beat cloud models: code autocomplete, image generation, and speech to text. The pattern here is that some of the more boring use cases consistently outperform the hyped ones for local models."

The S tier winners share a property: **well-constrained output format**. Autocomplete fills a code hole. Image gen produces a single image. STT transcribes audio. None require long chains of reasoning, tool use, or multi-step planning -- the things that currently require frontier models.

