# Learnings & Gotchas

Accumulated deployment lessons from building and debugging ClaudeClaw integrations. Updated as new issues are encountered and resolved.

---

## LiveKit Voice-to-Voice (2026-05-21)

### 1. LiveKit `--node-ip` is mandatory for Tailscale/VPN access
LiveKit auto-detects the server's IP for WebRTC ICE candidates. On a multi-interface machine (LAN + Docker bridges + Tailscale), it picks the wrong one (e.g. `192.168.100.31` instead of the Tailscale IP `100.105.94.83`). The phone connects via Tailscale and can't reach the LAN IP, so WebSocket signaling works but audio never arrives.
**Fix:** `livekit-server --dev --bind 0.0.0.0 --node-ip $(tailscale ip -4)`

### 2. Browser must explicitly attach audio tracks
LiveKit client SDK v2 does NOT auto-play received audio. Without a `TrackSubscribed` handler that calls `track.attach()`, audio packets arrive at the WebRTC layer (server logs show 0% packet loss, EXCELLENT quality) but are silently discarded by the browser.
**Fix:** Add `room.on(RoomEvent.TrackSubscribed, ...)` with `track.attach()` + `el.play()` for Mobile Safari.

### 3. Orphan Python processes steal job dispatch
When killing a Python livekit-agents process with `kill -9`, its multiprocessing children (forkserver, spawn, resource_tracker) survive as orphans. They reconnect to a new LiveKit server and register as ghost workers. The job dispatcher sends work to the ghost (which does nothing) while the real agent sits idle.
**Fix:** Kill the full process tree: `pkill -f multiprocessing.resource_tracker; pkill -f multiprocessing.spawn; pkill -f multiprocessing.forkserver`

### 4. ElevenLabs plugin expects `ELEVEN_API_KEY` env var
The LiveKit ElevenLabs plugin looks for `ELEVEN_API_KEY`, not `ELEVENLABS_API_KEY`. If your env uses a different name, pass `api_key=` explicitly in the TTS constructor.

### 5. HTTPS required for microphone on mobile
`navigator.mediaDevices.getUserMedia()` is undefined over plain HTTP on Mobile Safari and Chrome Android. Tailscale certs + Caddy reverse proxy is the simplest HTTPS solution.

### 6. Caddy proxies HTTP/WS only, not UDP
WebRTC audio flows over UDP port 7882 directly between phone and LiveKit server. Caddy handles only signaling (WebSocket :8443) and the frontend page (:8765). The UDP media path bypasses Caddy entirely and must be directly reachable via Tailscale.

### 7. LiveKit Agents v1.5 API changes
- Use `AgentServer()` + `@server.rtc_session` decorator, not `cli.run_app(entrypoint)`
- `agent_state_changed` event: use `getattr(ev, 'state', None)` as attribute names changed
- `ElevenLabs TTS`: parameter is `model=` not `model_id=`

### 8. Google Gemini Live model names are unstable
`gemini-2.5-flash`, `gemini-2.0-flash-live-001`, `gemini-2.0-flash-exp` all failed for `bidiGenerateContent`. Google API key also had a spending cap (429). OpenAI Whisper + GPT-4o is more reliable.

### 9. `livekit-server --dev` uses `devkey`/`secret` as API key/secret
No config file needed for development. Token generation must use these same credentials.

---

*Add new sections here as more integrations are built and debugged.*
