# Run Multiple Claude Code Agents Without Git Conflicts (Vibe Kanban)

**Date:** 2026-01-07
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=W45XJWZiwPM
**Duration:** 9:27

## Summary

- Demonstrates **Vibe Kanban**, an open source tool that orchestrates multiple parallel Claude Code agents while eliminating git merge conflicts
- Each agent gets its own git worktree/branch, so they develop features in isolation — parallel work without stepping on each other's files
- The human acts as the review gate: inspect the code diff, add inline review comments (which spawn a new Claude session to fix them), then merge when satisfied
- Uses a Plants vs. Zombies clone as the demo app — three agents built Cherry Bomb, Squash Plant, and a Debug Panel simultaneously
- Merge conflicts still happen (shared registry files), but Vibe Kanban exposes them clearly and Claude can resolve them automatically

## Key Points

1. **The core problem it solves:** Running 10 Claude agents on the same branch causes merge conflicts AND produces code you don't understand. Vibe Kanban fixes both by isolating each task in its own branch and forcing a human review step before merge.

2. **Workflow:** Create task in Kanban → describe spec in detail (spec-driven development) → select model + branch → agent starts → agent works in isolated git worktree → task moves to "In Review" → human reviews the diff → optionally leave inline comments that re-trigger Claude → click Merge → task moves to "Done".

3. **Git worktrees as isolation:** VS Code shows separate branches (`vibe-add-a-cherry-bom`, `vibe-debug-panel-feat`, `vibe-squash-plant`) each tied to a worktree under `/var/tmp/vibe-kanban/worktrees/`. Agents never touch main directly.

4. **Inline code review with AI:** From the diff view, you can click a line and type a comment (e.g. "change the cost to just 100"). Vibe Kanban creates a new Claude Code session, gives it the full conversation history + feature branch context, and it makes the precise change in seconds. Demonstrated live: Cherry Bomb cost changed from 150 → 100 sun.

5. **Merge conflict handling:** When two agents edit the same shared file (the plant registry/constants.ts), rebasing reveals the conflict. You can either resolve it yourself or delegate to Claude Code, which correctly merges both additions side-by-side. The conflict resolution progress is tracked with checkboxes in the UI.

6. **Session persistence:** Vibe Kanban saves the full Claude Code session history for every task — so even if your computer crashes or you close the terminal, the entire agent conversation is retrievable from the Kanban board. This is a significant improvement over native Claude Code terminal history.

7. **Parallelization decision-making:** The key skill is identifying which parts of your codebase can be parallelized (independent feature files) vs. which will conflict (shared registries, config files). The video argues game development maps well to this because each plant is a self-contained module.

## Tools, People & Concepts Mentioned

- **Tools:** Vibe Kanban (open source), Claude Code (Opus 4.5 / Claude Max), Visual Studio Code, yt-dlp, git worktrees, npm/vite
- **People:** Zen van Riel (presenter)
- **Concepts:** Parallel agent orchestration, git worktrees, spec-driven development, human-in-the-loop review, merge conflict resolution, AI code review, Kanban workflow

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 0:00 | Problem statement: running many agents causes merge conflicts + unreadable code |
| 0:23 | Introduces Vibe Kanban as the solution |
| 0:36 | Creates "Add Cherry Bomb" task with detailed spec |
| 1:01 | Starts both Cherry Bomb + Squash Plant agents in parallel |
| 1:02 | Creates Debug Panel task (3rd parallel agent) |
| 1:04 | VS Code shows 3 separate branches being worked on simultaneously |
| 4:41 | Cherry Bomb moves to "In Review" — demonstrates code diff review |
| 5:33 | Adds inline review comment "change the cost to just 100" |
| 6:07 | Claude instantly makes the change in a new session from context |
| 6:56 | Cherry Bomb merged to main, task moves to "Done" |
| 7:08 | Squash Plant rebase initiated — merge conflict revealed |
| 7:48 | Conflict resolution checklist shown; Claude resolves each file |
| 8:10 | Debug Panel hits "branches diverged" error, quick rebase fixes it |
| 8:30 | Debug Panel merged — live demo shows Sun Controls + Zombie Spawner working |
| 8:49 | Squash Plant merged, tested live against a zombie |
| 9:01 | Conclusion: focus is on the workflow, not the toy app |

## Visual-Only Insights (not in transcript)

- **Claude Code version visible in terminal:** `Claude Code v2.0.75`, running `Opus 4.5, Claude Max` — confirms the model tier being used
- **Exact Cherry Bomb constants from the diff:**
  - `COST: 150` → changed to `100` via review comment
  - `COOLDOWN: 30000`, `HEALTH: 300`, `WIDTH/HEIGHT: 70`, `COLOR: '#DC143C'`, `DAMAGE: 1000`, `EXPLOSION_DELAY: 1000`
- **Squash Plant constants from diff:** `COST: 50`, `COOLDOWN: 3000`, `HEALTH: 200`, `WIDTH/HEIGHT: 70`, `COLOR: '#5D4B37'`, `JUMP_SPEED: 400`, `DETECTION_RANGE: 150`
- **PlantType union type change visible:** `entities.ts` diff shows the exact TypeScript line: `export type PlantType = "sunflower" | "peashooter" | "wallnut" | "cherrybomb";` — adding cherrybomb to the union
- **Worktree paths:** `/var/tmp/vibe-kanban/worktrees/<branch-name>/pvz-clone` — confirms Vibe Kanban creates worktrees in `/var/tmp/`, not inside the project
- **Debug Panel UI spec visible in task creation:** The prompt included 3 specific feature groups — Sun Debug Controls (add 100/500 sun), Zombie Spawner (dropdown for type + lane), Plant Cooldown Toggle (disable cooldowns checkbox)
- **Review system model:** When a review comment triggers a new Claude session, the UI shows "Review initiated with model: claude-opus-20240229" — a different/older model identifier than the main sessions
- **Conflict files listed explicitly:** Rebase conflict screen shows 5 conflicting files: `constants.ts`, `entities.ts`, `plants/index.ts`, `Game.ts`, `PlantSelector.ts` — exactly the "shared registry" files predicted
- **Debug panel live numbers:** After merge, Sun counter shows 1150 (user clicked +100 several times), and multiple zombies are visible on-screen being blown up by Cherry Bomb
- **Speaker setup:** Streaming from a Mac (`ai-native-engineer@Mac Vault`), Obsidian vault path visible: `~/Documents/Vault/Vault`
