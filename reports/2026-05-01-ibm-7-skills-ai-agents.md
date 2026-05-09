# The 7 Skills You Need to Build AI Agents -- IBM Technology

- **Source:** https://youtu.be/mtiOK2QG9Q0
- **Channel:** IBM Technology
- **Duration:** 14:36
- **Date:** 2026-05-01

## Summary

IBM argues the "prompt engineer" title is obsolete for agent work. Agents take real actions in the world, so you need to think like a backend engineer, not a copywriter.

## The 7 Skills

1. **System Design** -- LLM + tools + DBs + sub-agents orchestrated together
2. **Tool & Contract Design** -- strict schemas; vague contracts = the LLM filling gaps with imagination
3. **Retrieval Engineering (RAG)** -- chunking, embedding quality, re-ranking
4. **Reliability Engineering** -- retry/backoff, timeouts, fallback paths, circuit breakers
5. **Security & Safety** -- prompt injection defense, least-privilege, input validation, output filters
6. **Evaluation & Observability** -- full tracing, test cases, metrics (not vibes)
7. **Product Thinking** -- UX for unpredictable systems; when to clarify vs. escalate

## Starting Moves

- Audit your tool schemas out loud
- Trace one real failure backward to the system (not the prompt)

## Visual-Only Insights (not spoken in the video)

- The reliability section first writes each item with an X (what agents currently miss), then rewrites them with checkmarks -- a before/after visual that's never narrated
- The System Design diagram has a crossed-out arrow from LLM directly to the database, implying "don't do this" -- architectural advice shown, not spoken
