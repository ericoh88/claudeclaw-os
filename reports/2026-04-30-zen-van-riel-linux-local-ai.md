# Why Everyone's Switching to Linux for Local AI

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=wudNmLHcZeE
**Duration:** 11:44

## Summary

- Linux saves a consistent ~800MB of VRAM vs Windows when running local LLMs — the key reason to switch, not raw speed
- Inference speed difference is only 2-3% (some tests under 1%) — not worth switching OSes for speed alone
- WSL2 is actually *worse* than native Windows for VRAM: uses ~1GB more than native Linux, giving you the worst of both worlds
- Ubuntu is the recommended distro for AI work: NVIDIA drivers and CUDA install cleanly, and it's the target platform for serious production AI tools
- The practical path: get a separate SSD, install Ubuntu on it, dual-boot — Windows stays untouched

## Key Points

1. **The real win is VRAM, not speed.** Across both models tested (Llama 3.1 8B Q4 and Mistral 24B Q4), Linux consistently used ~800MB less VRAM than Windows. The savings were the same regardless of model size, pointing to pure OS overhead — Windows simply reserves more GPU memory for itself.

2. **800MB matters more than it sounds.** On a 16GB card that's 5% of total VRAM. The difference between a model fitting in memory or spilling to system RAM (which causes catastrophic slowdowns). At 60K context, it can be the margin between running and not running.

3. **Context window degradation is severe.** Testing with Llama 3.1 8B at increasing context sizes showed: 10K tokens = 134 t/s, 20K tokens = 93 t/s, 60K tokens = 33 t/s — a 75% performance drop. Most YouTube demos show empty context windows; real agentic AI coding fills them up fast.

4. **Why Ubuntu specifically.** NVIDIA drivers just work, CUDA installs cleanly. More importantly, the serious production AI tools explicitly target Ubuntu: vLLM (production LLM serving), NVIDIA TensorRT (optimized inference), and Lambda Stack (deep learning environment with one-command setup) — all Linux-only or Ubuntu-specific.

5. **Docker-first workflow on Linux.** On Ubuntu, pin specific CUDA versions per project in Dockerfiles rather than polluting the system. Docker runs natively on Linux with no virtualization overhead, unlike on Windows where it requires a hypervisor.

6. **WSL2 does not save you.** Tested and measured: Linux = 6,963MB VRAM, Windows = 7,752MB, WSL2 = 7,962MB. Running Linux inside Windows costs you more VRAM than just Windows alone. Fine for general dev work, not viable for local AI.

7. **Learning Ubuntu builds professional skills.** Production AI infrastructure runs on Linux. AI engineering roles expect Linux experience. Getting VRAM back is the immediate benefit; becoming a better AI engineer is the long-term one.

8. **Test methodology.** RTX 5090 (32GB VRAM), two identical SSDs — Windows 11 on one, Ubuntu 24 on the other, same hardware. GPU warmed up before every test. 100+ benchmarks total. Full benchmark repo with Docker on GitHub (linked in description). Aligned NVIDIA driver and CUDA versions between OSes for fairness.

## Tools, People & Concepts Mentioned

- **Tools:** vLLM, NVIDIA TensorRT, Lambda Stack, Docker, Ollama/llama.cpp (implied inference backend), nvtop (GPU monitor), VS Code
- **Models:** Llama 3.1 8B Q4, Mistral 24B Q4
- **OS:** Ubuntu 24, Windows 11, WSL2
- **Concepts:** VRAM overhead, context window degradation, inference speed vs memory efficiency, GPU VRAM spill to system RAM, Docker containerization for CUDA versioning

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:02 | Intro — Linux wins, but not for the reason you think |
| 00:17 | Key claim: only 2-3% faster, but 800MB VRAM saved |
| 01:18 | Why Ubuntu: chose it because drivers/CUDA just work |
| 02:22 | Test rig: RTX 5090, two identical SSDs, Windows 11 vs Ubuntu 24 |
| 02:50 | Live Linux benchmark demo begins |
| 05:12 | Context stress test starts (10K to 60K tokens) |
| 06:18 | 60K context = 75% performance loss |
| 07:02 | Results summary: 800MB saved consistently across both models |
| 08:28 | Docker-first argument: cleaner dev environment on Linux |
| 09:31 | WSL2 debunked: actually uses more VRAM than Windows |
| 10:18 | Linux-only production tools: vLLM, TensorRT, Lambda Stack |
| 11:00 | Practical path: separate SSD, dual boot |

## Visual-Only Insights (not in transcript)

- **GPU mismatch in live demo.** The speaker's slide (frame 17) and transcript state "RTX 5090 with 32GB VRAM," but the GPU monitor visible during the live benchmark (frames 16, 20-45) consistently shows "NVIDIA GeForce RTX 3090" with 24.0 GiB VRAM. The live demo was likely recorded on a different machine (3090) than the one described as the test rig (5090). The benchmark results themselves were not recorded live.

- **VRAM comparison chart exact numbers (frame 49).** Blue bars = Linux, red = Windows:
  - Llama 8B base: Linux 6,953MB vs Windows 7,792MB
  - Mistral 24B base: Linux 16,164MB vs Windows 16,904MB
  - Llama 8B @ 60K context: Linux 13,636MB vs Windows 14,429MB
  - Mistral 24B @ 60K context: Linux 24,425MB vs Windows 25,249MB

- **WSL2 chart exact numbers (frame 68).**
  - Linux: 6,963MB (Baseline, Best)
  - Windows: 7,752MB (+5-10%)
  - WSL2: 7,962MB (+7-14%, Worst)

- **Speed results slide (frame 55)** labels the speed difference as "Noise, Not Worth Switching For" — the +2.6% difference is visually framed as irrelevant compared to VRAM savings.

- **Context degradation chart (frame 44):** Bar chart titled "Context Window Degradation — Performance Drops 75% As Context Fills Up." Shows 10K=134 t/s (dark grey), 20K=93 t/s (blue), 60K=33 t/s (red). The color coding (grey → blue → red) visually reinforces severity of degradation.

- **Benchmark repo structure visible in VS Code** (frames 26-40): files include `README.md`, `docker_build.sh`, `run_linux.sh`, `run_windows.ps1`, `verify_setup.ps1`, `benchmark_download_llama.sh`, and multiple `farmouse_`-prefixed result folders — these are the saved benchmark output files.

- **GPU ran at ~375W sustained** during benchmarks (often at or slightly over TDP), temperature reached 74-76°C. Memory clock showed "15.0 GiB / 14.0 GiB" — memory usage exceeding the base allocation, visible confirmation of heavy VRAM pressure during 60K context tests.

- **"Linux-Only Tools" card layout (frame 72):** vLLM logo shown in blue text, NVIDIA shown with green logo, Lambda shown with its distinctive black lambda-A logo with red bar.

## Saved

- reports/2026-04-30-zen-van-riel-linux-local-ai.md
- Open Brain (youtube/ai/zen-van-riel)
- Frames archived: store/watch-cache/wudNmLHcZeE/ (80 frames + contact sheet)
