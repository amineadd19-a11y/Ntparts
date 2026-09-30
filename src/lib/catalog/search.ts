/**
 * NTParts — Canonical catalogue search engine
 *
 * ONE implementation used by:
 * - website search
 * - OEM / reference lookup
 * - cross-reference lookup
 * - AI / PartMind tools
 * - manufacturer / model filters
 *
 * Pipeline:
 *   query
 *     → normalization
 *     → exact reference / OEM lookup
 *     → cross-reference lookup
 *     → manufacturer / model matching
 *     → text relevance
 *     → verification-aware ranking
 *
 * Exact verified OEM matches always outrank fuzzy text hits.
 * Never invents OEM numbers or compatibility.
 */

import type { Part, VerificationStatus } from '@/types';
import { CATALOG_PARTS } from '@/data/catalog';
import { normalizeReference } from '@/lib/catalog/normalize';
import { lookupByReference } from '@/lib/catalog/indexes';

export type MatchKind =
  | 'exact-verified-oem'
  | 'exact-source-listed-oem'
  | 'exact-oem'
  | 'partial-oem'
  | 'aftermarket'
  | 'manufacturer-model'
  | 'text';

export interface ScoredPart {
  part: Part;
  score: number;
  matchKind: MatchKind;
  verificationStatus: VerificationStatus;
}

export interface CanonicalSearchOptions {
  /** Limit result count (default 50). */
  limit?: number;
  /** Optional category filter. */
  category?: string;
  /** Prefer only parts with at least one verified OEM. */
  verifiedOnly?: boolean;
  /** Override catalogue source (tests). */
  parts?: Part[];
}

export interface CanonicalSearchResult {
  query: string;
  normalizedQuery: string;
  results: ScoredPart[];
  total: number;
}

const MATCH_RANK: Record<MatchKind, number> = {
  'exact-verified-oem': 70,
  'exact-source-listed-oem': 60,
  'exact-oem': 50,
  'partial-oem': 40,
  aftermarket: 30,
  'manufacturer-model': 20,
  text: 10,
};

function upgradeMatchKind(current: MatchKind, next: MatchKind): MatchKind {
  return MATCH_RANK[next] > MATCH_RANK[current] ? next : current;
}

function softNormalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function list(value?: string): string[] {
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];
}

function oemNumbers(part: Part): string[] {
  return (part.oemReferences ?? []).flatMap((oem) => [
    oem.referenceNumber,
    ...(oem.alternateNumbers ?? []),
  ]);
}

function bestOemStatus(part: Part): VerificationStatus {
  const refs = part.oemReferences ?? [];
  if (refs.some((r) => r.verificationStatus === 'verified')) return 'verified';
  if (refs.some((r) => r.verificationStatus === 'cross-checked')) return 'cross-checked';
  if (refs.some((r) => r.verificationStatus === 'source-listed')) return 'source-listed';
  if (refs.some((r) => r.verificationStatus === 'needs-verification')) return 'needs-verification';
  if (part.verificationStatus) return part.verificationStatus;
  return 'unverified';
}

/**
 * Score a single part against a normalized query.
 * Higher = better. Exact verified OEM >> fuzzy text.
 */
export function scorePart(part: Part, query: string): ScoredPart | null {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 1) return null;

  const qSoft = softNormalize(trimmed);
  const qNorm = normalizeReference(trimmed);
  if (!qSoft && !qNorm) return null;

  let score = 0;
  let matchKind: MatchKind = 'text';

  // --- OEM / reference layer ---
  for (const oem of part.oemReferences ?? []) {
    const isVerified = oem.verificationStatus === 'verified';
    const isSourceListed =
      oem.verificationStatus === 'source-listed' || oem.verificationStatus === 'cross-checked';

    const candidates = [oem.referenceNumber, ...(oem.alternateNumbers ?? [])];
    for (const candidate of candidates) {
      const cSoft = softNormalize(candidate);
      const cNorm = normalizeReference(candidate);
      if (!cSoft && !cNorm) continue;

      if (cSoft === qSoft || cNorm === qNorm) {
        if (isVerified) {
          score = Math.max(score, 320);
          matchKind = upgradeMatchKind(matchKind, 'exact-verified-oem');
        } else if (isSourceListed) {
          score = Math.max(score, 260);
          matchKind = upgradeMatchKind(matchKind, 'exact-source-listed-oem');
        } else {
          score = Math.max(score, 200);
          matchKind = upgradeMatchKind(matchKind, 'exact-oem');
        }
      } else if (
        (qNorm.length >= 3 && (cNorm.includes(qNorm) || qNorm.includes(cNorm))) ||
        (qSoft.length >= 3 && (cSoft.includes(qSoft) || qSoft.includes(cSoft)))
      ) {
        const partial = isVerified ? 160 : isSourceListed ? 130 : 100;
        if (partial > score) {
          score = partial;
          matchKind = upgradeMatchKind(matchKind, 'partial-oem');
        }
      }
    }
  }

  // --- Aftermarket reference ---
  const aftermarket = part.specifications?.aftermarketReference || '';
  if (aftermarket) {
    const aSoft = softNormalize(aftermarket);
    const aNorm = normalizeReference(aftermarket);
    if (aSoft === qSoft || aNorm === qNorm) {
      if (score < 180) {
        score = 180;
        matchKind = upgradeMatchKind(matchKind, 'aftermarket');
      }
    } else if (qSoft.length >= 3 && (aSoft.includes(qSoft) || qSoft.includes(aSoft))) {
      if (score < 90) {
        score = 90;
        matchKind = upgradeMatchKind(matchKind, 'aftermarket');
      }
    }
  }

  // --- Manufacturer / model ---
  const manufacturer = softNormalize(part.specifications?.manufacturer || '');
  const manufacturerId = softNormalize(part.specifications?.manufacturerId || '');
  const model = softNormalize(part.specifications?.model || '');
  if (
    (manufacturer && (manufacturer === qSoft || manufacturer.includes(qSoft))) ||
    (manufacturerId && (manufacturerId === qSoft || manufacturerId.includes(qSoft))) ||
    (model && (model === qSoft || model.includes(qSoft)))
  ) {
    const mScore = manufacturer === qSoft || model === qSoft ? 70 : 40;
    if (mScore > score) {
      score = mScore;
      matchKind = upgradeMatchKind(matchKind, 'manufacturer-model');
    }
  }

  // --- Text relevance (name, category, description, tags, brands) ---
  const name = softNormalize(part.name);
  const category = softNormalize(part.category);
  const description = softNormalize(part.description || '');
  const tags = softNormalize(list(part.specifications?.tags).join(' '));
  const brands = softNormalize(list(part.specifications?.aftermarketBrands).join(' '));

  if (name === qSoft) score = Math.max(score, 100);
  else if (name.startsWith(qSoft)) score = Math.max(score, 70);
  else if (qSoft.length >= 2 && name.includes(qSoft)) score = Math.max(score, 45);

  if (category === qSoft) score = Math.max(score, 35);
  else if (qSoft.length >= 2 && category.includes(qSoft)) score = Math.max(score, 18);

  if (qSoft.length >= 3 && description.includes(qSoft)) score = Math.max(score, 12);
  if (qSoft.length >= 3 && tags.includes(qSoft)) score = Math.max(score, 15);
  if (qSoft.length >= 3 && brands.includes(qSoft)) score = Math.max(score, 20);

  // Cross-references
  for (const xr of part.crossReferences || []) {
    const xrId = softNormalize(xr.referencedPartId);
    if (xrId === qSoft) score = Math.max(score, 80);
    else if (qSoft.length >= 3 && xrId.includes(qSoft)) score = Math.max(score, 40);
  }

  // Small boost when query looks like a part number and part has verified OEM
  if (
    /^[a-z0-9]{5,}$/i.test(qSoft) &&
    (part.oemReferences ?? []).some((o) => o.verificationStatus === 'verified')
  ) {
    score += 15;
  }

  if (score <= 0) return null;

  return {
    part,
    score,
    matchKind,
    verificationStatus: bestOemStatus(part),
  };
}

/**
 * Canonical search entry point.
 */
export function searchCatalogue(
  query: string,
  options: CanonicalSearchOptions = {},
): CanonicalSearchResult {
  const trimmed = query.trim();
  const limit = options.limit ?? 50;
  const parts = options.parts ?? CATALOG_PARTS;
  const normalizedQuery = normalizeReference(trimmed);

  if (!trimmed) {
    return { query: trimmed, normalizedQuery, results: [], total: 0 };
  }

  // Fast path: exact normalized reference hits from the index (live catalogue)
  const exactHits = options.parts === undefined ? lookupByReference(trimmed) : [];
  const exactIds = new Set(exactHits.map((p) => p.id));

  const scored: ScoredPart[] = [];

  for (const part of parts) {
    if (options.category && options.category !== 'all') {
      if (part.category.toLowerCase() !== options.category.toLowerCase()) continue;
    }
    if (options.verifiedOnly) {
      const hasVerified = (part.oemReferences ?? []).some(
        (r) => r.verificationStatus === 'verified',
      );
      if (!hasVerified) continue;
    }

    const result = scorePart(part, trimmed);
    if (!result) continue;

    // Boost exact index hits so they never lose to pure text
    if (exactIds.has(part.id)) {
      result.score += 50;
      if (MATCH_RANK[result.matchKind] < MATCH_RANK['exact-oem']) {
        result.matchKind = 'exact-oem';
      }
    }

    scored.push(result);
  }

  scored.sort(
    (a, b) => b.score - a.score || a.part.name.localeCompare(b.part.name),
  );

  const limited = scored.slice(0, limit);

  return {
    query: trimmed,
    normalizedQuery,
    results: limited,
    total: scored.length,
  };
}

/** Convenience: parts only (legacy-compatible). */
export function searchCatalogueParts(
  query: string,
  options?: CanonicalSearchOptions,
): Part[] {
  return searchCatalogue(query, options).results.map((r) => r.part);
}

/** Exact / normalized OEM lookup (strongest path). */
export function searchByOem(reference: string, options?: CanonicalSearchOptions): Part[] {
  const result = searchCatalogue(reference, { ...options, limit: options?.limit ?? 30 });
  return result.results
    .filter((r) => MATCH_RANK[r.matchKind] >= MATCH_RANK['partial-oem'])
    .map((r) => r.part);
}

/** Cross-reference style scan (still evidence-bound to catalogue). */
export function searchCrossReferencesCanonical(query: string) {
  const normalized = softNormalize(query);
  if (!normalized) return [];
  return CATALOG_PARTS.flatMap((part) =>
    (part.crossReferences || []).map((crossReference) => ({
      ...crossReference,
      partId: part.id,
      manufacturerId: part.specifications?.manufacturerId || '',
      partTemplateSlug: part.id.split('-').slice(1).join('-'),
      description: crossReference.notes || crossReference.relationshipType,
      numbers: oemNumbers(part),
      verificationStatus: bestOemStatus(part),
    })),
  ).filter((reference) => {
    const haystack = [
      reference.referencedPartId,
      reference.partId,
      reference.manufacturerId,
      reference.description,
      ...reference.numbers,
    ].join(' ');
    return softNormalize(haystack).includes(normalized);
  });
}

export function searchByAnyReference(query: string) {
  const normalized = query.trim();
  if (!normalized || normalized.length < 2) {
    return { parts: [] as Part[], crossReferences: [], total: 0 };
  }
  const parts = searchCatalogueParts(normalized);
  const crossReferences = searchCrossReferencesCanonical(normalized);
  return { parts, crossReferences, total: parts.length + crossReferences.length };
}
