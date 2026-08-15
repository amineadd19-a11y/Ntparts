import { NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeWithProviders } from '@/lib/ai/orchestrator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  question: z.string().trim().min(2).max(1500),
});

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const requestLog = new Map<string, number[]>();

function getClientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(key, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Too many AI requests. Please wait a minute and try again.' },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid AI query.' }, { status: 400 });
    }

    const result = await analyzeWithProviders(parsed.data.question);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI service unavailable.';
    const safeMessage = message.includes('No AI provider')
      ? 'AI service is not configured yet. Add GEMINI_API_KEY or OPENAI_API_KEY to the server environment.'
      : 'AI service is temporarily unavailable. Please try again.';
    console.error('[NTParts AI]', message);
    return NextResponse.json({ error: safeMessage }, { status: 503 });
  }
}
