# IBM 7 Skills Audit: Skill #3 -- Retrieval Engineering (RAG)

**Date:** 2026-05-04
**Rotation:** Day 4 of 7-skill review cycle
**Previous:** May 2 (System Design), May 2 (Security), May 3 (Reliability)

## The Standard

From the IBM Technology framework: "RAG isn't just 'attach a vector DB.' Chunking quality, embedding model selection, re-ranking, and retrieval evaluation all matter. The right content must surface on query -- test this, don't assume it."

Four pillars: **Chunking Strategy**, **Embedding Quality**, **Retrieval & Re-Ranking**, **Evaluation**.

---

## Current State: Scorecard

| Pillar | Coverage | Grade |
|--------|----------|-------|
| Chunking Strategy | Memory extraction is per-turn (natural chunks), but no long-doc chunking | B |
| Embedding Quality | Gemini embedding-001 (768d), single model, no fallback | B+ |
| Retrieval & Re-Ranking | 3-strategy cascade with relevance feedback, but no fusion or query expansion | B |
| Evaluation | Post-hoc relevance scoring exists, but no aggregated metrics | C+ |
| **Overall** | | **B** |

---

## What's Working Well

### 1. Natural Chunking via Conversation Turns (Good Design)

Memories are extracted per conversation turn, which gives semantically coherent chunks by default. This avoids the classic "split mid-sentence" problem that plagues naive chunking. The extraction prompt is high-bar (importance >= 0.5 to save), so the memory store stays clean.

### 2. Three-Strategy Fallback Cascade (Resilient)

```
Vector Search (cos_sim > 0.3) → FTS5 BM25 → LIKE pattern match
```

If embeddings fail (API down, empty vector), the system gracefully degrades to keyword search. This is exactly what IBM means by "fallback paths in retrieval."

### 3. Relevance Feedback Loop (Advanced)

Post-response evaluation via Gemini identifies which surfaced memories were actually useful. Useful memories get salience boost (+0.1), irrelevant ones get penalized (-0.05). Combined with daily decay, this creates an adaptive retrieval system that improves over time. Very few personal agent systems implement this.

### 4. Duplicate Detection at Ingestion (0.85 Threshold)

Cosine similarity check prevents near-duplicate memories from polluting the store. Smart design -- dedup at write time is cheaper than dedup at read time.

### 5. Contradiction Resolution in Consolidation

When Gemini detects contradictions between memories, the system supersedes the older one and penalizes its importance (0.3x) and salience (0.5x). Timestamp-based correction catches LLM direction errors. This handles the "stale knowledge" problem that most RAG systems ignore.

### 6. Decay-Based Forgetting (Biologically Inspired)

Three-tier decay (1%/2%/5% per day based on importance) with hard deletion at salience < 0.05. This keeps the retrieval corpus lean. High-importance memories survive ~460 days; low-importance ones fade in ~90 days. Pinning exempts permanent knowledge.

---

## Gaps & Concrete Suggestions

### GAP 1: Brute-Force Vector Search Does Not Scale (MEDIUM PRIORITY)

**Problem:** `getMemoriesWithEmbeddings()` loads ALL embeddings for a chat into memory and computes pairwise cosine similarity. At 100 memories this is fine. At 1000+ (likely after 6 months of daily use), this becomes a latency bottleneck -- O(n) comparisons per query with 768-float JSON parsing for each.

**Current path:** `db.ts` line 886 loads all rows, `memory.ts` line 54 embeds query, line 787 loops through all candidates.

**Suggestion:** Two options depending on scale:

**Option A (Quick, good to ~5000 memories):** Cache parsed embeddings in memory on first load, invalidate on write. Avoid re-parsing JSON arrays on every query.

```typescript
// src/embedding-cache.ts
const cache = new Map<string, { id: number; embedding: number[] }[]>();

export function getCachedEmbeddings(chatId: string, agentId: string): CachedMemory[] {
  const key = `${chatId}:${agentId}`;
  if (!cache.has(key)) {
    cache.set(key, getMemoriesWithEmbeddings(chatId, agentId));
  }
  return cache.get(key)!;
}

export function invalidateCache(chatId: string, agentId: string) {
  cache.delete(`${chatId}:${agentId}`);
}
```

**Option B (Future-proof, if you pass 5000 memories):** Use `sqlite-vss` extension or switch to a HNSW index. But for a single-user system, Option A should last years.

**Effort:** 30 minutes for Option A.

---

### GAP 2: No Hybrid Retrieval Fusion (MEDIUM PRIORITY)

**Problem:** Vector search and FTS5 are used as a cascade (try vector first, fall back to keywords). This means if vector search returns results, keyword matches are never considered -- even when a keyword match would be more relevant (e.g., exact entity names, specific dates, project codes).

**IBM principle:** "Hybrid retrieval (vector + keyword, fused with RRF) consistently outperforms either alone."

**Suggestion:** Replace the cascade with Reciprocal Rank Fusion:

```typescript
function hybridSearch(chatId: string, agentId: string, query: string, queryEmbedding: number[], limit = 5) {
  // Get candidates from both strategies
  const vectorResults = vectorSearch(chatId, agentId, queryEmbedding, limit * 2);
  const ftsResults = ftsSearch(chatId, agentId, query, limit * 2);

  // RRF fusion (k=60 is standard)
  const k = 60;
  const scores = new Map<number, number>();

  vectorResults.forEach((r, i) => {
    scores.set(r.id, (scores.get(r.id) ?? 0) + 1 / (k + i + 1));
  });
  ftsResults.forEach((r, i) => {
    scores.set(r.id, (scores.get(r.id) ?? 0) + 1 / (k + i + 1));
  });

  // Sort by fused score, return top N
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => getMemoryById(id));
}
```

**Impact:** Catches cases where a memory has the exact entity name (FTS5 hit) but is semantically distant from the query embedding. Common scenario: "What did we decide about the Smartlead campaign?" -- "Smartlead" is a strong keyword signal that vector search alone might miss if the memory summary uses different phrasing.

**Effort:** 1-2 hours.

---

### GAP 3: No Query Expansion or Reformulation (LOW-MEDIUM PRIORITY)

**Problem:** The raw user message is embedded directly as the query vector. Conversational messages like "what was that thing about the guy from yesterday?" produce weak embeddings because they're semantically vague.

**IBM principle:** "Query expansion and HyDE (Hypothetical Document Embeddings) significantly improve retrieval for vague queries."

**Suggestion:** Lightweight query expansion using extracted keywords + entity resolution:

```typescript
async function expandQuery(userMessage: string, recentContext: string): Promise<string> {
  // Only expand if message is short/vague (< 50 chars or contains pronouns)
  if (userMessage.length > 80 && !containsPronouns(userMessage)) return userMessage;

  // Use Gemini (fast, cheap) to reformulate
  const expanded = await geminiFlash(`
    Reformulate this vague query into a specific search query.
    Recent context: ${recentContext.slice(0, 500)}
    User query: "${userMessage}"
    Return: A single clear sentence that could match stored memories.
  `);
  return expanded || userMessage;
}
```

**When this helps:** "That thing we discussed" -> "The Smartlead campaign strategy discussion about targeting SaaS founders". The expanded query produces a much better embedding for retrieval.

**Cost:** ~$0.001 per expansion (Gemini Flash). Only triggers on short/vague messages.

**Effort:** 1 hour.

---

### GAP 4: FTS5 Tokenizer Not Optimized (LOW PRIORITY)

**Problem:** FTS5 uses the default `unicode61` tokenizer. No stemming, no custom token separators. This means:
- "running" won't match "run"
- "user's" won't match "users"
- CamelCase identifiers won't split ("SmartleadCampaign" won't match "Smartlead")

**Current config:** `CREATE VIRTUAL TABLE memories_fts USING fts5(summary, raw_text, entities, topics, content=memories, content_rowid=id)` -- no tokenizer specified.

**Suggestion:** Add Porter stemmer tokenizer:

```sql
CREATE VIRTUAL TABLE memories_fts USING fts5(
  summary, raw_text, entities, topics,
  content=memories, content_rowid=id,
  tokenize='porter unicode61'
);
```

**Caveat:** Requires rebuilding the FTS5 table (migration). The stemmer helps English queries significantly but won't affect vector search quality.

**Effort:** 30 minutes (write migration, rebuild index).

---

### GAP 5: No Retrieval Quality Metrics (MEDIUM PRIORITY)

**Problem:** The relevance feedback system (evaluateMemoryRelevance) updates salience but doesn't aggregate metrics anywhere. You can't answer: "What % of surfaced memories are actually useful?" or "Is retrieval quality improving or degrading over time?"

**IBM principle:** "Metrics over vibes. If you can't measure retrieval precision, you're guessing."

**Suggestion:** Add a lightweight metrics table:

```sql
CREATE TABLE retrieval_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  chat_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  query_length INTEGER,
  memories_surfaced INTEGER,       -- How many shown to Claude
  memories_useful INTEGER,         -- How many marked relevant
  precision REAL,                  -- useful / surfaced
  retrieval_strategy TEXT,         -- 'vector' | 'fts5' | 'like' | 'hybrid'
  created_at INTEGER NOT NULL
);
```

Then in `evaluateMemoryRelevance()`:

```typescript
db.prepare(`INSERT INTO retrieval_metrics (chat_id, agent_id, query_length, memories_surfaced, memories_useful, precision, retrieval_strategy, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
  chatId, agentId, query.length, surfacedIds.length, usefulIds.length,
  usefulIds.length / surfacedIds.length, strategy, now
);
```

**Dashboard integration:** Add a "Memory Health" panel showing 7-day rolling precision. Target: > 60% precision (most surfaced memories should be useful).

**Effort:** 1 hour.

---

### GAP 6: No Embedding Fallback (LOW PRIORITY)

**Problem:** If the Gemini API is down or rate-limited, `embedText()` throws and the memory is saved without an embedding (line 108, memory-ingest.ts catches the error). That memory becomes invisible to vector search forever -- it can only be found via FTS5.

**Current behavior:** Non-fatal error, memory still saved. But never gets an embedding retroactively.

**Suggestion:** Add a background job that finds memories without embeddings and retries:

```typescript
// Run hourly or on agent startup
async function backfillMissingEmbeddings(chatId: string, agentId: string) {
  const missing = db.prepare(`
    SELECT id, summary, entities, topics FROM memories
    WHERE chat_id = ? AND agent_id = ? AND (embedding IS NULL OR embedding = '[]')
    LIMIT 20
  `).all(chatId, agentId);

  for (const mem of missing) {
    try {
      const text = `${mem.summary} ${JSON.parse(mem.entities).join(' ')} ${JSON.parse(mem.topics).join(' ')}`;
      const embedding = await embedText(text);
      if (embedding.length > 0) {
        db.prepare('UPDATE memories SET embedding = ? WHERE id = ?').run(JSON.stringify(embedding), mem.id);
      }
      await sleep(500); // Rate limit courtesy
    } catch { break; } // API still down, stop trying
  }
}
```

**Effort:** 30 minutes.

---

### GAP 7: Consolidation Insights Not Surfaced Prominently (LOW PRIORITY)

**Problem:** Consolidations are searched separately (Layer 3 in context assembly) with a limit of 2. But consolidation insights are often the highest-value retrieval results -- they represent synthesized patterns across many memories. Capping at 2 and searching them separately from primary memories means they compete on different terms.

**Suggestion:** Include consolidation embeddings in the primary vector search pool (tag them as `type: consolidation` to distinguish). This lets consolidations compete directly with individual memories on relevance, rather than being capped arbitrarily.

**Effort:** 45 minutes.

---

## What NOT to Fix (Appropriate for Scale)

- **No ANN index (HNSW/IVF):** Overkill for a single-user system with < 5000 memories. Brute-force with caching is correct here.
- **No cross-encoder re-ranking:** Would add 200-500ms latency per query for marginal quality gains at this scale.
- **No multi-vector (ColBERT-style):** Way overengineered for conversational memory retrieval.
- **Open Brain is separate:** This is correct architecture -- Open Brain handles long-term knowledge (reports, research), while in-DB memories handle conversation context. Merging them would create scope confusion.
- **768-dim embeddings (not 1536+):** Gemini's 768d model is well-calibrated. Larger dimensions don't help for short text (summaries are 1-2 sentences).

---

## Priority Implementation Order

| # | Gap | Effort | Impact | Priority |
|---|-----|--------|--------|----------|
| 1 | Hybrid RRF fusion (vector + FTS5) | 1-2 hours | Better retrieval quality for entity-heavy queries | **MEDIUM** |
| 2 | Retrieval metrics table + dashboard | 1 hour | Enables data-driven tuning | **MEDIUM** |
| 3 | Embedding cache (parsed vectors in memory) | 30 min | Eliminates JSON parse overhead on every query | **MEDIUM** |
| 4 | Backfill missing embeddings job | 30 min | Recovers memories lost to API failures | **LOW-MEDIUM** |
| 5 | Query expansion for vague messages | 1 hour | Better retrieval on conversational queries | **LOW-MEDIUM** |
| 6 | FTS5 Porter stemmer | 30 min | Better keyword matching | **LOW** |
| 7 | Consolidation in primary search pool | 45 min | Better surfacing of synthesized insights | **LOW** |

---

## Retrieval System Architecture (Current)

```
User Message
    |
    v
[Embed Query] ---------> Gemini embedding-001 (768d)
    |
    v
[Vector Search] -------> All embeddings loaded, cos_sim > 0.3, top 5
    |  (if 0 results)
    v
[FTS5 Search] ---------> BM25 ranked, OR keywords, top 5
    |  (if 0 results)
    v
[LIKE Fallback] -------> Substring match, importance-ranked, top 5
    |
    v
[+ Recent High-Imp] ---> Top 5 by accessed_at (deduplicated)
[+ Consolidations] ----> Semantic or keyword search, top 2
[+ Team Activity] -----> Last 24h cross-agent, top 10
[+ History Recall] ----> Conditional (trigger words), last 7d, top 10
    |
    v
[Context Block] --------> Injected into Claude prompt
    |
    v
[Claude Responds]
    |
    v
[Relevance Eval] ------> Gemini scores which memories were useful
    |
    v
[Salience Update] -----> +0.1 useful, -0.05 irrelevant
```

## Recommended Architecture (With Fixes)

```
User Message
    |
    v
[Query Expansion?] ----> Only if short/vague (<50 chars, pronouns)
    |
    v
[Embed Query] ---------> Gemini embedding-001 (768d), cached parse
    |
    +------+------+
    |             |
    v             v
[Vector]      [FTS5]
    |             |
    +------+------+
           |
           v
    [RRF Fusion] ---------> Merge + rank by reciprocal rank
           |
           v
    [Top 5 fused results]
           |
    (same layers 2-5 as before)
           |
           v
    [Context Block]
           |
           v
    [Claude Responds]
           |
           v
    [Relevance Eval + Metrics Table] --> Track precision over time
```

---

## Score Against IBM Framework

| IBM Principle | ClaudeClaw | Score |
|---------------|-----------|-------|
| Chunking quality | Natural per-turn chunking, high-bar extraction | 8/10 |
| Embedding model selection | Gemini 768d, good quality, but single-model | 7/10 |
| Retrieval strategy | 3-tier cascade with dedup, but no fusion | 7/10 |
| Re-ranking | Post-hoc relevance feedback (unique!), but no retrieval-time re-rank | 7/10 |
| Evaluation/testing | Relevance feedback exists, but no aggregated metrics | 5/10 |
| Deduplication | At ingestion (0.85 sim) + at retrieval (superseded filter) | 9/10 |
| Staleness handling | Contradiction resolution + decay + supersession | 9/10 |
| Graceful degradation | 3-strategy fallback cascade | 8/10 |

**Overall Retrieval Engineering Score: 7.5/10**

---

## Next in Rotation

**May 5:** Skill #5 -- Security & Safety. Audit prompt injection defenses (especially when processing external content like emails, web pages, WhatsApp messages), least-privilege enforcement on scheduled tasks, and token/credential exposure in logs and outputs.

---

*Audit performed against IBM Technology "7 Skills for AI Agent Work" framework (https://youtu.be/mtiOK2QG9Q0)*
*Skill rotation: System Design -> Tool & Contract Design -> RAG -> Reliability -> Security -> Evaluation -> Product Thinking*
