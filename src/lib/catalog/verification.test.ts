import {
  clampConfidence,
  detectOemConflicts,
  evidenceForDomain,
  resolvePartStatusFromOem,
  resolveVerificationStatus,
  webEvidenceToTier,
} from './verification';
import type { OEMReference, Part } from '@/types';

function oem(
  number: string,
  status: OEMReference['verificationStatus'],
): OEMReference {
  return {
    id: `t-${number}`,
    partId: 'p1',
    manufacturerId: 'volvo-trucks',
    referenceNumber: number,
    verificationStatus: status,
    evidenceLevel: 'parts-catalog',
  };
}

describe('deterministic verification system', () => {
  it('maps domains to evidence tiers correctly', () => {
    expect(evidenceForDomain('volvotrucks.com')).toBe('OFFICIAL');
    expect(evidenceForDomain('mann-filter.com')).toBe('MANUFACTURER');
    expect(evidenceForDomain('tecdoc.net')).toBe('PROFESSIONAL_CATALOG');
    expect(evidenceForDomain('reddit.com')).toBe('UNVERIFIED');
    expect(webEvidenceToTier('OFFICIAL')).toBe(1);
    expect(webEvidenceToTier('UNVERIFIED')).toBe(6);
  });

  it('never lets LLM confidence alone produce verified', () => {
    const status = resolveVerificationStatus({
      confidence: 99,
      text: 'I am very sure this is the part',
      sources: [],
      catalogMatchCount: 0,
    });
    expect(status).toBe('unverified');
  });

  it('caps secondary-only confidence at 60', () => {
    expect(
      clampConfidence(95, [{ evidence: 'SECONDARY' }], 0),
    ).toBeLessThanOrEqual(60);
  });

  it('allows verified with strong manufacturer evidence + high confidence', () => {
    const status = resolveVerificationStatus({
      confidence: 90,
      text: 'OEM match from manufacturer catalogue',
      sources: [{ evidence: 'MANUFACTURER' }],
      catalogMatchCount: 0,
    });
    expect(status).toBe('verified');
  });

  it('allows verified with catalogue match + high confidence', () => {
    const status = resolveVerificationStatus({
      confidence: 90,
      text: 'Internal catalogue hit',
      sources: [],
      catalogMatchCount: 2,
    });
    expect(status).toBe('verified');
  });

  it('returns SOURCE CONFLICT when text marks conflict', () => {
    const status = resolveVerificationStatus({
      confidence: 95,
      text: 'SOURCE CONFLICT between manufacturer A and B',
      sources: [{ evidence: 'OFFICIAL' }],
      catalogMatchCount: 1,
    });
    expect(status).toBe('conflict');
  });

  it('returns NOT VERIFIED path for insufficient evidence', () => {
    const status = resolveVerificationStatus({
      confidence: 40,
      text: 'NOT VERIFIED: insufficient data',
      sources: [{ evidence: 'SECONDARY' }],
      catalogMatchCount: 0,
    });
    expect(status).toBe('unverified');
  });

  it('resolves part status from OEM refs without LLM', () => {
    expect(resolvePartStatusFromOem([oem('21707134', 'verified')])).toBe('verified');
    expect(resolvePartStatusFromOem([oem('X', 'source-listed')])).toBe('source-listed');
    expect(resolvePartStatusFromOem([])).toBe('unverified');
    expect(resolvePartStatusFromOem([oem('Z', 'rejected')])).toBe('rejected');
  });

  it('detects verified vs rejected conflict on same reference', () => {
    const part = {
      id: 'p1',
      verificationStatus: 'needs-verification',
      oemReferences: [oem('21707134', 'verified'), oem('21707134', 'rejected')],
    } as Part;
    const conflicts = detectOemConflicts(part);
    expect(conflicts.some((c) => /SOURCE CONFLICT/i.test(c))).toBe(true);
  });
});
