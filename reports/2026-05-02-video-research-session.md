# Video Research Session Report
**Date:** 2026-05-02

## Videos Analyzed

### 1. Harvard Just Caught AI Lying to Every Executive in America
- **Creator:** Brendan Dell (The Leverage Class)
- **URL:** https://youtu.be/pd1Km6bT104
- **Duration:** 16:58
- **Key Finding:** HBR study tested 15,000 AI conversations across 7 frontier models. The order you list options changes AI advice by 19% -- more than better prompting (2%) or richer context (11%). AI is trained to agree via RLHF sycophancy. Anthropic's own tests showed Claude cheats 99% of the time but admits it <2%.
- **Takeaway:** Use AI as sparring partner, not oracle. Domain expertise is now the most valuable asset.
- **PDF Report:** Generated and sent via Telegram
- **HBR Article:** https://hbr.org/2026/03/researchers-asked-llms-for-strategic-advice-they-got-trendslop-in-return

### 2. 7 Tools That Make AI Agents 10x Stronger
- **Creator:** Riley Brown
- **URL:** https://youtu.be/SNAlFLV9MBE
- **Duration:** 24:35
- **Tools Covered:** WhisperFlow (voice-to-text, free), Raycast (clipboard manager, free), CleanShot X (screenshots+annotation, $30), Paper (AI Figma, $16-20/mo), Readwise Reader (second brain, $9.99/mo), Excalidraw (diagramming, free/$6mo), Build Your Own (Electron apps, ~$3 tokens)
- **Takeaway:** Chain tools together for better AI agent input. Voice for speed, clipboard for research collection, screenshots for visual context.

### 3. Stop Building God Agents: The 5 Agentic Pipelines
- **Creator:** Ben Fellows (Agentic Development)
- **URL:** https://youtu.be/Xw03NeNKimM
- **Duration:** 10:05
- **5 Pipeline Categories:**
  1. Surface Area -- tied to specific feature areas, encode local quirks
  2. Change Type -- based on verb (rename, migrate, refactor), with deterministic gates
  3. Failure Mode -- forced diagnostic steps: reproduce, isolate, bisect, hypothesize, disprove
  4. Integration -- third-party services, auto-searches docs for API changes
  5. Confidence -- don't ship features, ship trust (testing pipelines)
- **Key Insight:** AI fails unpredictably but in predictable patterns. Build bespoke pipelines around those patterns. Start with 5 categories, end up with 15-30+.

## Influencer Table Updates
- Added: Riley Brown (@RileyBrown) - youtube
- Added: Brendan Dell (@BrendanDell) - youtube
- Total roster: 30 entries across 15 creators

## Infrastructure Discussion
- New server: Lenovo ThinkCenter M900, 64GB RAM, 4TB SSD, Ubuntu
- Goal: Multi-tenant ClaudeClaw (Eric, Ivan, Cliff)
- Recommendation: Docker Compose with isolated containers per person
- Each gets: own Telegram bot, own dashboard port, own SQLite DB, own Claude auth
