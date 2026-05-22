/**
 * Multi-transport notification routing.
 *
 * Centralises all outbound notifications (scheduled task results, mission
 * completions, system alerts) so they route to the correct channel:
 *   - Tasks created from Discord → results go back to that Discord channel
 *   - Tasks created from Telegram → results go back to Telegram
 *   - System alerts → both Telegram + Discord fallback channel
 *   - Missing/deleted channel → fall back to DISCORD_NOTIFICATION_CHANNEL_ID
 */

import { TextChannel } from 'discord.js';
import { Api, RawApi } from 'grammy';

import { ALLOWED_CHAT_ID, DISCORD_NOTIFICATION_CHANNEL_ID } from './config.js';
import { getDiscordClient } from './discord.js';
import { splitMessage, formatForTelegram } from './bot.js';
import { logger } from './logger.js';
import type { ScheduledTask, MissionTask } from './db.js';

// ── Types ────────────────────────────────────────────────────────────

export interface NotifyTarget {
  source: string;       // 'telegram' | 'discord' | 'cli' | 'dashboard'
  chatId: string | null; // discord channel ID (without prefix) or telegram chat ID
}

export interface NotifyOpts {
  /** Where to route the message. Omit for system alerts (both channels). */
  target?: NotifyTarget;
  /** If true, text is already HTML-formatted for Telegram. */
  preformatted?: boolean;
}

// ── State ────────────────────────────────────────────────────────────

let telegramApi: Api<RawApi> | null = null;
let telegramChatId: string = '';

/**
 * Initialise the notifier. Call once after the Telegram bot is ready.
 */
export function initNotifier(api: Api<RawApi>, chatId: string): void {
  telegramApi = api;
  telegramChatId = chatId;
}

// ── Formatting helpers ───────────────────────────────────────────────

/**
 * Convert Telegram HTML to Discord Markdown.
 * Handles common tags produced by formatForTelegram().
 */
function htmlToDiscordMarkdown(html: string): string {
  return html
    .replace(/<b>(.*?)<\/b>/gs, '**$1**')
    .replace(/<i>(.*?)<\/i>/gs, '*$1*')
    .replace(/<s>(.*?)<\/s>/gs, '~~$1~~')
    .replace(/<code>(.*?)<\/code>/gs, '`$1`')
    .replace(/<pre>(.*?)<\/pre>/gs, '```\n$1\n```')
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '[$2]($1)')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]+>/g, ''); // strip remaining HTML
}

const DISCORD_MAX_LENGTH = 2000;

function splitForDiscord(text: string): string[] {
  if (text.length <= DISCORD_MAX_LENGTH) return [text];
  const parts: string[] = [];
  let remaining = text;
  while (remaining.length > DISCORD_MAX_LENGTH) {
    const chunk = remaining.slice(0, DISCORD_MAX_LENGTH);
    const lastNewline = chunk.lastIndexOf('\n');
    const splitAt = lastNewline > DISCORD_MAX_LENGTH / 2 ? lastNewline : DISCORD_MAX_LENGTH;
    parts.push(remaining.slice(0, splitAt));
    remaining = remaining.slice(splitAt).trimStart();
  }
  if (remaining) parts.push(remaining);
  return parts;
}

// ── Transport senders ────────────────────────────────────────────────

async function sendToTelegram(text: string, preformatted: boolean, chatId?: string): Promise<void> {
  if (!telegramApi) return;
  const targetChat = chatId || telegramChatId;
  if (!targetChat) return;
  const formatted = preformatted ? text : formatForTelegram(text);
  for (const chunk of splitMessage(formatted)) {
    await telegramApi.sendMessage(targetChat, chunk, { parse_mode: 'HTML' }).catch((err) =>
      logger.error({ err }, 'Notifier: Telegram send failed'),
    );
  }
}

async function sendToDiscordChannel(text: string, preformatted: boolean, channelId: string): Promise<void> {
  const client = getDiscordClient();
  if (!client || !channelId) return;

  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !('send' in channel)) {
      logger.warn({ channelId }, 'Discord notification channel not found or not text-based');
      return;
    }
    const discordText = preformatted ? htmlToDiscordMarkdown(text) : text;
    for (const chunk of splitForDiscord(discordText)) {
      await (channel as TextChannel).send(chunk);
    }
  } catch (err) {
    logger.error({ err, channelId }, 'Notifier: Discord send failed');
  }
}

/**
 * Try to send to the given Discord channel. If the channel is missing
 * or deleted, fall back to DISCORD_NOTIFICATION_CHANNEL_ID.
 */
async function sendToDiscordWithFallback(
  text: string,
  preformatted: boolean,
  primaryChannelId: string | null,
): Promise<void> {
  const client = getDiscordClient();
  if (!client) return;

  if (primaryChannelId) {
    try {
      const channel = await client.channels.fetch(primaryChannelId);
      if (channel && 'send' in channel) {
        const discordText = preformatted ? htmlToDiscordMarkdown(text) : text;
        for (const chunk of splitForDiscord(discordText)) {
          await (channel as TextChannel).send(chunk);
        }
        return; // success, done
      }
    } catch {
      logger.warn({ channelId: primaryChannelId }, 'Original Discord channel unavailable, using fallback');
    }
  }

  // Fall back to the configured notification channel
  if (DISCORD_NOTIFICATION_CHANNEL_ID) {
    await sendToDiscordChannel(text, preformatted, DISCORD_NOTIFICATION_CHANNEL_ID);
  }
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Send a notification to the appropriate transport(s).
 *
 * - With target: routes to the source transport + channel
 * - Without target: system alert, goes to both Telegram + Discord fallback
 */
export async function notify(text: string, opts?: NotifyOpts): Promise<void> {
  const target = opts?.target;
  const preformatted = opts?.preformatted ?? false;

  if (!target) {
    // System alert: send to both channels
    const promises: Promise<void>[] = [];
    promises.push(sendToTelegram(text, preformatted));
    if (DISCORD_NOTIFICATION_CHANNEL_ID) {
      promises.push(sendToDiscordChannel(text, preformatted, DISCORD_NOTIFICATION_CHANNEL_ID));
    }
    await Promise.allSettled(promises);
    return;
  }

  // Source-aware routing
  if (target.source === 'discord') {
    // Extract raw channel ID from 'discord_XXXXX' format if needed
    const rawId = target.chatId?.replace(/^discord_/, '') ?? null;
    await sendToDiscordWithFallback(text, preformatted, rawId);
  } else {
    // telegram, cli, dashboard, or unknown — all go to Telegram
    await sendToTelegram(text, preformatted, target.chatId ?? undefined);
  }
}

/**
 * Build a source-aware sender function for use with initScheduler().
 * Extracts source info from the task and routes accordingly.
 */
export function createSourceAwareSender(): (text: string, task?: ScheduledTask | MissionTask | null) => Promise<void> {
  return async (text: string, task?: ScheduledTask | MissionTask | null) => {
    if (task?.source && task.source !== 'telegram') {
      // Route back to the originating transport
      await notify(text, {
        target: { source: task.source, chatId: task.source_chat_id },
        preformatted: true,
      });
    } else {
      // Default: Telegram (backward compat for old tasks without source)
      await sendToTelegram(text, true);
    }
  };
}

/**
 * Simple sender for system alerts (OAuth health, War Room, memory).
 * Always sends to both channels.
 */
export function getSystemAlertSender(): (text: string) => Promise<void> {
  return async (text: string) => {
    await notify(text, { preformatted: true });
  };
}
