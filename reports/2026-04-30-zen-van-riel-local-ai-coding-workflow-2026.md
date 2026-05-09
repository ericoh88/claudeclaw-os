# The Unbeatable Local AI Coding Workflow (Full 2026 Setup)

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=3zSANOIBHYw
**Duration:** 16:33

---

## Summary

- Full walkthrough of running Qwen 3.5 models locally on an RTX 3090 and routing them through Claude Code via LM Studio's Anthropic-compatible API endpoint
- Introduces LM Studio Link — an encrypted tunnel that lets a weak laptop offload inference to a powerful remote GPU machine
- Honest breakdown of the real-world limitations: slow TTFT due to Claude Code's large system prompt, need for large context windows (80k+ tokens), and more bugs vs. cloud SOTA
- Demonstrates building a full-stack Next.js dashboard app (LM Studio server health monitor) using the local model through Claude Code's plan mode + sub-agents
- Key workflow recommendations: use Qwen 3.5 35B MoE (not coder variant) for speed, set context to 80k+, use sub-agents to manage limited context, run in dev containers for bypass-all-permissions mode

---

## Key Points

1. **Hardware matters more than you think.** The demo machine is a Linux box with an RTX 3090 (24GB VRAM). Frames confirm GPU hitting 93% utilization and 211W power draw during active generation. If your model doesn't fit entirely in VRAM, performance degrades badly — tokens get shuffled between GPU and system RAM. Just because a model loads doesn't mean it's usable.

2. **LM Studio Link is the sleeper feature.** It creates an end-to-end encrypted tunnel between two devices. He runs the heavy model on the Linux box and connects it to his MacBook as if the model were local. The frames confirm it works — GPU spikes to 98% on Ubuntu when a query is sent from the MacBook. This means anyone with a beefy desktop can get good local AI on a weak laptop.

3. **Connecting Claude Code to LM Studio.** LM Studio exposes an Anthropic-compatible API endpoint at `/v1/messages`. You redirect Claude Code by setting two env vars before launching it:
   ```bash
   export ANTHROPIC_BASE_URL=http://127.0.0.1:1234
   export ANTHROPIC_API_KEY=lm-studio
   claude
   ```
   The API key value doesn't matter — LM Studio accepts any non-empty string.

4. **Default context window of 4000 tokens will silently hang.** Claude Code's system prompt alone is ~3,000 tokens. With tools overhead it hits ~18k tokens before you've typed anything. At 4000 token context, the model just hangs with no clear error. Fix: set LM Studio's context window to 80,000+ tokens.

5. **Model identity confusion is expected.** When you ask the local Qwen model what it is, it will say "I'm Claude Sonnet 4.6" — because Claude Code injects that in its system prompt. This is not a bug, it's how system prompt conditioning works. The model genuinely doesn't know what it is.

6. **Pick the right model.** The coding-specialist `qwen3-coder-next` is good but doesn't fully fit on a 24GB GPU. He switches to `Qwen3.5-35B-A3B` (35B MoE, quantized to ~22GB) which fits entirely and responds much faster. For agent coding where context grows large, full-GPU fit is more important than specialized training.

7. **Sub-agents are essential for local AI coding.** Because context windows are limited, the best pattern is to spawn sub-agents with fresh context for each spec/task, have them report back to the main agent. Claude Code's Task tool supports this natively. He explicitly prompts it to "create sub-agents for each task."

8. **Dev containers for safe bypass mode.** To use `--dangerously-skip-permissions` (bypass all permissions mode) so you can walk away while it codes, he runs inside a dev container. This isolates the environment so the agent can write files freely without security risk.

9. **Context overflow management.** When context fills up, LM Studio offers three strategies: Truncate Middle (removes middle of conversation, keeps beginning/end), Rolling Window (drops oldest), Stop at Limit. He uses Truncate Middle. Sometimes Claude Code handles this itself by summarizing.

10. **Capability gap is real.** Local models produce more bugs. The built dashboard had hardcoded GPU model names ("RTX 3080") the model made up. He had to pass more API documentation and let the model self-test via curl calls to fix it. He's honest: still not Claude Opus quality, but impressive for local.

---

## Tools, People & Concepts Mentioned

**Tools:**
- LM Studio (local model server, including Link feature)
- Claude Code (used with `--dangerously-skip-permissions` via dev containers)
- VS Code (development environment)
- Next.js + TypeScript (demo app framework)

**Models:**
- Qwen3-coder-next (~23GB quantized, coding specialist)
- Qwen3.5-35B-A3B (~22.5GB quantized, MoE, 35B params, 200k context — main demo model)

**Concepts:**
- Mixture of Experts (MoE) — not all parameters active per query, enables large model to fit in VRAM
- LM Studio Link — encrypted cross-device model sharing
- Anthropic-compatible API endpoint (`/v1/messages`) vs OpenAI-compatible (`/v1/chat/completions`)
- Context overflow strategies (Truncate Middle, Rolling Window, Stop at Limit)
- Sub-agent pattern for context management
- Dev container isolation for bypass-all-permissions

---

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | Intro hook — Qwen model generating Python at 100-140 tokens/sec on Linux GPU |
| 01:15 | GPU vs RAM split explained — why partial VRAM load kills performance |
| 01:46 | LM Studio Link introduced — setting it up between Linux + MacBook |
| 03:09 | Connecting Claude Code to LM Studio (env var approach) |
| 04:36 | Claude Code gives the two export commands after asking itself how to do it |
| 05:00 | Critical insight: Claude Code's system prompt is huge — slows local models a lot |
| 06:24 | Switching to Qwen 3.5 (non-coder) for better GPU fit + speed |
| 06:37 | Demonstrating the 4000-token context window failure (silent hang) |
| 07:09 | Fixing context to 80,000 tokens — model now responds properly |
| 08:04 | Starting the demo build: Next.js dashboard for LM Studio API |
| 09:23 | Plan mode with local model — surprisingly works well with tool calling |
| 10:41 | Context usage breakdown shown: 45k/200k (22%) after planning phase |
| 11:14 | 7 spec files generated for the full-stack build |
| 12:48 | Running in dev container + bypass-all-permissions mode |
| 13:21 | Asking Claude Code to spawn sub-agents per spec |
| 14:00 | Post-build review — working but has hallucinated hardware info (RTX 3080) |
| 14:52 | Giving agent access to curl LM Studio API directly to self-debug |
| 15:19 | Final dashboard working — shows real models from LM Studio API |
| 16:03 | Outro — honest assessment and call to action |

---

## Visual-Only Insights (not in transcript)

- **Frame 3 (GPU stats):** RTX 3090 showing 93% usage, 211W power, 44°C during Dijkstra generation. The context window setting is visible as 4000 tokens (the default that causes hangs).

- **Frame 13 (model list on macOS):** LM Studio model selector shows exact sizes: Qwen3.5-35B at 28.4 GiB, Qwen3-coder-next at 23.0 GiB. The LM Link panel shows Ubuntu as connected device.

- **Frame 15 (proof of remote compute):** GPU on Ubuntu spikes to 98% with 18.4 GiB VRAM used when the MacBook sends a query — visual proof the link is routing inference to the remote machine.

- **Frame 19 (all endpoints visible):** LM Studio's Developer tab shows all supported endpoints: `/v1/chat/completions`, `/v1/completions`, `/v1/models`, `/v1/messages` (Anthropic), `/v1/download/status/{job_id}`. The key one Claude Code needs is `/v1/messages`.

- **Frame 36-37 (YouTube analytics overlay):** He shows his own channel analytics — **96% of viewers are NOT subscribed**. This is his hook for the mid-video sub pitch.

- **Frame 38 (exact commands):** The terminal response from Claude Code shows the exact export commands with important caveats: the session won't be affected until you start a new session, tool use may not fully work with local models, extended thinking won't work.

- **Frame 46 (context breakdown):** Claude Code's context usage breakdown visible: System tools 15.3k tokens (7.7%), System prompt 3.1k (1.6%), Messages 16.2k (8.1%), free space 132k (66.2%). Total: 45k/200k (22%) after planning phase.

- **Frame 47 (spec files):** 8 spec files created: `01-project-setup.md`, `02-type-definitions.md`, `03-backend-proxy-layer.md`, `04-state-management.md`, `05-UI-components.md`, `06-main-dashboard-page.md`, `07-main-dashboard.md`, `08-backend-mock.md`.

- **Frame 51-52 (context overflow options):** LM Studio settings show all three overflow strategies with a dropdown: Truncate Middle, Rolling Window, Stop at Limit.

- **Frame 61 (self-debugging):** The agent is given instructions to call the LM Studio API directly with curl to see the actual response format, then fix its own code to match. Red/green diff highlighting visible in VS Code showing the fix.

- **Frames 64-80 (final dashboard):** Built dashboard shows LM Studio server status, GPU memory allocation (8.4GB / 12.8GB, 65% used), model list with Load/Unload buttons. At one point 2 models are loaded simultaneously, then one is unloaded — the UI updates in real time.

---

## Practical Takeaways for Local AI Coding

1. **Minimum viable local setup:** GPU with 24GB VRAM, LM Studio, Qwen3.5-35B-A3B (the MoE variant, not coder), context window 80k+ tokens
2. **Routing command:** `ANTHROPIC_BASE_URL=http://127.0.0.1:1234 ANTHROPIC_API_KEY=lm-studio claude`
3. **LM Studio Link** solves the "weak laptop" problem — run inference on a desktop from any device
4. **Sub-agents** are the key pattern to stretch limited local context windows
5. **Dev containers** = safe bypass-all-permissions mode
6. **Give your agent API docs + curl access** to help it self-debug integration code
7. Still expect more bugs than Claude Opus — be realistic, iterate more aggressively
