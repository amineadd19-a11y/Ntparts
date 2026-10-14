/**
 * NTParts — Deterministic verification system
 *
 * CRITICAL RULES:
 * - LLM confidence is a supporting signal, NEVER proof by itself.
 * - A part becomes verified only with explicit acceptable evidence
 *   according to the source tier policy below.
 * - Conflicting reliable sources → SOURCE CONFLICT (do not guess).
 * - Insufficient evidence → NOT VERIFIED (do not invent).
 */

import type { EvidenceLevel as CatalogEvidenceLevel, OEMReference, Part, VerificationStatus } from '@/types';

/** AI / web evidence tiers (ordered strongest → weakest). */
export type WebEvidenceLevel =
  | 'OFFICIAL'
  | 'MANUFACTURER'
  | 'AUTHORIZED_DISTRIBUTOR'
  | 'PROFESSIONAL_CATALOG'
  | 'SECONDARY'
  | 'UNVERIFIED';

/**
 * Source tiers (policy order).
 * 1. Manufacturer / OEM official source
 * 2. Official manufacturer catalogue / documentation
 * 3. Trusted professional parts catalogue
 * 4. Verified distributor
 * 5. Other approved sources
 * 6. Untrusted / unknown
 */
export type SourceTier =
  | 1 // OEM official
  | 2 // Official manufacturer catalogue
  | 3 // Professional parts catalogue
  | 4 // Verified / authorized distributor
  | 5 // Other approved (secondary but attributable)
  | 6; // Untrusted / unknown

export const SOURCE_TIER_LABELS: Record<SourceTier, string> = {
  1: 'Manufacturer / OEM official',
  2: 'Official manufacturer catalogue',
  3: 'Trusted professional parts catalogue',
  4: 'Verified distributor',
  5: 'Other approved source',
  6: 'Untrusted / unknown',
};

/** Domains that must never drive VERIFIED alone. */
const WEAK_DOMAIN_PATTERNS =
  /facebook|twitter|x\.com|reddit|quora|pinterest|blogspot|wordpress\.com|medium\.com|tiktok|youtube|wikipedia|ebay|aliexpress|amazon\.|wish\.com|forum|pastebin/i;

const OFFICIAL_OEM_PATTERNS =
  /mercedes-benz-trucks|volvotrucks|scania\.com|man\.eu|daf\.com|renault-trucks|iveco\.com|kenworth\.com|peterbilt\.com|freightliner\.com|macktrucks|hino\.com|isuzucv|udtrucks/i;

const MANUFACTURER_PATTERNS =
  /knorr-bremse|zf\.com|haldex|bosch\.com|mahle\.com|mann-filter|hengst\.com|textar\.com|cojali\.com|sampa\.com|elring\.com|reinz\.com|ajusa\.com|garrett|borgwarner|wabco|zf-group/i;

const DISTRIBUTOR_PATTERNS = /autodoc|intercars|trucktec|winkler|dieseltechnic|svensk/i;

const PROFESSIONAL_CATALOG_PATTERNS = /tecdoc|partslink24|spareto|plenty\.parts|rexbo\./i;

export function evidenceForDomain(domain: string): WebEvidenceLevel {
  const d = domain.toLowerCase().replace(/^www\./, '');
  if (WEAK_DOMAIN_PATTERNS.test(d)) return 'UNVERIFIED';
  if (OFFICIAL_OEM_PATTERNS.test(d)) return 'OFFICIAL';
  if (MANUFACTURER_PATTERNS.test(d)) return 'MANUFACTURER';
  if (DISTRIBUTOR_PATTERNS.test(d)) return 'AUTHORIZED_DISTRIBUTOR';
  if (PROFESSIONAL_CATALOG_PATTERNS.test(d)) return 'PROFESSIONAL_CATALOG';
  return 'SECONDARY';
}

export function webEvidenceToTier(level: WebEvidenceLevel): SourceTier {
  switch (level) {
    case 'OFFICIAL':
      return 1;
    case 'MANUFACTURER':
      return 2;
    case 'PROFESSIONAL_CATALOG':
      return 3;
    case 'AUTHORIZED_DISTRIBUTOR':
      return 4;
    case 'SECONDARY':
      return 5;
    case 'UNVERIFIED':
    default:
      return 6;
  }
}

export function catalogEvidenceToTier(level?: CatalogEvidenceLevel): SourceTier {
  switch (level) {
    case 'official':
      return 1;
    case 'parts-catalog':
      return 2;
    case 'secondary':
      return 5;
    default:
      return 6;
  }
}

export function confidenceForWebEvidence(evidence: WebEvidenceLevel): number {
  switch (evidence) {
    case 'OFFICIAL':
      return 98;
    case 'MANUFACTURER':
      return 94;
    case 'AUTHORIZED_DISTRIBUTOR':
      return 88;
    case 'PROFESSIONAL_CATALOG':
      return 82;
    case 'SECONDARY':
      return 55;
    case 'UNVERIFIED':
    default:
      return 25;
  }
}

export function strongestWebEvidence(
  sources: Array<{ evidence: WebEvidenceLevel }>,
): WebEvidenceLevel | null {
  if (!sources.length) return null;
  const order: WebEvidenceLevel[] = [
    'OFFICIAL',
    'MANUFACTURER',
    'AUTHORIZED_DISTRIBUTOR',
    'PROFESSIONAL_CATALOG',
    'SECONDARY',
    'UNVERIFIED',
  ];
  let best: WebEvidenceLevel = 'UNVERIFIED';
  for (const source of sources) {
    if (order.indexOf(source.evidence) < order.indexOf(best)) best = source.evidence;
  }
  return best;
}

/** True when evidence is strong enough to support VERIFIED (tiers 1–4). */
export function isStrongEvidence(level: WebEvidenceLevel | null): boolean {
  return (
    level === 'OFFICIAL' ||
    level === 'MANUFACTURER' ||
    level === 'AUTHORIZED_DISTRIBUTOR' ||
    level === 'PROFESSIONAL_CATALOG'
  );
}

/**
 * Cap model-reported confidence using source strength + catalogue hits.
 * LLM confidence alone cannot exceed the evidence ceiling.
 */
export function clampConfidence(
  reported: number,
  sources: Array<{ evidence: WebEvidenceLevel }>,
  catalogMatchCount: number,
): number {
  const strongest = strongestWebEvidence(sources);
  let cap = 40;
  if (catalogMatchCount > 0) cap = Math.max(cap, 70);
  if (strongest === 'PROFESSIONAL_CATALOG' || strongest === 'AUTHORIZED_DISTRIBUTOR')
    cap = Math.max(cap, 82);
  if (strongest === 'MANUFACTURER') cap = Math.max(cap, 92);
  if (strongest === 'OFFICIAL') cap = Math.max(cap, 98);
  if (!strongest && catalogMatchCount === 0) cap = 35;
  // Secondary-only web evidence cannot exceed 60
  if (strongest === 'SECONDARY' && catalogMatchCount === 0) cap = Math.min(cap, 60);
  return Math.max(0, Math.min(cap, reported || cap));
}

export type ResolutionStatus = 'verified' | 'probable' | 'conflict' | 'unverified';

export interface ResolutionInput {
  /** Model-reported or pre-clamped confidence 0–100 */
  confidence: number;
  /** Raw answer text (used for conflict / NOT VERIFIED markers) */
  text: string;
  sources: Array<{ evidence: WebEvidenceLevel }>;
  catalogMatchCount: number;
  /** Optional: explicit conflict flag from upstream */
  forcedConflict?: boolean;
}

/**
 * Deterministic status resolution.
 *
 * VERIFIED requires:
 *   - confidence ≥ 85 AND
 *   - (strong web evidence OR internal catalogue match with non-zero confidence)
 *
 * Secondary-only web evidence can never yield VERIFIED.
 * SOURCE CONFLICT in text → conflict regardless of confidence.
 */
export function resolveVerificationStatus(input: ResolutionInput): ResolutionStatus {
  const { confidence, text, sources, catalogMatchCount, forcedConflict } = input;

  if (forcedConflict || /SOURCE CONFLICT/i.test(text)) return 'conflict';
  if (/NOT VERIFIED|INSUFFICIENT DATA/i.test(text) && confidence < 70) return 'unverified';

  const strongest = strongestWebEvidence(sources);
  const strongWeb = isStrongEvidence(strongest);

  // VERIFIED: evidence-backed, not confidence-alone
  if (confidence >= 85 && (strongWeb || catalogMatchCount > 0)) return 'verified';
  if (confidence >= 55 && (catalogMatchCount > 0 || sources.length > 0)) return 'probable';
  return 'unverified';
}

/**
 * Detect conflicting OEM claims across references for the same logical part.
 * Returns human-readable conflict messages (empty if none).
 */
export function detectOemConflicts(part: Part): string[] {
  const conflicts: string[] = [];
  const byNorm = new Map<string, OEMReference[]>();

  for (const ref of part.oemReferences ?? []) {
    const key = ref.referenceNumber.trim().toLowerCase().replace(/[\s\-./]/g, '');
    if (!key) continue;
    const list = byNorm.get(key) || [];
    list.push(ref);
    byNorm.set(key, list);
  }

  // Conflict: same normalized number with disagreeing verification statuses at extremes
  for (const [key, refs] of byNorm) {
    const statuses = new Set(refs.map((r) => r.verificationStatus));
    if (statuses.has('verified') && statuses.has('rejected')) {
      conflicts.push(`SOURCE CONFLICT on reference ${key}: verified vs rejected`);
    }
  }

  // Conflict: part-level verified but all OEM refs are unverified/rejected
  if (part.verificationStatus === 'verified') {
    const refs = part.oemReferences ?? [];
    if (
      refs.length > 0 &&
      refs.every((r) => r.verificationStatus === 'unverified' || r.verificationStatus === 'rejected')
    ) {
      conflicts.push(
        `SOURCE CONFLICT on part ${part.id}: part marked verified but all OEM refs are unverified/rejected`,
      );
    }
  }

  return conflicts;
}

/**
 * Deterministic part-level status from OEM references only (no LLM).
 * Used for catalogue integrity — never upgrades based on model confidence.
 */
export function resolvePartStatusFromOem(refs: OEMReference[]): VerificationStatus {
  if (!refs.length) return 'unverified';
  if (refs.some((r) => r.verificationStatus === 'rejected')) {
    // Any rejected ref without any verified → rejected; mixed → needs-verification
    if (!refs.some((r) => r.verificationStatus === 'verified')) return 'rejected';
    return 'needs-verification';
  }
  if (refs.some((r) => r.verificationStatus === 'verified')) return 'verified';
  if (refs.some((r) => r.verificationStatus === 'cross-checked')) return 'cross-checked';
  if (refs.some((r) => r.verificationStatus === 'source-listed')) return 'source-listed';
  if (refs.some((r) => r.verificationStatus === 'needs-verification')) return 'needs-verification';
  return 'unverified';
}

/** Human-readable labels for UI / AI answers. */
export function statusLabel(status: ResolutionStatus | VerificationStatus): string {
  switch (status) {
    case 'verified':
      return 'VERIFIED';
    case 'probable':
    case 'source-listed':
    case 'cross-checked':
      return 'LIKELY / SOURCE-LISTED';
    case 'conflict':
      return 'SOURCE CONFLICT';
    case 'rejected':
      return 'REJECTED';
    case 'needs-verification':
    case 'unverified':
    default:
      return 'NOT VERIFIED';
  }
}
