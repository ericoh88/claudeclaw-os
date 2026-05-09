# Vibe Coders Just Gifted You A 6-Figure Career

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=RRJaLUJEG5Q
**Duration:** 05:59

## Summary

- Zen argues that "AI Security Engineer" is an overlooked, high-paying career created directly by the vibe coding explosion -- someone has to secure what non-technical founders and vibe coders ship.
- The core tension: 41% of code is now AI-generated, but 40-70% of AI-generated code contains serious security vulnerabilities. Shipping speed far outpaces security coverage.
- Three real-world breach examples anchor the argument: the Tea dating app (72K images leaked), EnrichLead SaaS (Stripe account emptied 2 days after launch), and a scan of 2,000 vibe-coded sites finding API keys exposed in frontend code.
- Three reasons to pursue this path: massive talent gap (5M+ unfilled cybersecurity jobs), serious compensation ($152K average, $280K+ top), and it's future-proof -- more AI adoption means more attack surface.
- Skills needed: security fundamentals (threat modeling, pen testing, risk assessment) + basic LLM knowledge + AI-specific attack techniques (prompt injection, data poisoning, model extraction). Study OWASP Top 10 for LLM Applications 2025 to get started.

## Key Points

1. **The vibe coding security gap is real and growing.** 84% of 30M+ developers now use AI coding tools (up from 44% a couple years ago). 41% of all code written is AI-generated or AI-assisted. But Stanford found that AI-assisted developers produced *more* security bugs than manual coders -- and were *more confident* their code was secure. Citation: Perry et al., "Do Users Write More Insecure Code with AI Assistants?", CCS '23.

2. **Breach examples cited:**
   - **Tea app** (women-only dating platform): 72,000 private user images leaked including government IDs. Basic security failure. Dated July 28, 2025.
   - **EnrichLead** (SaaS built entirely in Cursor): Hackers got into Stripe, refunded all customers, emailed the leaked user list. Founder shut down. Two days after launch.
   - **Escape Platform research (Oct 29, 2025)**: Scanned 2,000+ vibe-coded websites, found API keys sitting in frontend code. 10% of 1,600+ Lovable-built apps were leaking user data (names, emails, financial info).

3. **The talent gap is the opportunity.** Nearly 5 million unfilled cybersecurity jobs globally. But traditional security is the easier gap to fill -- AI security is where almost nobody qualifies. Over a third of security teams cite AI as their biggest skills gap. Fewer than a third have anyone with real AI expertise. WEF (Global Cybersecurity Outlook 2025) found only 14% of organizations feel confident they have the talent they need.

4. **Compensation is serious.** ZipRecruiter data (Dec 2023): Average AI Security Engineer salary $152K, top earners $280K+. At frontier labs (OpenAI, Anthropic): $400-600K total comp. Zen frames this as the top of a market with lots of room to grow into.

5. **Three skill sets to combine:**
   - **Security fundamentals:** threat modeling, penetration testing, risk assessment. If you're already in security, you're halfway there.
   - **AI/ML conceptual knowledge:** understand how LLMs process prompts and generate code -- not deep neural net math, just enough to understand *how* they produce insecure output.
   - **AI-specific attack techniques:** prompt injection, data poisoning, model extraction. This is genuinely new knowledge that most existing security engineers lack.
   - **Starting resource:** OWASP Top 10 for LLM Applications 2025 (published November 18, 2024).

6. **The role is future-proof because of the direction of the trend.** Every vibe-coded app that ships is another attack surface. More AI adoption = more need for AI security engineers. "You're not competing with AI. You are securing what AI creates."

7. **Why it's underrated:** The title lacks glamour compared to "AI researcher" or "vibe coder". The job is breaking things and finding holes, not building products. Zen says this is exactly why the supply of candidates is thin and demand is high.

## Tools, People & Concepts Mentioned

- **Tools:** Cursor (AI coding IDE), Replit (mobile AI coding interface), OWASP Top 10 for LLM Applications 2025
- **Companies/Products:** Tea app, EnrichLead, Lovable, Escape Platform, Semafor, OpenAI, Anthropic, World Economic Forum, Stanford, ISC2, ZipRecruiter, CNBC, Andreessen Horowitz
- **Concepts:** Vibe coding, AI security engineer, prompt injection, data poisoning, model extraction, threat modeling, penetration testing, risk assessment, attack surface

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:01 | Hook: vibe coding works until it breaks -- Tea app breach example |
| 00:27 | Introduces "AI Security Engineer" as the career opportunity |
| 00:39 | Industry stats: 30M+ devs, 84% use AI tools, 41% of code is AI-generated |
| 01:05 | Stanford study: AI-assisted devs produce MORE security bugs, yet feel MORE confident |
| 01:43 | EnrichLead case study: Cursor-built SaaS hacked in 2 days |
| 02:03 | Escape Platform scan: 2K vibe-coded sites with API keys in frontend |
| 02:53 | Reason 1: Talent gap -- 5M unfilled cyber jobs, 14% of orgs feel confident |
| 03:33 | Reason 2: Compensation -- $152K avg, $280K+ top, $400-600K at frontier labs |
| 03:54 | Reason 3: Future-proof -- more AI = more attack surface |
| 04:22 | Skill set breakdown: security fundamentals + AI/ML knowledge + AI attack techniques |
| 05:18 | OWASP Top 10 for LLM Applications as starting resource |
| 05:29 | Why the role is underrated: not glamorous, you break things not build them |
| 05:48 | CTA: AI engineering roadmap in description |

## Visual-Only Insights (not in transcript)

- **Tea app article is from "Cyber Security News"** dated July 28, 2025 -- frame 3 shows the byline "BY DEEBA AHMED" and confirms it's specifically "Tea App Breach: Women Only Dating Platform Leaks 72K User Images". The article text confirms users who joined before February 2025 were affected.

- **Exact salary slide figures:** The on-screen slide (frame 48) shows "Average Salary $152K / Top Earners $280K+" sourced to ZipRecruiter, December 2023. The transcript rounds to "$150,000 and up."

- **The stat "0.39 MILLION"** appears on a dark blue card (frame 40) -- likely the figure for unfilled AI-specific security roles globally, contrasting with the broader "5 million unfilled cybersecurity jobs" stat.

- **+ 29 Million SOFTWARE DEVELOPERS WORLDWIDE** (frame 10) is sourced to Andreessen Horowitz analysis, October 2025 with the note that estimates range 27M-47M. Transcript says "30 million plus" which rounds this.

- **Cursor demo (frame 25)** shows the actual Cursor IDE UI with a "Guest-Agent" popup using **gpt-4-32k** (not Claude) to assist with a PyTorch MNIST training script. The task management panels show items like "Pytorch MNIST Experiments" and "Enterprise Order Management" in progress.

- **Replit mobile interface** shown in frames 46 and 53 -- frame 53 specifically shows a prompt being typed: "Create an electron|" (cursor mid-word), reinforcing that even mobile users are shipping with AI code.

- **Semafor article (frame 30)** about Lovable specifically ("The hottest new vibe coding startup may be a sitting duck for hackers" -- with "sitting duck for hackers" highlighted in yellow). Dated May 29, 2025. Author: Reed Albergotti, Tech Editor at Semafor.

- **Escape Platform article (frame 28)** titled "Methodology: How we discovered over 2k high-impact vulnerabilities in apps built with vibe coding platforms" by three authors (Nohe Hinniger-Foray, Gwendal Mognier, Alexandra Charikova), dated Oct 29, 2025.

- **OWASP Top 10 for LLM Applications 2025 document cover** shown in frame 71 -- versioned as "Version 2025, November 18, 2024, OWASP PDF v0.9.0". This is a specific, actionable starting resource.

- **3D LLM visualization** in frame 64 shows a striking perspective grid of glowing white circles labeled "Large Language Model" -- appears as a B-roll cut while Zen explains the conceptual AI knowledge needed.

- **Stanford study presented as a document** (frame 17) -- styled like an aged paper/academic parchment with highlighted text: "AI-assisted developers produced more security bugs and were more confident their code was secure." Full citation shown: "Perry et al., 'Do Users Write More Insecure Code with AI Assistants?', CCS '23."

- **WEF stat formatted as a highlighted quote** (frame 45): "Only 14% of organizations confident they have the cybersecurity talent they need" -- sourced to "World Economic Forum Global Cybersecurity Outlook 2025."
