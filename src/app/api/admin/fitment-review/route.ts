import { NextResponse } from 'next/server';
import { CATALOG_PARTS } from '@/data/catalog';
import { buildFitmentReviewQueue } from '@/lib/catalog/fitment-review';
import { authorizeFitmentReviewRequest } from '@/lib/admin/fitment-review-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = { 'Cache-Control': 'private, no-store, max-age=0' };

export async function GET(request: Request) {
  const authorization = authorizeFitmentReviewRequest(request);
  if (authorization === 'misconfigured') {
    return NextResponse.json(
      { error: 'Fitment review endpoint is not configured.' },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }
  if (authorization !== 'authorized') {
    return NextResponse.json(
      { error: 'Unauthorized.' },
      { status: 401, headers: { ...NO_STORE_HEADERS, 'WWW-Authenticate': 'Bearer' } },
    );
  }

  const items = buildFitmentReviewQueue(CATALOG_PARTS);
  return NextResponse.json(
    { count: items.length, items },
    { headers: NO_STORE_HEADERS },
  );
}
