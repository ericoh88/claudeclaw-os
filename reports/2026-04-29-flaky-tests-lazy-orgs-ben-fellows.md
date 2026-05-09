# In 2026, Blaming Flaky Tests Means Your Org Is Lazy - Ben Fellows

**Source:** [In 2026, Blaming Flaky Tests Means Your Org Is Lazy](https://www.youtube.com/watch?v=BQDwFTy_QOg)
**Channel:** Agentic Development - Ben Fellows
**Date:** 2026-04-29

---

## Key Thesis

Flaky tests used to be a necessary evil. In 2026, with AI, it takes seconds to fix the front-end code causing flakiness instead of hours fighting it in test automation. Orgs that still have flaky tests are either clinging to outdated role divisions or too lazy to fix the actual problem.

## What Is Flakiness

- Tests that fail for reasons other than actual bugs
- Most common: browser interaction before elements are truly ready (Playwright "moves too fast")
- Database flakiness from bad test data (separate topic)

## Root Cause: The Org Structure Problem

- **QA engineers** manage Playwright -- their job is to make tests not flaky
- **Front-end developers** manage the code -- they don't care about Playwright flakiness, that's "a QA problem"
- Front-end code works fine for humans but NOT for Playwright (which interacts at extreme speeds with strict order of operations)
- QA engineers traditionally couldn't touch front-end code and lacked skills to do so

## The Band-Aid Approach (Old Way)

- Sleeps
- Wait for network idle
- Wait for requests
- Assert visibility checks
- All of these are expensive band-aids that cost tons of money

## What AI Changed

- AI is very good at tedious work -- and fixing loading order/race conditions is tedious
- It now takes seconds to fix the front-end code itself instead of hours fighting Playwright
- A good QA engineer who understands code can just update the front-end directly

## The Non-Lazy Solution

1. **Identify patterns**: Go through existing code, find top 10 flaky patterns (buttons clickable before ready, elements showing as interactable before loaded, etc.)
2. **Write policy as code rules**: Static checks that look for patterns and anti-patterns around loading states -- linting on steroids
3. **Let QA fix front-end directly**: When flaky stuff happens, let QA engineers update the front-end code themselves instead of round-tripping to front-end devs

## Why It's Lazy

Two lazy outcomes:
1. Org clings to job titles/roles and won't let QA touch front-end code
2. Front-end engineers don't care about test automation costs and keep shipping unstable code

## Bonus: Third-Party Libraries

- Component libraries sometimes cause flakiness you can't control
- Increasingly, you can rebuild component libraries yourself with AI and have complete control
- Third-party libraries are becoming a liability for this reason

## Connection to Policy as Code

- Write rules that detect flaky patterns in front-end code
- Don't jump to fixes -- first create static checks that find ALL instances of the pattern
- Run these as part of your development cycle

## Full Transcript

My goal today is to convince one person in the world that flakiness in the world of test automation is something that now can be addressed in the front end code in literally seconds as opposed to having an automation engineer spend hours trying to fight it. So, today I want to talk about why this happens, what has changed with AI, and frankly why any organization that still has flakiness either just is ignorant to it or is too lazy to mix up the roles and try to figure out how to address this.

At its core, flakiness is when you run a test and it fails for not a bug. The most common scenarios: one is when the browser is interacted with before it should be or some version of that and Playwright has a concept called "move too fast" and so the browser breaks. The second would be like database flakiness when there's bad test data. I want to specifically focus on the quality of the front end code.

The most common answer to flakiness is to do a bunch of waits or load states or all kinds of other things. You end up writing so much code to try to wait for things to be visible. For a long time, that made sense because addressing this stuff was so tedious. But frankly in the world of augmented coding and AI, flakiness takes exponentially less time just to fix the front end code than it does to work around it.

For a long time, I thought flakiness was part of Playwright. It was part of automation. Over the last 6 months, my eyes have been completely opened. When I do my own development, Playwright's not flaky. Then I go do automation on other people's apps and it becomes very flaky. And then I do development in my own app and it flakes and then I fix the front end code and then it doesn't flake. Light bulb went off.

What are the 10 most common reasons why Playwright flakes? Something loads and shows as interactable before it should be interactable. Order of operations of loading, race conditions. When you look at a page object model, you see a bunch of waits and wait for network idle when the reality is it's actually just faster to fix it in the front end code now.

Why is this happening? Two separate divisions in many organizations. They know of each other's pain, but there's not a ton of interest in fixing it. Playwright is managed by QA engineers. Front end is managed by developers. Most front end developers don't really care about Playwright flakiness -- that's a QA problem. They ship the feature. From a human perspective, the code is good enough. From a Playwright perspective, the code is not good enough because Playwright interacts at extreme speeds with very specific order of operations. The QA engineer could not touch the front end code, didn't have the skills to.

So you end up with sleeps, wait for network idle, wait for requests, assert things are visible -- all band-aids that cost tons of money.

Then we introduce AI. One of the things AI is very good at is tedious work. The order of operations in terms of browser loading is tedious. We now either have policy as code standards that look for load states and enforce patterns in the code, or sometimes even just having QA engineers fix the front end themselves.

It's lazy for one of two reasons. One, your org is clinging to job titles and roles and won't let QA engineers update front end code even in minimal ways. Or, your front end engineers truly do not care about the costs of writing and maintaining test automation and they're just going to keep shipping it.

The non-lazy outcome: spend a couple minutes and do a handful of things. Go through your existing code and identify the top 10 flaky patterns. Write a set of rules (policy as code) that look for patterns and anti-patterns. When flaky stuff happens, let the quality engineer update the front end code themselves.

Regarding third-party libraries: component libraries sometimes have flaky things that are out of your control. More and more, you can rebuild those libraries yourself and now have complete control over all the code.

Flakiness for a long time was treated as a necessary evil. It is no longer a necessary evil. It's just an evil you're too lazy to address.

My name is Ben Fellows. I run a company called Loop QA. You can check out our company at workwithloop.com.
