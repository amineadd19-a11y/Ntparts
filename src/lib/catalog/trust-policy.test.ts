import type { Compatibility, CrossReference, OEMReference, Part, Source } from '@/types';
import {
  getPartTrustLabel,
  isStrongEvidenceSource,
  isVerifiedCompatibility,
  isVerifiedCrossReference,
  isVerifiedOEMReference,
} from './trust-policy';

const officialSource: Source = {
  id: 'source-1',
  partId: 'part-1',
  name: 'Manufacturer catalogue',
  url: 'https://manufacturer.example/catalogue',
  type: 'official',
  reliability: 'high',
};

const oemReference: OEMReference = {
  id: 'oem-1',
  partId: 'part-1',
  manufacturerId: 'manufacturer-1',
  referenceNumber: 'ABC123',
  verificationStatus: 'verified',
  source: 'https://manufacturer.example/catalogue',
  evidenceLevel: 'official',
};

const crossReference: CrossReference = {
  id: 'xref-1',
  partId: 'part-1',
  referencedPartId: 'part-2',
  relationshipType: 'substitute',
  verificationStatus: 'verified',
  source: 'https://manufacturer.example/interchange',
};

const compatibility: Compatibility = {
  id: 'fit-1',
  partId: 'part-1',
  generationId: 'generation-1',
  verified: true,
};

describe('catalogue evidence trust policy', () => {
  it('accepts only high-reliability official or parts-catalog sources with an HTTP(S) URL', () => {
    expect(isStrongEvidenceSource(officialSource)).toBe(true);
    expect(isStrongEvidenceSource({ ...officialSource, type: 'forum' })).toBe(false);
    expect(isStrongEvidenceSource({ ...officialSource, reliability: 'medium' })).toBe(false);
    expect(isStrongEvidenceSource({ ...officialSource, url: 'not-a-url' })).toBe(false);
  });

  it('requires explicit verified status, acceptable evidence level, and a source URL for OEM references', () => {
    expect(isVerifiedOEMReference(oemReference)).toBe(true);
    expect(isVerifiedOEMReference({ ...oemReference, verificationStatus: 'source-listed' })).toBe(false);
    expect(isVerifiedOEMReference({ ...oemReference, evidenceLevel: 'secondary' })).toBe(false);
    expect(isVerifiedOEMReference({ ...oemReference, source: undefined })).toBe(false);
  });

  it('requires verified status and a source URL for cross-reference claims', () => {
    expect(isVerifiedCrossReference(crossReference)).toBe(true);
    expect(isVerifiedCrossReference({ ...crossReference, verificationStatus: 'source-listed' })).toBe(false);
    expect(isVerifiedCrossReference({ ...crossReference, source: 'catalogue page without URL' })).toBe(false);
  });

  it('fails closed when a legacy boolean has no relationship-level evidence', () => {
    expect(isVerifiedCompatibility(compatibility)).toBe(false);
    expect(isVerifiedCompatibility({ ...compatibility, verified: false })).toBe(false);
    expect(isVerifiedCompatibility({ ...compatibility, verificationStatus: 'verified' })).toBe(false);
  });

  it('accepts fitment only when the exact relationship has attributable, dated official/catalogue evidence', () => {
    const evidenced: Compatibility = {
      ...compatibility,
      verificationStatus: 'verified',
      evidence: {
        status: 'verified',
        sourceTitle: 'Manufacturer parts catalogue, application table',
        sourceUrl: 'https://manufacturer.example/applications',
        sourceType: 'official',
        checkedAt: '2026-10-14T09:00:00.000Z',
        vehicleConfiguration: 'Truck model X, 2020–2023, engine D13K',
        sourceReference: 'Table 4, application row 12',
      },
    };
    expect(isVerifiedCompatibility(evidenced)).toBe(true);
    expect(isVerifiedCompatibility({ ...evidenced, evidence: { ...evidenced.evidence!, sourceType: 'secondary' } })).toBe(false);
    expect(isVerifiedCompatibility({ ...evidenced, evidence: { ...evidenced.evidence!, sourceUrl: 'not-a-url' } })).toBe(false);
    expect(isVerifiedCompatibility({ ...evidenced, evidence: { ...evidenced.evidence!, sourceTitle: ' ' } })).toBe(false);
    expect(isVerifiedCompatibility({ ...evidenced, evidence: { ...evidenced.evidence!, vehicleConfiguration: '' } })).toBe(false);
    expect(isVerifiedCompatibility({ ...evidenced, evidence: { ...evidenced.evidence!, checkedAt: 'not-a-date' } })).toBe(false);
    expect(isVerifiedCompatibility({ ...evidenced, evidence: { ...evidenced.evidence!, checkedAt: '2999-01-01T00:00:00.000Z' } })).toBe(false);
    expect(isVerifiedCompatibility({ ...evidenced, evidence: { ...evidenced.evidence!, status: 'source-listed' } })).toBe(false);
  });

  it('keeps source-listed and cross-checked distinct from verified in public-facing trust labels', () => {
    const base = { verificationStatus: 'verified' } as Pick<Part, 'verificationStatus'>;
    expect(getPartTrustLabel(base)).toBe('verified');
    expect(getPartTrustLabel({ verificationStatus: 'source-listed' })).toBe('source-listed');
    expect(getPartTrustLabel({ verificationStatus: 'cross-checked' })).toBe('source-listed');
    expect(getPartTrustLabel({ verificationStatus: 'needs-verification' })).toBe('needs-verification');
    expect(getPartTrustLabel({ verificationStatus: 'unverified' })).toBe('unverified');
    expect(getPartTrustLabel({ verificationStatus: 'rejected' })).toBe('rejected');
  });
});
