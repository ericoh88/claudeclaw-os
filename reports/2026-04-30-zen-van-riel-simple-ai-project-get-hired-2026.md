# The Simple AI Project To Get You Hired In 2026

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=WUo5tKg2lnE
**Duration:** 08:01

## Summary

- Zen opens with a LinkedIn post from student "Vitor Andrade" who got hired as an AI Engineer after taking his course -- the project that got him hired was a simple chatbot for a demo consulting site, nothing complex
- The project Zen demos is a voice transcription tool called "Super AI Transcript" -- records audio, transcribes with Whisper locally, then uses an LLM (Ollama) to strip filler words and extract the clean core message
- Stack is React/TypeScript frontend, FastAPI Python backend, Ollama running locally via Docker -- everything runs self-hosted
- Three reasons this kind of project gets you hired: it shows full-stack capability, it's immediately understandable to non-technical interviewers, and it proves production-level thinking (local models, real UI, multi-LLM support)
- Zen gives away the full repo + an AI system building course for free; the challenge is to extend it -- add GPU acceleration, swap to a cloud LLM, add streaming, or customize for a specific sector

## Key Points

1. **Companies are hiring "AI-native engineers"** -- not people who know AI exists, but people who ship faster using it. Referenced Gergely Orosz (The Pragmatic Engineer) listing AI-native engineers as the most in-demand candidate profile in 2025.

2. **Simple beats flashy** -- Vitor's chatbot wasn't complex. It answered questions about a consulting site using Python + a database. It got him hired because interviewers understood it immediately. No explanation of vector databases or MCP tools required.

3. **The transcription project demonstrates three things at once:**
   - Full stack: browser APIs (recording), Python/FastAPI backend, local Whisper, LLM integration
   - Production mindset: runs locally, designed for multiple LLM providers, has a real human-usable interface
   - Useful product: a voice-to-clean-text tool is something anyone can immediately grasp and want

4. **The LLM system prompt** (visible in frames) removes filler words (um, uh, like, you know, basically, actually), removes redundant statements/rambling, fixes grammar/speech-to-text errors, preserves key points, technical details, names, numbers, and action items -- and returns only the cleaned text with no preamble.

5. **The challenge Zen gives viewers:** the local LLM on CPU is slow (required a jump cut in the demo). Improvements to make it your own:
   - Switch to a faster/smaller local model or add GPU acceleration
   - Connect to a cloud LLM (GPT or Claude) for instant cleanup
   - Add streaming so users see cleanup in real time
   - Deploy to cloud
   - Customize for a specific sector (e.g. healthcare compliance)

6. **The differentiation argument**: everyone watching gets the same base repo. What matters is what you do with it. Your version, customized to your goals and target sector, shows you think like an engineer.

7. **Similar product that raised $30M**: Wispr Flow raised $30M from Menlo Ventures (June 2024) -- proof there is real market demand for AI-powered dictation/transcription.

## Tools, People & Concepts Mentioned

- **Tools:** Whisper (local transcription), Ollama, FastAPI, React, TypeScript, Docker Compose, OpenAI (API), Claude (Anthropic), Google Gemini, Azure OpenAI, Llama.cpp, vLLM, Text Generation WebUI
- **People:** Vitor Andrade (student who got hired), Gergely Orosz (The Pragmatic Engineer), Sam Mensa (TechCrunch article on Wispr Flow)
- **Concepts:** AI-native engineers, full-stack AI portfolio projects, RAG, fine-tuning, agentic flows, prompt engineering, quantization, vector storage, embeddings

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | LinkedIn post from Vitor Andrade appears on screen -- hired as AI Engineer |
| 00:31 | References Pragmatic Engineer article on AI-native engineers being most in demand |
| 01:07 | Mentions Wispr Flow raised $30M -- contextualizes the product category |
| 01:17 | Demo of "Super AI Transcript" app begins (PiP mode) |
| 01:40 | Live recording demo -- shows raw transcript with filler words |
| 02:25 | Shows system prompt that cleans transcription |
| 02:46 | Cleaned result shown: "I want to get into AI engineering. I'm unsure where to start..." |
| 03:03 | Explains WHY this project gets you hired (3 points) |
| 04:29 | Second demo -- pastes a messy text transcript, clicks "Process Text" |
| 05:24 | Opens VS Code to show codebase structure |
| 05:55 | Shows docker-compose.yml -- app + Ollama services, Ollama on port 11434 |
| 06:23 | Acknowledges the CPU latency issue -- "that's your challenge" |
| 07:19 | Reveals two free resources: the repo + full AI system building course |
| 07:37 | AI Engineer Toolset mind map visible -- LLM landscape overview |

## Visual-Only Insights (not in transcript)

- **Vitor Andrade's LinkedIn post** is shown in full -- it specifically mentions the "Zen Van course" and attributes his hiring to AI fundamentals, the certification path, and soft skills training. Post is 10 months old.

- **Zen van Riel's LinkedIn profile** is shown: Senior Software Engineer @ GitHub (March 2021 to present), Netherlands, 5,137 followers, 500+ connections. Title is "AI Native Engineer." This is who's teaching -- currently active at GitHub.

- **The Pragmatic Engineer article** is shown with full bullet list: AI product engineers, data/backend engineers, and AI-native engineers are most in-demand. Pedigree = up to 50x more outreach. In-person demand rising. SF Bay Area dominates job postings.

- **Vitor's chatbot demo** shows the "THINK heuristic AI" brand -- this is the demo consulting site his chatbot was built for. The bot explains services in four steps: Insights, Blueprint, and two more (text cuts off).

- **App name is "Super AI Transcript"** -- supports MP3, WAV, M4A, WEBM, OGG. Has a "Hold R key to record" keyboard shortcut. Settings panel has a system prompt that is fully visible and editable by the user.

- **Transcript accuracy discrepancy**: The transcript says engagement dropped "50% in January" but the frame clearly shows "15% in January" then "another 12% in February." Likely a Whisper error on the number -- visual is correct.

- **Backend code detail** (visible in VS Code): `app.py` uses FastAPI, Pydantic, `dotenv`. Routes include `/api/status`, `/api/system_prompt`, `/api/transcribe`, `/api/clean`. The `clean_with_llm` method uses `self.llm_model.create()` and `model.generate_content()` -- provider-agnostic design.

- **AI Engineer Toolset mind map** fully readable: Cloud AI Models (OpenAI, Anthropic Claude, Google Gemini, Azure OpenAI), Local AI Models (Ollama, Llama.cpp, vLLM, Text Generation WebUI, Quantization), Implementation Approaches (Prompt Engineering, RAG, Fine-tuning, Agentic Flows), AI Fundamentals (Attention, Embeddings, Vector DB, Inference). This is Zen's curriculum map.

- **Docker Compose config**: Ollama pinned to `ollama/ollama:0.1.29`, model weights persisted in a named volume so they don't re-download on restart. App exposes ports 7000 and 3000.
