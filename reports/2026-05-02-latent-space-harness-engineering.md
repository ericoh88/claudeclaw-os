# Extreme Harness Engineering: 1M LOC, 1B toks/day, 0% Human Code or Review

**Source:** https://youtu.be/CeOXx-XTYek
**Channel:** Latent Space
**Guest:** Ryan Lopopolo, OpenAI (Frontier Product Exploration)
**Hosts:** Swyx (shawn@latent.space) + Alessio
**Duration:** 77 minutes
**Published:** 2026-04-07
**Views:** ~36K

---

## TL;DR

Ryan Lopopolo from OpenAI's Frontier team ran a 5-month experiment: building and shipping an internal beta product with ZERO manually written code across a 1M+ LOC codebase. The team of ~3 engineers produced ~1,500 PRs using Codex exclusively. The result was "Symphony" -- an open-source Elixir-based orchestration system (a "ghost library") that coordinates multiple Codex agents to autonomously handle the entire SDLC: coding, testing, PR review, CI, merge conflicts, dashboards, documentation, and even cutting tickets for follow-up work.

---

## Key Concepts

### 1. Harness Engineering (the new discipline)
- "Move over, context engineering. Now it's time for Harness engineering."
- The "harness" = the Codex environment (CLI + skills + scripts + context). Your job as an engineer shifts from writing code to engineering the harness so agents can write better code.
- When the agent fails, don't prompt harder. Ask: "What capability, context, or structure is missing?"
- Every agent mistake = an unwritten non-functional requirement. Write it down, encode it in docs/tests/lints.

### 2. Humans as the Bottleneck
- "The only fundamentally scarce thing is the synchronous human attention of my team."
- Went from 3.5 PRs/engineer/day (pre-o3) to 5-10 PRs/day (post-o3). Humans were tapped out from context switching.
- Solution: remove humans from the loop entirely. Post-merge review only. No pre-merge human code review.
- Ryan's role shifted to "group tech leading a 500-person org" -- setting architecture, not reviewing PRs.

### 3. Symphony (the Ghost Library)
- Open source: https://github.com/openai/symphony/tree/main
- Written in Elixir (model chose it -- Beam VM's process supervision maps perfectly to agent orchestration)
- A "spec" (ghost library) that Codex can implement locally. Not a library you import -- it's instructions an agent follows to build the system.
- Key innovation: distribute software as specs, not code. The agent rebuilds it locally.
- Spec was itself written by Codex: point it at the internal repo, ask it to write a spec, then have another Codex implement it, then another review it. Loop (Ralph-style) until high fidelity.

### 4. The Six Layers of Symphony
1. **Policy** -- institutional knowledge (CI must pass, PR format, etc.)
2. **Configuration** -- environment setup, variables
3. **Coordination** -- agent orchestration, task distribution (the tricky one)
4. **Execution** -- actual code writing by agents
5. **Integration** -- connecting to external systems (Linear, GitHub, Slack)
6. **Observability** -- traces, metrics, dashboards (all agent-authored)

### 5. Agent-Legible Software
- Software must be written for agents, not humans. Agent legibility > human legibility.
- The codebase has ~500 npm packages (architecture for 10,000 engineers, but only 3 humans + many agents)
- Only 6 skills total. When something isn't covered, encode it into an existing skill rather than creating new ones.
- Everything is text. "My job is to figure out ways to funnel text from one agent to the other."
- CLI tools must be token-efficient. Suppress passing test output. Only show failures.

### 6. Build Discipline
- Builds MUST complete under 1 minute. When o3 got background shells, it became impatient with long builds.
- Went through Make -> Bazel -> Turbo -> NX in a week because "the only goal was to make the agent productive."
- Tokens are cheap, so constantly garden the build system. Much less dispersion.

### 7. Code is Disposable
- When a PR fails review, Symphony moves it to "rework" state: completely trashes the worktree and PR, starts from scratch.
- Heavy use of git worktrees for parallelism. Models are great at resolving merge conflicts.
- "If it's garbage, I can just throw it away and not care."

---

## Quotable Moments

- "You kind of have to step back. Take a systems thinking mindset and constantly ask: where is the agent making mistakes? Where am I spending my time? How can I not spend that time going forward?"
- "Code is context. Code is prompts."
- "Don't put the agent in a box. Give the agent full accessibility over its domain."
- "You can just Codex things." (internal emoji/meme at OpenAI)
- "It's borderline negligent if you aren't using 1B tokens a day."
- "I would never shoulder-surf a teammate. I wouldn't want a screen recording of their entire session. I'd expect them to convince me the code is good and mergeable."
- On FFmpeg: "There's a SaaS micro-SaaS in every flag in FFmpeg."

---

## Technical Details

- **Stack:** Electron app (React), ~1M LOC, 500+ npm packages
- **Observability:** Full local dev stack -- Prometheus, Grafana, Victoria metrics, Jaeger traces. Agent writes its own dashboard JSON and responds to its own pages.
- **Issue tracking:** Linear (real Linear, not custom). Agent can cut its own tickets.
- **MCP opinion:** Ryan is "bearish on MCP" -- forces token injection, messes with autocompaction, agent forgets tool usage. Prefers thin CLI shims.
- **Model progression:** Started with Codex Mini (painful, 10x slower first month), through o1-pro, o3, o3-pro, o4-mini, to GPT-5.4. Each model generation required adapting the codebase.
- **GPT-5.4:** First model that merges top-tier coding + general reasoning + computer use in one model. "Fantastic model."
- **Self-improvement:** Team slurps all session logs into blob storage, runs daily agent loops to find team-wide improvements, reflects back into the repo. Everyone benefits from everyone else's behavior.

---

## Brett Taylor's Take (OpenAI Chairman)

- Software dependencies are going away. They can be vendored/inlined by agents.
- Ryan agrees for low-medium complexity deps (couple thousand lines). Agent strips away generic parts, keeps only what's needed.
- Tradeoff: you lose community security testing ("many eyes") when you inline deps. You're back to zero on trust.
- "The end of plugins" -- no need for generic abstractions when code is free.

---

## What Models Still Struggle With

- **Zero-to-one products** (hard + new quadrant). Models need humans for pure whitespace exploration.
- **Deep refactors** where proper interface shapes aren't known yet.
- **Multi-human multi-agent coordination** is an unsolved explosion of complexity.
- Other three quadrants (easy+established, easy+new, hard+established) are "largely solved given the right scaffold."

---

## OpenAI Frontier (Enterprise Platform)

- Enterprise platform for deploying agents safely at scale with governance.
- Ryan's team explores novel ways to package models into enterprise solutions.
- Background: Ryan came from Snowflake, Stripe, Citadel -- same enterprise customer profile.
- Expanding: offices in Bellevue and NYC, hiring.

---

## Relevance to Our Stack

This is directly relevant to how we run ClaudeClaw/Atlas:
- **Skills = their skills pattern.** They use 6 skills total. We have dozens. Worth auditing for consolidation.
- **Agent-legible codebase.** Their obsession with making everything text/CLI-first mirrors our approach.
- **Symphony's orchestration pattern** (Elixir gen_servers supervising agent tasks) is conceptually similar to our mission-cli dispatch system, but way more sophisticated.
- **Ghost libraries as specs** -- we could distribute our skill templates this way instead of actual code.
- **Session log analysis** -- they run daily agent loops on all session logs to find improvements. We could do this with our conversation_log table.
- **Build discipline** -- their 1-minute build constraint is smart. Our build takes longer.

---

## Source Materials (Retrieved)

### 1. OpenAI Article
- URL: https://openai.com/index/harness-engineering/
- Ryan's original blog post that "defined the discourse" on harness engineering
- People were literally feeding the article link to Codex and saying "make my repo like this" and it worked

### 2. Symphony GitHub Repo
- URL: https://github.com/openai/symphony
- Cloned locally to `/tmp/symphony/`
- Key files:
  - `SPEC.md` (2,170 lines) -- the full language-agnostic spec. This IS the ghost library. Any coding agent can implement it from this spec alone.
  - `elixir/` -- reference implementation (37 Elixir source files)
  - `elixir/WORKFLOW.md` -- the actual workflow contract with Linear integration, prompt templates, and agent instructions
  - `elixir/AGENTS.md` -- coding conventions for agents working on the repo itself

### Symphony Architecture (from SPEC.md)

**Core Components:**
1. Workflow Loader -- reads WORKFLOW.md (YAML front matter + Liquid prompt template)
2. Config Layer -- typed getters, env var resolution, dynamic reload
3. Issue Tracker Client -- Linear adapter (paginated GraphQL, normalized issues)
4. Orchestrator -- poll loop, dispatch, retry, reconciliation (single authority state machine)
5. Workspace Manager -- per-issue isolated directories with lifecycle hooks
6. Agent Runner -- wraps Codex app-server subprocess (stdio JSON protocol)
7. Status Surface (optional) -- Phoenix LiveView dashboard + REST API

**State Machine:**
- Unclaimed -> Claimed -> Running -> (Success: continuation retry) or (Failure: exponential backoff retry)
- Reconciliation every tick: checks tracker states, kills runs for terminal issues, detects stalls
- Stall detection: if no Codex event for `stall_timeout_ms` (default 5min), kill and retry

**WORKFLOW.md Format:**
```yaml
tracker:
  kind: linear
  project_slug: "my-project"
workspace:
  root: ~/code/workspaces
hooks:
  after_create: |
    git clone --depth 1 git@github.com:org/repo.git .
agent:
  max_concurrent_agents: 10
  max_turns: 20
codex:
  command: codex --config 'model="gpt-5.5"' app-server
  approval_policy: never
  thread_sandbox: workspace-write
```

**Prompt Template (Liquid):**
```
You are working on {{ issue.identifier }}
Title: {{ issue.title }}
{% if attempt %}This is retry #{{ attempt }}{% endif %}
```

**Retry Strategy:**
- Normal exit -> 1 second continuation retry (re-check if issue still active)
- Failure -> exponential backoff: `min(10000 * 2^(attempt-1), max_retry_backoff_ms)`
- Default max backoff: 5 minutes

**The Rework Flow (from WORKFLOW.md):**
1. Treat Rework as a FULL reset, not incremental patching
2. Close existing PR
3. Remove existing workpad comment
4. Create fresh branch from origin/main
5. Start completely over

**Linear Integration:**
- Custom issue states: Todo, In Progress, Human Review, Merging, Rework, Done
- Agent manages transitions autonomously
- Single persistent "Codex Workpad" comment per issue for all progress tracking
- Agent can file follow-up issues to backlog autonomously
- `linear_graphql` client-side tool gives agent raw GraphQL access to Linear

**SSH Worker Extension:**
- Run agents on remote hosts over SSH
- Orchestrator stays central, workers execute remotely
- Per-host concurrency limits
- Workspace locality (host-local, cold restart on host switch)

---

*Watched, researched, and summarized 2026-05-02 by Atlas*
*Sources: YouTube video + OpenAI article + Symphony GitHub repo*
