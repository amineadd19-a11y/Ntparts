/**
 * In-memory catalogue indexes for fast reference lookup.
 * Built once at module load; safe for serverless cold starts with current catalogue size.
 */

import type { Part } from '@/types';
import { CATALOG_PARTS } from '@/data/catalog';
import { buildReferenceIndex, findByNormalizedReference } from './pipeline';
import { normalizeReference } from './normalize';

const partsById = new Map<string, Part>();
for (const part of CATALOG_PARTS) {
  partsById.set(part.id, part);
}

const referenceIndex = buildReferenceIndex(CATALOG_PARTS);

/** Exact normalized reference lookup (OEM or aftermarket). */
export function lookupByReference(query: string): Part[] {
  return findByNormalizedReference(referenceIndex, partsById, query);
}

/** Prefix / contains scan limited for safety on large catalogues. */
export function lookupByPartialReference(query: string, limit = 50): Part[] {
  const key = normalizeReference(query);
  if (!key || key.length < 3) return [];
  const hits: Part[] = [];
  const seen = new Set<string>();
  for (const [ref, ids] of referenceIndex) {
    if (ref.includes(key) || key.includes(ref)) {
      for (const id of ids) {
        if (seen.has(id)) continue;
        const part = partsById.get(id);
        if (part) {
          hits.push(part);
          seen.add(id);
          if (hits.length >= limit) return hits;
        }
      }
    }
  }
  return hits;
}

export function getCatalogueSize(): number {
  return CATALOG_PARTS.length;
}

export function getPartFromIndex(id: string): Part | undefined {
  return partsById.get(id);
}
