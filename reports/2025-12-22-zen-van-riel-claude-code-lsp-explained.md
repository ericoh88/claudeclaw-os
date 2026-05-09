# Claude Code Just Got The Ultimate Dev Shortcut (LSP Explained)

**Date:** 2025-12-22
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=lffYEu5MhSQ
**Duration:** 05:41

## Summary

- Claude Code now has native Language Server Protocol (LSP) support baked in, letting it interact with code the same way professional developers do via IDE tooling.
- Without LSP, Claude Code falls back to Grep for finding references -- functional but less precise. With LSP, it uses proper semantic code intelligence.
- Setup is simple: type `/plugin` inside Claude Code, find your language's LSP plugin (e.g. `pyright-lsp` for Python), and install it. No external MCP server required.
- Zen has been using the Serena MCP server (17.5k GitHub stars) as a prior workaround -- this is now redundant for most users since the capability is native.
- LSP enables Claude to do "find all references", "go to definition", and type introspection (hover info on function parameters) just like a human dev would in VS Code.

## Key Points

1. **LSP support is now natively in Claude Code** -- no third-party MCP server needed. This is a significant upgrade for code navigation accuracy.

2. **The problem LSP solves:** without it, Claude uses Grep to find references. Grep is text-based and can produce false positives or miss references. LSP understands the language semantically, so `findReferences` returns exact call sites, not string matches.

3. **Installation via `/plugin`:** type `/plugin` in Claude Code, browse to your language's plugin (e.g. `pyright-lsp` for Python, `gopls-lsp` for Go, `rust-analyzer-lsp` for Rust), install as user-scoped. Tab to cycle between Discover / Installed / Marketplaces / Errors views.

4. **Version caveat:** at time of recording, LSP is broken in the latest Claude Code release. Workaround: pin to v2.0.67 with `ENABLE_LSP_TOOL=true npx @anthropic-ai/claude-code@2.0.67`. Likely fixed by time most viewers watch.

5. **Demo -- find references:** Claude uses `LSP(operation: "findReferences", symbol: "clean_with_llm", in: "backend/transcription.py")` and gets back 3 references across 2 files instantly. Also surfaces 2 diagnostic issues (Pyright linting errors) as a bonus.

6. **Demo -- type introspection:** asking "what parameters does `chat.completions.create` accept?" triggers Claude to hover over the function in code, pull the full parameter list (required + optional + descriptions) from the LSP, and return it -- replicating what a dev does with IDE hover tooltips.

7. **Serena MCP still relevant for heavy use:** Serena (praxis-ai/serena, 17.5k stars, 1.2k forks) exposes language servers to AI editors. It was the prior best practice. Now native LSP replaces it for basic use cases, but Serena may still be relevant for advanced/multi-language setups.

## Tools, People & Concepts Mentioned

- **Tools:** Claude Code, Pyright LSP, Gopls, Rust Analyzer, Serena MCP server, yt-dlp, VS Code, Grep
- **People:** Zen van Riel
- **Concepts:** Language Server Protocol (LSP), `findReferences`, Go to Definition, type introspection / hover info, Pyright static analysis, semantic code search vs text search, `/plugin` command in Claude Code

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | Intro -- announcing LSP support in Claude Code |
| 00:21 | Demo 1: "find code used to invoke an LLM" -- without LSP, uses Grep, finds `transcription.py:66` |
| 00:59 | Demo 2: "find all references with LSP" -- fails with "No LSP server available for .py", falls back to Grep |
| 01:39 | Shows `/plugin` command, browses plugin list, installs `pyright-lsp` |
| 02:14 | Restarts Claude Code; reveals version pin workaround (`@2.0.67`, `ENABLE_LSP_TOOL=true`) |
| 02:30 | Demo 3: re-runs "find LLM invocation and use LSP for references" -- LSP succeeds this time |
| 02:58 | Expands results: 3 references across 2 files + 2 Pyright diagnostic issues surfaced |
| 03:55 | Mentions Serena MCP (17.5k stars) as prior workaround, now superseded by native LSP |
| 04:30 | Demo 4: "what params does `chat.completions.create` accept?" -- LSP hover returns full parameter list |
| 05:07 | Shows manual hover in VS Code over `create` -- same data Claude is now reading via LSP |
| 05:28 | CTA: comment your language so community can share LSP configs |

## Visual-Only Insights (not in transcript)

- **Exact command visible for version pin:** `ENABLE_LSP_TOOL=true npx @anthropic-ai/claude-code@2.0.67` -- the transcript only says "use this command", but the screen shows the full string, including the `ENABLE_LSP_TOOL` env var which is not explicitly spelled out in audio.
- **Pyright diagnostics surfaced as bonus:** the LSP call for `findReferences` also returned `"Found 2 new diagnostic issues in 1 file"` -- specifically `[L 76:59] "strip" is not a known attribute of "None" (reportOptionalMemberAccess)` and `[L 80:10] "info" is not accessed`. These were visible on screen but never mentioned verbally. LSP gives you linting for free.
- **Function signature in hover tooltip visible:** hovering over `clean_with_llm` on line 108 of `app.py` shows `(method) TranscriptionService.clean_with_llm(self, text: str, system_prompt: str | None) -> str` -- the exact return type and parameter types are visible in the VS Code tooltip.
- **Full plugin list visible:** the `/plugin` screen shows 40 total plugins, with `gopls-lsp` (Go) and `rust-analyzer-lsp` (Rust) visible in addition to `pyright-lsp` (Python 29/40), confirming broad language support beyond what was mentioned verbally.
- **Serena GitHub stats:** the GitHub page shown is `praxis-ai/serena` with 17.5k stars, 1.2k forks, 126 watchers -- slightly more precise than the "over 17,000 stars" mentioned verbally.
- **Codebase context:** the demo app is `local-ai-transcript-app`, a FastAPI backend with a `TranscriptionService` class. The LLM call at `transcription.py:66` uses `self.llm_client.chat.completions.create()` with `OpenAI` client initialized at line 32 with a custom `base_url` -- indicating it uses an OpenAI-compatible local/proxy endpoint.
- **Claude version:** Claude Code is running `Opus 4.5 - Claude Max` plan throughout the demo.
