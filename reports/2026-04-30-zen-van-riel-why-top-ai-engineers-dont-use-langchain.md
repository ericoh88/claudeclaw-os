# Why Top AI Engineers Don't Use LangChain

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=uR_lvAZFBw0
**Duration:** 11:45
**Transcript source:** captions

## Summary

- Successful AI companies skip frameworks like LangChain — Octtomind dropped it after 12 months and their code got simpler and cheaper
- The core argument: agents are just Python for-loops that call LLM APIs directly; frameworks abstract this away but teach you the wrong mental model
- Video demos a "Super AI Transcript" app that processes meeting transcripts using a 3-tool agent — no framework, raw API calls via OpenRouter + Claude Sonnet 3.5
- The agentic loop has three phases: (1) LLM selects tools to call, (2) Python validates and executes them, (3) LLM summarizes what was done
- Key mental model: LLMs output instructions, Python executes them — the LLM never runs code

## Key Points

1. **Framework critique backed by Anthropic data:** The video opens citing Anthropic's "Building effective agents" post (Dec 19, 2024): "Consistently, the most successful implementations are simple, composable patterns rather than complex frameworks." Octtomind is named explicitly — dropped LangChain, code became simpler and cheaper.

2. **LLMs are language engines, not code executors:** The central thesis. The LM receives a system prompt + user content + a JSON tool spec, and returns structured text. Python parses that text, validates parameters, and runs the actual function. The LM never touches I/O directly.

3. **The agentic loop is a for-loop:** Not a complex orchestration graph. Python sends context to LM → LM returns tool selection → Python calls tool → Python sends result back to LM → repeat until done. A research agent calling 10 URLs is the same loop.

4. **Three-phase pattern demonstrated live:**
   - Phase 1 (`_select_tools`): Call LLM with system prompt + transcript + tool definitions → get back JSON with chosen tool(s) and parameters
   - Phase 2 (`_execute_tools`): Iterate tool calls, validate inputs, run Python functions (create .ics file, write incident report .md)
   - Phase 3 (`_generate_summary`): Call LLM again with tool execution results → get human-readable summary for the user

5. **Strong model required:** Small/local models struggle because tool definitions consume significant context. Zen uses Claude Sonnet 3.5 via OpenRouter, noting OpenRouter lets you swap models without rewriting code.

6. **Multi-tool calls in one turn:** The incident transcript demo shows the LLM selecting two tools simultaneously — `generate_incident_report` AND `create_calendar_reminder` — based on transcript content. Python handles them sequentially.

7. **Python as safety layer:** Error handling, input validation, and safety checks all live in the Python `execute` method of each tool class. Nothing AI about it — just a Python object you can inspect and test.

8. **Framework danger:** LangChain and similar tools abstract the for-loop away, making engineers think the system is smarter than it is. Understanding that it's "just a for loop with JSON function calls" is framed as the key insight separating the top 10% of AI engineers.

## Tools, People & Concepts Mentioned

- **Tools/Frameworks:** LangChain (criticized), OpenRouter, Claude Sonnet 3.5 (Anthropic), MCP servers (briefly), Whisper (transcription via Groq)
- **Services:** Google Calendar API (mentioned as extension point)
- **Files/Code:** agent.py, calendar_tool.py, incident_report_tool.py, generate_summary.py — available in a free repo linked in description
- **People/Orgs:** Anthropic, Octtomind
- **Concepts:** Agentic loop, tool calling, structured output, ICS calendar format, system prompt, OpenAI-compatible API standard

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | Anthropic "Building effective agents" post shown on screen as evidence |
| 00:35 | Live demo of "Super AI Transcript" app — audio recording + text paste UI |
| 01:00 | Shows agent result: calendar reminder created from project planning transcript |
| 01:37 | Whiteboard diagram introduced — Python ↔ LM tool-calling flow |
| 02:40 | Key clarification: "The LM is not able to call any code or execute it on its own" |
| 04:43 | "The agentic loop. Really just a for loop of the diagram on the whiteboard." |
| 05:25 | Code walkthrough begins — split view of app UI + terminal logs |
| 05:42 | Explains Claude + OpenRouter choice |
| 06:01 | Second demo — incident response transcript (two tools called at once) |
| 06:19 | Shows full JSON payload sent to LLM API — tools array visible in terminal |
| 07:23 | "LLM selecting two tool calls" — generate_incident_report + create_calendar_reminder |
| 07:49 | Phase 2 tool execution walkthrough in code |
| 08:14 | Opens calendar_tool.py — shows `execute` method creating .ics content |
| 09:34 | Phase 3: summary generation — system prompt for human-friendly output |
| 10:29 | "Python is your control center for these agent systems" — core mental model |
| 10:39 | Addresses AI safety misconception: "It's not the LM going rogue — it's the Python code executing instructions" |
| 11:10 | Final argument for skipping frameworks |

## Visual-Only Insights (not in transcript)

- **Anthropic post shown verbatim on screen** at 00:00: The exact quote used is from "Building effective agents" (Dec 19, 2024) — visible as an overlay card. This is more specific than what the voiceover conveys; Zen is citing it as authoritative justification.

- **App name is "Super AI Transcript"** — never said aloud in the video. The UI also includes an audio recording mode (hold 'R' to record) and file upload (MP3, WAV, M4A, OGG, WEBM) — neither mentioned verbally.

- **Terminal shows 3 registered tools at startup:** `create_calendar_reminder`, `generate_incident_report`, `create_discord_board` (later appears as `create_decision_record` in the JSON — possible naming inconsistency in the codebase).

- **Tool definition JSON is fully readable on screen:** Including the `meeting_type` enum values for the calendar tool: "standup", "planning", "brainstorm", "client_call", "status_update", "retrospective". The `create_decision_record` tool description is also visible: "Use this tool when the transcript describes Architectural decisions (strategic product decisions, feature priorities, framework choices, design patterns)...".

- **Phase 3 system prompt visible in full:** "You are a helpful assistant explaining what you did with a transcript. Write a friendly, concise summary (2-4 sentences)... Don't use technical jargon like 'tool_calls' or 'agent' — just explain what you did." This is a deliberate UX decision to hide agent mechanics from end users.

- **Model in terminal logs:** `anthropic/claude-sonnet-3-5` explicitly shown. Also `Whisper model 'base.en' loaded` — local Whisper for the audio transcription path.

- **File structure shown in VS Code:** `backend/agent.py`, `backend/tools/calendar_tool.py`, `backend/tools/incident_report_tool.py`, `backend/generate_summary.py`, `frontend/` — clean separation of concerns.

- **Incident report saved as timestamped .md file:** Terminal log shows `20231129_173925_Payment_Processing_Complete_Outage.md` — the tool writes local markdown files, not just UI output.

- **ICS file has action items baked in:** The calendar tool generates a `.ics` with 6 action items parsed from the incident transcript, timestamped for next-day follow-up (2023-11-21 in the demo).

- **Speaker's background:** Minimalist home office with a small bonsai tree and large leafy plant — consistent through all face-cam segments. Suggests deliberate aesthetic choice for the channel.
