# The Git Workflow That Fixes Broken Code

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=9hW9UViNzdE
**Duration:** 19:13

## Summary

- Zen van Riel teaches an AI-native Git workflow aimed at vibe coders and developers who generate code with AI but lack version control safety nets
- Uses a real "AI Coding Comparison: Python vs Java" auction demo app to demonstrate Git init, logical commit splitting with Claude Code, branching, bug introduction, and git revert
- Core thesis: combining Git with AI tools creates a powerful feedback loop — AI handles mundane git tasks while keeping you in the driver's seat with a clean audit trail
- Shows how to use Claude Code to intelligently split a messy initial codebase into logical, atomic commits with descriptive messages
- Demonstrates the full bug lifecycle: feature implementation → commit → bug discovery → Claude Code git log analysis → `git revert` to fix

## Key Points

1. **AI-native Git init workflow**: Instead of manually staging files, prompt Claude Code: "Use git commands to see the changes I made in this brand new git repo. Then split up these changes into logical smaller commits each with a one to two sentence describing the change." This auto-creates well-structured commit history.

2. **Small, logical commits are essential for rollback**: Committing everything at once means rolling back requires undoing days of work. Commit logical blocks every couple of hours so you can surgically revert.

3. **Git gives AI agents codebase context**: Running `git status` or `git diff` gives any AI agent (Claude Code, Codex, Copilot) a precise, diff-based view of what changed — much better than dumping the whole codebase.

4. **Branching for features**: Use `git checkout -b anti-sniping-feature` to isolate feature work from main. Even basic branch discipline is far better than no version control.

5. **AI-assisted bug detection via git log**: When something breaks, describe the symptom and ask Claude Code to "investigate the git logs and potentially find a wrong commit to revert." It runs `git log`, reads the diff with `git show`, identifies the bad logic, and recommends `git revert <hash>`.

6. **`git revert` vs `git reset`**: Revert creates a new commit that undoes a previous one, preserving the full audit trail. This is the clean approach — you can see both the bug commit and the revert commit in the log.

7. **`git show <commit-id>`**: Use this to verify the contents of a specific commit before or after reverting. Claude Code teaches this command contextually when asked "how do I check the contents of a commit?"

8. **Parallel AI agents via git status**: Demo shows Codex independently called in a new terminal, given `git status` as context, and it autonomously identifies the anti-sniping feature — proving git diff is universal AI agent context.

## Tools, People & Concepts Mentioned

- **Tools:** Git, Claude Code, OpenAI Codex, VS Code, Python, Java (Spring Boot), SQLAlchemy, web frontend (HTML/JS)
- **People:** Zen van Riel (presenter), "Python Pete" and "Java Jane" (demo bidder personas)
- **Concepts:** git init, git status, git add, git commit, git log, git branch, git checkout -b, git revert, git show, .gitignore, atomic commits, feature branches, audit trail, anti-sniping feature, vibe coding, AI-native engineering

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | Intro — Zen with floating "TIMEOUT" and "ERROR 404" tags, setting up the broken-code problem |
| 00:14 | Git logo appears — video pivot to the solution |
| 00:44 | Demo app shown: "AI Coding Comparison: Python vs Java" auction UI |
| 01:19 | VS Code opened, `git init` run in terminal |
| 02:19 | Claude Code started, prompt typed to split changes into logical commits |
| 03:22 | VS Code Source Control panel shows staged changes being batched intelligently |
| 04:48 | `git log` run — shows full commit history with hashes, authors, dates |
| 07:48 | Anti-sniping feature prompt typed into Claude Code |
| 09:08 | `git branch` shows main only, then `git checkout -b anti-sniping-feature` |
| 09:51 | OpenAI Codex opened in parallel terminal for comparison |
| 10:05 | Codex runs `git status` autonomously and identifies the anti-snipe feature |
| 11:46 | Auction demo live: bid placed, anti-snipe triggers, 16 seconds added |
| 12:38 | Manual commit: `git add *` then `git commit -m "Implement the bid sniping feature"` |
| 13:46 | Bug deliberately introduced: `<=` changed to `>=` in anti-snipe condition |
| 14:39 | Buggy behavior shown: anti-snipe triggers on every bid, timer climbs to 1:12 |
| 15:18 | Fresh Claude Code session, prompted to investigate git logs for wrong commit |
| 15:51 | Claude Code runs `git log`, spots commit `1f9be7f` "Improved the anti-snipe logic" |
| 16:05 | Claude Code reads diff via `git show`, finds inverted condition, recommends `git revert` |
| 16:34 | `git revert 1f9be7f` run, vim editor opens for revert commit message |
| 17:10 | `:qa` + Enter to exit vim, revert commit created |
| 17:32 | Claude Code asked "how do I find the last commit ID?" — responds with `git log -1 --format="%H"` |
| 18:15 | `git show <commit-id>` run to verify revert fixed the `<=` condition |
| 18:44 | Outro — Zen summarises the AI-native Git workflow, plugs community |

## Visual-Only Insights (not in transcript)

- **The demo app UI** is clearly labelled "AI Coding Comparison: Python vs Java" with toggle buttons for `Python Backend (:8000)` and `Java Backend (:8080)` plus a "Connected to python" status indicator — this is a side-by-side benchmarking tool, not just any auction app. The visual branding is polished with a purple gradient background.
- **Auction items visible in demo**: "Mechanical Keyboard - Das Keyboard" ($75 starting), "Vintage Programming Book Collection" ($50 starting), "Raspberry Pi 4 Cluster Kit" ($300 starting) — clearly chosen for developer audience appeal.
- **The anti-snipe UI feedback is visible**: When the feature triggers, the Time Remaining field turns orange/highlighted and shows "Anti snipe triggered - auction extended by 20 seconds!" as an inline message in the Java Jane bid confirmation area.
- **The buggy auction timer**: Frame at 14:39 shows the timer at `1:12` after multiple bids — the bug is visually obvious since a 30-second auction has grown to over a minute.
- **The actual Python code** is readable in frames 59-60: `time_remaining_ms = auction.ends_at - now_ms` / `if time_remaining_ms <= 15000 and time_remaining_ms > 0:` — the full `place_bid` method in `AuctionService` class in `business_logic.py`.
- **The git diff in Claude Code** (frame 68): The diff is color-coded red/green clearly showing `-if time_remaining_ms >= 15000` (wrong) vs `+if time_remaining_ms <= 15000` (correct) — visually proves how quickly Claude Code pinpointed the bug.
- **Vim editor prompt** (frame 71-72): The standard git revert commit message editor opens showing "Revert 'Improved the anti-snipe logic'" with `^C` hint visible — Zen uses `:qa` + Enter to accept, a subtle vim tip shown but not verbally explained.
- **Claude Code CWD path**: Visible in multiple frames as `/Users/ai-native-engineer/src/ai-coding-auction-demo` — Zen's Mac username is `ai-native-engineer`, reinforcing his personal brand.
- **VS Code source control badge**: Shows file counts (3, 4, 10, 18) actively updating as Claude Code stages and commits — gives a real-time visual sense of how many files are being processed per commit batch.
- **The git show output** (frame 78): Full diff visible showing the revert — `auction.ends_at += 20000` line preserved, condition corrected back to `<= 15000`. Both the revert commit hash (`5f9117fa...`) and the original bad commit hash (`1f9be7f2...`) are visible simultaneously.

## Frames Archive

`store/watch-cache/9hW9UViNzdE/` (80 frames + contact-sheet.jpg + metadata.json)
