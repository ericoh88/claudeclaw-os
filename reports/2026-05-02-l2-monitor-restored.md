# L2 Order Flow Monitor — Restored
**Date:** 2026-05-02 | **Server:** hornbill (Linux/UTC)

## Problem
L2 order flow monitor stopped sending alerts after April 27. Was running in `watch` mode (continuous loop) with no cron fallback. Process died silently.

## Findings
- Script: `/home/rhino/claudeclaw/scripts/l2-order-flow-monitor.py` (1721 lines)
- DB: `/home/rhino/claudeclaw/store/l2-orderflow.db` — 147 scans, 40 alerts, all from April 27
- Tiger API: Still connected and working (tested May 2)
- No cron job existed, no launchd plist, no systemd service
- Chloe (Cliff's agent on Rescuer) has separate bot at `/home/mouse/tiger-bot/signal_bot.py` with her own cron — status unknown

## Fix Applied
Cron jobs installed (weekdays, UTC):
```
0 13 * * 1-5    → Pre-market scan (9:00 AM ET) — always alerts
30 13 * * 1-5   → Market open scan (9:30 AM ET)
0,30 14-19 * * 1-5 → Every 30 min during hours
15 20 * * 1-5   → EOD report (4:15 PM ET) — PDF summary
```

## Test Scan Results (May 2, 13:21 UTC)
- ASTS @ $70.89 — STRONG_SELL (-8) | Bid pressure 25%
- CC @ $27.73 — NEUTRAL (+1)
- TROX @ $10.33 — NEUTRAL (-2)

## Alert Routing
- WhatsApp: Cliff (6596648916) via Evolution API
- Email: ericoh.7388@gmail.com via msmtp

## Log
`/tmp/l2-monitor.log`

## Next Steps
- Verify Chloe's bot on Rescuer (need SSH access)
- Consider adding more symbols to watchlist
- Monitor first full week of cron operation
