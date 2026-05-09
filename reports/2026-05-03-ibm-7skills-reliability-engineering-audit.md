# IBM 7 Skills Audit: Skill #4 -- Reliability Engineering

**Date:** 2026-05-03
**Rotation:** Day 3 of 7-skill review cycle
**Previous:** May 1 (Overview), May 2 (Security & Safety)

## The Standard

From the IBM Technology framework: "APIs fail. Networks time out. Agents can hang or retry forever. The patterns backend engineers have used for decades apply directly: retry with exponential backoff, timeouts, fallback paths, circuit breakers."

Four pillars: **Retry/Backoff**, **Timeouts**, **Fallback Paths**, **Circuit Breakers**.

---

## Current State: Scorecard

| Pillar | Coverage | Grade |
|--------|----------|-------|
| Retry/Backoff | 7 files with retry logic, 13+ external API call sites without | B- |
| Timeouts | 13 timeout constants, 9+ AbortControllers, good coverage of agent paths | A- |
| Fallback Paths | 4-tier TTS, 2-tier STT, model fallback, memory degradation | B+ |
| Circuit Breakers | Not implemented anywhere | F |
| **Overall** | | **B-** |

---

## What's Working Well

### Retry/Backoff (Where It Exists)
- **agent.ts**: Production-quality exponential backoff with jitter (2s -> 8s, capped at 60s, 25% jitter). Error classification drives retry decisions.
- **signal-rpc.ts**: Auto-reconnect with exponential backoff (500ms -> 30s cap). Socket closes handled cleanly.
- **wa-daemon.ts**: WhatsApp init retries 5x with linear backoff. Transient Chromium errors detected.
- **influencer-monitor.ts**: Multi-instance Nitter fallback (tries different mirrors sequentially).

### Timeouts (Strong Coverage)
- Every agent entry point (Telegram, Signal, Discord, Scheduler, Orchestrator) has `AbortController` + `setTimeout` with proper cleanup.
- `AGENT_TIMEOUT_MS` (30 min) and `MISSION_TIMEOUT_MS` (15 min) are configurable via env vars.
- Subprocess execution (`skill-health.ts`) uses belt-and-suspenders: Node timeout option + manual kill timer.
- `errors.ts` classifies timeout errors and marks them retryable.
- User has `/stop` command to abort in-flight queries.

### Fallback Paths (Impressive on Voice)
- **Voice TTS**: 4-tier cascade (ElevenLabs -> Gradium -> Kokoro -> macOS `say`). Best resilience in the codebase.
- **Voice STT**: 2-tier (Groq Whisper -> local whisper-cpp).
- **Agent model fallback**: `MODEL_FALLBACK_CHAIN` env var switches to secondary model on overload/billing errors.
- **Memory**: Graceful degradation from vector search -> FTS5 keyword search -> recent high-importance. Never blocks user.
- **Watch agent**: Documented fallback to main agent if watch agent is offline.

---

## Gaps & Concrete Suggestions

### GAP 1: No Retry on External API Calls (HIGH PRIORITY)

These external API call sites have zero retry logic:

| Service | File | Lines | Impact if Down |
|---------|------|-------|----------------|
| Slack API | `slack.ts` | 46, 56, 76 | Slack messages lost |
| Daily.co | `daily-client.ts` | 46, 100, 106, 112, 129 | War Room meetings fail |
| Gemini embeddings | `embeddings.ts` | 25 | Semantic memory disabled |
| Gemini content | `gemini.ts` | 30 | Video/memory analysis fails |
| ElevenLabs/Groq | `voice.ts` | 50, 373 | First-tier voice fails (fallback exists) |
| WhatsApp sends | `whatsapp.ts` | 115 | Messages silently dropped |
| Telegram sends | various | scattered | Notifications lost |
| Influencer monitor Telegram | `influencer-monitor.ts` | 220 | Daily report lost |

**Suggestion:** Create a shared `fetchWithRetry()` utility:

```typescript
// src/fetch-retry.ts
export async function fetchWithRetry(
  url: string | URL,
  options?: RequestInit & { maxRetries?: number; backoffMs?: number },
): Promise<Response> {
  const { maxRetries = 2, backoffMs = 1000, ...fetchOptions } = options ?? {};
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, fetchOptions);
      if (res.status >= 500 && attempt < maxRetries) {
        await sleep(backoffMs * Math.pow(2, attempt));
        continue;
      }
      return res;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await sleep(backoffMs * Math.pow(2, attempt));
    }
  }
  throw new Error('unreachable');
}
```

Then replace raw `fetch()` calls in Slack, Daily.co, voice, WhatsApp, and influencer monitor.

---

### GAP 2: No Circuit Breaker Pattern (MEDIUM PRIORITY)

The codebase retries per-request but never tracks systemic failure state. If Gemini is down for 10 minutes, every single request independently discovers this via timeout -- wasting 5-30 seconds each time.

**Suggestion:** Add a lightweight circuit breaker for external services:

```typescript
// src/circuit-breaker.ts
class CircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 3,
    private resetMs: number = 60_000,
  ) {}

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > this.resetMs) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit open -- service unavailable');
      }
    }
    try {
      const result = await fn();
      this.failures = 0;
      this.state = 'closed';
      return result;
    } catch (err) {
      this.failures++;
      this.lastFailure = Date.now();
      if (this.failures >= this.threshold) this.state = 'open';
      throw err;
    }
  }
}

// Usage: one breaker per external service
export const geminiBreaker = new CircuitBreaker(3, 60_000);
export const slackBreaker = new CircuitBreaker(3, 30_000);
export const elevenLabsBreaker = new CircuitBreaker(2, 120_000);
```

Priority targets: Gemini (embeddings + content), Slack, Daily.co.

---

### GAP 3: Database Operations Have No Timeout (MEDIUM PRIORITY)

All SQLite operations via `better-sqlite3` are synchronous and block the event loop. If the DB gets locked by another process (e.g., a stale `wa-daemon` holding a write lock), the main bot hangs completely with no timeout or recovery.

**Current risk:** Low for single-bot setups. Higher when multiple agents or daemons access the same DB file concurrently.

**Suggestions:**
1. Set WAL mode if not already: `PRAGMA journal_mode=WAL;` (allows concurrent readers)
2. Set busy timeout: `PRAGMA busy_timeout=5000;` (wait 5s for locks instead of failing immediately)
3. For long-running queries (conversation_log scans, memory searches), consider wrapping in a worker thread with a timeout:

```typescript
import { Worker } from 'worker_threads';
function queryWithTimeout(sql: string, params: any[], timeoutMs = 5000): Promise<any[]> {
  return Promise.race([
    runInWorker(sql, params),
    new Promise((_, reject) => setTimeout(() => reject(new Error('DB query timeout')), timeoutMs)),
  ]);
}
```

---

### GAP 4: Voice `execFile()` Without Timeout (LOW-MEDIUM)

`voice.ts` uses `execFile()` from child_process for FFmpeg/whisper operations but doesn't set a timeout option. A hung FFmpeg process would block voice processing indefinitely.

**Suggestion:** Add timeout to all `execFile()` calls:

```typescript
execFile('ffmpeg', args, { timeout: 30_000 }, callback);
```

The `timeout` option is built into Node's `child_process.execFile()` -- just needs to be set.

---

### GAP 5: Mission Tasks Queue Indefinitely When Agent Offline (LOW)

If a mission task targets the watch agent but the watch agent isn't running, the task sits in `queued` state indefinitely. The fallback (main agent self-executes) is documented in CLAUDE.md but not enforced in code.

**Suggestion:** Add a TTL or staleness check in `scheduler.ts`:

```typescript
// If task has been queued for > 10 minutes and target agent has no recent heartbeat,
// either reassign to main agent or mark as failed with actionable error
if (task.status === 'queued' && ageMs > 600_000 && !agentHasHeartbeat(task.agent_id)) {
  reassignToMainAgent(task);
}
```

---

### GAP 6: Dashboard/War Room Fetch Calls (LOW)

The dashboard HTML has 50+ raw `fetch()` calls to internal API endpoints (War Room, Mission Control, Agent status). These are local calls so failure risk is low, but a single failed fetch can leave the UI in an inconsistent state.

**Suggestion:** Create a `dashboardFetch()` wrapper in the frontend JS that adds:
- 10-second timeout via AbortSignal
- Single retry on 5xx
- Toast notification on failure instead of silent swallow

---

## What NOT to Fix (Risk-Appropriate)

These are correctly handled as single points of failure:

- **Telegram bot token**: Validated at startup. If it's wrong, the system should fail loudly, not try alternatives.
- **SQLite file**: Single-user system. File replication or Postgres would be overengineering.
- **Claude SDK**: If the `claude` CLI is missing, retrying won't help. Correct behavior is fail-and-alert.
- **Port conflicts**: Dashboard port conflict should fail at startup, not silently bind elsewhere.

---

## Priority Implementation Order

| # | Gap | Effort | Impact | Priority |
|---|-----|--------|--------|----------|
| 1 | `fetchWithRetry()` utility + wire into Slack, Daily.co, WhatsApp, influencer | 2-3 hours | Eliminates most transient API failures | **HIGH** |
| 2 | Circuit breaker for Gemini + Slack | 1-2 hours | Prevents cascading timeouts during outages | **MEDIUM** |
| 3 | `PRAGMA busy_timeout=5000` + WAL mode in db.ts | 15 minutes | Prevents DB lock hangs | **MEDIUM** |
| 4 | `timeout` option on voice `execFile()` calls | 15 minutes | Prevents hung FFmpeg | **MEDIUM** |
| 5 | Mission task staleness check + auto-reassign | 1 hour | Prevents forgotten tasks | **LOW** |
| 6 | Dashboard `fetch()` wrapper | 30 minutes | Better UI error handling | **LOW** |

---

## Metrics to Track (Post-Implementation)

Once fixes are in, add these to the `token_usage` or a new `reliability_events` table:

- Retry count per external service (are retries actually helping?)
- Circuit breaker open events (which services are flaky?)
- Timeout events by source (agent, mission, voice, embed)
- Mission task reassignment events (how often is fallback needed?)

This closes the loop on IBM's Skill #6 (Evaluation & Observability) -- you can't evaluate reliability without measuring it.

---

## Next in Rotation

**May 4:** Skill #3 -- Retrieval Engineering (RAG). Audit Open Brain ingestion quality, chunking strategy, embedding model selection, and whether the right content actually surfaces on query.
