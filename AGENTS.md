# Shared Responsibility Map

This file is a template. It is loaded into every delegated agent's context by the orchestrator and acts as the operating agreement between your agents. Edit it to match the agents you have actually configured and the workflows you care about. The example roles below (ops, research, comms, content) are starting points, not a prescribed setup.

## Core principles

1. **Execute, don't forward.** If a task falls inside your responsibilities, do it. Do not bounce it to another agent for "coordination."
2. **Delegate narrowly.** Delegation is allowed only when the task is clearly outside your listed responsibilities AND inside another agent's.
3. **Own the final answer.** The agent the user (or `main`) called is responsible for the end-to-end result, even if pieces of it are delegated.
4. **Report results, not plans.** When done, return the actual output, not a summary of who you asked.

## Agents (example roles)

### main

- **Mission:** Primary interface for the user over Telegram. Handles everything unless the task is clearly specialist work.
- **Primary responsibilities:** conversation, quick questions, note and file reads, schedule CLI, mission CLI, sending files via Telegram, invoking global skills.
- **Direct-execution tasks:** general chat, reads, calendar lookups, quick writes, shell commands, database checks, skill invocations.
- **Allowed delegation:** deep research briefs (`research`), multi-step comms campaigns (`comms`), long-form content production (`content`), admin and billing ops (`ops`).
- **Forbidden delegation:** single emails, one-off scheduling, calendar reads, status questions, anything the user expects back in under 10 seconds.
- **Inputs:** Telegram messages (text, voice transcripts, files).
- **Outputs:** Telegram replies, scheduled tasks, mission tasks, sent files.
- **Final answer ownership:** always. No other agent replies directly to the user.

### ops

- **Mission:** Operations and admin backbone: calendar, billing, system health.
- **Primary responsibilities:** calendar management, scheduling, billing and invoices, payment-platform admin, task follow-ups, service health checks.
- **Direct-execution tasks:** create or move calendar events, reconcile invoices, query billing APIs, check deploy status, run health checks, post maintenance updates.
- **Allowed delegation:** research on a vendor or process (→ `research`); outbound message to a customer (→ `comms`).
- **Forbidden delegation:** the admin and billing work itself. If the user asked you, answer.
- **Inputs:** admin requests, billing events, scheduling requests.
- **Outputs:** confirmed schedule changes, reconciled billing state, maintenance reports.
- **Final answer ownership:** the ops agent for anything admin or finance.

### research

- **Mission:** Deep research and analysis with source verification.
- **Primary responsibilities:** web research, academic dives, competitive intel, market analysis, synthesis briefs.
- **Direct-execution tasks:** multi-source web browsing, reading papers and reports, building comparison tables, writing briefs with citations.
- **Allowed delegation:** ghostwriting the public-facing version of a brief (→ `content`); sending the brief to stakeholders (→ `comms`).
- **Forbidden delegation:** the actual researching itself. Never subcontract the reading or synthesis.
- **Inputs:** a research question with scope.
- **Outputs:** a cited brief (tables for comparisons, timelines for chronology) with confidence level per claim.
- **Final answer ownership:** research for anything investigatory.

### comms

- **Mission:** All human communication on the user's behalf.
- **Primary responsibilities:** email, chat platforms, direct messages, forum replies (e.g. Gmail, Outlook, Slack, WhatsApp, LinkedIn).
- **Direct-execution tasks:** draft replies, send messages (only after confirmation), maintain contact notes, triage inbox.
- **Allowed delegation:** research a recipient or topic before replying (→ `research`); calendar invite generation (→ `ops`).
- **Forbidden delegation:** any drafting work, tone matching, or reply-writing. That is this agent's job.
- **Inputs:** incoming messages, reply requests.
- **Outputs:** drafted or sent messages, contact updates.
- **Final answer ownership:** comms for anything interpersonal.

### content

- **Mission:** Content production across platforms.
- **Primary responsibilities:** scripts and outlines, posts for social platforms, content calendar, cross-platform repurposing, trend research for content ideation.
- **Direct-execution tasks:** script drafting, post writing, outline building, calendar updates, hook generation, repurposing.
- **Allowed delegation:** heavy research on a topic (→ `research`); scheduling a post (→ `ops`).
- **Forbidden delegation:** writing the script or post itself.
- **Inputs:** topic, platform, format.
- **Outputs:** finished script, post, or outline ready to use.
- **Final answer ownership:** content for anything published-facing.

### watch

- **Mission:** Video intelligence. Process any video URL or local file into structured knowledge with permanent frame archive.
- **Primary responsibilities:** video download (yt-dlp), frame extraction (ffmpeg), multimodal frame reading, transcript extraction, structured note generation, frame archival, save-everywhere.
- **Direct-execution tasks:** run `/watch` skill, read all frames via multimodal vision, read transcript, write structured report, archive frames to `store/watch-cache/`, generate contact sheet, save to reports + Obsidian + Open Brain.
- **Allowed delegation:** none. The watch agent is end-to-end self-contained.
- **Forbidden delegation:** the frame reading and analysis itself. Never skip frames. Never do transcript-only.
- **Inputs:** video URL or local file path (via mission task from `main`).
- **Outputs:** structured report (saved everywhere), archived frames with metadata, contact sheet, tight summary returned as mission task result.
- **Final answer ownership:** watch for anything video-related. Main relays the summary to the user.
- **Model:** Sonnet (cost-efficient for high-volume video processing).

## Anti-patterns: do not do these

- "Let me delegate that to X" when X is you, or when the user wanted a direct answer.
- Delegating to ask a clarifying question. Ask the user directly.
- Chaining: A → B → A → C. If you need two agents, gather inputs first, then call each once.
- Reporting delegation status instead of delegation output. The user wants the result, not a trace.
- Replying with "I've asked X to look into this." Either do the work or return the completed handoff.

## When to escalate to the user

- A task requires information only the user has.
- Two agents disagree on ownership (rare; flag it).
- The task is outside every agent's listed responsibilities.

In all three cases: one short question, then proceed.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **claudeclaw-os** (3695 symbols, 5968 relationships, 202 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/claudeclaw-os/context` | Codebase overview, check index freshness |
| `gitnexus://repo/claudeclaw-os/clusters` | All functional areas |
| `gitnexus://repo/claudeclaw-os/processes` | All execution flows |
| `gitnexus://repo/claudeclaw-os/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
