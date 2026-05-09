# L2 Order Flow Monitor — Incident Report

**Date:** 2026-05-02 | **Prepared by:** Atlas (Eric's AI assistant)

---

## What Happened

Eric's L2 order flow monitor on hornbill stopped sending WhatsApp alerts after April 27. The script was running in `watch` mode (a continuous loop), with no cron job backing it. When the process died, nothing restarted it. No alerts have been sent to WhatsApp/email since April 27, 20:30 UTC.

## What Was NOT Affected

Chloe's signal bot on Rescuer (`/home/mouse/tiger-bot/signal_bot.py`) continued running fine the entire time. Her cron is intact — scans every 10 min during market hours, EOD summaries, swing scans — all working. She has a few intermittent Telegram 400 errors but most alerts go through. Tiger API credentials and TotalView subscription are both healthy.

## Root Cause

Eric's monitor was launched manually with `python3 l2-order-flow-monitor.py watch` — a blocking loop. No cron, no systemd service, no process manager. When the process exited (likely OOM, SSH disconnect, or reboot), there was nothing to bring it back.

## Fix Applied (May 2)

Cron jobs installed on hornbill for Eric's monitor:

| Time (ET) | Cron (UTC) | What |
|-----------|------------|------|
| 9:00 AM | `0 13 * * 1-5` | Pre-market scan (always sends alert) |
| 9:30 AM–3:30 PM | Every 30 min | Live scan (alerts on STRONG signals only, score ≥5 or ≤-5) |
| 4:15 PM | `15 20 * * 1-5` | EOD report with PDF |

## Test Scan Results (May 2, 13:21 UTC)

- **ASTS @ $70.89** — STRONG_SELL (-8) | Bid pressure 25%
- **CC @ $27.73** — NEUTRAL (+1)
- **TROX @ $10.33** — NEUTRAL (-2)

Tiger API connected instantly, alerts delivered via WhatsApp + email.

## Current State of Both Systems

| System | Server | Schedule | Sends to | Status |
|--------|--------|----------|----------|--------|
| Eric's L2 monitor | hornbill | Every 30 min (cron) | WhatsApp + email | ✅ Fixed |
| Chloe's signal bot | rescuer | Every 10 min (cron) | Telegram | ✅ Running |

## No Data Lost

All 147 historical scans and 40 alerts from April 23–27 are stored in the SQLite DB at `/home/rhino/claudeclaw/store/l2-orderflow.db`.

## Next Steps

- Monitor first full week of cron operation (starting Monday May 5)
- Consider adding process monitoring/alerting if cron itself fails
- Verify Chloe's Telegram 400 errors aren't losing critical alerts
