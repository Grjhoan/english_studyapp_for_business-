import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExampleSentence, PhraseItem, SentenceContext } from './types';

interface GenerationResult {
  meaning: string;
  businessTip: string;
  examples: {
    context: SentenceContext;
    sentence: string;
    explanation: string;
  }[];
}

const SYSTEM_PROMPT = `You are an elite executive communication coach specializing in Business English for Technical Project Managers (PMs).
Your role is to help a Project Manager expand their English vocabulary to communicate with customers, cross-functional internal teams (developers, designers, QA), and executive stakeholders.

When given an English word, idiom, or phrase, generate:
1. A concise, clear meaning/definition.
2. A practical 1-sentence tip on how a Project Manager should use it effectively in professional settings.
3. Exactly 3 realistic, high-impact business sentences for these 3 specific scenarios:
   - "Client / Customer Sync": Talking directly to external clients or customers. Polite, confident, solution-oriented, setting clear expectations.
   - "Internal Team Standup": Talking with engineering, design, or QA teams during standups, sprint planning, or backlog refinement. Collaborative, direct, and agile-focused.
   - "Stakeholder / Executive Update": Status emails, steering committee meetings, or syncs with directors/VPs. Concise, structured, and outcome-oriented.

Return ONLY a valid JSON object with this exact structure:
{
  "meaning": "Clear definition here",
  "businessTip": "PM usage tip here",
  "examples": [
    {
      "context": "Client / Customer Sync",
      "sentence": "Professional client sentence using the phrase naturally.",
      "explanation": "Brief note on why this sentence works well with clients."
    },
    {
      "context": "Internal Team Standup",
      "sentence": "Agile team sentence using the phrase naturally.",
      "explanation": "Brief note on team collaboration context."
    },
    {
      "context": "Stakeholder / Executive Update",
      "sentence": "Executive status sentence using the phrase naturally.",
      "explanation": "Brief note on executive framing."
    }
  ]
}`;

// Fallback intelligent generator if no API key is provided yet
function generateOfflineMock(phrase: string): GenerationResult {
  const clean = phrase.trim();
  return {
    meaning: `Professional business phrase meaning to coordinate, communicate, or align on "${clean}".`,
    businessTip: `Use "${clean}" to maintain high transparency with stakeholders while keeping meetings focused and efficient. (Note: Add your GEMINI_API_KEY in .env.local to activate live AI generation)`,
    examples: [
      {
        context: 'Client / Customer Sync',
        sentence: `In our next milestone review, we'll specifically focus on how to ${clean} to ensure we remain on schedule with your Q3 targets.`,
        explanation: 'Maintains client confidence by linking the discussion directly to strategic delivery targets.'
      },
      {
        context: 'Internal Team Standup',
        sentence: `Before we lock the sprint scope in Jira, let's take two minutes to ${clean} with the frontend leads on ticket dependencies.`,
        explanation: 'Addresses technical blockers early without derailing the daily standup.'
      },
      {
        context: 'Stakeholder / Executive Update',
        sentence: `The weekly progress dashboard has been updated to reflect our plan to ${clean} across both cross-functional tracks.`,
        explanation: 'Provides high-level visibility to executive sponsors.'
      }
    ]
  };
}

export async function generateBusinessSentences(phrase: string): Promise<GenerationResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  // 1. Try Google Gemini (Recommended cheaper model: gemini-2.0-flash / gemini-1.5-flash)
  if (geminiApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      // gemini-2.0-flash or gemini-1.5-flash: lowest cost, high speed, high reasoning for language tasks
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const prompt = `${SYSTEM_PROMPT}\n\nThe target phrase or word is: "${phrase.trim()}". Return the required JSON object.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text) as GenerationResult;

      if (parsed && parsed.examples && parsed.examples.length >= 3) {
        return parsed;
      }
    } catch (err) {
      console.error('[Gemini AI] Error generating sentences:', err);
      // fallback to OpenAI or mock if Gemini error occurs
    }
  }

  // 2. Try OpenAI gpt-4o-mini (alternative cheaper model)
  if (openaiApiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: `The target phrase or word is: "${phrase.trim()}". Return the required JSON object.` },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content) as GenerationResult;
          if (parsed && parsed.examples && parsed.examples.length >= 3) {
            return parsed;
          }
        }
      }
    } catch (err) {
      console.error('[OpenAI] Error generating sentences:', err);
    }
  }

  // 3. Fallback mock if neither API key is configured or both errored
  console.warn('[AI] Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured. Using intelligent template generator.');
  return generateOfflineMock(phrase);
}

export function buildPhraseItem(phrase: string, generated: GenerationResult): PhraseItem {
  return {
    id: `phrase-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    phrase: phrase.trim(),
    meaning: generated.meaning,
    businessTip: generated.businessTip,
    createdAt: new Date().toISOString(),
    examples: generated.examples.map((ex, idx) => ({
      id: `ex-${Date.now()}-${idx}`,
      context: ex.context,
      sentence: ex.sentence,
      explanation: ex.explanation,
    })),
  };
}
