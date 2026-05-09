# I Replaced My AI Server With A Browser Tab (WebGPU 2026 Setup)

**Date:** 2026-04-30 (uploaded 2026-04-07)
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=1mix7WnuEK0
**Duration:** 09:26

## Summary

- Zen van Riel demos **BrowserAI**, a pure front-end TypeScript web app that runs 5 different AI models entirely in the browser with zero backend server
- Models run locally on the user's GPU via **WebGPU**, with models cached in browser storage after first download — no API keys, no cloud costs
- The 5 demos covered: image classification (80 MB ViT model), LLM chat (Llama 3.2 1B ~700 MB), real-time hand tracking/gesture recognition (5 MB MediaPipe), speech-to-text (Moonshine-based model), and semantic search (BGE Small v1.5 embeddings)
- Code walkthrough shows a pure TypeScript/React project structure with Web Workers isolating AI inference from the UI thread, using familiar OpenAI-compatible API patterns
- Positions the stack as ideal for proof-of-concepts and serverless demos, not production workloads with large models

## Key Points

1. **No backend required** — The entire BrowserAI project is a frontend-only TypeScript/React app. `localhost:5173` in the demo, deployable for free (no server costs).

2. **WebGPU enables local GPU access from the browser** — The `useWebGPU` hook checks `navigator.gpu.requestAdapter()` to detect support. Chrome is shown with the "WebGPU Supported" green pill. Not all browsers support it yet — CPU-only models still work fine without it.

3. **Models are cached in browser storage** — First download is slow (80–700 MB depending on model), subsequent loads are instant from cache. The demo shows this by pre-loading before recording.

4. **Performance numbers shown on screen:**
   - Image classification (lion): **175 ms** inference
   - Image classification (Egyptian cat): **331 ms** inference, 95% confidence
   - LLM (Llama 3.2 1B): **51.6 tokens/sec**, demonstrated by GPU utilization spiking during a Wikipedia summarization prompt
   - Speech-to-text (12 seconds of audio): **567 ms** transcription
   - Semantic search ("preparing food"): **6 ms** to return results

5. **Architecture pattern — Web Workers for AI inference:** Each AI demo has a `.worker.ts` file that runs in a Web Worker, keeping the UI thread free. The LLM worker uses `@mlc-ai/web-llm` (`CreateMLEngine`, `engine.chat.completions.create`) with streaming. The classifier uses `@xenova/transformers` (`pipeline('image-classification', ...)`). APIs mirror standard OpenAI/HuggingFace patterns.

6. **Model size tradeoffs discussed:** 5 MB (MediaPipe hands) is fine for end-user download. 700 MB (Llama 3.2) is borderline. 100 MB+ models may not be appropriate for all production end users.

7. **Semantic search enables local RAG:** The BGE Small embedding model can ground smaller local LLMs in custom data — enabling lightweight local RAG pipelines entirely in-browser.

8. **Repo available free** in the video description. Paid tier ("AI and Eighth Engineers") for extended deployment/engineering guidance.

## Tools, People & Concepts Mentioned

- **Tools/Libraries:**
  - `@mlc-ai/web-llm` (MLC AI WebLLM) — LLM inference in browser via WebGPU
  - `@xenova/transformers` (Hugging Face Transformers.js) — image classification, embeddings
  - MediaPipe (hands model) — real-time hand tracking + gesture recognition
  - Moonshine — speech-to-text model (browser-based)
  - BGE Small v1.5 — semantic embedding model
  - Llama 3.2 1B (q4f16 quantization) — local LLM
  - WebGPU API (`navigator.gpu`) — browser GPU access
  - VS Code — shown as the editor
  - React / TypeScript — project stack
  - Web Workers — isolate AI inference from UI thread

- **People:** Zen van Riel (presenter/creator)

- **Concepts:** WebGPU, browser-local AI, model caching in browser storage, Web Workers, quantization (q4f16), local RAG via embeddings, serverless AI deployment, streaming LLM completions

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | Intro — claim that 5 AI models can run in the browser |
| 00:37 | BrowserAI web app intro, shows all 5 tabs |
| 00:55 | Image classification demo — loads 80 MB ViT model |
| 01:11 | Lion classified at 99.9% confidence (175 ms) |
| 01:22 | Egyptian cat classified at 95% confidence (331 ms) |
| 01:41 | LLM chat demo — Llama 3.2 1B loads from cache |
| 01:54 | Haiku generated at 51.6 T/s |
| 02:06 | Wikipedia article pasted to show GPU utilization spike |
| 03:01 | Computer vision / hand tracking demo — 5 MB MediaPipe model |
| 03:30 | Webcam live hand skeleton overlay — "Open Palm" detected |
| 03:32 | "Closed Fist" gesture detected in real-time |
| 04:07 | Speech-to-text demo — Moonshine model |
| 04:30 | 12 sec audio transcribed in 567 ms |
| 04:54 | Semantic search demo — BGE Small v1.5 |
| 05:23 | "Preparing food" query returns results in 6 ms |
| 06:14 | Subscribe CTA |
| 06:20 | Code walkthrough begins in VS Code |
| 06:36 | `useWebGPU` hook shown — `navigator.gpu.requestAdapter()` |
| 06:53 | Components folder structure walkthrough |
| 07:09 | LLMChat worker shown — `engine.chat.completions.create` streaming |
| 07:36 | MLC AI WebLLM package highlighted as the LLM backend |
| 08:03 | Image classification worker — `await classifier(imageUrl, {top_k: 5})` |
| 08:42 | Caveats — not suitable for all use cases, 100 MB+ model download concerns |
| 09:03 | Free deployment pitch — no backend needed |
| 09:12 | Repo link in description + paid program mention |

## Visual-Only Insights (not in transcript)

- **Actual model identifiers visible in UI:** Llama 3.2 1B is labeled as `q4f16` quantization with `~700 MB` size and `GPU` tag — confirming it's GPU-accelerated, not CPU
- **LLM chat haiku response shown verbatim on screen:** "Silent, gentle soul / Learning from data streams / Mystery unfolds" — the transcript doesn't quote this
- **`classification.worker.ts` line 29 specifically highlighted:** `const results = await classifier(payload.imageUrl, { top_k: 5 });` — speaker draws attention to this as the key call
- **LLMworker.ts imports:** `import { CreateMLEngine, MLEngine, type ChatCompletionMessageParam } from '@qbic-ai/web-llm'` — the actual package name is `@qbic-ai/web-llm` (visible in code), not `@mlc-ai/web-llm` as the transcript implies
- **Gesture recognition UI shows a red button with text label:** "Open Palm" and "Closed Fist" labels displayed below the webcam feed — not described verbally in this level of detail
- **BGE Small model info:** UI shows "BGE Small v1.5 - 128 - 192 - Ready" — dimensions 128 (max seq length?) and 192 visible
- **Semantic search similarity scores shown:** Top 3 results for "preparing food": 0.568, 0.529, 0.527 — numbers not mentioned in transcript
- **Subscribe overlay appears on screen at ~06:06** as a branded in-video graphic with a bell icon
- **Presenter's outfit changes between intro and code section** — beige/khaki collared shirt in talking head shots, striped button-up in the outro — may be filmed on different days
- **Project URL is localhost:5174 for Computer Vision tab** (different port from 5173 for other tabs) — suggests separate dev server or Vite port conflict, not mentioned verbally
