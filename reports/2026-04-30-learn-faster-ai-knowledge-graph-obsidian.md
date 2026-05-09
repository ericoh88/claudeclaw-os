# Learn Faster with an AI Knowledge Graph in Obsidian

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=dBebGUgiz34
**Duration:** 12:13

## Summary

- Zen van Riel demonstrates his Obsidian "second brain" — a knowledge graph built from AI engineering YouTube transcripts, automatically structured into interconnected markdown nodes by AI coding agents
- The system ingests raw video transcripts, extracts concepts (Hubs > Concepts > Technologies hierarchy), and creates consistent markdown files with Obsidian `[[link]]` syntax to wire the graph
- Everything is video-ID-indexed so you can search the graph by pasting a YouTube video ID and instantly see what concepts that video covered and how they connect to other content
- Live demo shows OpenAI Codex processing a new transcript in real-time, creating Claude Code and OpenAI Codex technology nodes — with a small AI naming error caught and fixed via VS Code mass-replace
- Free prompts (system prompts for transcript processing + vault structure) are offered in the video description; input data can be YouTube transcripts, existing notes in any platform, or code repositories

## Key Points

1. **The knowledge graph use case.** Van Riel uses the graph to surface cross-video concept clusters, spot gaps, and generate follow-up video ideas — e.g., "Gemini CLI hasn't appeared in a while, combine it with the Git workflow idea"

2. **Vault structure (3 levels of node granularity):**
   - **Hubs** — high-level topics that connect many concepts (e.g., AI_Coding_Systems, Agent_Orchestration)
   - **Concepts** — recurring patterns and ideas (e.g., Structured_AI_Coding_Workflow, AI_Cost_Management, Human_In_The_Loop_Coding_Rituals)
   - **Technologies** — specific tools and platforms (e.g., Gemini_CLI, Claude_Desktop)

3. **Markdown-first design.** Obsidian uses plain markdown, so any AI coding agent (Claude Code, Codex, Gemini CLI, Copilot) can directly create and edit vault files. No plugin APIs needed.

4. **Consistent node format.** Each file uses YAML frontmatter (`type`, `category`, `status`) plus Obsidian `[[]]` links to hubs and concepts. A "transcript processing agent" system prompt enforces this structure on every ingestion run.

5. **Video ID indexing.** Processed transcripts are stored keyed by YouTube video ID. This lets AI agents (and human searches) look up "what concepts appeared in video X" by pasting the video ID into the Obsidian graph filter.

6. **AGENTS.md as vault context.** A root-level `AGENTS.md` file describes the full vault structure and includes a CLI Query Playbook (ripgrep commands) for AI agents to navigate the vault programmatically.

7. **Live ingestion demo.** Codex processes a transcript and creates two new technology nodes: `Claude_Code` and `OpenAI_Codex`. It capitalized "CodeX" incorrectly — corrected with VS Code mass-replace across all files.

8. **Input data alternatives.** If you don't have a YouTube channel: existing notes in Obsidian/Notion, or code repositories (a prompt can scan a repo and extract architectural concepts).

## Tools, People & Concepts Mentioned

- **Tools:** Obsidian, Visual Studio Code, OpenAI Codex (v0.20.0), Gemini CLI, Claude Code, GitHub Copilot, Git, ripgrep (`rg`)
- **People:** Zen van Riel (presenter/creator)
- **Concepts:** Knowledge graphs, second brain methodology, AI agent system prompts, transcript processing agents, vault structure design, hub-concept-technology hierarchy, video ID indexing, Obsidian graph view, markdown-as-API-for-AI-agents

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | Opens with full Obsidian graph view — dense network of AI_ nodes |
| 00:46 | Copies a YouTube video ID to paste into the Obsidian graph filter |
| 01:13 | Pastes video ID → graph filters to single "AI_Native_Git_Versioning" node |
| 01:22 | Right-clicks to open local graph — shows all concepts connected to that video |
| 02:57 | Switches to VS Code to show the raw markdown files behind the graph |
| 03:31 | Opens `Gemini_CLI.md` — shows YAML frontmatter + hub/concept links |
| 04:26 | Shows `AGENTS.md` root file with vault overview and ripgrep CLI playbook |
| 05:00 | Explains Hubs > Concepts > Technologies hierarchy from `vault_structure_overview.md` |
| 06:35 | Shows the "transcript processing agent" system prompt in the Agents folder |
| 07:51 | Opens OpenAI Codex in terminal, pastes prompt + transcript reference, submits |
| 09:25 | Codex finishes — checks git diff to see what files were created |
| 09:48 | Catches AI naming error ("CodeX" with capital X) — mass-replaces in VS Code |
| 10:31 | Switches back to Obsidian, searches for new OpenAI Codex node, confirms it's wired in |
| 11:52 | CTA: free prompts in description, call to comments |

## Visual-Only Insights (not in transcript)

- **Bookshelf detail:** "AI Engineering" book with an owl cover is visible on his shelf throughout all talking-head shots — clearly a key reference text
- **YouTube Studio sidebar (00:07):** Shows Zen's actual recent video titles overlaid on the graph: "TIME TRAVEL AI AGENT Master The GIT Workflow", "AI Context Overload", "CLAUDE CODE vs Codex It Doesn't Matter", "Self-Testing AI Code", "Automatic AI Memory"
- **AGENTS.md CLI playbook is extensive:** The `rg` (ripgrep) commands visible include complex multi-step queries: inventory by folder, audit notes with missing outbound links, locate transcripts by concept, check CTA language, cross-reference hub-technology links — much more detailed than verbally described
- **`Gemini_CLI.md` "Receipt" annotations:** Core Capabilities entries include `⬅️Receipt: [Resources/Processed_Transcripts/Three_Agents_Orchestrated_DevParallel]` — a citation system linking capabilities back to the source transcript they came from. This wasn't mentioned verbally.
- **Codex version visible:** Terminal shows `OpenAI Codex (v0.20.0)` with slash-command UI (`/init`, `/status`, `/approvals`, `/model`, `send | newline | 'transcript' | ^C quit`)
- **Git diff reveals exact output:** After Codex runs, the VS Code git diff clearly shows two new files created: a `Claude_Code` technology node and an `OpenAI_CodeX` technology node (with the naming error). The diff view also shows existing files that were updated with new cross-links.
- **Graph filter sequence (10:31):** After mass-replacing the naming error, Obsidian graph shows `OpenAI_Codex` connected to exactly `AI_Coding_Systems` and `Integration_Patterns` — visually confirming the agent built correct cross-links automatically

## Influencer: Zen van Riel

Channel: Zen van Riel | Topic: AI engineering, Obsidian knowledge management, AI coding workflows | YouTube: https://youtube.com/@zenvanriel
