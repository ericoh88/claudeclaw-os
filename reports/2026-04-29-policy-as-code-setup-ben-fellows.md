# Set Up Policy as Code in 1 Hour - Ben Fellows

**Source:** [Set Up Policy as Code in 1 Hour (Control AI Code Fast)](https://www.youtube.com/watch?v=iFLaeWXRSlY)
**Channel:** Agentic Development - Ben Fellows
**Date:** 2026-04-29

---

## Key Thesis

Policy as code is a static, deterministic system that pairs with the non-determinism of AI to prevent code drift. You can get started in under an hour. It's like a massive bespoke linting system that was never physically feasible before AI.

## What Is Policy as Code (Quick Recap)

- A deterministic scanning system that checks your codebase against hundreds of custom rules
- Different from linting because it's significantly more comprehensive and completely bespoke to YOUR codebase, architecture, and decisions
- Acts as a deterministic PR review system for agentic development
- Pairs with agentic pipelines for scaling AI-assisted development

## How to Get Started (Under 1 Hour)

1. Open a Claude Code instance in your project
2. Ask: "What are the 10 most important rules for keeping a clean [your stack] codebase?"
3. Tell it: "Make a new folder called `policies/` at the root and a scraper that scans source for violations of these rules"
4. Run it -- Ben's first scan found **399 violations across 71 files**
5. Watch for false positives and validate the rules matter to you

## How to Build Your Rule Set

- Go back through your last few PRs and think about what you caught
- Dictate to an AI: "This is something I caught, I want a rule that does this"
- Start with 25-50 rules from real PR feedback
- Then ask: "What are some peripheral things to these?" and review/sign off
- Goal: hundreds of rules covering every architecture decision, pattern, and convention

## Scaling Considerations

- Don't have every rule doing its own scanners -- need a shared **evidence layer**
- Implement **caching** for performance
- Save evidence over time for **reporting** (database, HTML reports)
- At scale, suites can be 700-800+ lines; for enterprise clients, potentially thousands of rules

## The Point

Policy as code is your tool to build a deterministic PR system into agentic development. When paired with agentic pipelines, you get AI development that actually works at scale -- the AI writes code, policy as code catches drift before tests even run.

## Full Transcript

Okay, welcome back to the channel. Today, I want to talk about a simple getting started with policy as code concept and how you can actually do it within an hour. I want to pause for a second though and say thanks for the feedback on the first two videos. I am working on trying to get some of this up in the GitHub, but genuinely the feedback's been awesome. I appreciate that feedback that people really like the idea. I'll be doing a lot more videos about policy as code as a concept. The next few videos I'll be doing are about agentic pipelines and kind of what we're doing there. I think if you pair policy as code with agentic pipelines, you're going to be well on your way for actually figuring out how to scale agentic development.

So, today is going to be hopefully a little bit more just low-level doing some code, showing you how to do your first policy as code. If policy as code makes no sense to you and you've never heard of it before, go watch the first two videos that are just my most recent ones on the channel. In essence, it's a static deterministic system that can pair with the non-determinism of AI for trying to avoid drift.

Today, let's write some code. Let's get into it.

So, once again, I hope you've watched the policy as code videos and you understand a little bit what it is. What we're going to do though is we're just going to write like a couple prompts that you can do yourself to write your own policies as code to get started, right? And as a reminder, the eventual goal of these suites is very large, right? Like we have suites that are 7 or 800 lines and talking to a couple clients about how this could be rolled out into their code base. I think it's thousands of possible rules. In short, it's like everything about your code base, every decision, every architecture decision, every rule should be bespoke rules that basically are run and scanned your code base. Picture this once again as a massive linting system that was just never really physically feasible before AI to help with some of it.

Like how do you get started? How do you get started is super simple. And I want to sort of balance this up. I'm going to show you how you get started, but this isn't really how you like scale one of these like rule sets. How you scale it is you think about things like caching, you think about things like runtime evidence layers, like all kinds of more architectural focused things.

But if you're sitting here and like you have a let's say front-end code base, right? And we'll go here. Let's open a Claude instance in the terminal. We already have Claude instances of both open. We've got a second instance of that in this code base. All right. And then I would just let's just ask a question about what are the 10 most important rules generally for organizing, for keeping a clean front-end. You can look at source, but I want you to base your answer on best practices. Let's see what it says.

Great. So, it came back with 10 rules. So, what we're going to do is we're going to basically do this. This is going to be stupidly simple. We're going to say, "Make a new folder at the root of the project called policies and in it a scraper that scrapes source and tells me whether there are any violations of these rules." Very very basic. And once again, this is not necessarily how you would do this at scale. But the point of this video is just to show how simple this is to get started.

Great. All right. So, let's talk about what it built. It added a new folder called policies here. And it added scan. It already scanned it and it found 399 total violations of those rules, right? Across 71 files. Which is awesome, like awesome. Now, to be fair, like you have to worry about false positives, you have to worry about are these actually rules you care about, all kinds of things.

But what I'm telling you is that as a tool for verifying that AI is doing the architecture you want, the single most important thing you can do is sit down and write out like the hundreds and hundreds of things that you would catch in a PR. And what I did, for example, is I like went back and I thought about the last few PRs that I had to review and I just sat down and I literally verbally dictated to ChatGPT like, "This is something that I caught, but I want a rule that does this. This is something that I caught, I want a rule. This is something I caught." And then I once I had 25 to 50 of those, I said, "Hey, what are some peripheral things to these?" And then I reviewed those and signed off on them.

And all it's going to do is it's going to then scrape your code base and it's just going to do this. And you're going to say, "Okay, why is this different than linting?" It's different than linting because it's just significantly more comprehensive and in theory it should be completely bespoke to your code base and your app and your architecture and rules, etc., right? It is your tool to essentially build in a PR deterministic PR system for agentic development as it's doing it.

So, I want to keep this video short because it is super super simple to start this yourself. Now, as you scale it, things to be aware of, you don't want every rule doing its own scanners, you need like an evidence layer, you're eventually going to be doing like caches, you'll probably want like evidence that is saved over time so your reporting structure is actually spitting out to either a database or an HTML report or something like that. But like all that stuff super easy to build.

Yeah, so do it. You'll start to find a lot of things wrong with your code base very quick and then start to build it into your actual development cycle and you will absolutely start to see agentic development like work for you in a way that has never previously worked.

All right. Check out future videos coming up. Please like and subscribe to the channel. My name is Ben Fellows. Please check me out on LinkedIn or hit me up here. Same thing. You have any other video ideas, thoughts, comments, drop them below. I'll be trying to do a lot more videos in the next few weeks both about policy as code as well as agentic pipelines. Cool. All right, get out of here. Appreciate it. Bye.
