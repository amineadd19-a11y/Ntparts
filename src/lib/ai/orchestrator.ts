import type { AIAnalysisResponse } from './types';
import { analyzeParts } from './gemini';

const OPENAI_BASE = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const OPENAI_TIMEOUT_MS = 20_000;

function extractText(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  const object = value as Record<string, unknown>;
  const choices = Array.isArray(object.choices) ? object.choices : [];
  const first = choices[0];
  if (!first || typeof first !== 'object') return '';
  const message = (first as Record<string, unknown>).message;
  if (!message || typeof message !== 'object') return '';
  const content = (message as Record<string, unknown>).content;
  return typeof content === 'string' ? content.trim() : '';
}

async function callOpenAI(question: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not configured.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
  try {
    const response = await fetch(`${OPENAI_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      cache: 'no-store',
      signal: controller.signal,
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.1,
        max_tokens: 1200,
        messages: [
          {
            role: 'system',
            content: 'You are a secondary verification model for NTParts. Analyze truck-part questions conservatively. Never invent OEM numbers, fitment, dimensions or sources. If evidence is unavailable, say NOT VERIFIED. Your output is an AI second opinion, not authoritative evidence.',
          },
          { role: 'user', content: question },
        ],
      }),
    });
    if (!response.ok) throw new Error(`OpenAI provider error ${response.status}`);
    const text = extractText(await response.json());
    if (!text) throw new Error('OpenAI provider returned no text.');
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

function mergeSecondOpinion(primary: AIAnalysisResponse, opinion: string): AIAnalysisResponse {
  const normalized = opinion.replace(/\s+/g, ' ').trim();
  if (!normalized) return primary;
  const answer = `${primary.answer}\n\nSECOND AI OPINION (non-authoritative)\n${opinion}`;
  const conflict = /not verified|insufficient|cannot verify|uncertain|conflict/i.test(normalized)
    ? [...primary.sourceConflicts, 'The secondary AI model reports uncertainty; treat the cited web/catalog evidence as authoritative, not the model opinion.']
    : primary.sourceConflicts;
  return { ...primary, answer, sourceConflicts: conflict };
}

export async function analyzeWithProviders(question: string): Promise<AIAnalysisResponse> {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (!hasGemini && !hasOpenAI) {
    throw new Error('No AI provider is configured.');
  }

  let primary: AIAnalysisResponse | null = null;
  let primaryError: unknown = null;

  if (hasGemini) {
    try {
      primary = await analyzeParts(question);
    } catch (error) {
      primaryError = error;
    }
  }

  if (!primary && hasOpenAI) {
    const opinion = await callOpenAI(question);
    return {
      answer: `${opinion}\n\nVERIFICATION: NOT VERIFIED — this fallback model has no authoritative web grounding in this request.`,
      confidence: 35,
      status: 'unverified',
      catalogMatches: [],
      sources: [],
      sourceConflicts: ['No grounded primary provider was available.'],
      suggestions: [],
    };
  }

  if (!primary) throw primaryError instanceof Error ? primaryError : new Error('AI providers are unavailable.');

  // Gemini remains the grounded evidence engine. When configured, the second
  // provider supplies an independent reasoning opinion without being promoted
  // to evidence or source authority.
  if (hasOpenAI) {
    try {
      const opinion = await callOpenAI(question);
      return mergeSecondOpinion(primary, opinion);
    } catch (error) {
      console.warn('[PartMind] Secondary provider unavailable:', error instanceof Error ? error.message : error);
    }
  }

  return primary;
}
