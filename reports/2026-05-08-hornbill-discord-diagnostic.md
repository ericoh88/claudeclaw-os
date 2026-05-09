# Hornbill Discord Diagnostic & Fix Report
**Date:** 2026-05-08
**Server:** Hornbill
**Service:** ClaudeClaw (Atlas bot)
**Process PID:** 3289923

## Issue

Discord message handling on Hornbill silently stopped working after 16:00 UTC on May 8, 2026. Messages are received by the bot (logged as "Processing Discord message") but never reach the Claude agent. No errors are logged. Telegram continues to work normally on the same process.

## Root Cause

Most likely: `channel.sendTyping()` in discord.ts (line 185) hanging due to Discord REST API degradation. It was an awaited call with no timeout -- a non-resolving promise blocks the handler indefinitely. Since all channels fail (tested 3 channels), it's global, not per-channel.

## Timeline

| Time | Event | Status |
|------|-------|--------|
| 12:24 - 16:00 | Discord working normally | OK |
| 16:00:51 | Last successful Discord response (channel 1502232869227986955) | OK |
| 16:00 - 23:26 | 7-hour gap, no Discord activity | -- |
| 23:26:33 | Discord msg on channel 1494840980078198925 (10 chars) | SILENT FAIL |
| 23:28:18 | Discord msg on channel 1481608803991683104 (2 chars) | SILENT FAIL |
| 23:32:11 | Discord msg on channel 1481608803991683104 (2 chars) | SILENT FAIL |
| 23:32:28 | Telegram msg "Hi" | OK |

## Secondary Issue: Bloated Session

Channel `1481608803991683104` had a **29MB session file** (`03955e03-58ce-4494-bd69-d96afbfcef00.jsonl`, 4,558 lines). Other channels: 33KB and 940KB respectively.

## Affected Discord Channels

| Channel ID | Session ID | Session File Size | Last Modified |
|------------|-----------|-------------------|---------------|
| 1481608803991683104 | 03955e03-... | 29 MB | May 8 15:06 |
| 1494840980078198925 | 0eed88c6-... | 33 KB | May 4 08:36 |
| 1502232869227986955 | 63a8d581-... | 940 KB | May 8 16:00 |

## Code Path Analysis

The code path in `handleDiscordMessage()` (discord.ts) between the "Processing Discord message" log (line 179) and `runAgent()` (line 229):

1. `channel.sendTyping()` (line 185) -- **PRIME SUSPECT** -- awaited with no timeout
2. `buildMemoryContext()` (line 195) -- async, could hang
3. `getSession()` (line 198) -- quick DB read
4. `isSessionJsonlMissing()` / `isSessionPoisonedByOversizedImage()` (lines 202-212) -- file checks

## Fixes Applied

1. **Cleared bloated 29MB Discord session file** + DB mapping for channel 1481608803991683104
2. **Changed sendTyping()** from blocking `await` to fire-and-forget pattern (`channel.sendTyping().catch(() => {})`) to prevent future hangs
3. **Service restarted** -- Discord messages now process and get responses
4. **UNRESOLVED:** "Atlas is typing..." indicator still not showing despite fire-and-forget sendTyping(). Likely a Discord REST API connectivity issue or bot channel permission issue. Needs further investigation.

## Other Code Changes Made This Session

- `src/voice.ts`: ElevenLabs TTS speed reduced to 0.85 (user preference for slower speech)
- `src/bot.ts`: Voice mode now sends both text + voice together when /voice is toggled on (user preference)

## Architecture Reference

- **Hornbill**: Atlas bot (ClaudeClaw-OS) -- Telegram + Discord
- **Rescuer**: Chloe + Suzy (ClaudeClaw) -- Telegram + Discord + legacy OpenClaw
- Service: `systemctl --user claudeclaw.service`
- Session files: `~/.claude/projects/-home-rhino-claudeclaw-os/*.jsonl`

## Rescuer Server Standing Issues

From OpenBrain audit (same day):
- `GOOGLE_API_KEY` blank -- memory ingestion fails silently
- `ELEVENLABS_API_KEY` returns 401
- Chloe service has `Restart=no` -- crashes stay dead
- OpenClaw still running alongside ClaudeClaw (potential conflicts)
