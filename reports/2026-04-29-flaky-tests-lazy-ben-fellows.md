# In 2026, Blaming Flaky Tests Means Your Org Is Lazy - Ben Fellows

**Source:** [In 2026, Blaming Flaky Tests Means Your Org Is Lazy](https://www.youtube.com/watch?v=BQDwFTy_QOg)
**Channel:** Agentic Development - Ben Fellows
**Date:** 2026-04-29

---

## Key Thesis

Flaky tests are no longer a necessary evil. With AI, it's now exponentially faster to fix the frontend code itself than to write workarounds in your test automation. If your org still has flaky tests, you're either ignorant or lazy.

## What Is Flakiness

- Tests that fail for reasons other than actual bugs
- Most common: browser interaction before elements are truly ready (Playwright "moves too fast")
- Also: database/test data issues (not covered in this video)

## The Root Cause

- Frontend code is "good enough" for humans but NOT for Playwright
- Playwright interacts at extreme speeds with strict order of operations
- Common issues: elements showing as interactable before data loads, race conditions, loading order problems

## The Org Structure Problem

- QA engineers manage Playwright but can't touch frontend code
- Frontend devs don't care about flakiness -- "that's a QA problem"
- Two divisions know about each other's pain but nobody fixes the root cause
- QA resorts to band-aids: sleeps, wait for network idle, wait for requests, assert visible

## What Changed with AI

- AI is extremely good at tedious work like fixing loading order issues
- It's now faster to fix the frontend than to write Playwright workarounds
- A prompt can identify and fix loading/interaction patterns in seconds

## The Fix (3 Steps)

1. **Identify flaky patterns** -- go through existing code, find top 10 patterns that cause flakiness (buttons clickable before ready, elements showing as interactable before page fully loaded, etc.)
2. **Write policy as code rules** -- static checks that look for these patterns and anti-patterns across the entire codebase (linting on steroids)
3. **Let QA engineers fix frontend code directly** -- for loading states and interaction issues, don't force a round-trip to frontend devs

## Why It's Lazy

Two lazy outcomes:
1. Org clings to rigid role separation -- won't let QA touch frontend code even minimally
2. Frontend engineers don't care about test automation costs and keep shipping unstable code

The non-lazy outcome: spend a few minutes identifying patterns, write rules, fix the frontend.

## On Third-Party Libraries

- Component libraries sometimes cause flakiness that's out of your control
- Ben argues you can now rebuild most component libraries yourself with AI
- This gives you complete control over all code vs depending on a library you can't modify

## Policy as Code Connection

- Flaky pattern detection fits perfectly into policy as code
- Don't turn findings into immediate fixes -- write a RULE that catches the pattern everywhere
- Create static checks that prevent the pattern from recurring
