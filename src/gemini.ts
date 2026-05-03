import { GoogleGenAI, Part } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

import { GOOGLE_API_KEY } from './config.js';
import { logger } from './logger.js';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (client) return client;
  if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not set. Add it to .env for memory extraction.');
  }
  client = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
  return client;
}

/**
 * Generate text content via Gemini.
 * Defaults to gemini-2.5-flash. Google's free tier on 2.0 models was retired
 * in 2026; 2.5-flash is the current flash-tier default with the same API shape.
 */
export async function generateContent(
  prompt: string,
  model = 'gemini-2.5-flash',
): Promise<string> {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });
    if (!response.text) {
      logger.warn({ model }, 'Gemini returned empty response');
      return '';
    }
    return response.text;
  } catch (err) {
    logger.error({ err, model }, 'Gemini generateContent failed');
    throw err;
  }
}

/**
 * Convert a local image file to a Gemini-compatible Part (inline base64).
 */
function imageFileToPart(filePath: string): Part {
  const ext = path.extname(filePath).toLowerCase();
  const mimeMap: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
  };
  const mimeType = mimeMap[ext] || 'image/jpeg';
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString('base64'),
      mimeType,
    },
  };
}

/**
 * Analyze video frames with Gemini 2.5 Flash vision.
 *
 * Sends a batch of JPEG frame paths + a text prompt to Gemini and returns the
 * analysis as a markdown string. Used by the watch agent pipeline to replace
 * expensive Claude frame-reading with Gemini Flash ($0.60/M vs $15/M output).
 *
 * Batches frames into groups of maxPerBatch (default 20) to stay within
 * per-request limits, then concatenates all batch results.
 */
export async function analyzeFrames(
  framePaths: string[],
  prompt: string,
  opts: { model?: string; maxPerBatch?: number; temperature?: number } = {},
): Promise<string> {
  const {
    model = 'gemini-2.5-flash',
    maxPerBatch = 20,
    temperature = 0.2,
  } = opts;
  const ai = getClient();

  // Split frames into batches
  const batches: string[][] = [];
  for (let i = 0; i < framePaths.length; i += maxPerBatch) {
    batches.push(framePaths.slice(i, i + maxPerBatch));
  }

  logger.info(
    { totalFrames: framePaths.length, batches: batches.length, model },
    'Analyzing frames with Gemini vision',
  );

  const results: string[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const parts: (Part | string)[] = [];

    // Add frame images as inline data
    for (const fp of batch) {
      try {
        parts.push(imageFileToPart(fp));
      } catch (err) {
        logger.warn({ err, file: fp }, 'Failed to read frame, skipping');
      }
    }

    // Add the text prompt (with batch context if multi-batch)
    const batchLabel =
      batches.length > 1
        ? `\n\n[Batch ${i + 1}/${batches.length} — frames ${i * maxPerBatch + 1}-${i * maxPerBatch + batch.length} of ${framePaths.length}]\n\n`
        : '\n\n';
    parts.push(batchLabel + prompt);

    try {
      const response = await ai.models.generateContent({
        model,
        contents: parts,
        config: { temperature },
      });
      if (response.text) {
        results.push(response.text);
      }
    } catch (err) {
      logger.error({ err, batch: i + 1, model }, 'Gemini frame analysis batch failed');
      results.push(`[Batch ${i + 1} failed: ${err instanceof Error ? err.message : 'unknown error'}]`);
    }
  }

  return results.join('\n\n---\n\n');
}

/**
 * Parse a JSON response from Gemini, with fallback on malformed output.
 * Returns null if parsing fails.
 */
export function parseJsonResponse<T>(text: string): T | null {
  try {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    logger.warn({ err, text: text.slice(0, 200) }, 'Failed to parse Gemini JSON response');
    return null;
  }
}
