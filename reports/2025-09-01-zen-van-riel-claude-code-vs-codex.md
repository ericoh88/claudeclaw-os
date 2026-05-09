# The Truth Behind Comparing Claude Code VS Codex (Opus 4.6, GPT 5.3)

**Date:** 2025-09-01
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=9nBpIz6RIWk
**Duration:** 12:04

## Summary

- Zen van Riel compares Claude Code vs OpenAI's Codex CLI using a demo auction app in Python and Java with an intentionally-introduced bug: auction status assigned to an unused local variable instead of the auction object, so buyout never closes the auction.
- He feeds both tools the identical vague prompt and lets them run, showing that non-determinism makes direct tool comparisons meaningless — same prompt, same model produces different behavior each run.
- Both tools independently find and fix the bug (different search strategies, same end result), but Claude Code misses a secondary edge case in the Python fix on the second run, proving the point.
- Core message: stop tool-hopping every 3 weeks. Pick one AI coding tool, master it, and learn how to prompt it — that's what separates senior AI-native engineers from vibe coders.

## Key Points

1. **The comparison setup** — Demo app supports Python and Java auction backends with a $200 start / $260 buy-now / $25 min-increment auction. The bug: both backends assign `AuctionStatus.CLOSED` to a local variable `status` instead of `auction.status` (Python) or `auction.setStatus()` (Java), so the auction never closes on buyout.

2. **Models used** — Claude Code set to Opus (`claude-opus-20240229`); Codex set to GPT-4 high (`gpt-4-turbo-2024-04-09`). The video title's "Opus 4.6, GPT 5.3" is aspirational/clickbait framing, not the actual models.

3. **Different search strategies, same destination** — Claude Code searched with simpler patterns (`buyout`, `auction.close`) and went to Java first. Codex used an extremely broad regex (`buyout|buy_now|buyNow|buyNowPrice|buyPrice|instantBid|instantBuy|reserve_price|closeAuction|auto_close`) and went to Python first. Both found the right files.

4. **Both tools fixed the core bug** — Added an `if` condition checking if bid amount >= buy-now price, then properly set `auction.status = AuctionStatus.CLOSED` (Python) / `auction.setStatus(AuctionStatus.CLOSED)` (Java). Both also added `logger.info` logging for the buyout event.

5. **Non-determinism caught on camera** — Running the same prompt a second time, Claude Code changed its approach significantly: focused on Python business logic first, placed more emphasis on different backends. Same prompt, meaningfully different execution path.

6. **Remaining bug in second run** — Claude Code's second Python fix properly checked the buy-now condition but still failed to actually change `auction.status` in the `place_bid` path — the `status` variable remained unused. The fix was incomplete. This wasn't a knock on Claude Code specifically; Codex would have done the same given non-determinism.

7. **The actual point** — These tools are competitive feature-for-feature. Benchmarking them with single-run tests is meaningless. What matters is knowing your tool well enough to guide it, catch its errors, and understand what it's actually changing. That's a developer skill, not a tool selection problem.

8. **Advice** — Pick one tool, commit to mastering it, re-evaluate every few months rather than jumping on each new release. Zen says he'll wait a few months before reconsidering Codex CLI.

## Tools, People & Concepts Mentioned

- **Tools:** Claude Code, OpenAI Codex CLI, VS Code, Git, Maven (Java), pytest (Python), yt-dlp (implicitly)
- **People:** Zen van Riel (presenter)
- **Concepts:** Non-determinism in LLMs, AI-native engineering, prompt engineering, vibe coding, tool comparison bias, buyout auction logic, AuctionStatus state machine

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 0:00 | Intro — heated Reddit debates comparing Claude Code vs Codex |
| 0:26 | Demo app walkthrough — Python/Java auction with buy-now bug demonstrated live |
| 1:25 | Bug explanation — `status = AuctionStatus.CLOSED` assigns to local var, not `auction.status` |
| 2:30 | Both tools started with identical prompt: "The buyout price option does not seem to work..." |
| 4:00 | First run results — both tools find and fix the bug (Java first for Claude Code, Python first for Codex) |
| 7:30 | Code diff comparison — fixes shown side-by-side in git view |
| 9:00 | Second run — different search behavior with same prompt demonstrates non-determinism |
| 10:14 | Remaining bug caught — Claude Code's second Python fix is still incomplete |
| 11:16 | Core message: master one tool instead of chasing every new release |

## Visual-Only Insights (not in transcript)

- **Reddit post content visible at 0:05**: r/ClaudeCode post titled "Lots of posts praising Codex lately. As title says, are these comments and posts legit?" — 49 upvotes, 59 comments. Sets up the video's premise without reading it aloud.
- **Codex model selection menu visible at frame 17**: Options listed were "Default (Claude models)", "GPT-4 high (current)", "GPT-4 low", "GPT-3.5 high", "GPT-3.5 low", "Open Plan Mode". The video title implies GPT-5 but GPT-4 turbo is what was actually used.
- **IDE red dot markers on buggy lines before AI ran**: Both `business_logic.py` line 100 and `AuctionService.java` line 170 had red dot indicators (likely IDE "unused variable" warnings), visually confirming the bug before the AI tools even touched it.
- **Exact diff visible in frames 42-47**: `-status = AuctionStatus.CLOSED` → `+auction.status = AuctionStatus.CLOSED` plus an added `if` block checking buy-now price — the minimal correct fix was just one character change (`auction.`) plus adding the condition guard.
- **Claude Code plan panel visible (frame 41)**: Shows a structured "Update plan" with checkboxes: "Fix Python buy-now status assignment", "Auto-close on bid >= buy-now", "Apply same fixes to Java backend". Claude Code displayed this before executing — Codex did not show equivalent structured planning UI.
- **Codex security prompt (frame 56)**: A "Do you trust the files in this folder? 1. Yes, proceed / 2. No, exit" dialog appeared mid-session — a friction point not mentioned verbally.
- **Both tools attempted to run tests and failed** (frames 50-52): `mvn test -Dtest=AuctionServiceTest` → `[ERROR] No such file or directory` and `python -m pytest test_auction_service.py` → same error. Neither tool verified its fixes with passing tests — something worth noting when evaluating real-world reliability.

## Saved to
reports/2025-09-01-zen-van-riel-claude-code-vs-codex.md
