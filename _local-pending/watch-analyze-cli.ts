#!/usr/bin/env node
/**
 * ClaudeClaw Watch Frame Analyzer CLI
 *
 * Sends extracted video frames to Gemini 2.5 Flash for vision analysis.
 * Used by the watch agent pipeline instead of Claude's Read tool to cut
 * costs from ~$15/M (Sonnet) to ~$0.60/M (Gemini Flash) per output token.
 *
 * Usage:
 *   node dist/watch-analyze-cli.js /tmp/watch-abc123/frames/ [--prompt "custom prompt"]
 *   node dist/watch-analyze-cli.js /tmp/watch-abc123/frames/ --transcript /tmp/watch-abc123/transcript.txt
 *   node dist/watch-analyze-cli.js /tmp/watch-abc123/frames/ --out /tmp/analysis.md
 *
 * Reads all .jpg files in the given directory, sends them in batches to
 * Gemini 2.5 Flash, and outputs a structured markdown analysis.
 */

import * as fs from 'fs';
import * as path from 'path';

import { analyzeFrames } from './gemini.js';
import { logger } from './logger.js';

const DEFAULT_PROMPT = `You are a video analysis expert. Analyze these video frames in sequence and provide a detailed report.

For each frame or group of frames, note:
- What is being shown (UI, slides, code, people, demonstrations, scenery)
- Any on-screen text, code snippets, URLs, terminal commands, or UI elements
- Visual transitions or scene changes
- Anything that a transcript alone would miss (charts, diagrams, visual demonstrations)

Organize your findings chronologically. Focus on visual-only insights that complement an audio transcript.

Format as markdown with clear sections.`;

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`Usage: node dist/watch-analyze-cli.js <frames-dir> [options]

Options:
  --prompt "..."       Custom analysis prompt
  --transcript <file>  Include transcript text for context
  --out <file>         Write output to file instead of stdout
  --batch-size <n>     Frames per batch (default: 20)
  --model <name>       Gemini model (default: gemini-2.5-flash)
`);
    process.exit(0);
  }

  const framesDir = args[0];
  let prompt = DEFAULT_PROMPT;
  let transcriptFile: string | null = null;
  let outFile: string | null = null;
  let batchSize = 20;
  let model = 'gemini-2.5-flash';

  // Parse flags
  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--prompt':
        prompt = args[++i];
        break;
      case '--transcript':
        transcriptFile = args[++i];
        break;
      case '--out':
        outFile = args[++i];
        break;
      case '--batch-size':
        batchSize = parseInt(args[++i], 10) || 20;
        break;
      case '--model':
        model = args[++i];
        break;
    }
  }

  // Validate frames directory
  if (!fs.existsSync(framesDir)) {
    console.error(`Error: frames directory not found: ${framesDir}`);
    process.exit(1);
  }

  // Collect frame files sorted by name (frame_0001.jpg, frame_0002.jpg, ...)
  const framePaths = fs
    .readdirSync(framesDir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()
    .map((f) => path.join(framesDir, f));

  if (framePaths.length === 0) {
    console.error(`Error: no image files found in ${framesDir}`);
    process.exit(1);
  }

  // If transcript provided, append it to the prompt
  if (transcriptFile && fs.existsSync(transcriptFile)) {
    const transcript = fs.readFileSync(transcriptFile, 'utf-8');
    prompt += `\n\n## Transcript for context\n\nBelow is the audio transcript. Your job is to focus on VISUAL information the transcript doesn't capture, but use the transcript to understand context and timing.\n\n${transcript}`;
  }

  console.error(`Analyzing ${framePaths.length} frames with ${model}...`);
  console.error(`Batch size: ${batchSize}, Batches: ${Math.ceil(framePaths.length / batchSize)}`);

  try {
    const result = await analyzeFrames(framePaths, prompt, {
      model,
      maxPerBatch: batchSize,
    });

    if (outFile) {
      fs.writeFileSync(outFile, result, 'utf-8');
      console.error(`Analysis written to ${outFile}`);
    } else {
      console.log(result);
    }
  } catch (err) {
    logger.error({ err }, 'Frame analysis failed');
    console.error(`Error: ${err instanceof Error ? err.message : 'unknown'}`);
    process.exit(1);
  }
}

main();
