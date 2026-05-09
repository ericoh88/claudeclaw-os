# IBM 7 Skills Audit #6: Evaluation & Observability

**Date:** 2026-05-07
**Skill:** #6 of 7 -- Evaluation & Observability
**Framework:** IBM Technology "7 Skills You Need to Build AI Agents"
**Scope:** ClaudeClaw OS codebase, full observability posture review

## The Standard (from IBM)

> "Trace failures to the SYSTEM, not the prompt. Use metrics, not vibes."

Key principles:
1. **Full tracing** -- every agent turn should be traceable from input to output with context
2. **Test cases** -- unit + integration tests that catch regressions before production
3. **Metrics** -- quantifiable signals: success rate, latency, cost, token efficiency
4. **Alerting** -- proactive notification when metrics degrade, not just when things crash
5. **Evaluation loops** -- ability to replay, compare, and regress-test agent behavior

---

## Current State: What We Do Well

| Area | Implementation | Evidence |
|------|---------------|----------|
| **Token/cost accounting** | Every agent turn persists `input_tokens`, `output_tokens`, `cache_read`, `context_tokens`, `cost_usd`, `did_compact` to SQLite per session+agent. Dashboard charts cost over 30 days. | `db.ts:163-177`, `saveTokenUsage()`, `/api/tokens` endpoint |
| **Structured error taxonomy** | 8 error categories with pattern matching. Each classified error carries recovery hints (retry, newchat, switch model). Tests cover all categories. | `errors.ts` (242 lines), `errors.test.ts` (74 assertions) |
| **Rate tracker** | In-memory sliding window tracks messages/min, tokens/hour, cost/day with threshold warnings at 80% and 95%. | `rate-tracker.ts`, `rate-tracker.test.ts` (37 assertions) |
| **Skill health checks** | `skill_health` table stores per-skill status (healthy/unhealthy/timeout). `skill_usage` logs every skill invocation with success/fail flag and token count. | `skill-health.ts`, `db.ts:328-346` |
| **Audit log** | Security-relevant actions (session lock, failed PINs, blocked commands) stored with agent_id, action, detail, blocked flag. | `db.ts:278-288`, `security.ts` |
| **Compaction tracking** | `compaction_events` table records pre/post token counts when context auto-compacts. Dashboard shows compaction count in health widget. | `db.ts:317-325`, `/api/health` endpoint |
| **Session summaries** | On `/newchat`, auto-generates session summary committed to hive mind + `session_summaries` table with key decisions and cost. | `db.ts:349+`, `bot.ts:932-974` |
| **OAuth proactive monitoring** | Periodic checks on credential expiry with tiered alerting (warning vs expired) sent to Telegram. Avoids alert spam via level deduplication. | `oauth-health.ts` (139 lines) |
| **Structured logging** | Pino with JSON output in production, pretty-print in dev. Used consistently across scheduler, skill-health, orchestrator. | `logger.ts`, all `logger.info/warn/error` calls |
| **Test coverage** | 26 test files, 1110 total assertions across unit + integration tests. Covers errors, rate limiting, memory, scheduler, exfiltration guard, voice, cost footer. | `src/*.test.ts` |
| **Mission task lifecycle** | Full state machine: queued -> running -> completed/failed/cancelled with error capture and duration tracking. | `db.ts:2029-2180`, `scheduler.ts` |

---

## Gaps Found: Ranked by Impact

### HIGH: No Error Rate Tracking or Aggregate Failure Metrics

**The problem:** Errors are classified and logged at the individual turn level, but there's no aggregation. Nobody tracks:
- Error rate per hour/day (what % of turns fail?)
- Error category distribution over time
- Whether error rate is trending up
- Error rate per agent (is `research` failing more than `main`?)

**Why it matters:** Without aggregate error metrics, you can't detect degradation until a user notices. The IBM framework says "metrics over vibes" -- right now we have per-event logging but no time-series view of failure health.

**Suggested fix:**
```sql
-- Add to dashboard API or a new /api/error-stats endpoint
SELECT
  agent_id,
  date(created_at, 'unixepoch') as day,
  COUNT(*) FILTER (WHERE succeeded = 0) as failures,
  COUNT(*) as total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE succeeded = 0) / COUNT(*), 1) as error_pct
FROM skill_usage
GROUP BY agent_id, day
ORDER BY day DESC;
```

Also add a similar query over `token_usage` joined with a new `error_category` column (currently errors are only logged to pino, not persisted in a queryable table).

---

### HIGH: No Error Persistence Table

**The problem:** `classifyError()` classifies errors beautifully (8 categories, recovery hints) but the classified error is only:
1. Logged via pino (ephemeral, lost on restart)
2. Shown to the user in Telegram

There's no `agent_errors` table that stores: timestamp, agent_id, session_id, error_category, original_message, was_retried, retry_succeeded. This means:
- Can't query "how many rate_limit errors did we hit this week?"
- Can't correlate errors with time-of-day or usage patterns
- Can't build an error budget or SLO

**Suggested fix:**
```typescript
// New table
CREATE TABLE IF NOT EXISTS agent_errors (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  agent_id    TEXT NOT NULL DEFAULT 'main',
  session_id  TEXT,
  category    TEXT NOT NULL,  -- from ErrorCategory type
  message     TEXT NOT NULL,
  original    TEXT NOT NULL DEFAULT '',
  retried     INTEGER NOT NULL DEFAULT 0,
  retry_ok    INTEGER NOT NULL DEFAULT 0,
  created_at  INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_agent_errors_time ON agent_errors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_errors_cat ON agent_errors(category, created_at DESC);
```

Then in `bot.ts` where `classifyError` is caught, persist to this table before sending to Telegram.

---

### MEDIUM: No Latency Tracking Per Turn

**The problem:** We track `durationMs` for delegated tasks (`orchestrator.ts:226`) and display it in the response header (`[research -- 12s]`), but:
- Main agent turn duration is not persisted
- No p50/p95 latency view exists
- Can't answer "are responses getting slower over time?"

**Why it matters:** Latency is a direct UX signal. If the model is taking 45s when it used to take 15s, that's a system degradation that should surface automatically.

**Suggested fix:** Add `duration_ms INTEGER` to `token_usage` table. Record `Date.now() - start` at the same point where `saveTokenUsage()` is called. Expose via `/api/tokens` alongside cost data.

---

### MEDIUM: No Proactive Failure Alerting (Beyond OAuth)

**The problem:** The OAuth health monitor is excellent -- periodic checks, tiered alerts, deduplication. But it's the ONLY proactive health check. Nothing alerts on:
- 3+ consecutive agent failures
- Mission tasks stuck in "running" for > 2x their timeout
- Daily cost exceeding budget
- Skill health degradation (unhealthy skills don't notify Telegram)

**Why it matters:** The rate-tracker generates `warnings[]` but these are only checked when the next message arrives. If no messages come (e.g., overnight scheduled tasks), warnings accumulate silently.

**Suggested fix:** Create a periodic health pulse (every 5-10 min) that checks:
1. Error count in last N minutes vs threshold
2. Any mission tasks stuck running past timeout
3. Daily cost vs budget
4. Skills marked unhealthy

On breach, send a Telegram alert using the same sender pattern as OAuth health.

---

### MEDIUM: No Response Quality Evaluation

**The problem:** The system tracks cost and tokens but has no mechanism to evaluate whether the agent's OUTPUT was good. IBM's framework emphasizes eval loops -- the ability to:
- Score responses (even on a basic "did the tool calls succeed?" heuristic)
- Detect when the agent refuses, deflects, or produces unusable output
- Compare responses across model versions

**Why it matters:** You can have 100% uptime with terrible response quality. Without eval, you're flying blind on the most important metric.

**Suggested fix (low-effort):**
1. Add a `quality_signal` column to `conversation_log` (null by default)
2. When the user immediately follows up with a correction or retry, mark the previous turn as `quality_signal = 'corrected'`
3. Track `/newchat` events triggered soon after errors as implicit negative signals
4. Expose a simple "correction rate" metric on the dashboard

---

### LOW: Test Coverage Gaps in Critical Paths

**The problem:** 26 test files with 1110 assertions is solid. But notable gaps:
- `orchestrator.ts` -- multi-agent delegation, the most complex flow, has NO test file
- `scheduler.ts` -- tested but only 98 assertions for a 300+ line file handling cron + missions
- `dashboard.ts` -- no tests for API routes that serve observability data
- `whatsapp.ts` -- no unit tests

**Suggested fix:** Prioritize an `orchestrator.test.ts` that covers:
1. Agent delegation happy path
2. Delegation timeout handling
3. Fallback to main when delegated agent is offline
4. Error propagation from delegated agent back to user

---

### LOW: No Trace/Correlation IDs

**The problem:** When a message arrives, passes through bot -> orchestrator -> agent -> tools, there's no correlation ID linking the full journey. Pino logs are structured but individual entries can't be correlated back to a single user message.

**Suggested fix:** Generate a `traceId` (e.g., `nanoid(12)`) when a user message arrives. Pass it through to logger context via `logger.child({ traceId })`. Store in `conversation_log` and `token_usage`. This makes debugging production issues trivial: `grep traceId logs.json`.

---

## Summary Scorecard

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Data collection** | 7/10 | Token/cost/skill usage well tracked. Errors and latency are gaps. |
| **Aggregation & querying** | 5/10 | Dashboard shows per-session data. No aggregate trends (error rate over time, latency percentiles). |
| **Alerting** | 4/10 | OAuth health is excellent. Everything else is reactive (noticed by user, not by system). |
| **Testing** | 7/10 | Strong unit test culture. Critical orchestration path untested. |
| **Eval / quality feedback** | 2/10 | No response quality signal. Pure infrastructure observability, no output observability. |
| **Traceability** | 4/10 | Structured logs exist but no correlation IDs linking a request journey. |

**Overall: 5/10** -- The infrastructure for observability exists (SQLite tables, pino, dashboard). But it's observation without evaluation. The system tells you what happened (tokens, cost, timing) but not whether it worked well.

---

## Priority Actions (Pick One Per Sprint)

1. **[Week 1]** Add `agent_errors` table + persist classified errors. Instant visibility.
2. **[Week 2]** Add `duration_ms` to `token_usage`. One-line change, high-value metric.
3. **[Week 3]** Build a periodic health pulse (error rate + stuck tasks + budget). Reuse OAuth health pattern.
4. **[Week 4]** Write `orchestrator.test.ts` with delegation scenarios.
5. **[Stretch]** Add trace IDs and implicit quality signals.

---

*Next in rotation: Skill #7 -- Product Thinking (2026-05-08)*
