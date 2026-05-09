# IBM 7 Skills Audit #3: Retrieval Engineering (RAG)

**Date:** 2026-05-08
**Skill:** #3 of 7 -- Retrieval Engineering / RAG
**Framework:** IBM Technology "7 Skills You Need to Build AI Agents"
**Scope:** ClaudeClaw OS internal memory system + Open Brain knowledge base

## The Standard (from IBM)

> "The quality ceiling of any agent is the quality of what it retrieves."

Key principles:
1. **Chunking strategy** -- too big = diluted context, too small = lost context
2. **Embedding model selection** -- do similar concepts actually cluster?
3. **Re-ranking** -- second pass that scores by actual relevance, not just vector distance
4. **Ingestion quality** -- garbage in, garbage out applies harder to RAG than anywhere else
5. **Retrieval evaluation** -- measure whether the right content surfaces for real queries

---

## Current State: What We Do Well

| Area | Implementation | Evidence |
|------|---------------|----------|
| **5-layer retrieval pipeline** | Context assembly uses vector search, high-importance recall, consolidation insights, cross-agent awareness, and explicit conversation history. Multiple retrieval strategies prevent single-point-of-failure. | `memory.ts:41-172`, `buildMemoryContext()` |
| **LLM-powered extraction over naive storage** | Gemini evaluates each conversation turn and only stores lasting facts as structured memories (summary + entities + topics + importance). Ephemeral exchanges are skipped. Hard reject threshold at importance < 0.5. | `memory-ingest.ts:21-64`, extraction prompt with skip/extract taxonomy |
| **Embedding-backed deduplication** | New memories are checked against existing ones via cosine similarity. Threshold > 0.85 prevents near-duplicates from polluting the store. | `memory-ingest.ts:114-126` |
| **Relevance feedback loop** | After every response, Gemini re-evaluates whether surfaced memories actually helped. Useful memories get salience +0.1, useless ones get -0.05. This prevents noise from staying artificially fresh. | `memory.ts:231-264`, `evaluateMemoryRelevance()` |
| **No touch-on-retrieval** | `buildMemoryContext()` deliberately does NOT update `accessed_at` or `salience` during retrieval. Only the relevance evaluator can boost salience. Prevents positive feedback loops. | Explicit design choice documented in code comments |
| **Importance-weighted decay** | Memories decay at different rates: 1%/day for critical (importance >= 0.8), 2%/day for moderate, 5%/day for borderline. Pinned memories never decay. Auto-prune at salience < 0.05. | `memory.ts:212-225`, `decayMemories()` |
| **Contradiction resolution** | Consolidation detects conflicting memories and marks the older one as superseded. Timestamp-corrected to prevent the LLM from swapping stale/new. | `memory-consolidate.ts`, `supersedeMemory()` |
| **3-tier search fallback** | Vector similarity -> FTS5 keyword -> LIKE pattern matching. Each layer only fires if the previous returned nothing. Ensures something surfaces even without embeddings. | `db.ts:779-855`, `searchMemories()` |
| **Agent-scoped isolation** | All retrieval queries filter by `agent_id`. Multi-agent setups don't cross-contaminate memory or conversation history. | Every SELECT in db.ts includes `agent_id = ?` |
| **Open Brain semantic search quality** | Tested across 4 diverse queries. Top scores: 0.856 (architecture), 0.828 (cold email), 0.754 (trading). Semantic discrimination works well -- similar queries return overlapping but differentiated results. | Live audit conducted 2026-05-08 |

---

## Gaps Found: Ranked by Impact

### GAP 1: No Re-ranking Pass (HIGH)

**IBM says:** "Re-ranking is the second pass that scores by actual relevance, not just vector distance."

**What we do:** Vector search returns top-5 by cosine similarity. That's it. The raw cosine ranking is the final ranking.

**The problem:** Cosine similarity measures semantic proximity in embedding space, which is a proxy for relevance -- not relevance itself. A memory about "Eric prefers dark mode" might score high on a query about "mode changes in the codebase" because the word "mode" embeds similarly, but it's completely irrelevant.

**Fix:** Add a lightweight re-ranking step after vector retrieval. Two options:

- **Option A (cheap):** Cross-encoder re-ranking via Gemini. After getting top-10 by cosine, send `{query, memory_summaries}` to Gemini with a prompt like "Score each memory 0-10 for relevance to this query." Re-sort by that score. Cost: ~1 cheap Gemini call per message.

- **Option B (free):** Hybrid score = `0.6 * cosine_sim + 0.2 * recency_score + 0.2 * importance_score`. recency_score = normalized inverse of age. This doesn't need an LLM call and would already improve ranking for time-sensitive queries.

**Where to implement:** `memory.ts:50-71`, between the vector search and the context assembly.

---

### GAP 2: Full-table Scan for Vector Search (HIGH)

**What we do:** `getMemoriesWithEmbeddings()` loads ALL memories with embeddings into memory, then iterates and computes cosine similarity for each one.

**The problem:** This is O(n) per query. With 100 memories it's fine. With 5,000+ it becomes slow and memory-hungry. Every user message triggers this scan.

**Fix:** Two paths:

- **Short-term:** Add a limit. Only load memories from the last 90 days for vector comparison, then fall back to FTS5 for older content. Most relevant memories are recent anyway.

- **Medium-term:** Use SQLite's `sqlite-vss` extension (vector similarity search) or switch to a dedicated vector store. sqlite-vss supports HNSW indexing for approximate nearest-neighbor search in O(log n).

**Where to implement:** `db.ts`, `getMemoriesWithEmbeddings()` query -- add `WHERE created_at > ?` with a rolling window.

---

### GAP 3: Chunking is Absent -- Summary-only Retrieval (MEDIUM)

**IBM says:** "Too big = diluted context, too small = lost context."

**What we do:** We skip chunking entirely. Each memory is a 1-2 sentence Gemini-extracted summary of a conversation turn. The raw text is stored but never retrieved or searched -- only the summary is embedded and surfaced.

**The tradeoff:**
- Upside: Summaries are high-signal, low-noise. The LLM extraction filters out fluff.
- Downside: If the summary misses a detail, that detail is gone forever from retrieval. The raw text exists in the DB but is invisible to search.

**Fix:** Embed raw_text alongside summary. When searching, match against both. If a raw_text match scores high but its summary didn't, surface the raw_text snippet. This catches cases where Gemini's extraction dropped important context.

**Where to implement:** `memory-ingest.ts` -- generate a second embedding for raw_text (or a combined embedding of `summary + raw_text`). `searchMemories()` -- compare against both embedding columns.

---

### GAP 4: Open Brain Has Domain Blind Spots (MEDIUM)

**Audit results:**

| Domain | Entries | Coverage |
|--------|---------|----------|
| AI | 411 | Excellent |
| Trading | 397 | Excellent |
| Marketing | 25 | Thin |
| Networking | 29 | Thin |
| Security | 1 | Nearly empty |

**The problem:** When the agent is asked about security best practices or networking strategies, Open Brain returns almost nothing. The knowledge base has deep pockets and empty shelves.

**Fix:** Systematic ingestion sweep:
1. Ingest the security audit report (`2026-05-06-ibm-7skills-security-safety-audit.md`) to Open Brain under domain: security
2. Ingest CLAUDE.md's security rules (DB_ENCRYPTION_KEY, store/ never committed, 3-day purge) as structured knowledge
3. After each IBM 7-Skills audit report, auto-ingest it to Open Brain so the knowledge compounds
4. Add a quarterly "domain coverage check" scheduled task

---

### GAP 5: Conversation History Search is Keyword-only (MEDIUM)

**What we do:** `searchConversationHistory()` uses LIKE `%keyword%` matching against raw conversation content. No embeddings, no FTS5, no semantic search.

**The problem:** If you said "I want to build the checkout flow using Stripe" last week and today ask "what payment system did we discuss?", the LIKE search for "payment" won't find "Stripe" or "checkout flow." The query needs to match exact words.

**Fix:** Add FTS5 indexing to `conversation_log` table (same as `memories_fts`). This gives word-level matching with ranking. Embedding-based search on conversation_log is likely overkill given the 7-day/500-row retention window, but FTS5 is cheap and would significantly improve recall.

**Where to implement:** `db.ts` -- create `conversation_log_fts` virtual table. `searchConversationHistory()` -- use FTS5 MATCH instead of LIKE.

---

### GAP 6: Consolidation Doesn't Scale (LOW-MEDIUM)

**What we do:** Every 30 minutes, grab 20 unconsolidated memories and send them to Gemini for pattern synthesis.

**The problem:** Consolidation processes memories in order of insertion, not priority. If 50 new memories arrive (e.g., after a busy research session), the first 20 get consolidated, and the rest wait 30+ minutes. High-importance memories at position 21-50 are delayed.

**Fix:** Sort unconsolidated memories by importance DESC before selecting the batch. Critical memories get consolidated first.

**Where to implement:** `db.ts`, `getUnconsolidatedMemories()` -- change `ORDER BY created_at ASC` to `ORDER BY importance DESC, created_at ASC`.

---

### GAP 7: No Retrieval Quality Metrics (LOW-MEDIUM)

**What we do:** `evaluateMemoryRelevance()` adjusts salience but doesn't log aggregate metrics. We don't know our retrieval precision over time.

**The problem:** We can't answer: "What percentage of surfaced memories are actually useful?" or "Is retrieval quality improving or degrading?" Without this, we're optimizing blind.

**Fix:** Add a `retrieval_metrics` table or append to `token_usage`:

```sql
ALTER TABLE token_usage ADD COLUMN memories_surfaced INTEGER DEFAULT 0;
ALTER TABLE token_usage ADD COLUMN memories_useful INTEGER DEFAULT 0;
```

Then log in `evaluateMemoryRelevance()`. Dashboard can chart retrieval precision = useful/surfaced over time.

**Where to implement:** `memory.ts:231-264`, `db.ts` schema.

---

### GAP 8: Open Brain Source Name Inconsistencies (LOW)

**Audit found:** "naventic-ai" and "navantic-ai" used interchangeably across 8 entries. Two entries missing source_name entirely.

**The problem:** Source-name-filtered searches fragment results. Someone searching `source_name: "naventic-ai"` misses half the entries.

**Fix:** Standardize to one spelling. Update existing entries via Open Brain's update API or direct DB correction. Add a pre-ingestion normalization step that maps known aliases to canonical names.

---

## Action Items (Priority Order)

| # | Action | Impact | Effort | Where |
|---|--------|--------|--------|-------|
| 1 | Add hybrid re-ranking score (cosine + recency + importance) | High | Low | `memory.ts:50-71` |
| 2 | Add rolling window to vector search (90-day default) | High | Low | `db.ts`, `getMemoriesWithEmbeddings()` |
| 3 | Add FTS5 index to conversation_log | Medium | Low | `db.ts` schema + `searchConversationHistory()` |
| 4 | Log retrieval precision metrics (surfaced vs useful) | Medium | Low | `memory.ts`, `token_usage` table |
| 5 | Sort consolidation batch by importance DESC | Medium | Trivial | `db.ts`, `getUnconsolidatedMemories()` |
| 6 | Ingest audit reports to Open Brain (automate) | Medium | Low | Scheduled task or post-report hook |
| 7 | Embed raw_text alongside summary for dual-path retrieval | Medium | Medium | `memory-ingest.ts`, `searchMemories()` |
| 8 | Fix Open Brain source_name inconsistencies | Low | Trivial | Direct DB update |

---

## Comparison to IBM Standard

| IBM Principle | ClaudeClaw Status | Grade |
|--------------|------------------|-------|
| **Chunking strategy** | Skipped entirely -- uses LLM-extracted summaries instead. Works well but loses detail. | B |
| **Embedding model selection** | Gemini embedding-001 (768-dim). Tested via Open Brain audit -- similar concepts cluster correctly. | A- |
| **Re-ranking** | Missing. Raw cosine ranking is final. Biggest gap. | D |
| **Ingestion quality** | Strong. LLM extraction with skip/extract taxonomy, importance scoring, duplicate detection. | A |
| **Retrieval evaluation** | Relevance feedback loop exists (Gemini re-evaluates). But no aggregate metrics tracked. | B+ |

**Overall RAG grade: B+**

The retrieval pipeline is well-architected with multiple layers and smart features (relevance feedback, decay, contradiction resolution). The main gaps are the absence of re-ranking, the O(n) vector scan, and missing aggregate metrics. All are fixable with moderate effort.

---

*Next audit (2026-05-09): Skill #7 -- Product Thinking*
