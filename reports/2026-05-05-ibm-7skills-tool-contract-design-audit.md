# IBM 7 Skills Audit #4: Tool & Contract Design

**Date:** 2026-05-05
**Skill:** #2 -- Tool & Contract Design
**Framework:** "Every tool has a contract (inputs -> outputs). Vague schemas get filled by LLM imagination -- that's a bug, not a feature."
**Scope:** All CLI tools, dashboard API endpoints, database schema, agent message contracts, memory system

---

## Executive Summary

ClaudeClaw has a wide contract quality spectrum. `meet-cli.ts` is the gold standard (structured JSON output, strict validation, proper help text). Most other CLIs output unstructured prose that agents must regex-parse. The dashboard API validates some endpoints well but has no unified schema validation layer. The database schema lacks CHECK constraints and doesn't enforce foreign keys at runtime. Agent-to-agent communication uses free-form strings with no message envelope.

**Overall grade: C+** -- pockets of excellence surrounded by ad-hoc, inconsistent contract design.

---

## Findings

### 1. CLI Tool Contracts (6 files audited)

| CLI | Input Validation | Output Format | Help Text | Grade |
|-----|-----------------|---------------|-----------|-------|
| `meet-cli.ts` | Strong (agents, files, keys, modes validated) | Structured JSON everywhere | Full `--help` | A |
| `agent-create-cli.ts` | Strong (ID regex + live token validation) | Mixed JSON/prose | Full `--help` | B |
| `slack-cli.ts` | Moderate (positional args checked) | Structured JSON | None | B- |
| `watch-analyze-cli.ts` | Moderate (dir/file existence checked) | Raw markdown (correct for purpose) | Basic `--help` | C+ |
| `schedule-cli.ts` | Moderate (cron validated via computeNextRun) | Unstructured prose | None | C- |
| `mission-cli.ts` | Weak (no type checks, NaN passthrough) | Unstructured prose | None | D |

**Key issues:**

- **No shared argument parser.** Each CLI implements its own flag parsing with unique edge-case bugs. Six different parsing strategies for six files.
- **NaN propagation.** `parseInt` without NaN guards in `mission-cli.ts` (--priority, --timeout) and `meet-cli.ts` (--ttl-sec). `--priority abc` silently stores NaN in the database.
- **Prose output on agent-facing CLIs.** `mission-cli.ts` outputs "Mission task created: abc123" -- the consuming agent must regex-parse this to extract the ID. `schedule-cli.ts` has the same problem. These CLIs are called programmatically by agents per CLAUDE.md, making structured output critical.
- **Silent no-ops.** `schedule-cli.ts` prints "Deleted task: xyz" even when xyz doesn't exist. No row-affected check.
- **Flag-value confusion.** `--agent --title` silently sets agent to "--title" in most CLIs. Only `slack-cli.ts` checks for this (one arg, one file).

### 2. Dashboard API Contracts (40+ endpoints audited)

**Auth:** Token in query string (`?token=...`). Works but the token appears in logs, browser history, and referrer headers. CORS is wide open (`*`).

**Response shape inconsistency -- three competing patterns:**
- Pattern A: `{ error: "msg" }` (no `ok` field) -- mission tasks, agents, chat
- Pattern B: `{ ok: false, error: "msg" }` (with `ok` field) -- War Room, meet, voices
- Pattern C: Domain-specific shapes (`{ tasks }`, `{ agents }`, flat objects)

Clients cannot rely on one convention to detect success vs. failure. Some endpoints include `ok` on success but not failure. Some use `ok` on both. Some never use it.

**Well-validated endpoints (the good):**
- `POST /api/mission/tasks` -- validates presence, length limits (200 for title, 10000 for prompt), clamps numeric ranges
- `POST /api/meet/join` -- validates agent against allowlist, validates meet URL with regex
- `POST /api/agents/create` -- validates all four required fields

**Poorly-validated endpoints (the bad):**
- `POST /api/warroom/meeting/transcript` -- no length limits on speaker/text. Returns `{ ok: true }` even when required fields are missing (silent no-op).
- `POST /api/warroom/meeting/start` -- no validation on mode or agent. User-controllable ID with no format check.
- `POST /api/chat/send` -- message body has no length limit.
- All `parseInt` on query params (~12 instances) -- no NaN guards. `?limit=abc` passes NaN to SQLite LIMIT clause.
- `DELETE /api/tasks/:id` -- always returns `{ ok: true }` even for nonexistent IDs.

**No runtime schema validation.** Zero dependencies on Zod, Joi, AJV, or any validation library. All TypeScript types on `c.req.json<T>()` are compile-time only. The `as` type assertions give false confidence.

### 3. Database Schema Contracts

**What's good:**
- Parameterized queries everywhere (no SQL injection risk)
- NOT NULL used consistently
- DEFAULT values well-defined
- One proper FOREIGN KEY on `warroom_transcript`

**What's missing:**
- **No CHECK constraints on any enum/status column.** `mission_tasks.status` is typed as `'queued' | 'running' | 'completed' | 'failed' | 'cancelled'` in TypeScript but accepts any string at the DB level.
- **Foreign keys not enforced.** `PRAGMA foreign_keys = ON` is never called. The one FK on `warroom_transcript` and the REFERENCES on `memories.superseded_by` are decorative.
- **No bounds on numeric ranges.** `importance` [0,1] and `salience` [0,5] are clamped in scattered application code but unconstrained at the DB level.
- **No STRICT tables.** SQLite's type affinity means wrong types are silently accepted.
- **No agents table.** Agent IDs across 7+ tables have no referential integrity -- agents are file-system-based entities.

### 4. Agent Message Contracts

**No structured message envelope.** Inter-agent communication is plain text:
- Delegation: prompt is concatenated strings. Result is `string | null`.
- Mission tasks: `prompt` is free-form TEXT, `result` is free-form TEXT.
- Inter-agent tasks: same pattern, result truncated to 2000 chars.

**Agent responses trusted raw.** When a delegated agent returns, the text is stored and displayed as-is. No parsing, no schema validation, no error classification of the content.

**`parseJsonResponse<T>()` is the single biggest contract gap.** This function in `gemini.ts` parses all LLM JSON responses, casts with `as T`, and has zero runtime type checking. If Gemini returns `{"summary": 123}` instead of `{"summary": "text"}`, it passes through silently and fails downstream.

### 5. Memory System Contracts

- `importance` is clamped to [0,1] in `memory-ingest.ts` but not in `saveStructuredMemory()` itself. The `checkpoint` command in CLAUDE.md bypasses all application validation with raw SQL.
- `entities` and `topics` from LLM responses are not type-validated at runtime. Non-string arrays would be JSON-stringified and stored as-is.
- Memory relevance evaluation doesn't validate that returned IDs were actually in the surfaced set. Gemini could touch/penalize random memory IDs.

---

## Concrete Suggestions (Priority-Ordered)

### P0: Immediate (High Impact, Low Effort)

**1. Add `--json` output to mission-cli and schedule-cli.**
These are the two most agent-consumed CLIs and they output prose. Wrap results in `{ ok: true, id: "..." }` / `{ ok: false, error: "..." }`. Follow `meet-cli.ts` as the template.

**2. Guard all `parseInt` calls against NaN.**
Add a shared utility:
```typescript
function parseIntSafe(val: string | undefined, fallback: number): number {
  const n = parseInt(val ?? '', 10);
  return Number.isNaN(n) ? fallback : n;
}
```
Apply across all 6 CLIs and ~12 dashboard endpoint instances.

**3. Enable foreign key enforcement.**
Add `db.pragma('foreign_keys = ON');` after the WAL pragma in `db.ts` line 369. One line, big win for data integrity.

**4. Fix silent no-ops.**
`schedule-cli.ts` delete/pause/resume and `DELETE /api/tasks/:id` should check rows affected and return 404 or an error when the ID doesn't exist.

### P1: Short-Term (Medium Effort)

**5. Add CHECK constraints to enum columns.**
For all status columns (`mission_tasks`, `scheduled_tasks`, `inter_agent_tasks`, `meet_sessions`, `skill_health`), add migration:
```sql
-- Example for mission_tasks
ALTER TABLE mission_tasks ADD COLUMN status_new TEXT NOT NULL DEFAULT 'queued'
  CHECK(status_new IN ('queued','running','completed','failed','cancelled'));
```
(SQLite doesn't support ALTER COLUMN, so this requires a table rebuild migration.)

**6. Add a runtime validation layer for LLM responses.**
Replace `parseJsonResponse<T>()` with a version that takes a Zod schema:
```typescript
function parseJsonResponse<T>(text: string, schema: z.ZodSchema<T>): T | null {
  const raw = JSON.parse(stripped);
  const result = schema.safeParse(raw);
  return result.success ? result.data : null;
}
```
This catches shape mismatches at the parse boundary instead of downstream. Start with `ExtractionResult` and `ConsolidationResult`.

**7. Standardize API response shapes.**
Pick one pattern and apply everywhere. Recommendation:
```typescript
// Success
{ ok: true, data: { ... } }
// Error
{ ok: true, error: "message" }  // No -- use:
{ ok: false, error: "message" }
```
Wrap in a helper: `c.ok(data)` and `c.fail(msg, status)`.

**8. Add `--help` to mission-cli, schedule-cli, slack-cli.**
Copy the pattern from `meet-cli.ts`. Low effort, high usability.

### P2: Medium-Term (Higher Effort)

**9. Create a shared CLI argument parser.**
Extract a reusable `parseArgs()` function that handles:
- Flag-value separation (prevent `--agent --title` confusion)
- NaN-safe number parsing
- Required flag validation
- Unknown flag warnings
- Auto-generated `--help` text

**10. Add a structured agent message envelope.**
Define a standard wrapper for all inter-agent communication:
```typescript
interface AgentMessage {
  type: 'task' | 'delegation' | 'response';
  from_agent: string;
  to_agent: string;
  payload: string;
  metadata: {
    timestamp: number;
    trace_id: string;
    priority?: number;
  };
}
```
This enables tracing, retry, and structured logging across agent boundaries.

**11. Validate memory relevance IDs against surfaced set.**
In `evaluateMemoryRelevance()`, filter returned IDs to only those that were actually surfaced before calling touch/penalize. One `Set` intersection check.

**12. Move dashboard auth token to Authorization header.**
Replace `c.req.query('token')` with `c.req.header('Authorization')` using Bearer token format. Prevents token leaking into logs and browser history.

---

## What's Working Well

- `meet-cli.ts` is production-grade: structured JSON, strict validation, known-agent allowlist, proper help text. This should be the template for all CLIs.
- Parameterized SQL queries everywhere -- zero injection risk.
- Global error handler on the dashboard prevents crashes and doesn't leak internal details.
- `mission-cli.ts` POST endpoint has the best body validation in the API (length limits, range clamping).
- Memory ingestion clamps importance and performs duplicate detection via cosine similarity.
- `agent-create-cli.ts` does live validation of Telegram bot tokens against the API.

---

## Next Audit

**Skill #5: Security & Safety** -- scheduled for 2026-05-06. Will cross-reference the Vibe Coders security report from April 30.

---

*Part of the IBM "7 Skills for AI Agents" rotating audit series. Previous: System Design (May 2), Reliability (May 3), Retrieval/RAG (May 4).*
