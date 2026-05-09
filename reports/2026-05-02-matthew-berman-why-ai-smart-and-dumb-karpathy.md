# Reacting to "Why AI is so smart but also so dumb?"

- **Source:** https://youtu.be/pngC-TH8M0U
- **Channel:** Matthew Berman
- **Duration:** 34:51
- **Date watched:** 2026-05-02
- **Featured speaker:** Andrej Karpathy (Sequoia AI Ascent event)

## Summary

Matthew Berman reacts to Andrej Karpathy's talk at Sequoia's annual AI Ascent event. The talk covers why AI models are simultaneously brilliant at some tasks and terrible at others, introduces the Software 3.0 paradigm, and explores the future of agent-first products and agentic engineering.

## Key Topics

### LLMs as a New Computer (Software 3.0)

Karpathy frames LLMs as a fundamentally new computing paradigm:

- **Software 1.0** = writing explicit code
- **Software 2.0** = training neural networks with datasets
- **Software 3.0** = prompting -- the context window is your lever over the LLM interpreter

The context window is RAM (short-term memory), the model weights are the CPU (processing). Programming in this paradigm means crafting what goes into the context window. Installation of software becomes "copy this text, paste it to your agent" rather than complex shell scripts.

### Verifiability: Why AI is "Jagged"

The core insight: AI excels in domains where outputs can be automatically verified.

- **Code**: compiles or doesn't, runs or errors -- easily verifiable
- **Math**: 2+2=4, provably correct -- easily verifiable
- **Common sense**: "Should I drive or walk to the car wash 50m away?" -- not in the RL training loop

Labs optimize for verifiable domains because: (1) automatic verification enables massive RL training, (2) code output is the most commercially valuable, (3) enterprise companies will pay significantly for faster development.

This explains the "jaggedness" -- a model can refactor a 100k-line codebase but tells you to walk to a car wash. The skills aren't generalized; they're shaped by where the reward signals are strongest.

**Karpathy's bold claim:** Everything can eventually be made verifiable -- it's just a spectrum of difficulty. Berman pushes back on this, questioning whether "taste" can ever truly be verified.

### Vibe Coding vs Agentic Engineering

Karpathy draws a clear distinction:

- **Vibe coding** raises the floor -- anyone can build software without understanding syntax
- **Agentic engineering** raises the ceiling -- professional engineers go 10-100x faster while maintaining quality

Agentic engineering is its own discipline: orchestrating stochastic, spiky agents without sacrificing quality. Example: Peter Steinberger runs dozens to hundreds of agents in parallel, automating deployment, bug detection, PR management -- not just code writing.

### The Bitter Lesson

Never bet against end-to-end neural network capabilities over human heuristics. Tesla's autopilot example: switching from neural net + hand-written rules to fully end-to-end neural networks dramatically improved performance and reduced complexity.

### Agent-First Products

The entire internet needs rebuilding for agents:

- **Stripe Projects CLI**: authenticate once as a human, then agents provision services on your behalf
- **Here.Now**: one-click "copy setup instructions for my agent"
- **Salesforce Headless 360**: entire product suite rebuilt for agents
- **Journey Kits**: agent-discoverable workflow installation

New product categories will emerge that agents need but humans never did.

### Animals vs Ghosts

Karpathy argues AI models are not animal intelligences -- they're "ghosts":

- No intrinsic motivation, curiosity, or fun
- Shaped entirely by data and reward functions
- Understanding this distinction helps you use them more competently
- Despite this, threatening models (per Sergey Brin) does seem to improve performance -- an unexplained phenomenon

### Taste and Judgment

- Karpathy believes nothing fundamentally prevents models from learning taste -- labs just haven't been incentivized to RL for aesthetics
- Berman disagrees -- he hopes taste remains a human domain
- Current AI-generated code works but is "bloaty, copy-paste heavy, with awkward abstractions"
- If AI solves taste, "we really are not needed anymore"

### The Closing Quote

"You can outsource your thinking but you can't outsource your understanding."

Even with powerful AI agents, you still need to fundamentally understand what you're building and why. The human becomes the bottleneck of knowing what to build, why it's worth doing, and how to direct the agents. Understanding is the irreducible human contribution.

## Actionable Takeaways

1. **Build for agents, not just humans** -- installation, onboarding, and documentation should be agent-consumable
2. **Focus on non-verifiable domains** if building a startup -- verifiable domains will be owned by the labs
3. **Learn agentic engineering** -- orchestration and taste are the new high-value skills
4. **Don't bet against end-to-end neural nets** -- the bitter lesson keeps proving true
5. **Understand what you outsource** -- you can delegate thinking but not understanding
