/**
 * NTParts catalogue import / merge pipeline.
 *
 * Rules:
 * - Never invent OEM numbers, compatibility, or technical claims.
 * - Prefer merging sources into an existing entity over creating duplicates.
 * - Preserve provenance (sources) on merge.
 * - Never upgrade SOURCE-LISTED / NOT VERIFIED to VERIFIED without explicit evidence.
 * - Template / discovery rows without OEM evidence must not enter the live catalogue.
 */

import type { Part, OEMReference, Source, VerificationStatus } from '@/types';
import { normalizeReference, referenceIdentityKey } from './normalize';
import { isVerifiedOEMReference } from './trust-policy';

export type IncomingPart = Part;

export interface MergeResult {
  parts: Part[];
  stats: {
    input: number;
    output: number;
    merged: number;
    skippedDuplicates: number;
    rejectedNotEligible: number;
  };
}

/**
 * Live-catalogue eligibility gate.
 * Public web references require an attributable URL. The one exception is the
 * user-supplied RENPAR MOIS 11 PDF: those rows are attributable by document + page,
 * and are published only as SOURCE-LISTED (never as verified fitment).
 * `needs-verification`, `unverified`, and `rejected` are never eligible.
 */
const LIVE_OK: VerificationStatus[] = ['verified', 'source-listed', 'cross-checked'];

function hasSuppliedRenparProvenance(part: Part): boolean {
  const specs = part.specifications ?? {};
  const page = Number(specs.sourcePage);
  if (
    specs.sourceDocument !== 'RENPAR MOIS 11.pdf' ||
    !Number.isInteger(page) ||
    page < 1 ||
    !specs.aftermarketReference?.trim()
  ) {
    return false;
  }

  return (part.sources ?? []).some(
    (source) =>
      source.type === 'parts-catalog' &&
      source.name === `RENPAR MOIS 11.pdf — page ${page}` &&
      !source.url,
  );
}


function hasSuppliedDafCatalogueProvenance(part: Part): boolean {
  const specs = part.specifications ?? {};
  const row = Number(specs.sourceRow);
  if (
    specs.sourceDocument !== 'Catalogue Poids Lourds PRO 2026.html' ||
    !Number.isInteger(row) ||
    row < 1
  ) return false;

  return (part.sources ?? []).some(
    (source) =>
      source.type === 'parts-catalog' &&
      source.name === `Catalogue Poids Lourds PRO 2026.html, row ${row}` &&
      !source.url,
  );
}

export function isLiveCatalogueEligible(part: Part): boolean {
  if (!LIVE_OK.includes(part.verificationStatus)) return false;
  const refs = part.oemReferences ?? [];
  const hasRenparSource = hasSuppliedRenparProvenance(part);
  const hasDafSource = hasSuppliedDafCatalogueProvenance(part);
  const hasSuppliedLocalSource = hasRenparSource || hasDafSource;

  // A source-listed aftermarket part number is a valid catalogue entry even when
  // the supplied source does not state an OEM number. It is never relabelled as OEM.
  if (refs.length === 0) return hasSuppliedLocalSource;

  return refs.some((ref) => {
    if (!ref.referenceNumber?.trim() || !LIVE_OK.includes(ref.verificationStatus)) return false;

    if (ref.verificationStatus === 'verified') {
      return Boolean(ref.source && /^https?:\/\//i.test(ref.source)) &&
        isVerifiedOEMReference(ref);
    }

    if (ref.source && /^https?:\/\//i.test(ref.source)) return true;

    // Allow a local-document citation only when the part carries the exact matching
    // source document/page metadata. No arbitrary non-URL references are accepted.
    const expectedRenparCitation = `RENPAR MOIS 11.pdf, page ${part.specifications?.sourcePage}`;
    const expectedDafCitation = `Catalogue Poids Lourds PRO 2026.html, row ${part.specifications?.sourceRow}`;
    return ref.evidenceLevel === 'parts-catalog' && (
      (hasRenparSource && ref.source === expectedRenparCitation) ||
      (hasDafSource && ref.source === expectedDafCitation)
    );
  });
}

function allReferenceKeys(part: Part): string[] {
  const keys: string[] = [];
  if (part.id) keys.push(normalizeReference(part.id));
  const aftermarket = part.specifications?.aftermarketReference;
  if (aftermarket) keys.push(normalizeReference(aftermarket));
  for (const oem of part.oemReferences || []) {
    keys.push(normalizeReference(oem.referenceNumber));
    for (const alt of oem.alternateNumbers || []) {
      keys.push(normalizeReference(alt));
    }
  }
  return keys.filter(Boolean);
}

function mergeOemReferences(existing: OEMReference[], incoming: OEMReference[]): OEMReference[] {
  const byNorm = new Map<string, OEMReference>();

  const rank = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return 5;
      case 'cross-checked':
        return 4;
      case 'source-listed':
        return 3;
      case 'needs-verification':
        return 2;
      case 'unverified':
        return 1;
      case 'rejected':
      default:
        return 0;
    }
  };

  for (const ref of [...existing, ...incoming]) {
    const key = normalizeReference(ref.referenceNumber);
    if (!key) continue;
    const prev = byNorm.get(key);
    if (!prev) {
      byNorm.set(key, { ...ref });
      continue;
    }
    // Keep the stronger verification status; never invent upgrades beyond what sources provide.
    const keep =
      rank(ref.verificationStatus) > rank(prev.verificationStatus)
        ? {
            ...ref,
            alternateNumbers: Array.from(
              new Set([...(prev.alternateNumbers || []), ...(ref.alternateNumbers || [])]),
            ),
          }
        : {
            ...prev,
            alternateNumbers: Array.from(
              new Set([
                ...(prev.alternateNumbers || []),
                ...(ref.alternateNumbers || []),
                ref.referenceNumber,
              ]),
            ).filter((n) => normalizeReference(n) !== key),
          };
    byNorm.set(key, keep);
  }

  return Array.from(byNorm.values());
}

function mergeSources(existing: Source[], incoming: Source[]): Source[] {
  const seen = new Set<string>();
  const result: Source[] = [];
  for (const source of [...existing, ...incoming]) {
    const key = `${source.name}|${source.url || ''}|${source.type}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(source);
  }
  return result;
}

function preferVerification(
  a: VerificationStatus,
  b: VerificationStatus,
): VerificationStatus {
  const order: VerificationStatus[] = [
    'verified',
    'cross-checked',
    'source-listed',
    'needs-verification',
    'unverified',
    'rejected',
  ];
  const ia = order.indexOf(a);
  const ib = order.indexOf(b);
  if (ia < 0) return b;
  if (ib < 0) return a;
  return ia <= ib ? a : b;
}

function shouldKeepDistinctAftermarketRecords(existing: Part, incoming: Part): boolean {
  const involvesRenpar =
    existing.specifications?.sourceDocument === 'RENPAR MOIS 11.pdf' ||
    incoming.specifications?.sourceDocument === 'RENPAR MOIS 11.pdf';
  if (!involvesRenpar) return false;

  const existingSku = normalizeReference(existing.specifications?.aftermarketReference ?? '');
  const incomingSku = normalizeReference(incoming.specifications?.aftermarketReference ?? '');
  return Boolean(existingSku && incomingSku && existingSku !== incomingSku);
}

/**
 * Merge an incoming part into an existing one, preserving provenance and stronger evidence.
 */
export function mergeParts(existing: Part, incoming: Part): Part {
  const aftermarketReference =
    existing.specifications?.aftermarketReference ||
    incoming.specifications?.aftermarketReference ||
    '';

  const aftermarketBrands = Array.from(
    new Set(
      [
        ...(existing.specifications?.aftermarketBrands || '').split(','),
        ...(incoming.specifications?.aftermarketBrands || '').split(','),
      ]
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ).join(', ');

  return {
    ...existing,
    description: existing.description || incoming.description,
    oemReferences: mergeOemReferences(existing.oemReferences || [], incoming.oemReferences || []),
    crossReferences: [...(existing.crossReferences || []), ...(incoming.crossReferences || [])],
    sources: mergeSources(existing.sources || [], incoming.sources || []),
    specifications: {
      ...(incoming.specifications || {}),
      ...(existing.specifications || {}),
      aftermarketReference,
      aftermarketBrands,
    },
    verificationStatus: preferVerification(existing.verificationStatus, incoming.verificationStatus),
    updatedAt: new Date().toISOString(),
    images: existing.images?.length ? existing.images : incoming.images,
  };
}

/**
 * Deduplicate a list of parts by normalized ID / OEM / aftermarket references.
 * When a collision is found, sources are merged into the first occurrence.
 * Optionally filters out non-eligible (discovery-only) rows when `liveOnly` is true.
 */
export function deduplicateAndMerge(parts: Part[], options?: { liveOnly?: boolean }): MergeResult {
  const liveOnly = options?.liveOnly !== false; // default: enforce live eligibility
  // A reference can legitimately point to multiple aftermarket SKUs. Keep all
  // matching candidates so separate supplier catalogue items are not lost.
  const index = new Map<string, number[]>();
  const result: Part[] = [];
  let merged = 0;
  let skippedDuplicates = 0;
  let rejectedNotEligible = 0;

  const indexPart = (part: Part, partIndex: number) => {
    for (const key of allReferenceKeys(part)) {
      const candidates = index.get(key) ?? [];
      if (!candidates.includes(partIndex)) candidates.push(partIndex);
      index.set(key, candidates);
    }
  };

  for (const part of parts) {
    if (liveOnly && !isLiveCatalogueEligible(part)) {
      rejectedNotEligible += 1;
      continue;
    }

    const keys = allReferenceKeys(part);
    let matchIndex = -1;
    for (const key of keys) {
      for (const candidateIndex of index.get(key) ?? []) {
        if (shouldKeepDistinctAftermarketRecords(result[candidateIndex], part)) continue;
        matchIndex = candidateIndex;
        break;
      }
      if (matchIndex >= 0) break;
    }

    if (matchIndex >= 0) {
      result[matchIndex] = mergeParts(result[matchIndex], part);
      indexPart(result[matchIndex], matchIndex);
      merged += 1;
      skippedDuplicates += 1;
      continue;
    }

    const nextIndex = result.length;
    result.push(part);
    indexPart(part, nextIndex);
  }

  return {
    parts: result,
    stats: {
      input: parts.length,
      output: result.length,
      merged,
      skippedDuplicates,
      rejectedNotEligible,
    },
  };
}

/** Build a reverse index: normalized reference -> part ids */
export function buildReferenceIndex(parts: Part[]): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const part of parts) {
    for (const key of allReferenceKeys(part)) {
      const list = map.get(key) || [];
      if (!list.includes(part.id)) list.push(part.id);
      map.set(key, list);
    }
  }
  return map;
}

export function findByNormalizedReference(
  index: Map<string, string[]>,
  partsById: Map<string, Part>,
  query: string,
): Part[] {
  const key = normalizeReference(query);
  if (!key) return [];
  const ids = index.get(key) || [];
  return ids.map((id) => partsById.get(id)).filter((p): p is Part => Boolean(p));
}

export { referenceIdentityKey, LIVE_OK };
