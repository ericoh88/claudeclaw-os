# I Added Unlimited Image Generation To Claude Code (Nano Banana)

**Date:** 2026-04-30
**Channel:** Zen van Riel
**URL:** https://youtube.com/watch?v=NBibgD7I48w
**Duration:** 06:57
**Published:** 2025-12-29

## Summary

- Zen shows how to give Claude Code the ability to generate and edit images on demand using a Python wrapper around Google's Gemini image generation API (branded "Nano Banana" in the video, which is `gemini-2.0-flash-exp` / `gemini-3-pro-image-preview`).
- The repo (`google-image-gen-api-starter`) is free and available via the description link. Claude Code reads a README/CLAUDE.md to understand how to call `main.py` via `uv run`, then autonomously generates images as part of its coding workflow.
- A key feature is **style consistency** via markdown style files (e.g. `styles/blue_glass_3d.md`) that define visual parameters Claude passes to the Python script, producing coherent sets of assets.
- The script supports **image editing with reference** -- pass an existing image and a directive, and only the targeted element changes while the rest stays intact (demonstrated: rocket emoji swapped for checkered flag in a blue glass scene).
- A hard-won **pro tip**: avoid generating complex gradients via AI. Iterative edits on gradient-heavy images degrade quality rapidly (shown visually across 4 iterations of a Python + TypeScript logo). Generate clean iconography first, add gradients later in Canva/Photoshop.

## Key Points

1. **The core mechanic**: `main.py` wraps the Gemini image generation API. Claude Code calls it via `uv run python main.py output.png "prompt" [flags]`. Claude reads the README and figures out the right invocation without being told the script name.

2. **Style system**: Markdown files under `styles/` define a visual language (e.g. `blue_glass_3d.md` specifies translucent blue glass, solid black backgrounds, no gradients, no fog, no flat/sticker appearance). Pass `--style styles/blue_glass_3d.md` and every image generation uses that aesthetic. Style files include a Prompt Template section that gets injected into the Gemini API call.

3. **Image editing (inpainting-style)**: Pass `--edit input.png` to modify a specific element. The script sends both the prompt and the reference image to Gemini, which replaces only what you asked. Works well for single-element swaps; breaks down with complex gradients.

4. **Reference images**: `--ref style.png` tells Gemini to match the visual style of a reference image when generating something new. Supports up to 14 reference images.

5. **Aspect ratio control**: `--aspect 16:9` (or 1:1, 3:4, 4:3, 5:4, 9:16, etc.) for use in different contexts like YouTube thumbnails.

6. **Gradient degradation warning**: Iterative edits on gradient-heavy images cause rapid quality loss. Iteration 1 = slightly grainy. Iteration 2 = logos start to blur. Iteration 3 = basically unusable. Workflow fix: generate clean iconography, composite gradients and text in Canva or Photoshop afterwards.

7. **Extensibility**: Zen suggests converting the repo into a Claude Code skill (callable anywhere) or wrapping it as an MCP server.

## Tools, People & Concepts Mentioned

- **Tools:** Claude Code, Nano Banana (Google Gemini image gen API), `uv` (Python package runner), VS Code, Canva, Photoshop, Git
- **APIs:** `gemini-3-pro-image-preview` (latest at time of recording), `google.generativeai` Python SDK
- **Concepts:** Style templates via markdown, image editing with reference, inpainting, aspect ratio control, gradient degradation, MCP server, Claude Code skills

## Notable Timestamps

| Time | What happens |
|------|-------------|
| 00:00 | Hook: "one thing getting in the way of Claude Code becoming truly amazing -- image generation" |
| 00:26 | First demo: manually run `uv run python main.py output.png "A 3D cube on black background"` -- generates a copper/metallic cube |
| 00:51 | Claude Code demo: drag README into Claude, ask it to generate a cube -- it reads the README and calls the script autonomously |
| 01:51 | Style system introduced -- `blue_glass_3d.md` style file shown |
| 02:10 | Claude generates blue glass style cube -- result matches the style gallery |
| 02:47 | Image editing demo: pass `4.png` (lab equipment + rocket) and ask Nano Banana to replace the rocket with a checkered flag |
| 04:05 | Result shown: `edited_4.png` -- only the rocket replaced, everything else intact |
| 04:35 | Code walkthrough: `main.py` using `gemini-3-pro-image-preview`, `--style`, `--edit`, `--ref` flags |
| 05:06 | Pro tip: avoid gradients. Visual demo of 4-iteration gradient degradation on Python + TS logos |
| 06:19 | Backgrounds folder shown: AI-generated aurora/abstract backgrounds used as base layers |
| 06:44 | Outro: grab the repo, extend to skill or MCP server |

## Visual-Only Insights (not in transcript)

- **GPU image surprise (t=00:05):** The very first screen shown in VS Code is a photorealistic blue neon GPU rendered in the blue glass style -- this is never verbally described but establishes the quality ceiling of the tool immediately.

- **Project file structure (visible in sidebar):** The repo has `showcase/backgrounds/` (4 aurora-style abstract backgrounds), `showcase/examples/` (5 numbered PNGs), `showcase/gradient_degradation/` (4 iteration files + text_degradation subfolder), `styles/blue_glass_3d.md`, `src/video_script.md` (Zen keeps a video script in the repo), `main.py`, `pyproject.toml`.

- **blue_glass_3d.md contents (t=01:55 + t=02:36):** The style file is visible and readable. Key constraints in "What NOT to Include": Gradients, vignettes, fog, environments; More than 3 colors (only blue, cyan, white, black); Circuit board patterns; Flat/sticker appearance. The "With Reference Image" section explains that `--ref` provides the WHAT (shapes), the prompt provides the HOW (style).

- **main.py usage block (t=04:41):** Full CLI reference is visible:
  ```
  uv run python main.py output.png "A minimal 3D cube on solid black background"
  uv run python main.py output.png "a gear icon" --style styles/blue_glass_3d.md
  uv run python main.py output.png "cube" "sphere" "pyramid" --style styles/blue_glass_3d.md
  uv run python main.py output.png "Change the background to blue" --edit input.png
  uv run python main.py output.png "Same style but with a sphere" --ref style.png
  uv run python main.py output.png "Prompt" --aspect 16:9
  ```

- **Claude Code "Welcome back Zen!" greeting (t=01:03):** Claude Code shows rate limit message -- "Your rate limits are 2x higher through 12/31. Enjoy the extra room to think!" -- confirming this was recorded in late December 2025 during a promotional rate limit boost.

- **Gradient degradation sequence (t=05:18-06:02):** Four images are shown side-by-side in the file tree:
  - `01_gradient_added.png`: Python snake + TypeScript "TS" logos in clean blue glass, solid black bg
  - `02_first_iteration.png`: Blue glass logos with a soft teal/purple gradient added -- already slightly grainy at edges
  - `03_second_iteration.png`: More colorful gradient, logos visibly blurring, Python snake losing definition
  - `04_third_iteration.png`: Heavy rainbow-gradient bg, logos severely degraded and low-resolution, TypeScript text becoming unreadable dots

- **Aurora backgrounds (t=06:26):** The `showcase/backgrounds/` folder contains AI-generated abstract backgrounds in dark teal/blue aurora style -- clearly intended to be composited under the generated icons in Canva or Photoshop, never meant to be edited by AI.

- **Blue glass examples gallery (t=02:03-02:08):** Five images visible in examples/ folder: 1.png shows a blue glass upward-pointing triangle/pyramid and a stylized bracket/S-shape; other images include the lab pipeline and GPU renders.

## Repo Details (visible in frames)

- **Repo name:** `google-image-gen-api-starter`
- **Runner:** `uv` (not pip -- dependencies managed via pyproject.toml)
- **API:** `google.generativeai`, model `gemini-3-pro-image-preview`
- **Style files location:** `styles/`
- **Examples location:** `showcase/examples/`
- **Claude integration:** Drop `README.md` into Claude Code context; it figures out the rest

## Actionability

- Clone the repo, drop the README into Claude Code, start generating images mid-session
- Create your own style markdown file under `styles/` for project-specific visual language
- Use `--edit` + reference image for surgical element swaps; avoid on gradient-heavy images
- Wrap as a Claude Code skill in `~/.claude/skills/` for global availability
- For production assets: AI generates clean icons, Canva/Photoshop adds gradients and text
