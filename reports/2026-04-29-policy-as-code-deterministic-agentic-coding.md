# Policy as Code: Getting Deterministic Results from Non-Deterministic AI Coding Agents

**Date:** 2026-04-29
**Topic:** Agentic coding governance, deterministic control, Claude Code hooks
**Context:** Research into Ben Fellows (LoopQA) "scripted agentic" philosophy + broader industry convergence

---

## The Core Problem

Agentic coding tools (Claude Code, Cursor, Codex) are non-deterministic. Same prompt, different results every run. The question: how do you get reliable, repeatable outcomes from an inherently probabilistic system?

## Three Emerging Camps

### 1. Harness Engineering (Birgitta Bockeler / Thoughtworks)

Wrap the non-deterministic agent in deterministic controls:
- **Feedforward guides** (CLAUDE.md, linters, architecture rules) constrain the agent BEFORE it acts
- **Feedback sensors** (tests, type checkers, CI) catch mistakes AFTER
- The agent is the "wild" middle layer sandwiched between deterministic guardrails

### 2. Policy-as-Code Governance (Vectimus, Microsoft Agent Governance Toolkit)

Intercept every tool call the agent makes and evaluate it against Cedar/OPA policies deterministically BEFORE execution:
- Same input = same decision, every time
- No LLM involved in policy evaluation
- Tools: Vectimus (Cedar-based), Microsoft Agent Governance Toolkit (zero-trust + sandboxing)

### 3. Scripted Agentic (Ben Fellows / LoopQA methodology)

Define the workflow deterministically (YAML pipelines, step-by-step scripts), let AI handle each individual step:
- The SEQUENCE is deterministic
- The execution within each step is non-deterministic
- Reproducibility at workflow level even though individual outputs vary

## Ben Fellows Assessment

- **Who:** CEO of LoopQA, QA testing services company (human engineers, not a SaaS tool)
- **Channel:** @benfellowsloop on YouTube (currently 404/down), "Claude Code for QA Engineers" series
- **LinkedIn tagline:** "Augmented Coding. Scripted Agentic. QA Vet."
- **Philosophy:** "Stop vibing. Script your agent workflows. Review the output like a senior engineer would review a junior's PR."
- **Selling something?** No. LoopQA sells QA services, not a framework or tool. He's sharing methodology.
- **Core insight:** You don't let the AI decide WHAT to do, you tell it what to do step-by-step, and let it figure out HOW.

## The Four-Layer Determinism Stack

| Layer | When | What | Example |
|-------|------|------|---------|
| 1. Feedforward | Before agent acts | CLAUDE.md, skills, prompts | "NEVER modify dashboard-html.ts" |
| 2. Orchestration | Controls flow | Deterministic step sequencing | YAML pipelines, mission-cli delegation |
| 3. Policy Gates | Intercepts actions | Deterministic tool-call evaluation | PreToolUse hook blocks `rm -rf` |
| 4. Feedback | After agent acts | Tests, linters, type checks | CI pipeline rejects bad output |

No single layer gives determinism. All four together give **practical determinism** -- not identical outputs every time, but reliably correct outputs every time.

## Implementation: Claude Code PreToolUse Hooks

Claude Code has a native hooks system. Define in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{
          "type": "command",
          "command": "python3 /path/to/policy-gate.py"
        }]
      }
    ]
  }
}
```

The policy gate script receives tool name + arguments as JSON on stdin. Exit 0 = allow. Non-zero = BLOCK.

### Example Policy Gate (Python):

```python
import json, sys, re

BLOCKED_PATTERNS = [
    r'rm\s+-rf',
    r'npm\s+publish',
    r'git\s+push\s+--force',
    r'DROP\s+TABLE',
    r'store/.*\.db',
]

PROTECTED_FILES = [
    'src/dashboard-html.ts',
    'src/dashboard.ts',
    '.env',
    'store/',
]

data = json.load(sys.stdin)
tool = data.get('tool_name', '')

if tool == 'Bash':
    cmd = data['tool_input'].get('command', '')
    for pattern in BLOCKED_PATTERNS:
        if re.search(pattern, cmd, re.IGNORECASE):
            print(f"BLOCKED: matches policy rule '{pattern}'")
            sys.exit(2)

if tool in ('Write', 'Edit'):
    path = data['tool_input'].get('file_path', '')
    for protected in PROTECTED_FILES:
        if protected in path:
            print(f"BLOCKED: {path} is protected")
            sys.exit(2)

sys.exit(0)
```

## ClaudeClaw Current State

**What exists:**
- PIN lock, kill phrase, exfiltration guard, MCP allowlist, rate limiting, timeouts
- A hook system in `src/hooks.ts` (message lifecycle only, never wired up)

**What's missing:**
- Zero visibility into tool calls between `query()` and result
- SDK runs with `permissionMode: 'bypassPermissions'`
- No PreToolUse/PostToolUse interception
- No tool-level audit trail in DB

**Integration path:** Add `.claude/settings.json` hooks at project level. Every agent session inherits them. No code changes to agent.ts or orchestrator.ts needed.

## Key Insight

The non-deterministic model isn't the problem. The lack of deterministic structure AROUND it is. All credible practitioners are converging on: **deterministic orchestration + non-deterministic execution + deterministic validation.**

---

## Sources

- [Harness Engineering - Martin Fowler/Thoughtworks](https://martinfowler.com/articles/harness-engineering.html)
- [Vectimus - Deterministic AI Agent Governance](https://github.com/vectimus/vectimus)
- [Microsoft Agent Governance Toolkit](https://github.com/microsoft/agent-governance-toolkit)
- [Building a C Compiler with Parallel Claudes - Anthropic](https://www.anthropic.com/engineering/building-c-compiler)
- [Beyond AI Vibes: Deterministic Foundations](https://speedscale.com/blog/beyond-ai-vibes-deterministic-foundations-agentic-coding/)
- [TestGuild Podcast - Ben Fellows](https://testguild.com/podcast/automation/a558-ben/)
- [From Policy as Code to Agentic Governance](https://www.altimetrik.com/blog/policy-as-code-agentic-governance-ai-first-enterprise/)
