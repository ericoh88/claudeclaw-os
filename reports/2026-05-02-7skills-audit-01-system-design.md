# 7 Skills Audit #1: System Design

**Date:** 2026-05-02
**Framework:** IBM Technology - 7 Skills for AI Agent Work
**Skill:** #1 System Design (LLM + tools + DB orchestration, multi-agent architecture)
**Next cycle:** #2 Tool & Contract Design

---

## Verdict: STRONG with 3 actionable gaps

ClaudeClaw's system design is well-above-average for a personal agent system. Clean data abstraction layer, proper multi-agent isolation via composite DB keys, structured error taxonomy with recovery hints, and enforced timeouts at every level. The architecture maps directly to what IBM describes as "thinking in terms of LLM + tools + DB orchestration."

---

## What's Working Well

### 1. Data Abstraction Layer (Excellent)
All SQLite access goes through `src/db.ts` -- 100+ named exported functions, zero SQL bypasses anywhere in the codebase. Grep for `.prepare(` outside db.ts returns nothing. This is the "never shortcut LLM directly to database" principle done right.

- Sessions: `getSession()` / `setSession()` with composite key `(chat_id, agent_id)`
- Memory: `saveStructuredMemory()` / `searchMemories()` with vector embeddings
- Tasks: `createMissionTask()` / `claimNextMissionTask()` per-agent scoped
- Encryption: AES-256-GCM on sensitive message bodies before storage

### 2. Multi-Agent Isolation (Good)
- Each agent runs as a separate process (no shared in-memory state)
- Declarative YAML configs per agent (`agents/{id}/agent.yaml`)
- PID file locks prevent duplicate instances
- Per-agent MCP server allowlists (`loadMcpServers()` in agent.ts)
- Composite keys in DB tables enforce agent-scoped data access

### 3. Error Taxonomy (Comprehensive)
`src/errors.ts` classifies errors into 9 categories (auth, rate_limit, context_exhausted, timeout, subprocess_crash, network, billing, overloaded, unknown), each with structured recovery hints (`shouldRetry`, `shouldNewChat`, `shouldSwitchModel`, `retryAfterMs`). The `runAgentWithRetry()` loop in agent.ts uses these to make smart retry decisions with exponential backoff.

### 4. Timeout Enforcement (Strong)
Three independent timeout layers prevent runaway execution:
- Per-query: `AGENT_TIMEOUT_MS` (default 30 min)
- Per-mission: `effectiveTimeout` per task (default 15 min)
- Per-turn: `AGENT_MAX_TURNS` (default 30 turns)

### 5. Audit Trail (Complete)
- `hive_mind` table: cross-agent activity broadcast
- `inter_agent_tasks` table: delegation audit log
- `conversation_log` table: per-agent, per-chat history
- `token_usage` table: cost tracking per agent

---

## Gaps Found

### Gap 1: Blocking Delegation (MEDIUM severity)

**Problem:** `delegateToAgent()` in orchestrator.ts is synchronous -- it `await`s the target agent until completion. If main delegates to watch agent for a video (30+ min), main is blocked and can't respond to user messages.

**Where:** `src/orchestrator.ts` line 213: `await runAgent(...)` blocks the caller.

**Fix:** Reserve `delegateToAgent()` for sub-5-minute turnarounds only. For anything long-running, use mission tasks (async queue). The mission task system already handles this correctly -- the gap is that delegation is also available as a tempting shortcut.

**Concrete action:** Add a `maxDelegationMs` config (default 300000 / 5 min) and log a warning + auto-convert to mission task if the estimated duration exceeds it. Alternatively, document this constraint in AGENTS.md so agents know when to delegate vs. create a mission.

### Gap 2: No Database Integrity Checks on Boot (MEDIUM severity)

**Problem:** SQLite corruption can spread silently to all agents. No `PRAGMA integrity_check` runs at startup. Migration crashes (`ALTER TABLE` mid-flight) have no rollback mechanism.

**Where:** `src/db.ts` lines 384-627 (migrations), line 369 (WAL mode).

**Fix:**
1. Run `PRAGMA integrity_check` on database open. If it fails, alert via Telegram and refuse to boot.
2. Wrap migrations in a transaction where possible. For DDL that can't be transacted, implement a migration_state table that tracks which step completed, enabling resume-from-failure.

**Concrete action:** Add ~15 lines to the database initialization path:
```typescript
const check = db.prepare("PRAGMA integrity_check").get();
if (check.integrity_check !== 'ok') {
  logger.error('Database integrity check FAILED', check);
  // notify via Telegram if possible, then exit
  process.exit(1);
}
```

### Gap 3: No Graceful Shutdown / Health Checks (MEDIUM severity)

**Problem:** When a sub-agent process crashes, the delegating agent doesn't know until the timeout fires. No heartbeat or health check mechanism exists. On graceful shutdown (SIGTERM), in-flight tasks are abandoned rather than completed or re-queued.

**Where:** `src/index.ts` (no SIGTERM handler), `src/orchestrator.ts` (delegation has no health check).

**Fix:**
1. Add SIGTERM handler that stops accepting new work, waits for in-flight tasks to complete (with a grace period), then exits.
2. Add a simple health check to delegation: before spawning a delegated agent, verify the target agent's connection state file (`store/agent-{id}-conn.json`) is recent.
3. For mission tasks: on agent startup, re-queue any tasks stuck in `running` state for that agent (crash recovery).

**Concrete action:** Add crash recovery to `initScheduler()`:
```typescript
// On boot: re-queue any tasks stuck as 'running' for this agent
db.prepare(`
  UPDATE mission_tasks SET status = 'queued', claimed_at = NULL
  WHERE assigned_agent = ? AND status = 'running'
`).run(agentId);
```

---

## Minor Observations (not urgent)

- **Pull-based hive mind:** Agents poll for cross-agent updates. A push mechanism using the existing `chatEvents` EventEmitter would reduce latency, but in practice the 60-second scheduler loop makes this low-priority.
- **Shared memory table has no agent_id:** Intentional design (memories are cross-agent), but worth documenting explicitly so future contributors don't add agent-scoped memory queries expecting isolation.
- **Module-level config mutation:** `setAgentOverrides()` mutates global vars. Safe because agents run in separate processes, but fragile if architecture ever moves to in-process multi-agent.

---

## Score Against IBM Framework

| IBM Principle | ClaudeClaw | Score |
|---------------|-----------|-------|
| LLM + tools + DB orchestration | Clean 3-layer architecture, proper abstractions | 9/10 |
| Never shortcut LLM to DB | Zero SQL bypasses outside db.ts | 10/10 |
| Multi-agent architecture | 6 agents with YAML configs, process isolation | 8/10 |
| Error handling as system design | 9-category error taxonomy with recovery hints | 9/10 |
| Timeout and resource limits | 3-layer timeout enforcement | 9/10 |
| Inter-agent coordination | Mission tasks + delegation + hive mind | 7/10 |
| Graceful degradation | Retry with backoff + model fallback, but no crash recovery | 6/10 |

**Overall System Design Score: 8.3/10**

---

## Next Audit

**Skill #2: Tool & Contract Design** -- audit all CLI tools (schedule-cli, mission-cli), skill interfaces, and API route schemas for strict input/output contracts. Check for vague schemas where the LLM could fill gaps with imagination.

---

*Audit performed against IBM Technology "7 Skills for AI Agent Work" framework (https://youtu.be/mtiOK2QG9Q0)*
*Skill rotation: System Design → Tool & Contract Design → RAG → Reliability → Security → Evaluation → Product Thinking*
