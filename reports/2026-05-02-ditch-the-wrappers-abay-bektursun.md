# Ditch the Wrappers: How to Unlock the True Power of AI Agents

- **Source:** https://youtu.be/EcrXY_7tCuk
- **Speaker:** Abay Bektursun
- **Duration:** 1:20:12
- **Format:** Live talk/workshop with audience Q&A, slides, and live coding demo
- **Date watched:** 2026-05-02

## Summary

Abay Bektursun, a neural network researcher with over a decade of experience, gives a talk arguing that the real leverage in AI comes from using raw LLMs (Claude Code, Codex terminal, OpenCode) rather than wrapper products (Lovable, Harvey, etc.) that pollute context and degrade intelligence. His central thesis: **protect the context of the LLM -- that's the highest leverage move.** Everything sold on top of AI clutters context and makes models quadratically worse due to the attention mechanism's scaling properties.

## Key Points

### 1. AI as the ultimate leverage (0:00-5:00)
- References Naval Ravikant's four leverages: labor, capital, code, media
- AI now gives you ALL four -- you no longer need permission for any of them
- One person cured his dog's cancer using AI (AlphaFold + ChatGPT to design mRNA vaccine) -- the hardest part was government approval, not the technical work
- Abay uses AI to manage his health/fitness (built an app called "Fuel OS"), achieved 14% body fat and fixed blood work issues

### 2. Your mental state matters when using AI (5:00-10:00)
- LLMs are trained via RLHF -- they're approval-seeking rather than truth-seeking
- AI reflects YOUR state: negative mindset = negative outputs, positive/opportunity-seeking mindset = better results
- Anthropic has published research on "emotion vectors" -- AI has encoded patterns of emotional reactivity from training data
- Claude is slightly more truth-seeking than ChatGPT due to how Anthropic tweaked RLHF
- Abay invested heavily in optimizing his own state (3 years traveling, Buddhist meditation, martial arts, Ironman) because it directly impacts AI output quality

### 3. CORE THESIS: Protect the LLM's context (15:00-28:00)
- **"If you take away only one thing: highly effective AIs have very clean context"**
- Attention mechanism scales quadratically -- each added token creates exponential difficulty increases
- Effective context length is ~40k-100k tokens even when models claim 1M+
- Wrapper companies (Lovable, Harvey, etc.) clutter context with their own tooling, features, and system prompts
- These wrappers also get deprioritized/throttled tokens at higher premiums -- they must dumb down models
- Harvey (AI law firm) will eventually lose to lawyers using Claude/ChatGPT directly
- The labs themselves will release better vertical solutions using the data wrappers collect for them

### 4. Only three tools matter (20:00-30:00)
- **Claude Code** -- best because Anthropic symbiotically tunes the harness AND the model together
- **Codex terminal** (OpenAI) -- also good
- **OpenCode** -- hooks into any model
- Everything else is "absolute fluff" and waste of money
- $200/mo Claude Max subscription burns ~$5,500/mo in actual compute -- massively subsidized by VC
- Abay calculated he was spending ~$60k/month in token value across subscriptions
- GitHub Copilot moving to usage-based pricing signals the subsidy era is ending

### 5. Practical Claude Code features demonstrated (29:00-42:00)
- **CLAUDE.md** -- project memory that self-accumulates
- **Skills** -- reusable context modules (writing style, tech diligence, caveman token compression)
- **MCP/Plugins** -- connecting to external tools (Google Calendar, etc.)
- **Sub-agents** -- parallel agents with their own clean context (good for read-only research tasks)
- **Loop/Schedule** -- autonomous agents that check in periodically (e.g., monitoring GPU jobs every hour)
- **Rewind** -- going back in history to clean dirty context (he demonstrated adding "draw a cat" then rewinding it)
- **Dangerously skip permissions** -- he runs with full auto-approve because Claude is smart enough

### 6. Live demo: Meeting prep dossier agent (50:00-78:00)
- Built a meeting prep agent live during the talk
- Gave it browser access via Chrome's headless debugging feature (Playwright)
- Agent used his LinkedIn to research "Mandy Hong" -- scraped her profile, Instagram, GitHub
- Generated a dossier markdown file, then converted it to a "Cancun beachy" styled HTML page
- Key technique: give AI access to YOUR browser (already logged in) rather than its own bot browser -- avoids bot detection
- Same technique powers his Reddit agent that does Hormozi-style lead gen for Fuel OS

### 7. Skills philosophy (39:00-42:00, 76:00-78:00)
- He crafts his own skills iteratively -- doesn't use third-party skills (security risk)
- AI writing skill: studied Shakespeare, great writers, what makes AI writing bad (em dashes, clicheees), built a style guide
- Used this writing skill for cold emails to secure $40k+ in GPU credits and $5k from Modal
- Skills should be designed FOR YOUR workflow, not pulled from marketplaces

### 8. Investment alpha / AI industry stack (47:00-50:00)
- Showed a slide of "companies the world depends on" in the AI stack
- Track the TALENT (named specific researchers like Christopher Olah) -- where talent goes, intelligence follows
- OpenAI secured ~$30B compute; DeepMind designs own chips (TPUs now used by Anthropic); Meta doing custom ASIC designs
- Next wave: robotics and physical intelligence -- self-driving cars are just the beginning
- OpenAI lost users to Anthropic because they tried baking ads into LLMs, then released GPT-5.5 as course correction

### 9. Miscellaneous tools mentioned
- **Whisper Flow** -- voice-to-text that strips filler words, runs locally
- **Granola** -- meeting recording/transcription service
- **Whoop** -- HRV/health data tracking
- **Chrome headless debugging** -- the key trick for giving AI real browser access without bot detection

## Timestamps

| Time | Topic |
|------|-------|
| 0:00 | Intro, mRNA cancer cure story |
| 2:27 | Personal health results from AI |
| 3:00 | Naval's 4 leverages + AI as 5th |
| 5:00 | Your mental state affects AI output |
| 6:30 | How LLMs are trained (RLHF, attention) |
| 8:00 | AI safety and danger discussion |
| 10:00 | Optimizing state through meditation/fitness/nutrition |
| 12:45 | Fuel OS app -- nutrition tracking |
| 13:30 | TikTok agent that auto-posts nutrition research |
| 14:30 | Reddit agent using Hormozi principles for lead gen |
| 15:30 | **CORE: Protect the LLM context** |
| 19:30 | AI subsidized by VC -- $200/mo = $5,500 in compute |
| 21:00 | Only 3 tools: Claude Code, Codex, OpenCode |
| 22:00 | Abay's AI research wins (OpenAI parameter golf #1 and #2) |
| 24:00 | Audience Q&A on context management |
| 28:30 | Claude Code features overview slide |
| 32:30 | Context management demo (rewind, clean context) |
| 38:00 | How Claude Code project directories work |
| 39:00 | Skills demo -- writing guidelines |
| 42:45 | Live build: meeting prep dossier agent |
| 47:00 | AI industry investment stack |
| 50:30 | Live coding the dossier agent |
| 57:20 | Why Claude Code over chat interfaces |
| 58:00 | Computer-use/ClaudeBot discussion |
| 59:00 | Browser access demo (Playwright + Chrome) |
| 67:00 | MCP vs API discussion |
| 69:00 | Dossier demo results -- LinkedIn research |
| 73:00 | HTML dossier with Cancun theme |
| 76:00 | Skills philosophy -- craft your own, don't pull third-party |
| 79:55 | Wrap up |

## Visual-Only Insights

- Setting is a cozy, well-lit hotel or co-working lounge with arched doorways -- intimate group of ~10-15 people seated around the speaker
- Abay presents from a standing desk with his laptop, large TV screen behind him
- His custom terminal (forked from Ghostty) has a distinctive blue theme
- The "Claudi" agent orchestration tool he built has a clean sidebar showing multiple agent tabs
- Around 1:10:00, the video recording was lost briefly ("Video lost during this part sorry :(")
- The Fuel OS TikTok and Reddit agent screenshots show real engagement and positive user responses
- The AI industry stack slide is a detailed table tracking compute deals, talent, and chip strategies across OpenAI, Anthropic, DeepMind, Meta, and xAI

## Actionable Takeaways

1. Use Claude Code / Codex terminal / OpenCode directly -- stop paying for wrappers
2. Keep LLM context surgically clean -- only feed what's relevant to the task
3. Use /rewind and /compact to manage context hygiene during sessions
4. Build your own skills iteratively rather than importing third-party ones
5. Give agents access to YOUR browser via Chrome headless debugging for authenticated scraping
6. Use sub-agents for parallel read-only tasks to keep main agent context clean
7. Set up loop/schedule for autonomous monitoring tasks
8. Your mental state matters -- approach AI work with clarity and positive intent
9. Invest in the AI stack companies (compute + talent are the moats)
10. The subsidy window is closing -- maximize your usage now while tokens are cheap
