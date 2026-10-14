import type { Part } from '@/types';
import { buildFitmentReviewQueue } from './fitment-review';

function makePart(compatibility: Part['compatibility']): Part {
  return {
    id: 'part-1',
    systemId: 'system-1',
    name: 'Oil filter',
    category: 'filters',
    images: [],
    oemReferences: [],
    crossReferences: [],
    compatibility,
    sources: [],
    verificationStatus: 'source-listed',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

describe('fitment review queue', () => {
  const now = new Date('2026-10-14T12:00:00.000Z');

  it('queues legacy compatibility flags without evidence and explains why', () => {
    const queue = buildFitmentReviewQueue([makePart([{
      id: 'fit-1',
      partId: 'part-1',
      generationId: 'generation-1',
      verified: true,
    }])], now);

    expect(queue).toHaveLength(1);
    expect(queue[0].status).toBe('needs-review');
    expect(queue[0].reasons).toContain('evidence-missing');
    expect(queue[0].reasons).toContain('relationship-status-not-verified');
  });

  it('queues stale evidence without modifying or promoting the relationship', () => {
    const relationship: NonNullable<Part['compatibility']>[number] = {
      id: 'fit-stale',
      partId: 'part-1',
      generationId: 'generation-1',
      verified: true,
      verificationStatus: 'verified',
      evidence: {
        status: 'verified',
        sourceTitle: 'Official catalogue',
        sourceUrl: 'https://manufacturer.example/catalogue',
        sourceType: 'official',
        checkedAt: '2025-10-13T12:00:00.000Z',
        vehicleConfiguration: 'Model X / engine Y',
        sourceReference: 'Table 2, row 5',
      },
    };
    const queue = buildFitmentReviewQueue([makePart([relationship])], now);

    expect(queue).toHaveLength(1);
    expect(queue[0].reasons).toContain('evidence-stale');
    expect(relationship.verificationStatus).toBe('verified');
    expect(relationship.verified).toBe(true);
  });

  it('does not queue a relationship accepted by the trust policy', () => {
    const relationship: NonNullable<Part['compatibility']>[number] = {
      id: 'fit-current',
      partId: 'part-1',
      generationId: 'generation-1',
      verified: true,
      verificationStatus: 'verified',
      evidence: {
        status: 'verified',
        sourceTitle: 'Official catalogue',
        sourceUrl: 'https://manufacturer.example/catalogue',
        sourceType: 'official',
        checkedAt: '2026-09-14T12:00:00.000Z',
        vehicleConfiguration: 'Model X / engine Y',
        sourceReference: 'Table 2, row 5',
      },
    };

    expect(buildFitmentReviewQueue([makePart([relationship])], now)).toEqual([]);
  });

  it('returns an empty queue for parts with no compatibility relationships', () => {
    expect(buildFitmentReviewQueue([makePart([])], now)).toEqual([]);
  });
});
