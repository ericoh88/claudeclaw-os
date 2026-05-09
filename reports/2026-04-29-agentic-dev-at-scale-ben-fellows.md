# We Tried Agentic Development at Scale - Ben Fellows

**Source:** [We Tried Agentic Development at Scale. Here's What Broke (And What Actually Worked)](https://www.youtube.com/watch?v=X2SVUeQwdI8)
**Channel:** Agentic Development - Ben Fellows
**Date:** 2026-04-29

---

## Key Thesis

Agentic development has an 80/20 problem: 80% works great, 20% drift compounds over time and becomes catastrophic by month 3. Policy as code introduces a deterministic floor under the non-deterministic AI stack.

## The 80/20 Problem

- AI is pattern-based -- copies bad code even when told not to
- Bad patterns propagate: ship one bad thing -> context -> AI copies -> more bad things
- Existing tools (rules, skills, prompts, memories) are advisory, not gating

## Policy as Code Solution

- Deterministic scripts paired with non-deterministic AI rules
- Scans entire codebase, maps rules to evidence, flags drift
- AI breaks policies almost EVERY time (10-12 errors typical)
- ~800 rules, nearly 100K lines in one suite
- Must be bespoke to YOUR app
- Covers: architecture, imports, UI, observability, documentation, cross-module coupling
- Need rules to catch AI cheating (wrappers, wrong file locations)

## Two Pillars of Scaled Agentic Dev

1. Policy as code -- deterministic drift prevention
2. Bespoke agentic pipelines -- custom orchestration per repo
