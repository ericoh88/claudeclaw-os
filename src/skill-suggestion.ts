/**
 * Skill Suggestion Engine
 *
 * After an agent run completes, evaluates whether the task solved represents
 * a repeatable pattern worth saving as a reusable skill.
 *
 * Uses Gemini Flash for cheap, fast LLM evaluation.
 * Only fires when: no skills were invoked AND 3+ tools were used.
 */

import { generateContent, parseJsonResponse } from './gemini.js';
import { saveSkillSuggestion } from './db.js';
import { logger } from './logger.js';

interface SkillEvaluation {
  is_skill_worthy: boolean;
  suggested_name: string;
  description: string;
  reasoning: string;
}

const EVAL_PROMPT = `You are evaluating whether a completed AI agent task should be saved as a reusable skill.

A "skill" is a proven, repeatable procedure the agent can invoke next time it encounters a similar task.

TASK SUMMARY:
{task_summary}

TOOLS USED (count: {tool_count}):
{tools_used}

Evaluate this task. Respond in JSON:
{
  "is_skill_worthy": true/false,
  "suggested_name": "kebab-case-name",
  "description": "One sentence: what this skill would do when invoked",
  "reasoning": "Why this is or isn't worth saving"
}

RULES:
- Return is_skill_worthy=true ONLY if the task is genuinely repeatable and non-trivial.
- Simple Q&A, single lookups, quick fixes, or one-off personal requests are NOT skill-worthy.
- Multi-step workflows, research pipelines, data processing, report generation, integration patterns ARE skill-worthy.
- The name should be concise and action-oriented (e.g. "research-and-archive", "weekly-digest", "lead-enrichment").
- If the task closely matches an existing common pattern, it's probably already a skill. Return false.`;

/**
 * Evaluate whether a completed agent run should become a skill.
 * Fire-and-forget: never blocks the user response.
 */
export async function evaluateSkillCandidate(
  userMessage: string,
  assistantResponse: string,
  toolsUsed: string[],
  skillsInvoked: string[],
  agentId: string,
  chatId: string,
): Promise<void> {
  // Gate: only evaluate if no skills matched and 3+ tools were used
  if (skillsInvoked.length > 0) return;
  if (toolsUsed.length < 3) return;

  // Deduplicate tools for the summary
  const uniqueTools = [...new Set(toolsUsed)];

  // Build a compact task summary (truncate to save tokens)
  const taskSummary = [
    `USER: ${userMessage.slice(0, 500)}`,
    `RESPONSE: ${assistantResponse.slice(0, 800)}`,
  ].join('\n\n');

  const prompt = EVAL_PROMPT
    .replace('{task_summary}', taskSummary)
    .replace('{tool_count}', String(toolsUsed.length))
    .replace('{tools_used}', uniqueTools.join(', '));

  try {
    const raw = await generateContent(prompt);
    const result = parseJsonResponse<SkillEvaluation>(raw);

    if (!result) {
      logger.warn('Skill suggestion: failed to parse Gemini response');
      return;
    }

    if (result.is_skill_worthy && result.suggested_name && result.description) {
      saveSkillSuggestion(
        result.suggested_name,
        result.description,
        taskSummary.slice(0, 1000),
        toolsUsed.length,
        agentId,
        chatId,
        'llm',
      );
      logger.info(
        { name: result.suggested_name, reasoning: result.reasoning },
        'Skill suggestion saved',
      );
    } else {
      logger.debug(
        { reasoning: result.reasoning },
        'Task not skill-worthy',
      );
    }
  } catch (err) {
    // Never let skill evaluation errors affect the user experience
    logger.warn({ err }, 'Skill suggestion evaluation failed (non-fatal)');
  }
}
