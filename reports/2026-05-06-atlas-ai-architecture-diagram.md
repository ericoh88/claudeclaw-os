# Atlas AI Architecture Diagram

**Date:** 2026-05-06
**Type:** Architecture Documentation
**Format:** Excalidraw diagram (rendered to PNG)
**File:** `/home/rhino/video-projects/atlas-architecture.excalidraw`

## Overview

A hub-and-spoke architecture diagram of the Atlas AI system, created in Excalidraw with a dark background (#0a0a1a) and neon-colored nodes. The diagram was rendered via Kroki.io (SVG) + ImageMagick (PNG conversion) and sent to See Weng Lung's WhatsApp.

## Architecture Components

### Core (Center)
- **Claude AI Core** by Anthropic - the central intelligence engine powering all capabilities

### 7 Satellite Systems

1. **Bot Layer** (Blue #3b82f6) - ClaudeClaw TypeScript application
   - Telegram, WhatsApp, Web Dashboard interfaces

2. **Memory System** (Cyan #06b6d4) - SQLite Database
   - Conversations, Facts, Context persistence across sessions

3. **Open Brain** (Green #22c55e) - Cloud Knowledge Base
   - 9,000+ entries, YouTube video intelligence, Research reports

4. **80+ Skills** (Purple #a855f7) - Modular Capabilities
   - Email, Calendar, Browser automation, Video processing, Outreach

5. **MCP Tools** (Amber #f59e0b) - External Services
   - Web Search, Playwright browser, Exa, GitNexus code intelligence

6. **Multi-Agent Team** (Pink #ec4899) - Specialized Workers
   - Research, Comms, Watch, Content agents running autonomously

7. **Channels** (Teal #14b8a6) - 24/7 Always On
   - Telegram, WhatsApp, Dashboard - persistent service on Mac/Linux

## Technical Notes

- Excalidraw JSON rendered via Kroki.io API (SVG output) then converted to PNG with ImageMagick
- Local Playwright-based renderer (render_excalidraw.py) timed out due to esm.sh module load issues
- An invisible bounds_frame rectangle (opacity 0) was added to prevent viewBox clipping on left/right edges
- Final PNG: 2400x1629, ~700KB
- Sent to WhatsApp via Evolution API (no caption on media, text sent separately)

## Context

Created for Eric's school friend See Weng Lung (+65 9755 3823) during a demo session where Atlas introduced itself and explained its architecture. Part of a series including a 15-second intro video and NotebookLM infographics.

Built by Naventic AI.
