# Agentic Pipelines Over Agentic Factories - Ben Fellows

**Source:** [I Tried Building with Agentic Factories. They Failed. Here's What Worked Instead.](https://www.youtube.com/watch?v=mREHBZQbhBo)
**Channel:** Agentic Development - Ben Fellows
**Date:** 2026-04-29

---

## Key Thesis

Building bespoke agentic pipelines tailored to your repo produces far better results than generic "agentic factory" frameworks. Factories try to be one-size-fits-all and fail because codebases are too complex and varied.

## What Are Agentic Factories (and Why They Fail)

- Factories are wrapped Claude Code instances with context, memory, and tools bundled together
- Promise: feed in acceptance criteria/user stories, get working code out
- Ben tried 4-5 of them, none worked well
- Core problem: "Ford doesn't build every car in one factory" -- one factory can't apply to every codebase
- They exist because of real ceilings: context window limits, single personality limits, discipline limits

## The Alternative: Agentic Pipelines

Agentic pipelines take the good parts of factories (reusable agents, custom prompts, memory sharing) but create bespoke pipelines designed around YOUR repo.

### How a Pipeline Works

1. Given a task, the first step writes a **manifest**
2. Multiple Claude Code instances spin up to **research** the manifest
3. Each instance writes **development plans**
4. Plans are **reviewed by a manager** instance
5. An **orchestrator** spins out Claude Code instances to execute the work
6. Includes replanning steps as needed
7. Output: a branch ready to merge

### Pipeline Characteristics

- Each project can have **8-10 different pipelines** depending on the task type
- Every pipeline run creates a **new branch**
- Every step **commits** for full visibility
- They built a **governance app** to observe build steps, test results, commits

## Four Core Benefits

1. **Chaining different personalities** -- managers, reviewers, executors as independent instances. Can even mix models (OpenAI, Codex alongside Claude)
2. **Escape context window ceiling** -- pass full transcripts and documentation instead of compressed summaries. Each block gets fresh context
3. **Own the whole Git story end to end** -- pipeline owns its own worktree, creates its own branch, keeps it clean
4. **Observability and governance by design** -- built-in visibility into every decision

## How It Differs from Claude Skills/Commands

- Pipelines are inherently **deterministic systems**
- Claude skills and commands should be **married with pipelines** -- they're part of the pipeline, not a replacement
- Skills/commands are building blocks; pipelines are the orchestration

## Example Pipeline (TDD Style)

1. **Planner** role creates TDD-style work breakdown
2. **Executor 1** writes tests, ensures they fail
3. **Executor 2** writes code, ensures tests pass
4. **Refactor** step
5. **Review and verifier** between steps
6. **Manager** blocks or promotes
7. Merge to main

## Pairs with "Policy as Code"

- Concept Ben created: "a linter on steroids"
- Hundreds of rules that control and constrain AI's development
- Run **before tests** to ensure code quality (tests handle business outcomes)
- Built into the pipeline as a step between execution and testing

## Why You Should Do This

1. Handle significantly **larger, longer, and more complex** development tasks
2. Run more things **in parallel** without human brain overhead managing multiple instances
3. Prompts can be much bigger and more wide-ranging with higher success rates

## Downsides

- **Runs significantly longer** than single Claude Code -- each instance needs to come up to speed on where others left off
- Core trade-off is **time** -- not the dopamine hit of AI doing something in 2 minutes
- Planning phase + development + manager review + policy-as-code suite can take 5+ minutes
- But the output is a branch that's much closer to merge-ready

## Transcript

So, building my own bespoke agentic pipeline has completely changed the output of agentic development for me. I was just writing quad code instances and doing them in parallel, trying to maintain context, trying to control drift. When I figured out that you should actually be creating your own pipelines, it's completely changed output quality and so forth.

Today, I want to talk about how you can do this, why you should do this, and exactly why these like general generic promised factory things that exist all over the internet just really aren't worth the time and energy.

What is agentic development? The idea of agentic development is trying to have an agent do development without necessarily having human in the loop. I would argue that you should still always have human in the loop in some component, but agentic development in theory from a purist perspective is this idea that you would have an agent take everything from development and it would go all the way to prod.

Why is this a topic? It's about more output with the same high quality. There are a bunch of companies and open source projects throwing hundreds of millions of dollars at this problem. They're trying to create what are called AI factories -- the idea that all they need is acceptance criteria or user stories and they can do it.

I've tried these factories and I've tried four or five of them. And the reality of these factories is that none of them have particularly worked well for me and I stopped one day and I realized, okay, so what are these? And why are they happening? And all they are is basically a bunch of wrapped Claude Code instances or whatever kind of development instance you want, context and memory and all these other tools.

Why did these exist? They exist because generally speaking using AI hits context window ceilings, which is getting better because now it's like a million tokens instead of 200. The other component is single personality ceilings. If an agent is doing something, it's only generally doing it as a personality. Claude, I will argue by the way, it's entirely possible that by the time you're watching this video, it's completely out of date because Claude is starting to introduce the idea that you can orchestrate multiple personality agents within just Claude. Observability is a big one too. And discipline ceilings.

So, why don't I like factories? There's a reason why Ford doesn't build every one of their cars in one factory. This idea that there's an agentic development factory and that it should be able to apply to every code base and every different component that you have is insane to me.

What I want to pitch is this idea of agentic pipelines. Agentic pipelines are the idea that you take everything that's good about an agentic factory -- reusable agents, custom prompts, memory sharing -- but you create bespoke pipelines for specific things designed around your repo. The beautiful thing about this is they're completely your pipelines. Generally, pipelines across the projects all have the same building blocks, but how a pipeline is set up, the review systems, what's parallel, what's not parallel, it all is bespoke to you.

This is just an example dev pipeline that I have. It's simply a function that runs a bunch of different instances of Claude Code. If I give it a task, the first thing it does is write a manifest and then that manifest is saved. Depending on that manifest, different Claude Code instances spin up that do research on that manifest and then write development plans. Those plans are reviewed by a manager. Then there's an orchestrator that spins out all of the next Claude Code instances to actually do the work. There's steps like replanning and other components, but the point is it creates this whole pipeline system.

We've taken this further by writing an app for governance of this pipeline. When the agentic pipeline spits out a manifest, when it's doing the build, you can see all the build steps, when it adds tests, you can see its run times, tests, all of its commits and so forth. Every time a pipeline runs, it makes a new branch, every step does commits, and we have a ton of visibility into it.

In a lot of our projects, we have upwards of eight to 10 different pipelines depending on the task. When we're writing test automation, there is a specific pipeline that pulls the commit, looks at it, and so forth.

The core of it comes down to four core things. First, chaining different personalities -- the ability to have managers, things that are not influenced by the previous Claude Code instance. Agentic pipelines are not limited to one agentic system. You can use things like OpenAI and Codex as part of this process. You would lose things like memory and some of the other built-in components, but you do benefit a lot by having different models looking at the code.

Second, escape context window ceiling. You have the ability to not have to deal with compressed summaries and instead pass full transcripts and documentation. You're breaking up all of the work and can have planning steps show that process.

Third, owning the whole Git story end to end. A pipeline owns its own work tree, creates its own branch, keeps it super clean.

Fourth, observability and governance by design. Optional but super useful.

How is this different from Claude skills or commands? It's inherently a deterministic system. A pipeline forces deterministic behavior. Claude skills and commands should be married with pipelines -- they should be part of the pipeline.

Here's a pipeline breakdown. You have a planner role that creates TDD-style work. An executor writes tests and makes sure they fail. The next writes the code and makes sure it passes. Then a refactor step. Between those, review and verifier roles. Managers either block or promote, then it's merged to main.

This pairs really nicely with policy as code. That's a concept I came up with -- a linter on steroids. Codebases are a series of patterns and with AI you inherently deal with drift. So you should have hundreds of rules that are policy as code that control and constrain AI's development. When you have an agent, you can build in policy as code as part of your pipeline. You have a planner agent, an executor agent, and before you run your tests, you run policy as code to make sure no errors are present. Policy as code is about code quality; tests are about business outcomes.

Why should you do this? One, you can do significantly larger and longer and more complex development. Your prompts can be significantly bigger and more wide-ranging and you'll have success. Two, you can run a lot more things in parallel. You have a lot less time dealing with your human brain trying to manage multiple instances of Claude Code.

The downsides: they run significantly longer than Claude Code because you're pairing a bunch of instances together and every single time one is trying to come up to speed on where the other ones left. The core trade-off is time. It's not going to be the dopamine hit of AI doing something in 2 minutes. It's going to have a planning phase, development, managers reviewing, running your policy as code suite which can take upwards of 5 minutes. But in theory, the output is a branch that is ready to merge that's much closer to what you would have gotten.

That's my case for why you should be building your own agentic pipelines. I'm going to be doing a couple of videos coming up about how to actually do them and how to get started. Would love to hear your feedback on whether or not you think this is the right direction, wrong direction. Check me out on LinkedIn, Ben Fellows on LinkedIn, and subscribe to this YouTube channel.
