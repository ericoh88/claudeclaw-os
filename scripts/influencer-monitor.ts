#!/usr/bin/env npx tsx
/**
 * Influencer Monitor
 * ------------------
 * Checks YouTube RSS feeds (and X via Nitter) for new content from tracked influencers.
 * Generates a morning report and sends it via Telegram (and optionally WhatsApp outbox).
 *
 * Usage:
 *   npx tsx scripts/influencer-monitor.ts              # check + report
 *   npx tsx scripts/influencer-monitor.ts --dry-run     # check only, no send
 *   npx tsx scripts/influencer-monitor.ts --list        # show all influencers
 *   npx tsx scripts/influencer-monitor.ts --add "Name" "handle" "platform" "url" "channel_id"
 */

import https from 'https';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Load .env
const envPath = path.join(PROJECT_ROOT, '.env');
const envConfig: Record<string, string> = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) {
      envConfig[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || envConfig.TELEGRAM_BOT_TOKEN || '';
const ALLOWED_CHAT_ID = process.env.ALLOWED_CHAT_ID || envConfig.ALLOWED_CHAT_ID || '';
const DB_ENCRYPTION_KEY = process.env.DB_ENCRYPTION_KEY || envConfig.DB_ENCRYPTION_KEY || '';
const DB_PATH = path.join(PROJECT_ROOT, 'store', 'claudeclaw.db');

// ---- Database ----
// @ts-ignore
import Database from 'better-sqlite3';
const db = new Database(DB_PATH);

interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: string;
  channel_url: string;
  channel_id: string | null;
  active: number;
}

interface ContentRow {
  influencer_id: string;
  content_id: string;
}

function getInfluencers(platform?: string): Influencer[] {
  if (platform) {
    return db.prepare('SELECT * FROM influencers WHERE active = 1 AND platform = ? ORDER BY name').all(platform) as Influencer[];
  }
  return db.prepare('SELECT * FROM influencers WHERE active = 1 ORDER BY name, platform').all() as Influencer[];
}

function contentExists(influencerId: string, contentId: string): boolean {
  const row = db.prepare('SELECT 1 FROM influencer_content WHERE influencer_id = ? AND content_id = ?').get(influencerId, contentId);
  return !!row;
}

function insertContent(influencerId: string, contentId: string, title: string, url: string, publishedAt: string): void {
  const now = Math.floor(Date.now() / 1000);
  db.prepare(`INSERT OR IGNORE INTO influencer_content (influencer_id, content_id, title, url, published_at, discovered_at) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(influencerId, contentId, title, url, publishedAt, now);
}

function getUnreportedContent(): Array<{ name: string; handle: string; platform: string; title: string; url: string; published_at: string; id: number }> {
  return db.prepare(`
    SELECT ic.id, ic.title, ic.url, ic.published_at, i.name, i.handle, i.platform
    FROM influencer_content ic
    JOIN influencers i ON ic.influencer_id = i.id
    WHERE ic.reported = 0
    ORDER BY ic.published_at DESC
  `).all() as any[];
}

function markReported(ids: number[]): void {
  const stmt = db.prepare('UPDATE influencer_content SET reported = 1 WHERE id = ?');
  const tx = db.transaction(() => { for (const id of ids) stmt.run(id); });
  tx();
}

// ---- HTTP fetch helper ----
function fetch(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InfluencerMonitor/1.0)' } }, (res) => {
      // Follow redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode && res.statusCode >= 400) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let data = '';
      res.on('data', (chunk: Buffer) => data += chunk.toString());
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

// ---- YouTube RSS Parser ----
interface FeedEntry {
  videoId: string;
  title: string;
  url: string;
  published: string;
  channelName: string;
}

function parseYouTubeFeed(xml: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const videoId = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] || '';
    const title = entry.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] || '';
    const channelName = entry.match(/<name>([^<]+)<\/name>/)?.[1] || '';
    if (videoId) {
      entries.push({
        videoId,
        title: decodeXmlEntities(title),
        url: `https://www.youtube.com/watch?v=${videoId}`,
        published,
        channelName: decodeXmlEntities(channelName),
      });
    }
  }
  return entries;
}

function decodeXmlEntities(s: string): string {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

// ---- X/Twitter via Nitter RSS (best effort) ----
const NITTER_INSTANCES = [
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://nitter.1d4.us',
];

interface TweetEntry {
  tweetId: string;
  title: string;
  url: string;
  published: string;
}

async function fetchNitterFeed(handle: string): Promise<TweetEntry[]> {
  const cleanHandle = handle.replace(/^@/, '');
  for (const instance of NITTER_INSTANCES) {
    try {
      const xml = await fetch(`${instance}/${cleanHandle}/rss`);
      return parseNitterFeed(xml);
    } catch {
      continue; // try next instance
    }
  }
  return []; // all instances failed, silently skip
}

function parseNitterFeed(xml: string): TweetEntry[] {
  const entries: TweetEntry[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const title = item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]
      || item.match(/<title>([^<]+)<\/title>/)?.[1] || '';
    const link = item.match(/<link>([^<]+)<\/link>/)?.[1] || '';
    const pubDate = item.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] || '';
    const tweetId = link.match(/status\/(\d+)/)?.[1] || crypto.randomBytes(8).toString('hex');
    if (title) {
      entries.push({
        tweetId,
        title: decodeXmlEntities(title).slice(0, 200),
        url: link.replace(/nitter\.[^/]+/, 'x.com'),
        published: pubDate,
      });
    }
  }
  return entries.slice(0, 10); // last 10 tweets max
}

// ---- Telegram send ----
async function sendTelegram(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !ALLOWED_CHAT_ID) {
    console.log('No Telegram credentials, printing to stdout:\n');
    console.log(text);
    return;
  }
  const payload = JSON.stringify({
    chat_id: ALLOWED_CHAT_ID,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  });
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
    }, (res) => {
      let data = '';
      res.on('data', (chunk: Buffer) => data += chunk.toString());
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          console.error('Telegram error:', data);
        }
        resolve();
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

// ---- WhatsApp outbox (enqueue if encryption key available) ----
function enqueueWhatsApp(text: string): void {
  // Get the user's own WhatsApp chat ID from wa_message_map or config
  const waChat = process.env.WHATSAPP_SELF_CHAT || envConfig.WHATSAPP_SELF_CHAT;
  if (!waChat || !DB_ENCRYPTION_KEY) return;

  try {
    const key = Buffer.from(DB_ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let enc = cipher.update(text, 'utf8', 'hex');
    enc += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    const encrypted = `${iv.toString('hex')}:${tag}:${enc}`;

    const now = Math.floor(Date.now() / 1000);
    db.prepare('INSERT INTO wa_outbox (to_chat_id, body, created_at) VALUES (?, ?, ?)').run(waChat, encrypted, now);
    console.log('WhatsApp message enqueued');
  } catch (e) {
    console.error('Failed to enqueue WhatsApp:', e);
  }
}

// ---- Main ----
async function checkYouTube(): Promise<number> {
  const influencers = getInfluencers('youtube');
  let newCount = 0;

  for (const inf of influencers) {
    if (!inf.channel_id) continue;
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${inf.channel_id}`;
    try {
      const xml = await fetch(feedUrl);
      const entries = parseYouTubeFeed(xml);
      for (const entry of entries.slice(0, 5)) { // last 5 videos
        if (!contentExists(inf.id, entry.videoId)) {
          insertContent(inf.id, entry.videoId, entry.title, entry.url, entry.published);
          newCount++;
        }
      }
    } catch (e: any) {
      console.error(`YouTube feed error for ${inf.name}: ${e.message}`);
    }
  }
  return newCount;
}

async function checkX(): Promise<number> {
  const influencers = getInfluencers('x');
  let newCount = 0;

  for (const inf of influencers) {
    try {
      const tweets = await fetchNitterFeed(inf.handle);
      for (const tweet of tweets) {
        if (!contentExists(inf.id, tweet.tweetId)) {
          insertContent(inf.id, tweet.tweetId, tweet.title, tweet.url, tweet.published);
          newCount++;
        }
      }
    } catch (e: any) {
      console.error(`X feed error for ${inf.name}: ${e.message}`);
    }
  }
  return newCount;
}

function buildReport(): { text: string; ids: number[] } {
  const items = getUnreportedContent();
  if (items.length === 0) {
    return { text: '', ids: [] };
  }

  const byPerson: Record<string, typeof items> = {};
  for (const item of items) {
    const key = item.name;
    if (!byPerson[key]) byPerson[key] = [];
    byPerson[key].push(item);
  }

  let text = `📡 <b>Influencer Report</b>\n`;
  text += `${new Date().toLocaleDateString('en-MY', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}\n\n`;

  for (const [person, contents] of Object.entries(byPerson)) {
    text += `<b>${person}</b>\n`;
    for (const c of contents) {
      const icon = c.platform === 'youtube' ? '🎬' : '🐦';
      const shortTitle = c.title.length > 80 ? c.title.slice(0, 77) + '...' : c.title;
      text += `${icon} <a href="${c.url}">${shortTitle}</a>\n`;
    }
    text += '\n';
  }

  text += `${items.length} new item${items.length > 1 ? 's' : ''} total`;
  return { text, ids: items.map(i => i.id) };
}

async function addInfluencer(name: string, handle: string, platform: string, url: string, channelId?: string): Promise<void> {
  const id = crypto.randomBytes(4).toString('hex');
  const now = Math.floor(Date.now() / 1000);
  db.prepare('INSERT OR IGNORE INTO influencers (id, name, handle, platform, channel_url, channel_id, added_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, name, handle, platform, url, channelId || null, now);
  console.log(`Added: ${name} (${handle}) on ${platform}`);
}

function listInfluencers(): void {
  const rows = getInfluencers();
  console.log('\nInfluencers Table');
  console.log('─'.repeat(70));
  console.log(`${'Name'.padEnd(22)} ${'Handle'.padEnd(20)} ${'Platform'.padEnd(10)} Active`);
  console.log('─'.repeat(70));
  for (const r of rows) {
    console.log(`${r.name.padEnd(22)} ${r.handle.padEnd(20)} ${r.platform.padEnd(10)} ${r.active ? '✓' : '✗'}`);
  }
  console.log('─'.repeat(70));
  console.log(`Total: ${rows.length}`);
}

// ---- CLI ----
const args = process.argv.slice(2);

if (args.includes('--list')) {
  listInfluencers();
  db.close();
  process.exit(0);
}

if (args.includes('--add')) {
  const idx = args.indexOf('--add');
  const [name, handle, platform, url, channelId] = args.slice(idx + 1);
  if (!name || !handle || !platform) {
    console.error('Usage: --add "Name" "@handle" "youtube|x" "url" "[channel_id]"');
    process.exit(1);
  }
  await addInfluencer(name, handle, platform, url || '', channelId);
  db.close();
  process.exit(0);
}

const dryRun = args.includes('--dry-run');

console.log('Checking YouTube feeds...');
const ytNew = await checkYouTube();
console.log(`YouTube: ${ytNew} new items`);

console.log('Checking X feeds...');
const xNew = await checkX();
console.log(`X: ${xNew} new items`);

const { text, ids } = buildReport();

if (!text) {
  console.log('No new content to report.');
  db.close();
  process.exit(0);
}

if (dryRun) {
  console.log('\n--- DRY RUN REPORT ---');
  console.log(text.replace(/<[^>]+>/g, '')); // strip HTML tags for console
  db.close();
  process.exit(0);
}

// Send via Telegram
await sendTelegram(text);
console.log('Telegram report sent');

// Enqueue WhatsApp if configured
enqueueWhatsApp(text.replace(/<[^>]+>/g, '')); // plain text for WhatsApp

// Mark as reported
markReported(ids);
console.log(`Marked ${ids.length} items as reported`);

db.close();
