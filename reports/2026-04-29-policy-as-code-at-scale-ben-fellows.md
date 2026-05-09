# How We Use Policy as Code to Control Claude and AI Agents - Ben Fellows

**Source:** [How We Use Policy as Code to Control Claude and AI Agents](https://www.youtube.com/watch?v=lHZomSUi7gU)
**Channel:** Agentic Development - Ben Fellows
**Date:** 2026-04-29

---

## Key Thesis

Policy as code at scale has three layers: evidence gathering, rules, and gates. When fully built out, it becomes a 100,000+ line deterministic governance system that constrains AI drift and makes agentic development reliable.

## Three Core Layers at Scale

### 1. Evidence Gathering
- Don't let every rule do a full codebase scrape -- create **evidence buckets**
- Different rules need different evidence; map rules to buckets
- Use AST parsers, artifact readers, manifests, routes
- Evidence cache allows skipping full scans when only certain files changed

### 2. Rules
- Declarative rules as data -- each rule is a module
- Four types carry the whole engine: rules, context, evidence objects, findings
- Cover everything: architecture, imports, middleware order, route structure, UI boundaries, patterns, anti-patterns
- Ben's project: **100,000 lines of rules** governing software development
- Rules were written by AI in an afternoon, then reviewed by humans over a couple hours
- Rules should NEVER change -- they are your source of truth

### 3. Gates
- Determines when and how stuff fails
- Three levels: hard fail, warn, release
- Important for CI/CD integration (though currently mostly used in local dev)

## The Waiver System

- Allows exceptions to rules when needed
- **Biggest risk point**: AI tries to introduce waivers everywhere
- Solution: AI is NOT allowed to introduce waivers
- Periodic human audits of what's been flagged as waivers

## Repo Structure (Full Build)

```
policy-as-code/
  sdk/          # rules, findings, context
  engine/       # runner, evaluator
  extractor/    # evidence gathering
  rules/        # all rules sorted
  reporter/     # output (markdown, HTML)
```

## How It Runs in Practice

1. AI makes a code change
2. Policy rule system runs automatically (part of agentic pipeline)
3. Any errors found -- AI fixes code to be compliant
4. **Critical rule**: Code must become compliant with the rule system, NEVER the other way around
5. After policy passes, run test automation
6. Both clean = high confidence the code is correct

## Real Results

- Suite currently takes 4-5 minutes to run (needs optimization)
- Found ~302 errors after a morning of development
- Missing attributes, missing test IDs, component library violations, observability gaps
- Drift is dramatically reduced -- fewer and fewer new rules needed over time
- When drift IS found, ask AI: "How did this get around the rules?" -- usually just a missing rule

## Key Design Decisions

- Evidence caching strategy
- Rule-to-evidence mapping
- Gate thresholds
- Waiver governance
- Report format (markdown/HTML)
- Whether to package as NPM/hex or keep bespoke

## The Big Picture

Code is a massive set of patterns. With AI, you can now codify ALL of those patterns into rules. This was never feasible before. When paired with test automation in an agentic pipeline, you get both code quality compliance AND business outcome verification.

## Full Transcript

So, in my previous video, I introduced the concept of policy as code and tried to make the argument of why it exists. If you missed that video, in short, policy as code is basically a tool that we've had tremendous success with pairing with your traditional AI agentic limiting tools, like your rule files, your skills, etc. And it introduces a static set of rules and scripts that basically contain drift at scale. You want to see that whole video, check it out. It's on my YouTube channel.

In today's video, what I want to get into is actually what this looks like and how you can build out these policies. This is not going to be a getting started video. I'll have another one of those on the channel, so you can find that. But, it is going to be trying to show you like how this works at scale and how you can run it and how you can build it. What you can see right here is this is actually one of the rule sets I have for this Elixir suite. So, with that, let's get into it.

Okay, before we get into it, as a reminder, my name is Ben Fellows. I do a lot of content on QA as well as now just general engineering, things like agentic pipelines, things like policy as code, living documentation, all kinds of things.

So, once again, if you're new to this, what is policy as code? I have a whole video on this, but essentially, the concept is that you introduce a set of rules that are extraordinarily comprehensive that govern everything from architecture to rules on what you can import where to frankly even what documentation needs to be available. And the idea basically is that you run this every time you're also doing agentic development. So, you give a prompt, it tries to run code, and then it runs its policy as code suite and it flags errors.

And I actually might have, let's see if I have it. An example of its output. So, this is an example of the output. Now, in this case, I haven't worried about cleaning it too much into a report or anything like that. It's just more for me. In short, you can see, so I did some development earlier this morning. I ran the suite. It currently takes around 4 to 5 minutes. I think I can probably optimize that much further because it does feel like it takes way too long, but the code base is quite large. And in short, from the development this morning, it found around 302 errors. Now, I had also messed a little bit with some of the rules. So, you have to be really careful with changing the rules. Generally speaking, you want to be never changing them. Like your rules should not be changed. Like they are your source of truth. They guide everything. And you can see now it's found all these violations, right? And this is anything from missing attributes to missing test IDs to this is my component library and looking for like where it's supposed to live and what apps missing their observability things as well, right?

So, this is the output of it. And the concept is this idea that you use this to constrain AI drift and it frankly works really well.

So, how do you build it and what is it at scale, right? And so, what is at scale is three core levels. You have your evidence gathering, you have your rules, and then you have your gates. So, the evidence gathering at scale, why it becomes complex is a couple things. One is you want to figure out how to optimize the scraping of your code base essentially, right? Like you don't want every rule to do a full scrape of the code base. So, you end up essentially creating like evidence buckets that basically different rules need to look for different things, right? And so, you create a bunch of different evidence buckets that the rules all then are mapped to and the rules look at. And then you also have your whole gate system, which is basically determining when and how stuff fails. This is more important when you try to introduce it into maybe the idea of a CI/CD flow. Most of what we're doing right now is for like local development, but it is an interesting tool.

So, one pipeline, seven subsystems. You have your source code, your AST parser, that then compiles into an artifact reader. You have your manifests and routes that all then goes into evidence cache. And then that becomes evidence store and rule registry. So, the benefit of this is that you can then add logic like when you're doing changes, if you've only changed certain files, and then the rules are not mapped to those files, you can use some of the evidence cache and you don't have to run full scans every single time. You have your runner, and then you have your findings, you have your waiver concept.

Waiver concept is basically the idea that you want to either allow for certain exceptions, right? So, my general belief is that code is just a massive set of patterns. For the most part, you can almost codify all of those patterns and how they should work. But at the same point, there are times when you want waivers. And so, you have the ability to do waivers. This is probably the biggest risk point in the whole concept though, because as soon as you introduce the idea that waivers are possible, AI tries to introduce them like everywhere. So, we have a whole system around AI not allowed to introduce waivers and then we periodically audit what it has been flagged as a waiver. And then you have the output here, which is your report or HTML. And then you have the gate evaluator.

So, what does the repo actually look like? You have basically policy as code repo, your SDK, which has all rules, findings, context. You have an engine concept, your extractor concept, and then you have all your rules sorted here. And then you have a reporter concept and so forth.

Basically you have your rules, you have the context component in the code, and then you have the evidence objects, and then you have all your findings, and then you have your waivers. Four types carry the whole engine.

What happens when you actually run it: first, you have your CLI, which at this point we just have AI run. So, part of our agentic pipelines now is that after a change, AI is just told to run the policy rule system, any errors, make sure the code is compliant. And the key thing is that the code always has to make sure the code becomes compliant with the rule system, not ever that the rule system should somehow become compliant with the code. This whole thing fails if you are not capable of building out a set of rules that govern software development. And like genuinely, what we're talking about is like thousands of rules possibly long term, right? It's everything from patterns to anti-patterns to architecture, etc.

What's interesting about it is that now with AI, writing and governing all these rules -- it wrote all the rules in an afternoon. I spent a couple hours with a couple other folks going through all the rules, deciding if we liked them and they were valid. And now we have 100,000 lines of rules that govern software development on this project. I never would have sat down and write 100,000 lines of rules before this.

Basically you have your visual UI boundaries. Architecture things, route structure to how the HTTP works to imports to middleware order, etc. It is truly governing everything about basically every decision that a developer could make that is possible to be turned into a pattern.

Personally speaking, I think it works really well. I have a lot of evidence to say it does work really well. And then once you have it in place, it's as simple as just hey, run the policy rules. Is it clean, good? Then you run all your test automation. Is it clean, good? Then you can be very confident at an agentic perspective that the code is both compliant with how you want everything architected, done, etc. as well as all the tests. Is it perfect? Absolutely not. Am I still finding rules that need to be added? When I find drift, I then ask AI what, how did this get around the rules? And most often is the case is I just didn't have a rule for it. Now, what's really cool about it is I'm getting so much less drift than I've ever gotten before, so there's less and less rules that I'm having to add and to me that's an indicative component that this is really working.

If you have questions, drop them in the comments below. My name is Ben Fellows. I run a company called Whip QA. If you actually want consulting or a course on this stuff, we're considering launching that. Subscribe. I appreciate it. Talk to you. Bye.
