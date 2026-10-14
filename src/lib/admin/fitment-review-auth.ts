import { timingSafeEqual } from 'node:crypto';

export type FitmentReviewAuthorization = 'authorized' | 'unauthorized' | 'misconfigured';

/**
 * Server-only guard for the internal read-only fitment review endpoint.
 * Configure FITMENT_REVIEW_API_TOKEN as a Vercel server environment secret.
 */
export function authorizeFitmentReviewRequest(
  request: Pick<Request, 'headers'>,
  configuredToken: string | undefined = process.env.FITMENT_REVIEW_API_TOKEN,
): FitmentReviewAuthorization {
  if (!configuredToken || configuredToken.trim().length < 32) return 'misconfigured';

  const authorization = request.headers.get('authorization') ?? '';
  const match = /^Bearer\s+([^\s]+)$/i.exec(authorization);
  if (!match) return 'unauthorized';

  const supplied = Buffer.from(match[1], 'utf8');
  const expected = Buffer.from(configuredToken, 'utf8');
  if (supplied.length !== expected.length) return 'unauthorized';

  return timingSafeEqual(supplied, expected) ? 'authorized' : 'unauthorized';
}
