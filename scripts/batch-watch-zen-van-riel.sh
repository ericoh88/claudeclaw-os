#!/bin/bash
# Batch transcribe Zen Van Riel YouTube videos
# Runs each through the watch pipeline with 90s delay between jobs
# Created: 2026-04-30

PROJECT_ROOT=$(git -C /home/rhino/claudeclaw-os rev-parse --show-toplevel)
LOG="/tmp/zen-van-riel-batch.log"

VIDEOS=(
  "https://youtube.com/watch?v=aEL384kTznk|I Quit My GitHub Job Because AI Breaks Software"
  "https://youtube.com/watch?v=1mix7WnuEK0|I Replaced My AI Server With A Browser Tab (WebGPU 2026 Setup)"
  "https://youtube.com/watch?v=5Z2HBJTUNik|Why You Should Bet Your Career on Local AI"
  "https://youtube.com/watch?v=ibg2QJPCKQ8|Why So Many AI Startups Are Lying"
  "https://youtube.com/watch?v=pr9fsrK8nmQ|The Ultimate Local AI Tier List For 2026"
  "https://youtube.com/watch?v=3zSANOIBHYw|The Unbeatable Local AI Coding Workflow (Full 2026 Setup)"
  "https://youtube.com/watch?v=hl2LqZz1bO8|Don't Lose Your Engineering Career To AI"
  "https://youtube.com/watch?v=S5QlsnIcogs|Become The Product Engineer Companies Hire On Day One"
  "https://youtube.com/watch?v=fp_mecPRKxs|Go Fullstack This Year Before AI Replaces You"
  "https://youtube.com/watch?v=1npq8zDPJQA|Don't Waste 2026 Competing Against PhDs (MLOps vs ML Engineer)"
  "https://youtube.com/watch?v=RRJaLUJEG5Q|Vibe Coders Just Gifted You A 6-Figure Career"
  "https://youtube.com/watch?v=wudNmLHcZeE|Why Everyone's Switching to Linux for Local AI"
  "https://youtube.com/watch?v=W45XJWZiwPM|Run Multiple Claude Code Agents Without Git Conflicts (Vibe Kanban)"
  "https://youtube.com/watch?v=YlCkX6PROyk|The Most Underrated Engineering Role in 2026"
  "https://youtube.com/watch?v=NBibgD7I48w|I Added Unlimited Image Generation To Claude Code (Nano Banana)"
  "https://youtube.com/watch?v=lffYEu5MhSQ|Claude Code Just Got The Ultimate Dev Shortcut (LSP Explained)"
  "https://youtube.com/watch?v=0WWedfT2AUA|Why Real Engineers Won't Be Replaced By AI"
  "https://youtube.com/watch?v=s0mbV0XIzWg|How To Dominate 2026 as a Software Developer"
  "https://youtube.com/watch?v=cqDQV5g7zHo|Don't Waste 2026 on the Wrong Career (ML vs AI Engineer)"
  "https://youtube.com/watch?v=ZnN9HXEIDcI|Unleash AI Code Agents on Autopilot (Never Look Back)"
  "https://youtube.com/watch?v=uR_lvAZFBw0|Why Top AI Engineers Don't Use LangChain"
  "https://youtube.com/watch?v=WUo5tKg2lnE|The Simple AI Project To Get You Hired In 2026"
  "https://youtube.com/watch?v=nYDUdnMVDdU|AI Coding Without Rate Limits Is Finally Here (Local Claude Code)"
  "https://youtube.com/watch?v=rp5EwOogWEw|The Ultimate Local AI Coding Guide For 2026"
  "https://youtube.com/watch?v=kU4L-JXq9sM|The Complete AI Voice Agent Blueprint"
  "https://youtube.com/watch?v=dBebGUgiz34|Learn Faster with an AI Knowledge Graph in Obsidian"
  "https://youtube.com/watch?v=WmS9_m5n1kU|This AI Coding Trap Destroys Your Productivity"
  "https://youtube.com/watch?v=9hW9UViNzdE|The Git Workflow That Fixes Broken Code"
  "https://youtube.com/watch?v=9nBpIz6RIWk|The Truth Behind Comparing Claude Code VS Codex (Opus 4.6, GPT 5.3)"
)

TOTAL=${#VIDEOS[@]}
echo "$(date) - Starting batch transcribe: $TOTAL Zen Van Riel videos" | tee "$LOG"
echo "---" | tee -a "$LOG"

for i in "${!VIDEOS[@]}"; do
  IFS='|' read -r URL TITLE <<< "${VIDEOS[$i]}"
  NUM=$((i + 1))

  echo "$(date) - [$NUM/$TOTAL] Processing: $TITLE" | tee -a "$LOG"
  echo "  URL: $URL" | tee -a "$LOG"

  # Create mission task for watch agent (or self-execute if no agent)
  node "$PROJECT_ROOT/dist/mission-cli.js" create \
    --agent watch \
    --priority 5 \
    --title "Watch: Zen Van Riel - $TITLE" \
    "Watch this video and run the full pipeline (frames + transcript, no exceptions). Source: zen-van-riel. Save report to reports/ and Open Brain under youtube/ai/zen-van-riel. URL: $URL" \
    2>&1 | tee -a "$LOG"

  echo "  Task created at $(date)" | tee -a "$LOG"

  # Wait 90 seconds between each (unless last video)
  if [ $NUM -lt $TOTAL ]; then
    echo "  Waiting 90s before next video..." | tee -a "$LOG"
    sleep 90
  fi
done

echo "---" | tee -a "$LOG"
echo "$(date) - Batch complete. $TOTAL tasks queued." | tee -a "$LOG"
echo "Check progress: node $PROJECT_ROOT/dist/mission-cli.js list" | tee -a "$LOG"
