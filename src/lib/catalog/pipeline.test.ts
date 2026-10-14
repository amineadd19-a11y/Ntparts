import type { Part, VerificationStatus } from '@/types';
import { deduplicateAndMerge, isLiveCatalogueEligible } from './pipeline';

function part(
  partStatus: VerificationStatus,
  referenceStatus: VerificationStatus,
): Part {
  return {
    id: 'part-1',
    systemId: 'engine-system',
    name: 'Oil filter',
    category: 'Filters',
    images: [],
    oemReferences: [
      {
        id: 'oem-1',
        partId: 'part-1',
        manufacturerId: 'volvo-trucks',
        referenceNumber: '21707134',
        verificationStatus: referenceStatus,
        source: 'https://example.com/catalogue',
        evidenceLevel: 'parts-catalog',
      },
    ],
    crossReferences: [],
    compatibility: [],
    sources: [],
    verificationStatus: partStatus,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('live catalogue verification gate', () => {
  it.each(['verified', 'source-listed', 'cross-checked'] as VerificationStatus[])(
    'allows eligible part and reference status %s',
    (status) => {
      expect(isLiveCatalogueEligible(part(status, status))).toBe(true);
    },
  );

  it.each(['needs-verification', 'unverified', 'rejected'] as VerificationStatus[])(
    'rejects non-production part status %s even when the reference is verified',
    (status) => {
      expect(isLiveCatalogueEligible(part(status, 'verified'))).toBe(false);
    },
  );

  it.each(['needs-verification', 'unverified', 'rejected'] as VerificationStatus[])(
    'rejects non-production reference status %s even when the part is verified',
    (status) => {
      expect(isLiveCatalogueEligible(part('verified', status))).toBe(false);
    },
  );

  it('rejects a public OEM reference without an attributable URL', () => {
    const candidate = part('source-listed', 'source-listed');
    candidate.oemReferences[0].source = 'Manufacturer catalogue page';
    expect(isLiveCatalogueEligible(candidate)).toBe(false);
  });

  it('rejects a VERIFIED label when the evidence level is only secondary', () => {
    const candidate = part('verified', 'verified');
    candidate.oemReferences[0].evidenceLevel = 'secondary';
    expect(isLiveCatalogueEligible(candidate)).toBe(false);
  });

  it('filters needs-verification records from the default live merge', () => {
    const result = deduplicateAndMerge([
      part('needs-verification', 'verified'),
      part('verified', 'needs-verification'),
      part('source-listed', 'source-listed'),
    ]);

    expect(result.parts).toHaveLength(1);
    expect(result.parts[0].verificationStatus).toBe('source-listed');
    expect(result.stats.rejectedNotEligible).toBe(2);
  });
});
