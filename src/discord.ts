import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import https from 'https';

import {
  Client,
  GatewayIntentBits,
  Message,
  MessageFlags,
  Partials,
  TextChannel,
  DMChannel,
} from 'discord.js';

import { runAgent, AgentProgressEvent } from './agent.js';
import { DISCORD_BOT_TOKEN, DISCORD_ALLOWED_USER_ID } from './config.js';
import { getSession, setSession, clearSession, saveTokenUsage } from './db.js';
import { logger } from './logger.js';
import { buildPhotoMessage, buildDocumentMessage, buildVideoMessage } from './media.js';
import { buildMemoryContext, saveConversationTurn } from './memory.js';
import { transcribeAudio, synthesizeSpeech, voiceCapabilities, UPLOADS_DIR } from './voice.js';

// Discord message limit
const DISCORD_MAX_LENGTH = 2000;

// ── Session-poison detection ─────────────────────────────────────────
// Mirrors bot.ts. Two failure modes:
//   1. Oversized image (>5 MB) embedded in tool_result — API 400s on resume.
//   2. Stale DB mapping pointing to a JSONL file that has since been cleaned
//      up off disk — SDK exits 1 immediately. Surfaced 2026-04-28 incident
//      where channels last touched 2026-03-21/22 had their JSONL files
//      auto-purged but the SQLite mapping was never cleared.
const ANTHROPIC_IMAGE_LIMIT_BYTES = 5 * 1024 * 1024;
const POISON_BASE64_THRESHOLD = Math.ceil((ANTHROPIC_IMAGE_LIMIT_BYTES * 4) / 3);

function sessionJsonlPath(sessionId: string): string {
  return path.join(
    os.homedir(),
    '.claude',
    'projects',
    '-home-rhino-claudeclaw-os',
    `${sessionId}.jsonl`,
  );
}

function isSessionJsonlMissing(sessionId: string): boolean {
  return !fs.existsSync(sessionJsonlPath(sessionId));
}

function isSessionPoisonedByOversizedImage(sessionId: string): boolean {
  const jsonlPath = sessionJsonlPath(sessionId);
  let stats: fs.Stats;
  try {
    stats = fs.statSync(jsonlPath);
  } catch {
    return false;
  }
  if (stats.size < ANTHROPIC_IMAGE_LIMIT_BYTES) return false;
  try {
    const data = fs.readFileSync(jsonlPath, 'utf-8');
    for (const line of data.split('\n')) {
      if (!line || !line.includes('"image"')) continue;
      const matches = line.match(/"data":"([A-Za-z0-9+/=]+)"/g);
      if (!matches) continue;
      for (const m of matches) {
        if (m.length - 9 > POISON_BASE64_THRESHOLD) return true;
      }
    }
  } catch {
    // Unreadable — let runAgent proceed and surface the real failure
  }
  return false;
}

// Parse comma-separated allowed user IDs
const ALLOWED_USER_IDS = new Set(
  DISCORD_ALLOWED_USER_ID ? DISCORD_ALLOWED_USER_ID.split(',').map((id: string) => id.trim()).filter(Boolean) : []
);

function isAllowedUser(userId: string): boolean {
  return ALLOWED_USER_IDS.size === 0 || ALLOWED_USER_IDS.has(userId);
}

let discordClient: Client | null = null;

// Per-channel voice mode toggle (in-memory, resets on restart)
// 'both' = text + voice, 'off' = text only
const voiceEnabledChats = new Set<string>();

// ── Model selection (mirrors bot.ts pattern) ──────────────────────────────

const AVAILABLE_MODELS: Record<string, string> = {
  opus: 'claude-opus-4-6',
  sonnet: 'claude-sonnet-4-5',
  haiku: 'claude-haiku-4-5',
};

const OPUS_SIGNALS = /\b(architect|architecture|design system|strategic|strategy|tradeoff|trade.off|deep research|deep dive|complex debug|security review|production decision|critical|long.term|master plan|should i|pros and cons|compare.*option|evaluate|assessment|nuanced|thorough analysis)\b/i;
const HAIKU_SIGNALS = /^(hi|hello|hey|thanks|thank you|ok|okay|yes|no|sure|got it|noted|done|remind me|what time|status|check|ping|how are you|good morning|good night).{0,40}$/i;

function classifyModel(message: string, chatDefault: string): string {
  const trimmed = message.trim();
  if (HAIKU_SIGNALS.test(trimmed) && chatDefault !== AVAILABLE_MODELS.opus) return AVAILABLE_MODELS.haiku;
  if (OPUS_SIGNALS.test(trimmed)) return AVAILABLE_MODELS.opus;
  if (trimmed.length > 300 && chatDefault === AVAILABLE_MODELS.haiku) return AVAILABLE_MODELS.sonnet;
  return chatDefault;
}

// ── Message helpers ───────────────────────────────────────────────────────

function splitMessage(text: string): string[] {
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

function extractFileMarkers(text: string): { text: string; files: Array<{ filePath: string; caption?: string }> } {
  const files: Array<{ filePath: string; caption?: string }> = [];
  const pattern = /\[SEND_(?:FILE|PHOTO):([^\]\|]+)(?:\|([^\]]*))?\]/g;
  const cleaned = text.replace(pattern, (_, filePath: string, caption?: string) => {
    files.push({ filePath: filePath.trim(), caption: caption?.trim() });
    return '';
  });
  return { text: cleaned.replace(/\n{3,}/g, '\n\n').trim(), files };
}

// ── Discord file download ─────────────────────────────────────────────────

/**
 * Download a Discord attachment URL to a local temp file.
 */
async function downloadDiscordAttachment(url: string, ext: string): Promise<string> {
  const filename = `${Date.now()}_${crypto.randomBytes(4).toString('hex')}${ext}`;
  const localPath = path.join(UPLOADS_DIR, filename);
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          const ws = fs.createWriteStream(localPath);
          res2.pipe(ws);
          ws.on('finish', () => { ws.close(); resolve(localPath); });
          ws.on('error', reject);
        }).on('error', reject);
        return;
      }
      const ws = fs.createWriteStream(localPath);
      res.pipe(ws);
      ws.on('finish', () => { ws.close(); resolve(localPath); });
      ws.on('error', reject);
    }).on('error', reject);
  });
}

// ── Core message handler ──────────────────────────────────────────────────

async function handleDiscordMessage(msg: Message, content: string, voiceReply = false): Promise<void> {
  // Security: only respond to allowed users
  if (!isAllowedUser(msg.author.id)) {
    logger.warn({ userId: msg.author.id }, 'Rejected Discord message from unauthorised user');
    return;
  }

  if (!content) return;

  // Use channel ID as the "chat ID" for session tracking
  const chatIdStr = `discord_${msg.channelId}`;

  logger.info({ channelId: msg.channelId, userId: msg.author.id, messageLen: content.length }, 'Processing Discord message');

  // Show typing indicator
  const channel = msg.channel as TextChannel | DMChannel;
  let typingInterval: ReturnType<typeof setInterval> | null = null;
  try {
    await channel.sendTyping();
    typingInterval = setInterval(() => {
      channel.sendTyping().catch(() => {});
    }, 8000);
  } catch {
    // typing is best-effort
  }

  try {
    // Build memory context
    const { contextText: memCtx } = await buildMemoryContext(chatIdStr, content);
    const fullMessage = memCtx ? `${memCtx}\n\n${content}` : content;

    let sessionId = getSession(chatIdStr);

    // Pre-flight: drop poisoned/orphaned mappings before runAgent resumes them.
    if (sessionId) {
      if (isSessionJsonlMissing(sessionId)) {
        logger.warn({ chatIdStr, sessionId }, 'Session JSONL missing — clearing stale mapping');
        clearSession(chatIdStr);
        sessionId = undefined;
        await channel.send('Previous session expired. Starting fresh.');
      } else if (isSessionPoisonedByOversizedImage(sessionId)) {
        logger.warn({ chatIdStr, sessionId }, 'Session contains oversized image — clearing mapping');
        clearSession(chatIdStr);
        sessionId = undefined;
        await channel.send('Previous session contained an oversized image (>5 MB). Starting fresh.');
      }
    }

    // Determine model
    const chatDefault = AVAILABLE_MODELS.opus;
    const modelForThisMessage = classifyModel(content, chatDefault);

    // Progress callback — send short updates for multi-step tasks
    const onProgress = (event: AgentProgressEvent) => {
      if (event.type === 'task_started' || event.type === 'task_completed') {
        const emoji = event.type === 'task_started' ? '🔄' : '✓';
        channel.send(`${emoji} ${event.description}`).catch(() => {});
      }
    };

    const abortCtrl = new AbortController();

    const result = await runAgent(
      fullMessage,
      sessionId,
      () => channel.sendTyping().catch(() => {}),
      onProgress,
      modelForThisMessage,
      abortCtrl,
    );

    if (typingInterval) clearInterval(typingInterval);

    // Subtype guard: a non-success result means the session is in a state that
    // will fail again on resume. Clear the mapping so the next message starts fresh.
    const subtype = (result as any).subtype;
    if (subtype && subtype !== 'success') {
      logger.warn(
        { chatIdStr, sessionId, subtype },
        'Non-success agent result — clearing session mapping',
      );
      clearSession(chatIdStr);
      const reasonMap: Record<string, string> = {
        error_max_turns: 'hit the max-turns ceiling (likely a tool loop)',
        error_during_execution: 'failed mid-execution',
      };
      const reason = reasonMap[subtype] ?? `failed (${subtype})`;
      await channel.send(`Session ${reason}. Started fresh — please retry.`);
      return;
    }

    if (result.newSessionId) {
      setSession(chatIdStr, result.newSessionId);
    }

    const rawResponse = result.text?.trim() || '[Task completed — no summary was generated. Ask me to recap what I just did.]';
    const { text: responseText, files } = extractFileMarkers(rawResponse);

    // Save conversation turn
    saveConversationTurn(chatIdStr, content, rawResponse, result.newSessionId ?? sessionId);

    // Send file attachments
    for (const file of files) {
      try {
        await channel.send({ files: [{ attachment: file.filePath, name: file.filePath.split('/').pop() }] });
      } catch (fileErr) {
        logger.error({ err: fileErr, filePath: file.filePath }, 'Failed to send file via Discord');
        await channel.send(`Could not send file: ${file.filePath}`);
      }
    }

    // Determine if we should include voice in the reply
    const caps = voiceCapabilities();
    const shouldSpeak = caps.tts && (voiceReply || voiceEnabledChats.has(chatIdStr));

    // Always send text first
    if (responseText) {
      for (const part of splitMessage(responseText)) {
        await channel.send(part);
      }
    }

    // Then send voice audio if voice mode is active
    if (shouldSpeak && responseText) {
      try {
        const audioBuffer = await synthesizeSpeech(responseText.slice(0, 4000));
        const audioPath = path.join(UPLOADS_DIR, `discord_tts_${Date.now()}.mp3`);
        fs.writeFileSync(audioPath, audioBuffer);
        await channel.send({ files: [{ attachment: audioPath, name: 'voice-reply.mp3' }] });
        try { fs.unlinkSync(audioPath); } catch { /* ignore */ }
      } catch (ttsErr) {
        logger.error({ err: ttsErr }, 'Discord TTS failed (text already sent)');
      }
    }

    // Save token usage
    if (result.usage) {
      const activeSessionId = result.newSessionId ?? sessionId;
      saveTokenUsage(
        chatIdStr,
        activeSessionId,
        result.usage.inputTokens,
        result.usage.outputTokens,
        result.usage.lastCallCacheRead,
        result.usage.lastCallInputTokens,
        result.usage.totalCostUsd,
        result.usage.didCompact,
      );
    }

  } catch (err) {
    if (typingInterval) clearInterval(typingInterval);
    logger.error({ err }, 'Discord message handler error');

    // Exit code 1 with no useful error from the SDK almost always means the
    // session is in a state the API/SDK will reject on every retry (oversized
    // image, malformed tool call, missing JSONL, context exhaustion). Clear
    // the mapping so the next message starts fresh — otherwise the bot fails
    // silently forever in this channel.
    const errMsg = err instanceof Error ? err.message : String(err);
    const origMsg = (err as any)?.originalError?.message ?? '';
    const errCategory = (err as any)?.category ?? '';
    const poisonedSession = getSession(chatIdStr);
    let userMsg = 'Something went wrong. Check the logs.';
    if (
      errMsg.includes('exited with code 1') ||
      origMsg.includes('exited with code 1') ||
      errCategory === 'subprocess_crash' ||
      errCategory === 'context_exhausted'
    ) {
      if (poisonedSession) {
        clearSession(chatIdStr);
        logger.warn(
          { chatIdStr, sessionId: poisonedSession },
          'Cleared session mapping after exit-code-1 failure',
        );
      }
      if (poisonedSession && isSessionJsonlMissing(poisonedSession)) {
        userMsg = 'Previous session expired (file cleaned up). Started fresh — please retry.';
      } else if (poisonedSession && isSessionPoisonedByOversizedImage(poisonedSession)) {
        userMsg = 'Session contained an oversized image (>5 MB) the API rejects. Started fresh — please retry.';
      } else {
        userMsg = 'Subprocess failed. Started fresh — please retry.';
      }
    }
    try {
      await channel.send(userMsg);
    } catch {
      // ignore
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────

export async function initDiscord(): Promise<void> {
  if (!DISCORD_BOT_TOKEN) {
    logger.warn('DISCORD_BOT_TOKEN not set — Discord integration disabled');
    return;
  }

  discordClient = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel, Partials.Message],
  });

  discordClient.on('ready', (client: any) => {
    logger.info({ tag: client.user.tag }, 'Discord bot ready');
    console.log(`\n  Discord connected: ${client.user.tag}`);
    if (!DISCORD_ALLOWED_USER_ID) {
      console.log('  DISCORD_ALLOWED_USER_ID not set — bot will respond to all users');
    }
  });

  discordClient.on('messageCreate', async (msg: Message) => {
    // Ignore bots (including self)
    if (msg.author.bot) return;
    // Only process messages from allowed users
    if (!isAllowedUser(msg.author.id)) return;

    // Check for voice messages (Discord sends them as attachments with flag 8192)
    const isVoice = msg.flags.has(MessageFlags.IsVoiceMessage);
    if (isVoice) {
      const voiceAttachment = msg.attachments.find((a: any) =>
        a.contentType?.startsWith('audio/') || a.name?.endsWith('.ogg')
      );
      if (voiceAttachment) {
        const channel = msg.channel as TextChannel | DMChannel;
        try {
          await channel.sendTyping();
          logger.info({ userId: msg.author.id, attachmentId: voiceAttachment.id }, 'Processing Discord voice message');

          // Download the voice file
          const ext = path.extname(voiceAttachment.name || '.ogg') || '.ogg';
          const localPath = await downloadDiscordAttachment(voiceAttachment.url, ext === '.oga' ? '.ogg' : ext);

          // Transcribe using Groq Whisper (same as Telegram voice)
          const transcribed = await transcribeAudio(localPath);

          if (!transcribed) {
            await channel.send('Could not transcribe the voice message. Try again or type it out.');
            return;
          }

          logger.info({ transcribed: transcribed.slice(0, 100) }, 'Discord voice transcribed');
          await handleDiscordMessage(msg, `[Voice transcribed]: ${transcribed}`, true);

          // Clean up temp file
          try { fs.unlinkSync(localPath); } catch { /* ignore */ }
        } catch (err) {
          logger.error({ err }, 'Discord voice transcription failed');
          try {
            await channel.send('Could not transcribe voice message. Check GROQ_API_KEY in .env.');
          } catch { /* ignore */ }
        }
        return;
      }
    }

    // Strip bot mention from message if present
    let content = msg.content;
    if (discordClient) {
      content = content.replace(new RegExp(`<@!?${discordClient.user!.id}>`, 'g'), '').trim();
    }
    if (!content && msg.attachments.size === 0) return;

    // Handle /voice toggle command
    if (/^[!/]voice$/i.test(content.trim())) {
      const chatIdStr = `discord_${msg.channelId}`;
      const channel = msg.channel as TextChannel | DMChannel;
      const caps = voiceCapabilities();
      if (!caps.tts) {
        await channel.send('No TTS provider configured. Add ElevenLabs or Gradium keys to .env.');
        return;
      }
      if (voiceEnabledChats.has(chatIdStr)) {
        voiceEnabledChats.delete(chatIdStr);
        await channel.send('Voice mode OFF - text replies only');
      } else {
        voiceEnabledChats.add(chatIdStr);
        await channel.send('Voice mode ON - replies will include text + voice audio');
      }
      return;
    }

    // Handle file attachments (images, PDFs, documents, videos)
    const nonVoiceAttachments = msg.attachments.filter((a: any) =>
      !a.contentType?.startsWith('audio/')
    );
    const attachmentMessages: string[] = [];
    for (const att of nonVoiceAttachments.values()) {
      try {
        const ext = path.extname(att.name || '.bin') || '.bin';
        const localPath = await downloadDiscordAttachment(att.url, ext);
        const ct = att.contentType || '';
        const name = att.name || 'unknown';

        if (ct.startsWith('image/')) {
          attachmentMessages.push(buildPhotoMessage(localPath, undefined));
        } else if (ct.startsWith('video/')) {
          attachmentMessages.push(buildVideoMessage(localPath, undefined));
        } else {
          attachmentMessages.push(buildDocumentMessage(localPath, name, undefined));
        }
        logger.info({ name, contentType: ct, localPath }, 'Discord attachment downloaded');
      } catch (err) {
        logger.error({ err, name: att.name }, 'Failed to download Discord attachment');
      }
    }

    // Combine text content with attachment descriptions
    const fullContent = attachmentMessages.length > 0
      ? [content, ...attachmentMessages].filter(Boolean).join('\n\n')
      : content;

    await handleDiscordMessage(msg, fullContent);
  });

  discordClient.on('error', (err: any) => {
    logger.error({ err }, 'Discord client error');
  });

  discordClient.on('disconnect' as 'warn', () => {
    logger.warn('Discord disconnected');
  });

  await discordClient.login(DISCORD_BOT_TOKEN);
}

export function getDiscordClient(): Client | null {
  return discordClient;
}
