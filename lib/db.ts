import fs from 'fs';
import path from 'path';
import { PhraseItem } from './types';

// Default initial starter phrases tailored specifically for Project Managers
export const DEFAULT_PHRASES: PhraseItem[] = [
  {
    id: 'starter-1',
    phrase: 'Catch me up',
    meaning: 'To bring someone up to speed on the latest updates, progress, or decisions made in their absence.',
    businessTip: 'Great for starting meetings when someone joins late, or after returning from PTO or another project sprint.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    examples: [
      {
        id: 'ex-1-1',
        context: 'Client / Customer Sync',
        sentence: "Thanks for joining, Michael. Before we walk through the demo, let me quickly catch you up on the milestone deliverables we completed this sprint.",
        explanation: 'Professional and courteous way to orient the client before showing deliverables.'
      },
      {
        id: 'ex-1-2',
        context: 'Internal Team Standup',
        sentence: "Hey team, I was in the executive roadmap review yesterday afternoon—could someone catch me up on where we landed with the API schema blocker?",
        explanation: 'Direct and collaborative inquiry for engineering standups.'
      },
      {
        id: 'ex-1-3',
        context: 'Stakeholder / Executive Update',
        sentence: "In case you missed yesterday's steering committee notes, I've prepared a 3-bullet summary to catch you up on budget allocations.",
        explanation: 'Respects executive time with proactive, concise communication.'
      }
    ]
  },
  {
    id: 'starter-2',
    phrase: 'Touch base',
    meaning: 'To make brief contact with someone to talk about a status, confirm alignment, or check progress.',
    businessTip: 'Use when you need a quick 5-minute alignment rather than a formal hour-long meeting.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    examples: [
      {
        id: 'ex-2-1',
        context: 'Client / Customer Sync',
        sentence: "I'd like to touch base with you midway through next week to confirm that the staging release meets your acceptance criteria.",
        explanation: 'Proactive PM outreach showing accountability.'
      },
      {
        id: 'ex-2-2',
        context: 'Internal Team Standup',
        sentence: "Let's touch base right after standup for five minutes to clarify the story point estimates for the payment gateway ticket.",
        explanation: 'Keeps standup lean by deferring detailed discussions.'
      },
      {
        id: 'ex-2-3',
        context: 'Stakeholder / Executive Update',
        sentence: "We touched base with the compliance officer yesterday and confirmed that the upcoming deployment is fully aligned with audit guidelines.",
        explanation: 'Assures stakeholders that risk management is under control.'
      }
    ]
  },
  {
    id: 'starter-3',
    phrase: 'Circle back',
    meaning: 'To return to a topic, question, or decision at a later time after gathering more data or finishing another agenda item.',
    businessTip: 'Crucial meeting facilitation phrase for PMs to avoid getting sidetracked by tangents.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    examples: [
      {
        id: 'ex-3-1',
        context: 'Client / Customer Sync',
        sentence: "That's an important feature request. Let me review the dependency timeline with our lead architect and circle back with an estimated delivery window by Thursday.",
        explanation: 'Avoids making unverified commitments on the spot while maintaining client trust.'
      },
      {
        id: 'ex-3-2',
        context: 'Internal Team Standup',
        sentence: "We're running short on time for today's agenda, so let's circle back to the CI/CD pipeline refactor during tomorrow's backlog grooming.",
        explanation: 'Keeps team discussions focused on high-priority sprint items.'
      },
      {
        id: 'ex-3-3',
        context: 'Stakeholder / Executive Update',
        sentence: "As promised in our quarterly review, I am circling back to share the finalized cost projection for Phase 2.",
        explanation: 'Demonstrates reliability and follows up on promised action items.'
      }
    ]
  }
];

// In-memory cache for serverless invocation lifecycle
let memoryCache: PhraseItem[] | null = null;

// Determine JSON storage path (works locally and in writable temp)
function getJsonFilePath(): string {
  const localDataDir = path.join(process.cwd(), 'data');
  if (fs.existsSync(localDataDir)) {
    return path.join(localDataDir, 'phrases.json');
  }
  // Try to create local data dir
  try {
    fs.mkdirSync(localDataDir, { recursive: true });
    return path.join(localDataDir, 'phrases.json');
  } catch {
    // If running in a read-only environment like AWS Lambda / Vercel without local write
    return path.join('/tmp', 'pm_phrases.json');
  }
}

// Upstash / Vercel KV REST API support (if configured by user in Vercel)
async function getFromKv(): Promise<PhraseItem[] | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/pm_phrases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.result) {
      const parsed = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      if (Array.isArray(parsed)) return parsed;
    }
    return null;
  } catch (err) {
    console.warn('[KV DB] Failed to fetch from KV, falling back to local:', err);
    return null;
  }
}

async function saveToKv(phrases: PhraseItem[]): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) return false;

  try {
    const res = await fetch(`${url}/set/pm_phrases`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(phrases)),
    });
    return res.ok;
  } catch (err) {
    console.warn('[KV DB] Failed to save to KV:', err);
    return false;
  }
}

export async function getPhrases(): Promise<PhraseItem[]> {
  // 1. Try Upstash / Vercel KV if environment variables are provided
  const kvData = await getFromKv();
  if (kvData && kvData.length > 0) {
    memoryCache = kvData;
    return kvData;
  }

  // 2. Check in-memory cache
  if (memoryCache && memoryCache.length > 0) {
    return memoryCache;
  }

  // 3. Fallback to local JSON file
  const filePath = getJsonFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[DB] Local file read warning:', err);
  }

  // 4. Default starter phrases
  memoryCache = [...DEFAULT_PHRASES];
  await savePhrases(memoryCache);
  return memoryCache;
}

export async function savePhrases(phrases: PhraseItem[]): Promise<boolean> {
  memoryCache = phrases;

  // 1. Save to KV if configured
  const savedToKv = await saveToKv(phrases);

  // 2. Save to local JSON file
  try {
    const filePath = getJsonFilePath();
    fs.writeFileSync(filePath, JSON.stringify(phrases, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[DB] Local file write warning:', err);
  }

  return true;
}

export async function addPhrase(phraseItem: PhraseItem): Promise<PhraseItem[]> {
  const current = await getPhrases();
  // Filter out any duplicate if same phrase already exists, putting newest at the top
  const filtered = current.filter(
    (item) => item.phrase.toLowerCase().trim() !== phraseItem.phrase.toLowerCase().trim()
  );
  const updated = [phraseItem, ...filtered];
  await savePhrases(updated);
  return updated;
}

export async function deletePhrase(id: string): Promise<PhraseItem[]> {
  const current = await getPhrases();
  const updated = current.filter((item) => item.id !== id);
  await savePhrases(updated);
  return updated;
}
