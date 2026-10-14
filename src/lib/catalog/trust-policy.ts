import type { Compatibility, CrossReference, OEMReference, Part, Source } from '@/types';

const EVIDENCE_SOURCE_TYPES = new Set<Source['type']>(['official', 'parts-catalog']);

function isHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** A source is strong enough to support a catalogue claim only when it is attributable and high-reliability. */
export function isStrongEvidenceSource(source: Source): boolean {
  return EVIDENCE_SOURCE_TYPES.has(source.type) &&
    source.reliability === 'high' &&
    isHttpUrl(source.url);
}

/** An OEM reference can be called verified only with explicit status and attributable OEM/parts-catalog evidence. */
export function isVerifiedOEMReference(reference: OEMReference): boolean {
  return reference.verificationStatus === 'verified' &&
    (reference.evidenceLevel === 'official' || reference.evidenceLevel === 'parts-catalog') &&
    isHttpUrl(reference.source);
}

/** A cross-reference must have an explicit verified status and a source URL before claiming interchangeability. */
export function isVerifiedCrossReference(reference: CrossReference): boolean {
  return reference.verificationStatus === 'verified' && isHttpUrl(reference.source);
}

/**
 * Compatibility currently has no per-relationship evidence fields in the data model.
 * Therefore a boolean flag alone is not sufficient to claim verified vehicle fitment.
 * This intentionally fails closed until the relationship itself stores attributable evidence.
 */
export function isVerifiedCompatibility(_compatibility: Compatibility): boolean {
  return false;
}

export type PartTrustLabel = 'verified' | 'source-listed' | 'needs-verification' | 'unverified' | 'rejected';

export function getPartTrustLabel(part: Pick<Part, 'verificationStatus'>): PartTrustLabel {
  switch (part.verificationStatus) {
    case 'verified':
      return 'verified';
    case 'source-listed':
    case 'cross-checked':
      return 'source-listed';
    case 'needs-verification':
      return 'needs-verification';
    case 'rejected':
      return 'rejected';
    case 'unverified':
    default:
      return 'unverified';
  }
}
