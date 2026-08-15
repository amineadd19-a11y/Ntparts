import { NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeParts } from '@/lib/ai/gemini';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const requestSchema = z.object({
  question: z.string().trim().min(2).max(1500),
});

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid AI query.' }, { status: 400 });
    }

    const result = await analyzeParts(parsed.data.question);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'AI service unavailable.';
    const safeMessage = message.includes('GEMINI_API_KEY')
      ? 'AI service is not configured yet. Add GEMINI_API_KEY to the server environment.'
      : 'AI service is temporarily unavailable. Please try again.';
    console.error('[NTParts AI]', message);
    return NextResponse.json({ error: safeMessage }, { status: 503 });
  }
}
