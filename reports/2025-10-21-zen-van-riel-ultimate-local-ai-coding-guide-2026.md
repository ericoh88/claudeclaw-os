# The Ultimate Local AI Coding Guide For 2026

**Date:** 2025-10-21
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=rp5EwOogWEw
**Duration:** 36:02
**Transcript source:** native captions
**Frames:** 80 @ 512px resolution

---

## Summary

- A 36-minute masterclass on running local AI models (via LM Studio) for coding, covering hardware requirements, model selection, VRAM budgeting, and integration with Claude Code, Continue, and Kilo Code in VS Code.
- Presenter uses an RTX 5090 (31.5 GB VRAM) but explicitly benchmarks smaller hardware scenarios and addresses MacBook unified memory use cases.
- The core thesis: local AI coding works best for smaller scripts and isolated tasks; context window limitations make it choke on complex large codebases. Use cloud for those.
- Demonstrates the full stack: LM Studio → OpenAI-compatible local server → VS Code extensions (Continue, Kilo Code, Claude Code).
- Shows concrete performance numbers: Qwen 32B hits ~42 tokens/s vs. OpenAI gpt-oss 20B at ~170 tokens/s on the same GPU.

---

## Key Points

1. **Hardware fundamentals matter most.** VRAM is the binding constraint. A model that fits in VRAM runs fast; overflow into shared (system) RAM causes severe slowdown. The presenter demos this live — loading Qwen 32B with 75k context at 45 GB estimated usage causes the system to stall.

2. **LM Studio is the recommended starting point.** Provides a simple GUI, supports OpenAI-compatible API locally (default: `http://localhost:1234`), works on Windows/Mac/Linux. Ollama is the alternative for more terminal-centric workflows.

3. **Model selection heuristics:**
   - RTX 3090/4090 (24 GB): Qwen 2.5 32B Q4 (~21 GB) fits cleanly with ~3k context; OpenAI gpt-oss 20B (12.7 GB) fits with generous context.
   - RTX 5090 (31.5 GB): Same models but can stretch context significantly more.
   - MacBook M4 Pro 48 GB unified memory: can run much larger models due to shared memory architecture.
   - Budget cards (8-12 GB): limited to 7B models.

4. **Context window is the critical bottleneck for coding.** Not raw speed — context. Once the context fills, local models either slow dramatically (offloading to RAM) or get stuck in loops. The presenter shows Kilo Code looping on `index.html` reads when context is exhausted.

5. **Advanced LM Studio settings help:** Flash Attention + K-cache F16 quantization reduce memory footprint enough to squeeze more context out of the same VRAM.

6. **Integration with VS Code agents:**
   - **Continue**: Add LM Studio as provider, click "Auto-detect model." Straightforward.
   - **Kilo Code**: Select "Use your own API key" → "LM Studio" → paste `http://localhost:1234` as base URL → auto-detects loaded models.
   - **Claude Code**: Yes, you can route Claude Code to a local model via the OpenAI-compatible endpoint. Presenter confirms this works.

7. **Real-world coding demo:** With Kilo Code + Qwen 32B + optimized settings (Flash Attention, K-cache F16, 27k context), the model successfully locates and adds new auction entries to `index.html` — a real edit on a real file.

8. **The honest conclusion:** Local AI coding is viable for simple scripts and small projects. For large, complex codebases, you'll hit context limits fast. The pragmatic strategy is local for privacy-sensitive or offline work, cloud (Claude, GPT-4) for heavy lifting.

---

## Tools, People & Concepts Mentioned

- **Tools:** LM Studio (v0.1.10 → v0.1.30), Ollama, Continue (VS Code extension), Kilo Code (VS Code extension), Claude Code, Windows Task Manager, VS Code
- **Models:** Qwen 2.5 32B Instruct (GGUF Q4_K_M, ~21 GB), OpenAI gpt-oss 20B (GGUF, ~12.7 GB), OpenHermes 2.5 Mistral 7B (various quants shown)
- **Hardware:** NVIDIA RTX 5090 (31.5 GB VRAM), NVIDIA RTX 3090, MacBook M4 Pro 48 GB unified memory, AMD Radeon (integrated)
- **Concepts:** VRAM budgeting, GGUF quantization (Q2K through Q8_0), Flash Attention, K-cache quantization, context window limits, GPU offload layers, OpenAI-compatible local API, tokens per second benchmarking

---

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 0:00 | Intro — masterclass pitch, benefits of local AI coding |
| 1:52 | LM Studio introduced as starting tool |
| 3:05 | Model browser shown — Qwen 2.5 32B (21 GB) and OpenAI gpt-oss 20B (12.7 GB) highlighted |
| 0:15 | Task Manager + LM Studio split screen — RTX 5090 at idle (14 GB / 31.5 GB used, 30°C) |
| ~8:00 | Live demo: Gym class Python generation — 170.6 tokens/s on gpt-oss 20B |
| ~10:00 | MacBook M4 Pro 48 GB comparison overlay shown |
| ~12:00 | token_analysis.json shown — 69,234 tokens across 32 files in real project |
| ~22:00 | Context overload demo — 45 GB Qwen config causes shared RAM usage + video lag |
| ~28:00 | Qwen with reasonable 6k context — 42 tokens/s vs 170.6 for gpt-oss |
| ~32:00 | Continue extension setup in VS Code |
| ~33:00 | Kilo Code setup + context loop bug demonstrated |
| ~34:00 | Flash Attention + K-cache optimization in LM Studio |
| ~34:30 | Kilo Code successful edit of index.html with 3 new auction items |
| 35:04 | Honest conclusion — local is good for simple/small, cloud still needed for complex |

---

## Visual-Only Insights (not in transcript)

- **Exact LM Studio version numbers visible:** v0.1.10 in early frames, v0.1.30 in later frames — confirms the recording spans multiple versions or the presenter updated mid-video.
- **GPU 1 is AMD Radeon (integrated graphics)** visible in Task Manager alongside the RTX 5090 — so the presenter's PC has dual GPU setup (discrete + APU/iGPU).
- **RTX 5090 idle state:** 14.0/31.5 GB VRAM used at 10% utilization, 30°C before any model load — gives a clean baseline.
- **token_analysis.json** shows a real project: 69,234 total tokens, 32 files, mix of Python (most tokens), JSON, Markdown, XML. Python files account for the bulk of token count — visible detail that adds context to why context window limits matter for this codebase.
- **Shared GPU memory spike** during overload: 17.2/30.8 GB shared RAM used when Qwen 32B at 75k context is loaded — this visual is the clearest demonstration of the RAM spillover problem in the whole video.
- **Video presenter stutters in PiP** when GPU is overloaded — OBS itself is competing for GPU resources, making the screen recording visually degrade as a real-time indicator of system stress.
- **OpenHermes 2.5 Mistral 7B** appears in the model directory browser in multiple quantization variants (Q2K, Q3K_S, Q4_K_M, Q5_K_M, Q8_0 etc.) — shown as an example of the quantization spectrum available for the same base model.
- **Continue extension UI** shows "Auto-detect model" button which pulls directly from the local LM Studio API endpoint.
- **Kilo Code token counter** at the bottom shows "Input Tokens: 19000" when the context loop starts — meaning the loop begins well before the theoretical context limit, suggesting the effective usable context is lower than the slider setting.
- **Flash Attention checkbox** is in "Advanced Mechanisms" section under LM Studio model load settings — not immediately obvious from the transcript alone where to find it.
- **Kilo Code successful edit** is confirmed visually by the VS Code Git sidebar showing "1 change" badge on the source control icon, and the diff view clearly showing 3 new auction object entries added to the JavaScript array.

---

## Source

Zen van Riel — AI engineering content creator. Runs an "AI engineering community" (linked in description). Content is technical and hands-on.
