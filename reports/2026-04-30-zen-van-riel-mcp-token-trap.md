# This AI Coding Trap Destroys Your Productivity

**Date:** 2026-04-30
**Channel:** Zen van Riel (@zenvanriel)
**URL:** https://youtube.com/watch?v=WmS9_m5n1kU
**Duration:** 11:55

## Summary

- MCP servers silently load every tool definition into context on every turn — even tools you never call — burning hundreds of thousands of tokens per session
- In a live demo, the GitHub MCP server consumed 31K input tokens + 125K cache tokens in just two simple queries (get latest issue, get latest workflow run)
- The same two queries done with the GitHub CLI (`gh`) cost only 9K input + 25K cache tokens — roughly 3-4x cheaper and with a cleaner context
- The core trade-off: 100K tokens spent on MCP tool definitions = roughly 40 code files you could have in context instead (a 300-line Python class = only 2,258 tokens)
- Zen's advice: audit your MCP servers per-tool and per-project, replace with CLI equivalents where possible, and reserve heavy MCP use for dedicated non-coding sessions

## Key Points

1. **The invisible token tax.** Every MCP server you connect loads its full tool manifest into context every single turn. The GitHub MCP server alone has 80+ tools — that overhead exists even if your actual prompt is "get the latest issue."

2. **Cache doesn't save you.** Cached tokens still count toward rate limits and still occupy context window. On a subscription plan you'll hit limits faster. At scale, 100K+ cached tokens per short session adds up fast.

3. **Context pollution degrades quality.** Thousands of irrelevant tool-definition tokens reduce the attention the model can give to your actual code. Less code context = worse AI suggestions.

4. **GitHub CLI is a full replacement for GitHub MCP.** Commands like `gh issue list --state all` and `gh run list --limit 1` give identical results to the MCP server calls with a fraction of the token cost. No MCP required.

5. **Separate tools for separate jobs.** Zen uses Claude Desktop (with YouTube MCP) for brainstorming video ideas, and OpenAI Codex (no GitHub MCP) for actual coding. Each tool has only the context it needs.

6. **Practical audit steps:**
   - Review your current MCP config and delete unused servers
   - Evaluate remaining servers on a per-project and per-tool basis
   - Ask whether a CLI tool (`gh`, etc.) can do the same job with fewer tokens

7. **Tools Zen actually keeps:** Context7 and Serena — mentioned as the MCP servers he consistently uses and considers worth the token cost.

## Tools, People & Concepts Mentioned

- **Tools:** GitHub MCP server, OpenAI Codex (CLI), Claude Desktop, VS Code, GitHub Actions, GitHub CLI (`gh`), OpenAI tokenizer, Context7, Serena
- **People:** Zen van Riel
- **Concepts:** MCP servers, token caching, rate limits, context window, RAG, GitHub Actions workflows, CLI vs MCP trade-offs, AI native engineering

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | Intro — framing MCP servers as a hidden productivity trap |
| 01:30 | Shows the zen-ai-engineer-tutor GitHub repo structure |
| 01:50 | Opens OpenAI Codex with GitHub MCP connected, shows 80+ tool list |
| 02:20 | Demo query: "get the latest issue from the repo" |
| 02:50 | Red arrow points to "13.3K tokens used" after just one query |
| 03:10 | Second query: "what was the status of the latest action workflow run" |
| 04:00 | Token count climbs — 28K then 33K tokens in two turns |
| 04:30 | `/status` command reveals 31,550 input + 125,056 cached tokens |
| 05:15 | Tokenizer demo — 300-line Python class = only 2,258 tokens |
| 05:50 | "40 different code files vs MCP tool definitions" — the core argument |
| 06:30 | Shows Codex with NO MCP servers; repeats same queries via GitHub CLI |
| 07:30 | Same issue retrieved, same workflow found — only 5K tokens |
| 08:20 | `/status` comparison: 9K input + 25K cached vs 31K + 125K with MCP |
| 09:00 | Strategy: use different tools for different tasks |
| 09:30 | Claude Desktop demo — YouTube MCP for brainstorming, not coding |
| 10:30 | Three-step audit recommendation |
| 11:10 | CTA — community link in description |

## Visual-Only Insights (not in transcript)

- **Book on shelf:** "AI Engineering" with an owl illustration is prominently displayed — consistent background prop, likely deliberate personal branding
- **GitHub MCP tool list (frame ~11):** The full list is visually staggering — 80+ tools visible in the terminal including deeply niche ones like `rebase_sub_issue`, `dismiss_notification`, `get_global_security_advisory`. The visual impact makes the bloat argument immediately obvious without needing the audio
- **Model in use:** Codex sessions show `gpt-5-codex` as the model, Provider: OpenAI — this is the OpenAI Codex CLI, not Claude Code
- **Red arrow annotations:** Zen added post-production red arrows to highlight token usage numbers on screen — a deliberate editorial choice to direct viewer attention to the key data points
- **Tokenizer page (frame ~30):** The OpenAI tokenizer tool shows the exact Python code snippet from his `cosmos_db.py` file pasted in — he's doing this comparison live, not faking the numbers
- **Claude Desktop UI (frame 68):** Shows "Opus 4.1" as the model and action categories: Write, Learn, Code, Life stuff, Claude's choice — this appears to be a different/custom Claude interface or a future version, not standard Claude.ai
- **Channel stats (frames 71-72):** YouTube channel stats shown during Claude Desktop demo — Zen van Riel has 7,990 subscribers, 328,576 total views, 56 videos published as of recording
- **Closing gesture (frames 78-79):** Zen points to himself with both thumbs — a confident, self-referential close suggesting "trust me on this, I've done it"
