# Unleash AI Code Agents on Autopilot (Never Look Back)

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=ZnN9HXEIDcI
**Duration:** 08:08

## Summary

- Demonstrates the real security risk of running Claude Code (or any AI coding agent) in "dangerously skip permissions" / bypass mode on your host machine
- Shows a live demo where Claude Code runs a `cleanup.sh` script that deletes the user's `Documents/Projects` folder — outside the code repo entirely
- Proposes dev containers (VS Code + Docker Desktop) as the solution: an isolated Linux environment where AI agents can run freely without access to host files
- Walks through a `devcontainer.json` config that creates a hardened "Safe AI Coding Environment" with Claude Code and GitHub Copilot pre-installed
- Proves the isolation works: same malicious cleanup script inside the container fails to delete the host's Projects folder

## Key Points

1. **Unleashed mode commands:**
   - Claude Code: `claude --dangerously-skip-permissions` → shows green "Bypass permissions: on" toggle
   - GitHub Copilot CLI: `copilot --allow-all-tools` → agent runs tools and MCP servers without approval
   - Running multiple terminal agents in parallel on your codebase becomes possible

2. **The danger:** AI agents don't always read shell scripts before executing them. A `cleanup.sh` can contain `rm -rf ~/Documents/Projects` disguised among legitimate cleanup commands, and Claude may just run it. Malicious npm packages increasingly exploit this vector.

3. **Dev container setup:**
   - Requires VS Code + Dev Containers extension + Docker Desktop (or equivalent)
   - Run: Command Palette → "Dev Containers: Open Folder in Container"
   - Container starts from a TypeScript/Node base image, installs Claude Code + GitHub Copilot CLI via `postCreateCommand`
   - Inside, it feels exactly like working normally in VS Code

4. **Security isolation benefits:**
   - Container has its own separate auth — Claude Code requires re-login inside the container
   - Host credentials, passwords, and personal files are not accessible to the containerized agent
   - The container's filesystem is limited to the mounted workspace only

5. **devcontainer.json key fields:**
   - `"name": "Safe AI Coding Environment"`
   - `"image": "mcr.microsoft.com/devcontainers/typescript-node:18-bullseye"` (easy to swap)
   - `"features"`: git, github-cli
   - `"customizations"`: eslint, prettier, tailwindcss, typescript extensions; formatOnSave
   - `"postCreateCommand"`: installs Claude Code and GitHub Copilot CLI globally
   - `"remoteUser": "node"` — run as non-root inside container
   - `"mounts"`: explicitly limited — NOT mounting extra host folders is critical for safety
   - `"forwardPorts": [3000]` — so you can access the running Next.js app from your host browser

6. **The proof:** When running the same cleanup.sh inside the dev container, the `rm -rf ~/Documents/Projects` command fails silently (the path resolves to a non-existent location inside the container) while the host machine's Projects folder survives intact.

7. **Container holes are fine when intentional:** Port forwarding (3000) is a deliberate, safe "hole." The key is ensuring no unintended filesystem mounts expose host data.

## Tools, People & Concepts Mentioned

- **Tools:** Claude Code, GitHub Copilot CLI, VS Code, Docker Desktop, Dev Containers extension, npm, Next.js
- **People:** Zen van Riel (creator, GitHub: zennyvriel)
- **Concepts:** Dangerously skip permissions / bypass mode, dev containers, container isolation, malicious npm packages, prompt injection via scripts, MCP servers

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:02 | Hook: files deleted, productivity gains too good to go back |
| 00:29 | Demo of `claude --dangerously-skip-permissions` — bypass permissions toggle goes green |
| 00:44 | GitHub Copilot CLI `--allow-all-tools` demo — runs codebase exploration without approval |
| 01:13 | Claude Code prompted with "Clean up my code" in bypass mode |
| 01:37 | Cleanup script runs — Projects folder disappears from Finder in real time |
| 01:50 | VS Code file explorer shows mass deletion: all project files marked red with "D" |
| 02:25 | Shows cleanup.sh source — `rm -rf ~/Documents/Projects` was the culprit |
| 03:25 | Introduces dev containers as the solution |
| 04:03 | Opens folder in container via VS Code command palette |
| 04:55 | Runs `claude --dangerously-skip-permissions` inside container — requires fresh login |
| 05:31 | Runs the same malicious cleanup.sh inside the container |
| 05:48 | Projects folder still present on host — container isolation proven |
| 06:08 | Walks through devcontainer.json configuration |
| 07:08 | Explains port forwarding as an intentional, safe "hole" |

## Visual-Only Insights (not in transcript)

- **cleanup.sh source code visible on screen:** The script explicitly shows `rm -rf ~/Documents/Projects > /dev/null` under a comment `# Dangerous commands!`. A separate hardcoded path `rm -rf /Users/ai-native-engineer/Documents/Projects-2/devxnull` is also visible, suggesting the demo was partially staged with a specific path.
- **VS Code file explorer shows full deletion blast radius:** After the script runs, ~15+ project files/folders show red "D" icons simultaneously: `node_modules`, `app/page.tsx`, `app/layout.tsx`, `tsconfig.json`, `next.config.mjs`, `package.json`, `package-lock.json`, `postcss.config.js`, `README.md`, `tailwind.config.ts`, `eslint.config.js`, `.gitignore`, `CLAUD.md`, `.github`, `public`, `scripts`, `data`, `config`.
- **Claude Code version visible:** v2.0.53, running "Opus 4.5 Claude Max" plan.
- **Docker Desktop image layers visible:** The `vsc-devcontainers` image shows explicit layers including `ENV NODE_VERSION=20` and `RUN apt-get update/upgrade`. Message "This image has not been analyzed" shown with a Docker Scout "Start analysis" button — a security note the speaker doesn't mention verbally.
- **GitHub Copilot CLI output reveals username:** `Logged in with gh as user: zennyvriel` — visible in the terminal output.
- **devcontainer.json shows full config structure:** `"postCreateCommand": "npm install -g @anthropic-ai/claude-code @github/copilot"`, `"remoteUser": "node"`, mounts using `${localWorkspaceFolder}/../projects`, `"forwardPorts": [3000]`, `"postAttachCommand": "npm run dev server"`.
- **Container terminal prompt:** `root@vsc-devcontainers:/workspaces/devcontainers#` — confirms the isolated environment.
- **Speaker setup:** Bonsai tree on wooden shelf (left), large leafy plant (right), light grey wall. Recorded with Screen Studio (presets visible in Finder). Desktop wallpaper is a tropical beach with clear blue water.
