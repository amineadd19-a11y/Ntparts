import type { Compatibility, CrossReference, OEMReference, Part, Source } from '@/types';

const EVIDENCE_SOURCE_TYPES = new Set<Source['type']>(['official', 'parts-catalog']);
/** Fitment evidence must be rechecked at least annually before it can support a verified claim. */
export const MAX_FITMENT_EVIDENCE_AGE_DAYS = 365;

function isHttpUrl(value?: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password;
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
 * Verified fitment requires evidence attached to this exact relationship.
 * Legacy `verified: true`, a part-level source, or a bare URL cannot establish fitment.
 */
export function isVerifiedCompatibility(compatibility: Compatibility): boolean {
  const evidence = compatibility.evidence;
  if (
    compatibility.verified !== true ||
    compatibility.verificationStatus !== 'verified' ||
    !evidence ||
    evidence.status !== 'verified' ||
    (evidence.sourceType !== 'official' && evidence.sourceType !== 'parts-catalog') ||
    !evidence.sourceTitle.trim() ||
    !evidence.vehicleConfiguration.trim() ||
    !evidence.sourceReference?.trim() ||
    !isHttpUrl(evidence.sourceUrl)
  ) return false;

  const checkedAt = Date.parse(evidence.checkedAt);
  const ageMs = Date.now() - checkedAt;
  const maxAgeMs = MAX_FITMENT_EVIDENCE_AGE_DAYS * 24 * 60 * 60 * 1000;
  return Number.isFinite(checkedAt) && ageMs >= 0 && ageMs <= maxAgeMs;
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
