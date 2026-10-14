import { authorizeFitmentReviewRequest } from './fitment-review-auth';

const TOKEN = 'test-only-fitment-review-token-0123456789';

function request(authorization?: string): Request {
  return new Request('https://example.test/api/admin/fitment-review', {
    headers: authorization ? { authorization } : undefined,
  });
}

describe('fitment review API authorization', () => {
  it('fails closed when the server secret is missing', () => {
    expect(authorizeFitmentReviewRequest(request(), undefined)).toBe('misconfigured');
  });

  it('fails closed when the configured secret is too short', () => {
    expect(authorizeFitmentReviewRequest(request('Bearer short'), 'short')).toBe('misconfigured');
  });

  it('rejects missing, malformed, and incorrect bearer credentials', () => {
    expect(authorizeFitmentReviewRequest(request(), TOKEN)).toBe('unauthorized');
    expect(authorizeFitmentReviewRequest(request('Basic abc'), TOKEN)).toBe('unauthorized');
    expect(authorizeFitmentReviewRequest(request('Bearer wrong-token'), TOKEN)).toBe('unauthorized');
  });

  it('accepts the exact bearer token', () => {
    expect(authorizeFitmentReviewRequest(request(`Bearer ${TOKEN}`), TOKEN)).toBe('authorized');
  });
});
