# Agent in a Box - Product Spec (Discovery Phase)

**Date:** 2026-05-22
**Product:** Agent in a Box
**Company:** Naventic AI
**Users:** Eric Oh, Cliff, Ivan (all partners, all with full access including deploy)

## What It Is

A standalone web dashboard on Denzel for onboarding clients who want their own AI agent (Hermes) and managing the full lifecycle of deployed agents. Not a personal dev tool - this is Naventic AI's client-facing operations platform.

## Tech Stack

- Hono + Preact (lightweight, single container on Denzel)
- Docker socket for container management
- Reads/writes vault.env and YAML manifests from ~/hermes-deploy/
- Wraps deploy-hermes.sh for actual deployments

## Pages

### 1. Login
- Simple auth (username + password or PIN)
- Three accounts: Eric, Cliff, Ivan
- All three have full access including deploy

### 2. Fleet Dashboard (home)
- Live grid of all running agent containers
- Each card shows: name, owner, client name, status (healthy/unhealthy/stopped), uptime, dashboard port, Telegram bot username, days remaining on trial
- Quick actions per card: restart, stop, start, logs, open Hermes dashboard
- Expired/expiring agents flagged with alert badge
- Alert goes to whoever created that bot

### 3. New Onboarding (wizard - 6 stages)

**Stage 1: Contact Lookup**
- Search by name or phone number
- Hits Open Brain contacts database
- Pulls up their record if they exist

**Stage 2: Generate WhatsApp Template**
- Dashboard generates a pre-filled WhatsApp message asking client for their desired agent/bot name
- Copy button for manual forward to client's WhatsApp
- Eric, Cliff, or Ivan manually forwards

**Stage 3: Key In Bot Name**
- Client replies via WhatsApp with their bot name
- Partner manually keys it into the dashboard
- Dashboard stores it against the onboarding record

**Stage 4: Generate BotFather Instructions**
- Dashboard generates a SECOND template with step-by-step @BotFather instructions
- Copy button for manual forward
- Client creates the bot on Telegram, copies the token, sends it back via WhatsApp

**Stage 5: Key In Bot Token**
- Partner manually keys in the bot token from client's reply
- Partner assigns bot address/ID (Eric controls this)

**Stage 6: Review & Deploy**
- Set trial duration (default 1 week)
- Review full summary
- One-click deploy (wraps deploy-hermes.sh)

### 4. Onboarding Tracker
- List of all onboardings in progress
- Shows which stage each client is at: waiting for bot name / waiting for token / ready to deploy / live / expired
- Who initiated it (Eric/Cliff/Ivan)
- Resume any onboarding where you left off

### 5. Credential Vault
- View/edit vault.env (masked values, reveal on click)
- Add/update credentials
- "Refresh all agents" button after changes (restarts containers to pick up new env)
- Shows which agents use each credential

### 6. Manifest Manager
- List all YAML manifests in ~/hermes-deploy/manifests/
- View/edit any manifest
- Create new manifest from template
- Shows deployed vs undeployed status

### 7. Container Logs
- Per-agent log viewer (docker logs with follow)
- Filter by severity / search
- Quick link from fleet dashboard

### 8. Settings
- Manage users (Eric/Cliff/Ivan)
- Default trial duration
- Alert preferences (who gets notified on agent expiry)

## Lifecycle Management

- Each agent has a start date and optional expiry date (e.g. 1 week trial)
- Dashboard sends alert to the partner who created the bot when trial expires
- Does NOT auto-stop - alerts only, partner decides manually
- Ability to extend, pause, or permanently activate

## What the Dashboard Does NOT Do

- Does not auto-send WhatsApp (partners forward manually)
- Does not auto-receive client replies (partners key in manually)
- Does not auto-create bots on BotFather (client does that)

## Integration Points

- **Open Brain contacts API** - contact lookup by name/phone
- **Docker socket** - container CRUD, logs, health
- **deploy-hermes.sh** - actual deployment execution
- **vault.env** - shared credential store
- **~/hermes-deploy/manifests/** - per-agent YAML configs

## Current Fleet on Denzel (as of 2026-05-22)

| Container | Dashboard Port | Status |
|---|---|---|
| ethan-bot | 9118 | Up 41h |
| samadhi-bot | 9119 | Up 41h (healthy) |
| stephanie-bot | 9120 | Up 42h |
| kelly-bot | 9121 | Up 17h (healthy) |

## Next Steps

1. Build Phase 1: Login + Fleet Dashboard + New Onboarding wizard
2. Build Phase 2: Onboarding Tracker + Lifecycle alerts
3. Build Phase 3: Credential Vault + Manifest Manager + Logs + Settings
