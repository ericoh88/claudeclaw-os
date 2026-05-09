# Securing AI Agents with Zero Trust -- IBM Technology

- **Source:** https://youtu.be/d8d9EZHU7fw
- **Channel:** IBM Technology
- **Presenter:** Jeff Crume, Distinguished Engineer, IBM
- **Duration:** 13:32
- **Date:** 2026-05-02

## Summary

Jeff Crume explains how Zero Trust security principles -- originally designed for traditional IT -- need to be extended and adapted for agentic AI systems. Agents don't just think, they act: calling APIs, moving data, spawning sub-agents. Every new capability adds a new attack surface, and Zero Trust provides the framework to contain that risk.

## Zero Trust Principles (Quick Review)

1. **Verify then Trust** -- trust follows verification, never the other way around
2. **Just-in-Time over Just-in-Case** -- give access only when needed, revoke immediately after
3. **Least Privilege** -- only the access rights needed, for only as long as needed
4. **Pervasive Controls** -- security throughout the system, not just at the perimeter (no "hard crunchy outside, soft chewy center")
5. **Assumption of Breach** -- design security assuming the attacker is already inside your system, network, and database with elevated privileges

## Traditional Zero Trust Domains

- **Users** -- IAM, strong authentication, access controls
- **Devices** -- ensure not compromised/jailbroken
- **Data** -- encryption, DLP, prevent unauthorized exfiltration
- **Network** -- encryption in transit, micro-segmentation for isolation

## What Changes with Agentic AI

All the traditional controls still apply, plus:

- **Non-Human Identities (NHIs)** -- agents use many identities, potentially proliferating rapidly. Each needs the same level of control and visibility as human users, maybe more, because they operate autonomously
- **Tool Security** -- tools agents use must be vetted and trusted
- **Data Integrity** -- training data, preference/context data, RAG augmentation data all need protection from tampering
- **Intent Alignment** -- agent intentions must match the original user's intentions

## Agentic System Threat Map

The system has: Sensing (input) -> AI (thinking, augmented by policies/preferences) -> Actions (API calls, data writes, tool use, spawning sub-agents), all driven by credentials.

**Attack surfaces identified:**
1. **Direct prompt injection** -- breaking context via malicious input
2. **Policy/preference poisoning** -- tampering with the data that guides reasoning, or poisoning the training data
3. **Interface interception** -- inserting at any tool/API interface (e.g., MCP call hijacking)
4. **Service attacks** -- targeting individual APIs, data sources, tools, or sub-agents
5. **Credential theft** -- copying credentials, creating new accounts, privilege escalation

## Zero Trust Defenses for Agentic Systems

### 1. Credential Management
- Unique credentials per agent (and per sub-agent)
- Store all NHIs in a controlled vault with dynamic check-in/check-out
- Just-in-Time access, not Just-in-Case
- Never embed credentials in code -- absolute no-no
- Enforce RBAC, strong authentication, dynamic credential rotation

### 2. Tool Registry
- Verified, vetted registry of secure APIs, databases, data sources, and tools
- "Make sure the ingredients are pure" -- only use what's been vetted

### 3. AI Firewall / AI Gateway
- Inspection layer over the entire system
- Checks for improper inputs going to tools
- Detects prompt injections coming in
- Monitors for information leaking out
- Enforcement layer for all agent interactions

### 4. Immutable Logging & Traceability
- All actions logged in tamper-proof logs
- Must be able to trace why the agent did what it did
- Full audit trail for post-incident analysis

### 5. Environment Scanning
- Network scanning tools
- Endpoint scanning tools
- AI model vulnerability scanning -- looking for latent vulnerabilities hiding inside models

### 6. Human-in-the-Loop Controls
- Kill switch capability
- Throttling (e.g., prevent a buying agent from purchasing 1000 items in a minute)
- Canary deployments -- test the agent in a controlled environment before full deployment

## Key Takeaway

"Agentic AI multiplies power and risk. Zero trust gives us the framework to keep that power contained. Every agent must prove who it is, justify what it wants, and earn trust continuously."

## Visual-Only Insights (not spoken)

- The whiteboard diagram progressively builds from a simple Traditional vs Agentic comparison chart to a full architecture diagram showing sensing -> AI brain -> actions with all the security overlays
- Attack vectors are drawn with red/pink X marks and bug icons directly on the architecture diagram, showing exactly where each threat hits
- The credential section shows a document labeled "CREDS" with a large X through it -- visually reinforcing "never embed credentials"
- NHI (Non-Human Identity) and JIT/RBAC labels are written directly on the defense diagram, showing where each control maps to the architecture
- A tool "REG" (Registry) bucket appears on the right side of the diagram
- "HITL" (Human in the Loop) is written prominently on the final defense layer
- The AI gateway/firewall is drawn as a purple box wrapping around the AI brain and its connections -- visual containment
