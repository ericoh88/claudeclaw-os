# ClaudeClaw TODO

## Video Knowledge Base: Matt Pocock
- [ ] Process 23 Matt Pocock agentic engineering YouTube videos through watch pipeline
- [ ] Videos cover: Claude Code skills, agentic dev phases, context windows, plan mode, worktrees, TDD with AI, frontend AI, codebase prep, /init alternatives
- [ ] Full list in conversation history (2026-05-02) -- last 50 pulled via yt-dlp
- [ ] Save each as: markdown report + Open Brain entry
- [ ] Limit: ~23 agentic videos first, TypeScript ones later if wanted

## Watch Agent Rework
- [ ] Current watch agent (headless scheduler) is unreliable -- sits idle, tasks don't get processed
- [ ] Evaluate replacing with a skill that spins up a subagent/worktree per video
- [ ] Look into Wave Video or similar tools as part of the pipeline
- [ ] Ensure new approach can batch-process videos without killing main agent context
