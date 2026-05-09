# AI Coding Without Rate Limits Is Finally Here (Local Claude Code)

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=nYDUdnMVDdU
**Duration:** 11:02
**Upload date:** 2025-10-30

## Summary

- Zen demos using **Claude Code Router (CCR)** to route Claude Code through a locally-running LLM via LM Studio, bypassing cloud API rate limits entirely
- He builds a **local AI PDF reader app** (Next.js + TypeScript + Tailwind + pdf-parse) live using this local-first setup, with Qwen 3 / Qwen Coder 30B as the local model
- The demo reveals honest limitations: the local model loops on routing bugs, requiring a fallback to the actual Claude cloud model to fix them
- Context length is a key constraint: the Qwen 3 local model at 48K tokens can't fit a full 501-page PDF; upgrading to 250K context with Qwen 7B solves page-search but is significantly slower
- Ends with a demo of the finished app successfully answering questions about the Pro Git book by injecting page-level PDF text into the AI context

## Key Points

1. **Claude Code Router (CCR)** is the tool — launched via `ccr code` instead of `claude code`, routing requests to a local LM Studio endpoint (`http://10.5.0.2:1234` OpenAI-compatible)
2. **Model used:** Qwen Coder 30B (18.63 GB) loaded in LM Studio on an RTX 3090; later swapped to Qwen 2.5 7B Instruct with 250K context window for full-document search
3. **`--dangerously-skip-permissions` flag** used to allow the agent to run any command without approval — explicitly noted as safer inside WSL/Ubuntu sandbox on Windows
4. **WSL (Windows Subsystem for Linux) + Ubuntu** is the recommended environment for local AI coding agents — better bash support, safer sandbox for skip-permissions mode
5. **The spec-file workflow:** Feed an `initial-prompt.md` to the agent, have it write a `Claude Code SPEC.md` with TODOs, then drive implementation from the spec
6. **Honest failure point:** Local model (Qwen Coder 30B) gets stuck in a loop trying to fix Next.js App Router directory structure. Cloud Claude fixes the same problem immediately, identifying `src/pages/page.tsx` should be `src/app/page.tsx`
7. **Context window reality check:** 200K+ tokens for a 501-page PDF exceeds the 48K Qwen 3 deployment. Switching to Qwen 7B at 250K context works but inference is slow
8. **PDF RAG alternative mentioned:** Vector embeddings + chunking is the right approach for large documents at scale — covered in Zen's other videos

## Tools, People & Concepts Mentioned

- **Tools:** Claude Code, Claude Code Router (CCR), LM Studio, VS Code, WSL/Ubuntu, Next.js 13.5.6, TypeScript, Tailwind CSS, pdf-parse, pdfjs-dist, Windows Task Manager, Chrome
- **Models:** Qwen Coder 30B, Qwen 2.5 7B Instruct, Claude Sonnet 4.5 (cloud fallback visible on-screen)
- **Concepts:** Local LLM serving, OpenAI-compatible API endpoints, context window limits, RAG / vector embeddings, bypass-permissions mode, app router vs pages router (Next.js 13)
- **Community:** Zen's "AI Native Engineering" community (linked in description)

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 0:00 | Cold open — CCR already running, GPU visible, intro to the PDF reader app goal |
| 0:38 | Launches `ccr code` in VS Code terminal, LM Studio shown with Qwen Coder 30B loaded |
| 0:46 | GPU usage visible in Task Manager during initial planning phase; GPU ~30-40% on RTX 3090 |
| 1:05 | Shows `initial-prompt.md` with full tech spec (Next.js, TypeScript, Tailwind, local AI endpoint) |
| 1:35 | AI creates `Claude Code SPEC.md` with full folder structure and component breakdown |
| 3:12 | Switches to `ccr code --dangerously-skip-permissions` to speed up build |
| 5:00 | First manual test — `npm run dev` → 404 on localhost:3000 |
| 6:02 | Prompts Claude to investigate routing issue; local model loops |
| 6:44 | Honest admission: local model isn't good enough; pastes same prompt to cloud Claude |
| 7:12 | Cloud Claude immediately identifies Next.js 13 App Router structure error and fixes it |
| 7:42 | Finished app running — PDF Local Reader loads Pro Git (501 pages) |
| 8:55 | Context overflow error in LM Studio — 239K tokens, only 48K supported |
| 9:16 | Switches to Qwen 2.5 7B with 250K context in LM Studio |
| 9:38 | Request accepted, GPU usage spikes, slow generation but correct answer returned |
| 10:25 | AI correctly points to page 28 for `git status` documentation |

## Visual-Only Insights (not in transcript)

- **Terminal shows `Claude Code v2.0.27` and `Sonnet 4.5 - API Usage Billing`** in the opening frame — even while claiming "local model only", the CCR branding suggests it still shows the Claude Code version string even when routing locally
- **LM Studio version 0.3.30**, Qwen Coder 30B at 18.63 GB, context 48000, all GPU layers offloaded (48/48), reachable at `http://10.5.0.2:1234` — WSL IP, not localhost
- **RTX 3090 dedicated GPU memory shown as 29-31 GB out of 24 GB** — this is the shared/unified memory overflow, indicating the 30B model is partially spilling to system RAM
- **`initial-prompt.md` visible content:** Includes `Local AI API endpoint: http://10.5.0.2:1234/v1/chat/completions (OpenAI format compatible)` — key detail for reproducing the setup
- **LM Studio developer logs** explicitly show the error text: "Trying to keep the first 239158 tokens when the context overflows. However, the model is loaded with context length of only 48000 tokens"
- **Qwen 2.5 7B context setting:** Slider set to `250000`, model supports up to `300000` tokens — visible in LM Studio settings panel
- **GPU 1 (NVIDIA RTX 4070)** visible in later frames hitting ~80% during full-document inference — earlier frames show GPU 0 (RTX 3090). Two-GPU setup on Windows
- **package.json dependencies visible:** `@anthropic-ai/sdk: ^0.15.10` included even in the "local-only" app — likely for fallback or SDK compatibility
- **SPEC.md folder structure** explicitly shows: `src/components/ChatInterface/`, `AIIntegration/`, `hooks/`, `lib/PdfParser.ts`, `api/route.ts` — the full AI-generated architecture blueprint
- **App working state (frame 55+):** Chat UI shows "Context: Current Page Only" vs "Context: Entire Document" toggle buttons — clean two-mode UX visible before it's demonstrated verbally
