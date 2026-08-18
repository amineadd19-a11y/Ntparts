import { clampConfidence, evidenceForDomain, statusFrom } from './gemini';
import type { AISource } from './types';

function source(domain: string, evidence: AISource['evidence'], confidence: number): AISource {
  return {
    title: domain,
    url: `https://${domain}/x`,
    domain,
    evidence,
    confidence,
    retrievedAt: '2026-08-18T00:00:00.000Z',
  };
}

describe('PartMind source policy', () => {
  it('ranks official and manufacturer domains above secondary', () => {
    expect(evidenceForDomain('volvotrucks.com')).toBe('OFFICIAL');
    expect(evidenceForDomain('mann-filter.com')).toBe('MANUFACTURER');
    expect(evidenceForDomain('knorr-bremse.com')).toBe('MANUFACTURER');
    expect(evidenceForDomain('random-shop.example')).toBe('SECONDARY');
  });

  it('marks forums and marketplaces as unverified', () => {
    expect(evidenceForDomain('reddit.com')).toBe('UNVERIFIED');
    expect(evidenceForDomain('ebay.com')).toBe('UNVERIFIED');
    expect(evidenceForDomain('facebook.com')).toBe('UNVERIFIED');
  });

  it('caps confidence when only secondary web sources exist', () => {
    const sources = [source('some-blog.example', 'SECONDARY', 55)];
    expect(clampConfidence(95, sources, 0)).toBeLessThanOrEqual(60);
  });

  it('allows high confidence with manufacturer evidence', () => {
    const sources = [source('mann-filter.com', 'MANUFACTURER', 94)];
    expect(clampConfidence(90, sources, 0)).toBeGreaterThanOrEqual(90);
  });

  it('does not mark secondary-only answers as verified', () => {
    const sources = [source('random.example', 'SECONDARY', 55)];
    expect(statusFrom(90, 'Looks fine', sources, 0)).not.toBe('verified');
  });

  it('can verify when catalogue matches exist with high confidence', () => {
    expect(statusFrom(90, 'Match found', [], 2)).toBe('verified');
  });
});
