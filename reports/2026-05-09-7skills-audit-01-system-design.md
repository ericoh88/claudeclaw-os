# 7 Skills Audit #1: System Design

**Date:** 2026-05-09
**Framework:** IBM Technology "7 Skills for AI Agents"
**Skill Under Review:** #1 -- System Design
**Next Rotation:** #2 -- Tool & Contract Design

---

## Scorecard

| Dimension | Grade | Notes |
|-----------|-------|-------|
| LLM-Tool-DB layering | A | Clean separation. No LLM-to-SQL shortcuts. All DB access via typed functions in db.ts. |
| Multi-agent orchestration | B+ | Solid delegation + mission task system. Weak on cross-agent awareness (polling, not reactive). |
| State management | B+ | SQLite WAL mode, agent-scoped queries, field encryption. Single DB = single point of failure. |
| Service boundaries | B | Main process is a monolith (bot + dashboard + scheduler + memory + War Room). Sub-agents properly headless. |
| Failure resilience | B- | Startup recovery exists. No runtime health checks, no stuck-task alarms, no DB corruption detection. |
| Observability | C+ | token_usage and conversation_log exist. No structured tracing of tool calls, retrieval quality, or agent decision paths. |

**Overall: B**
The architecture is sound for a single-machine deployment. The main gaps are in runtime observability and failure detection -- areas that matter as the system grows.

---

## What's Working Well

1. **No LLM-to-DB shortcut.** Claude never generates raw SQL. All database access goes through pre-built CLI commands (mission-cli, schedule-cli) that call typed functions in db.ts. This is exactly what IBM's video warns against bypassing.

2. **Centralized data access layer.** All 2500+ lines of DB logic live in one file (db.ts) with exported functions. No scattered raw queries in business logic. Parameterized statements everywhere. FTS5 queries sanitize keywords before joining.

3. **Agent isolation with shared awareness.** Each agent has its own sessions, conversation logs, and memories (scoped by agent_id). The hive_mind table gives cross-agent visibility without coupling.

4. **Task claiming is atomic.** Mission tasks use transactions to SELECT + UPDATE in one operation, preventing two agents from claiming the same task.

5. **Field-level encryption.** WhatsApp and Slack message bodies encrypted with AES-256-GCM before storage. Graceful fallback for pre-encryption data.

---

## Gaps and Concrete Suggestions

### GAP 1: Main process is a monolith
**Risk: Medium | Effort: High**

The main process runs: Telegram bot, HTTP dashboard, scheduler, mission scheduler, memory consolidation, memory decay, War Room, and the orchestrator. If any of these crash or hang, everything goes down.

**Suggestion:** Not worth splitting into microservices for a single-machine deployment. But add process-level isolation for the two highest-risk components:
- **War Room** already spawns as a subprocess (good).
- **Memory consolidation** (Gemini API calls every 30min) should catch and log errors without crashing the parent process. Verify it's wrapped in try/catch at the scheduler level, not just internally.
- Add a lightweight self-health endpoint (e.g., `GET /health`) to the dashboard that returns uptime, last successful scheduler run, last memory consolidation, and pending mission task count. This costs ~20 lines and makes external monitoring trivial.

### GAP 2: No runtime health checks or stuck-task alarms
**Risk: Medium | Effort: Low**

If a scheduled task hangs (e.g., Claude CLI subprocess never returns), it stays in 'running' state until the next process restart. There's no alarm, no timeout enforcement at the scheduler level, and no dashboard indicator for "task has been running for 30+ minutes."

**Suggestion:**
- Add a `started_at` timestamp to running tasks (may already exist for mission tasks -- extend to scheduled tasks if not).
- In the scheduler loop (every 60s), check for tasks where `status = 'running' AND started_at < now - timeout_ms`. Log a warning and optionally auto-reset.
- Surface "zombie tasks" on the Mission Control dashboard with a warning badge.

### GAP 3: No structured agent tracing
**Risk: Low (now), High (at scale) | Effort: Medium**

When an agent processes a message, there's no structured trace of: which tools were called, what parameters were sent, what retrieval returned, and what the model's reasoning was at each step. The conversation_log captures the final output but not the decision chain.

IBM's framework calls this "Evaluation & Observability" (Skill #6), but the lack of tracing is also a System Design gap because it means failures can't be attributed to a specific component.

**Suggestion:**
- For now, this is acceptable. Claude Code's own logging handles most of this.
- When ready to level up: log each Claude CLI invocation's tool_use events to a `tool_traces` table (agent_id, chat_id, tool_name, parameters, result_summary, duration_ms, created_at). This enables "trace one failure backward" -- IBM's recommended starting exercise.

### GAP 4: Single SQLite database = single point of failure
**Risk: Medium | Effort: Low**

All agents share one SQLite file. Disk corruption, accidental deletion, or a full disk would take down all agents simultaneously. WAL mode helps with crash recovery but doesn't protect against data loss.

**Suggestion:**
- Add an automated daily backup: `cp store/claudeclaw.db store/backups/claudeclaw-$(date +%Y%m%d).db` via a scheduled task or system cron. Keep 7 days of backups.
- Add a startup integrity check: `PRAGMA integrity_check` on boot, log a warning (or refuse to start) if corruption detected.
- Consider: the 3-day auto-purge policy already limits data volume. A daily backup of a small DB is cheap insurance.

### GAP 5: Cross-agent communication is polling-based
**Risk: Low | Effort: Medium-High**

Agents discover each other's work by polling the hive_mind table. There's no reactive notification when one agent completes a task that another agent is waiting on. Mission task results are relayed through the main bot, which works but adds latency.

**Suggestion:**
- This is fine for the current agent count (2-3 active agents). No action needed now.
- If agent count grows beyond 5 or response-time sensitivity increases, consider a lightweight IPC mechanism (Unix domain sockets or a simple file-based event system). SQLite polling at 2-30s intervals is pragmatic but doesn't scale to real-time coordination.

### GAP 6: No dependency graph between services
**Risk: Low | Effort: Low**

There's no explicit declaration of "dashboard depends on DB being initialized" or "scheduler depends on orchestrator being loaded." The startup sequence in index.ts handles this implicitly, but if someone adds a new service, the ordering assumptions are invisible.

**Suggestion:**
- Add a comment block at the top of index.ts documenting the boot sequence and dependencies:
  ```
  // Boot order (dependencies must initialize before dependents):
  // 1. initDatabase()          -- required by everything
  // 2. initOrchestrator()      -- required by delegation, mission tasks
  // 3. startDashboard()        -- requires DB + orchestrator
  // 4. startBot()              -- requires DB + orchestrator + dashboard
  // 5. startScheduler()        -- requires DB
  // 6. startMissionScheduler() -- requires DB + orchestrator
  ```
- This is documentation, not code. Five minutes of work, prevents future ordering bugs.

---

## Action Items (Priority Order)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | Add `GET /health` endpoint to dashboard | 30 min | Enables external monitoring, catches silent failures |
| 2 | Add startup `PRAGMA integrity_check` | 15 min | Detects DB corruption before it causes cascading errors |
| 3 | Add daily DB backup (scheduled task or cron) | 20 min | Insurance against data loss |
| 4 | Add zombie task detection in scheduler loop | 1 hr | Catches hung Claude CLI subprocesses |
| 5 | Document boot sequence dependencies in index.ts | 10 min | Prevents future ordering bugs |
| 6 | Structured tool tracing table (future) | 2-4 hrs | Enables "trace one failure backward" workflow |

---

## Next Review

**Skill #2: Tool & Contract Design** -- Audit all CLI tools, mission task contracts, skill schemas, and MCP server configurations for vague or missing input/output specifications. Per IBM: "Vague schemas get filled by LLM imagination."
