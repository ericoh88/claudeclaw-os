# Building Pi, and What Makes Self-Modifying Software So Fascinating

**Source:** [The Pragmatic Engineer (YouTube)](https://youtu.be/n5f51gtuGHE)
**Date:** 2026-05-04
**Duration:** ~94 minutes
**Host:** Gergely Orosz
**Guests:** Mario Zechner (creator of Pi), Armen Ronacher (creator of Flask, ex-Sentry)

---

## Summary

An in-person conversation between two veteran Austrian engineers and Gergely Orosz about Pi (a minimalist, self-modifiable coding agent), the state of AI-assisted software engineering, why code quality is declining, the MCP vs CLI debate, and why the industry needs to slow down.

---

## Key Takeaways

### 1. Why Pi Exists (~32:00)

Mario was a happy Claude Code user until summer 2025 when the team started shipping fast, injecting hidden system prompts, modifying context behind his back, and introducing constant bugs. He wanted a hammer that doesn't break at a different spot every day. Looked at alternatives (AMP, Droid, Open Code) but they were either too expensive, too opinionated, or did things to the context he didn't like (e.g. Open Code running LSP diagnostics after every single edit, confusing the model mid-work). So he built Pi from scratch: his own LLM abstraction, agent loop, and TUI. Minimal core tools: read, write, edit, bash. That's it.

He reverse-engineered Claude Code during summer 2025 and built a service to track the evolution of its system prompt and tool definitions across releases (CC History at mario.at).

### 2. Self-Modifying Software Is the Real Unlock (~38:00)

Pi's extension system lets users hook into everything via TypeScript modules loaded into the same Node process. The key insight: you can ask Pi to modify itself. It writes TypeScript extensions that extend its own capabilities. People have built:
- MCP support (Pi doesn't ship with it natively)
- Custom plan modes
- RL environments for open weights models
- Game development workflows with screenshot feedback loops
- Custom TUI styles and layouts

Mario sees this as the future beyond just dev tools: software that reshapes itself to the user's needs. Next step is a web-based UI alternative to the TUI.

### 3. OpenClaw Connection (~48:00)

Peter Steinberger started building his WhatsApp assistant "V Relay," initially forked Pi and called it "Towel," then switched to using Pi directly. Pi wouldn't have compaction if OpenClaw didn't need it (Mario built it because Peter was begging for it, though Mario tells his own users not to use compaction). The downside: thousands of OpenClaw instances now autonomously file issues and PRs against the Pi repo without users even knowing.

### 4. Agents Are Degrading Code Quality (~18:00-24:00)

Armen interviewed 30+ engineering teams about AI agent adoption. Findings:
- **Adoption spikes during holidays.** Thanksgiving, summer, and especially Christmas were inflection points because people had free time to actually learn the tools (it takes 2-3 weeks to click)
- **PRs are getting larger, harder to review, more "psychologically" challenging.** The code reads differently from how a human would write it
- **Automation bias is real.** The agent writes great code for 2 minutes, then garbage, but you stop noticing because you assumed it was doing well
- **Non-engineers are now submitting PRs.** Marketing, sales, PMs are all coding now. One sales team built a demo for a feature that didn't exist and nobody noticed
- **A good engineer says "no" a lot.** Agents make you say "yes" to everything because there's no cost to asking for more
- **Agents don't feel pain.** Humans are incentivized to fix complexity because it hurts them. Agents just keep adding to it. They don't learn from past mistakes the way humans do

### 5. "We All Need to Slow the F Down" (~72:00)

Mario's core argument:
- Agents produce 10x more code but also 10x more bugs
- Even at half the human error rate, that's still 5x more bugs than before
- You can't review 10x output volume as a human (we're used to reviewing ~1.5k LOC/day)
- The "dark factory" (100 agents, one spec, self-organizing) produces something, but quality is garbage
- Specs always have blanks. Agents fill them from training data. Training data quality is garbage to mediocre
- **Better approach:** Use agents to automate the stuff you hate, free up time to think about what to actually build, then bring agents back to polish the result with the time and attention it deserves

### 6. Complexity Is the Agent's Own Worst Enemy (~60:00)

If agents generate so much code that they can't fit the relevant context into their own window for the next task, they've defeated themselves. And agentic search doesn't solve the information retrieval problem: are you sure the agent found all the relevant code?

The training data problem compounds this: agents learned from the internet, where the mean quality of code is garbage to mediocre. The handful of excellently engineered projects (Linux, etc.) are minuscule compared to all the cargo-culted trend-of-the-day code.

### 7. MCP vs CLI (~77:00)

Both guests lean CLI. Their critique of MCP:
- **Spec complexity.** It's a product of its time but overly complex for what it does
- **Bad implementations.** Most corporate MCP servers are lazy OpenAPI-to-tool mappings that dump hundreds of tools into context
- **Non-composable.** To combine outputs from two MCP servers, data has to round-trip through the model's context. CLI pipes handle this natively
- **Code mode is an admission.** Cloudflare's code mode MCP basically says "the model should just write code to call these services"
- **Models are creative with bash.** They grep 20MB files, pipe outputs, read partial results. MCP takes that away
- **MCP's real strengths:** Auth (David from Sentry's point), enterprise adoption, consumer-facing chat apps (connect your email, OneDrive, etc.)
- **Future:** Maybe MCP2 based on auth + generated SDKs (like Stainless) rather than the current tool-call model

### 8. Dealing with Agentic Open Source Spam (~50:00)

Mario's approach:
- Auto-close every PR from unknown contributors via GitHub workflow
- The workflow posts a comment asking for a human-written issue (max one screen of text)
- Agents don't read those comments, so it's an effective human filter
- Once a human opens a good issue and Mario approves (types "LGTM"), their GitHub username goes in a whitelist file and future PRs pass through
- Built a 3D visualization tool that embeds issues/PRs into vector space to see clusters of similar agent submissions and bulk-close them

### 9. The Emotional Toll of Agentic Development (~64:00)

Armen openly talks about "agentic regret":
- The initial excitement of vibe coding on your phone while playing with kids gave way to stress as expectations ratcheted up
- He fell into the trap of letting the machine make decisions he wouldn't have made
- **The friction you used to feel in a codebase (the pain that triggers refactors) disappears when an agent does the work**
- Deliberate friction in engineering processes (code reviews, SLOs, tiered approval chains) exists for a reason
- Companies that removed friction ("ship without friction") are now experiencing security incidents and quality issues
- Some engineering teams report they have codebases they couldn't maintain anymore without the machine

### 10. Open Source Isn't Dying (~58:00)

Mario pushes back on doom:
- The rate of actually useful, maintained projects probably hasn't changed
- There are just way more projects that die after two days
- The fundamentals (human energy, community, ecosystem) are the same
- The real change is mechanical: need bottlenecks to deal with exponentially growing noise
- GitHub is under immense pressure from millions of agent instances (especially OpenClaw)

### 11. Predictions and Staying Grounded (~86:00)

- Neither guest is willing to make confident predictions ("it's like dog years, 1 year = 7")
- Self-modifiable software will expand beyond dev tools
- There will be a societal reckoning about dependency on basically two companies (Anthropic, OpenAI), especially relevant for Europeans
- Staying grounded: having kids, going outside, not living in SF, letting the passage of time clarify what matters (if it's still in the discourse 3 weeks later, it's probably real)

---

## Background on the Guests

**Mario Zechner:** Austrian, started on a 486DX 40MHz with turbo button. Worked in NLP/ML research in the 2000s, then startups (including a Java-to-iOS ahead-of-time compiler that was acquired by Samarine). Knew Ned Friedman from early startup days, got early Copilot access through him.

**Armen Ronacher:** Austrian, started programming on recycled architectural office computers (Windows NT, DOS). Created Flask web framework (still widely used, "clankers like to spit out Flask code"). Ran the German Ubuntu foundation/community. Worked on computer games in London, then spent 10 years at Sentry. Left April 2025 to start something new.

Both met on Reddit, eventually in Vienna. Connected with Peter Steinberger through six degrees of separation in the Austrian tech scene.

---

## Book Recommendations

- **Mario:** *Code* by Charles Petzold (great for non-techies understanding what programming really is)
- **Armen:** *Breakneck* (exploration of how China works vs Europe/US approaches)

---

## Quotable Moments

> "All the companies claiming that all of their code is now written by agents. Yes, we know the quality is garbage. We feel it in our bones when we use your product. It's garbage." -- Mario

> "A good engineer is an engineer that says no a lot and 'I don't need this' a lot. If you're using agents, the exact opposite happens." -- Mario

> "Agents don't learn. You can put as much stuff in the agents and build a memory system, but that's not the same type of learning as a human does. They also don't feel pain." -- Armen

> "I don't want my hammer to break at a different spot every day." -- Mario (on why he left Claude Code)

> "There's a genuine excitement in it and my 20+ years of experience tells me a lot of stuff, but it hits you in certain ways where you felt like there would be grounding and a strong foundation, and now it feels like everyone else doesn't care about that foundation anymore." -- Armen
