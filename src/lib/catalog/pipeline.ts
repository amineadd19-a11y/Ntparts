/**
 * NTParts catalogue import / merge pipeline.
 *
 * Rules:
 * - Never invent OEM numbers, compatibility, or technical claims.
 * - Prefer merging sources into an existing entity over creating duplicates.
 * - Preserve provenance (sources) on merge.
 * - Never upgrade SOURCE-LISTED / NOT VERIFIED to VERIFIED without explicit evidence.
 */

import type { Part, OEMReference, Source } from '@/types';
import { normalizeReference, referenceIdentityKey } from './normalize';

export type IncomingPart = Part;

export interface MergeResult {
  parts: Part[];
  stats: {
    input: number;
    output: number;
    merged: number;
    skippedDuplicates: number;
  };
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

  const rank = (status: OEMReference['verificationStatus']) =>
    status === 'verified' ? 3 : status === 'source-listed' ? 2 : 1;

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
  a: Part['verificationStatus'],
  b: Part['verificationStatus'],
): Part['verificationStatus'] {
  const order: Part['verificationStatus'][] = ['verified', 'cross-checked', 'needs-verification'];
  return order.indexOf(a) <= order.indexOf(b) ? a : b;
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
 */
export function deduplicateAndMerge(parts: Part[]): MergeResult {
  const index = new Map<string, number>();
  const result: Part[] = [];
  let merged = 0;
  let skippedDuplicates = 0;

  for (const part of parts) {
    const keys = allReferenceKeys(part);
    let matchIndex = -1;
    for (const key of keys) {
      if (index.has(key)) {
        matchIndex = index.get(key)!;
        break;
      }
    }

    if (matchIndex >= 0) {
      result[matchIndex] = mergeParts(result[matchIndex], part);
      for (const key of allReferenceKeys(result[matchIndex])) {
        index.set(key, matchIndex);
      }
      merged += 1;
      skippedDuplicates += 1;
      continue;
    }

    const nextIndex = result.length;
    result.push(part);
    for (const key of keys) {
      index.set(key, nextIndex);
    }
  }

  return {
    parts: result,
    stats: {
      input: parts.length,
      output: result.length,
      merged,
      skippedDuplicates,
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

export { referenceIdentityKey };
