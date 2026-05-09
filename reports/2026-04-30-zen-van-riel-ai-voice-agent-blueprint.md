# The Complete AI Voice Agent Blueprint

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=kU4L-JXq9sM
**Duration:** 08:46

## Summary

- Demonstrates why most AI voice agents fail in real life: they get stuck in infinite loops when users go off-script
- Introduces a **moderator pattern** where a second LLM continuously monitors the conversation and injects coaching into the primary AI voice agent
- Live demo uses a customer satisfaction survey agent (Azure GPT-Realtime) with a frustrated customer trying to derail it
- The moderator breaks the loop by sending structured `<MODERATOR_GUIDANCE>` tags with a checklist status, coaching instruction, and a verbatim prompt the agent can speak
- Shares full working code at the end with three prompt files: `agent_persona.md`, `moderator_instructions.md`, `survey_checklist.md`

## Key Points

1. **The core problem:** AI voice agents loop indefinitely when users deviate from the expected script. The longer the conversation, the more the LLM loses track of its system prompt (attention drift toward recent context).

2. **The moderator pattern:** A second LLM that sits outside the main conversation loop. It has clean access to the system prompt + rolling transcript (last 400 turns). Every turn, it produces a structured coaching message injected into the voice agent's context via `<MODERATOR_GUIDANCE>` tags.

3. **Three-part moderator output:**
   - **Checklist:** states current gap vs survey completion (e.g., "Missing pain_point and suggestion")
   - **Coach:** explains the micro-goal with empathy guidance (e.g., "Acknowledge downtime, confirm as pain point, then ask for improvement")
   - **Prompt:** verbatim phrase the agent can speak directly to the customer

4. **Shared system prompt:** Both the voice agent and the moderator receive `survey_checklist.md` appended to their prompts. This is the "ground truth" both reference, preventing drift.

5. **Why this matters for LLMs:** System prompts live at the start of context. In long conversations, the model pays less attention to them. The moderator re-anchors the agent every turn by injecting fresh structured guidance that appears near the end of context (high attention zone).

6. **Implementation:** Python backend with a `PromptBuilder` class that loads three markdown files and assembles them into a `PromptBundle`. The `survey_checklist.md` is programmatically appended to both the agent persona and moderator prompt. ChecklistKeys track: greeting, rating, highlight, pain_point, suggestion, closing.

7. **The demo interaction:** Customer gives a score of 2, complains about service downtime, refuses to answer positive experience question, demands to talk to a human. Without the moderator the agent loops on "positive experience." With moderator, it pivots to: "It sounds like service downtime has been the main frustration. What's one concrete change that would make things better?"

## Tools, People & Concepts Mentioned

- **Tools/Platforms:** Azure GPT-Realtime (voice agent backend), VS Code, Python
- **Concepts:** AI moderator pattern, context attention drift, system prompt injection, checklist-driven conversation, `MODERATOR_GUIDANCE` tags, PromptBuilder, survey state machine
- **People:** Zen van Riel (creator)
- **Resources:** Sample application code linked in video description, AI native engineering community

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:02 | Intro: why AI voice agents break in real life |
| 00:56 | Introduces the moderator design pattern |
| 01:28 | Live demo begins — AI voice agent starts customer survey |
| 01:53 | Customer gives score of 2, complains about downtime |
| 02:05 | Agent incorrectly pivots to "positive moment" — sets up the loop problem |
| 02:34 | Zen mutes himself mid-demo to explain what just happened |
| 02:39 | Explains the infinite loop failure mode in real time |
| 03:04 | Moderator kicks in — agent successfully pivots to pain point |
| 03:18 | Explains the three moderator outputs (checklist, coach, prompt) |
| 04:14 | Whiteboard diagram begins |
| 04:21 | Draws the AI agent loop (person ↔ AI Voice Agent) |
| 05:11 | Adds AI Moderator diamond to the diagram |
| 05:56 | Explains attention drift / why system prompts lose weight over time |
| 06:35 | Code walkthrough begins in VS Code |
| 07:13 | Shows `moderator_instructions.md` — output envelope format |
| 07:53 | Shows `survey_checklist.md` — the shared ground truth |
| 08:07 | Shows `prompt_builder.py` — how survey_checklist is appended to both prompts |
| 08:25 | Outro: links to code + community |

## Visual-Only Insights (not in transcript)

- **UI status indicators:** The live demo app shows a 3D sphere that changes color in real time: gray = "NO ONE IS SPEAKING", green = "AI IS SPEAKING", blue = "YOU ARE SPEAKING." This visual feedback loop is not mentioned verbally but makes the turn-taking dynamics immediately clear.

- **App header shows "azure - gpt-realtime"** as the model backend when live — confirming Azure's GPT-4o Realtime API is powering the voice agent.

- **Moderator panel content visible in frames 21-39:** The exact coaching the moderator produced during the demo is legible: "Missing pain_point and suggestion; customer already hinted at downtime frustration — need explicit capture and improvement idea." / Coach: "Acknowledge their downtime comment, confirm it as the pain point, then ask for a concrete improvement suggestion." / Prompt: "It sounds like service downtime has been the main frustration — what's one change that would make things better?"

- **Whiteboard tool used is Excalidraw-style** (visible toolbar with diamond, circle, arrow, freehand tools). The diagram is drawn live: stick figure → "AI Voice Agent" circle → bidirectional loop arrows → "AI Moderator" diamond (with dotted vertical lines below indicating its "silent" nature) → "System Prompt" circle (shared, fed to both agent and moderator).

- **VS Code shows `prompt_builder.py` with full Python code:** The `PromptBundle` dataclass and `PromptBuilder` class with singleton-style `_self_bundle` caching are fully visible. Key line highlighted: `persona = f"{persona_text}{appended_checklist}"` — showing the exact concatenation pattern.

- **Git commit popup visible at frame 63-64:** Shows initial commit was 18 hours before recording (October 4th, 2024, 11:06 PM) — meaning this was built recently and presented quickly.

- **Book in background:** "AI Engineering" book visible on shelf behind the speaker throughout the talking-head segments.

- **Agent name is "Ava the Survey Host"** — visible in `agent_persona.md` but never mentioned verbally. The agent has a persona with a name.
