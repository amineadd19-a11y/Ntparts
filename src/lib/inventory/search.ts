/**
 * Stock reference search helpers.
 * Search depends only on Reference (+ optional alternate/search refs).
 * CMUP / purchase price is never used as a search filter.
 */
import { normalizeReference } from '@/lib/catalog/normalize';

export type SearchableStockRecord = {
  reference: string;
  normalizedReference?: string;
  quantity?: number;
  searchRefs?: string[];
  gamme?: string | null;
  description?: string | null;
  manufacturer?: string | null;
  catalogMatch?: {
    name?: string;
    category?: string;
    oemReferences?: string[];
  } | null;
  /** Present for display only — MUST NOT affect search filtering. */
  purchasePrice?: number | null;
};

/**
 * True when the query matches the stock record by reference (exact / normalized / partial)
 * or by verified alternate refs / catalogue text. Never requires purchasePrice.
 */
export function matchesStockReference(
  record: SearchableStockRecord,
  query: string
): boolean {
  const qRaw = (query ?? '').trim();
  if (!qRaw) return true;

  // A record is searchable if it has a reference (and typically a quantity).
  // Missing CMUP must never exclude it.
  if (!record?.reference) return false;

  const q = qRaw.toLowerCase();
  const qNorm = normalizeReference(qRaw);

  const candidates: string[] = [
    record.reference,
    record.normalizedReference ?? '',
    ...(record.searchRefs ?? []),
    record.gamme ?? '',
    record.description ?? '',
    record.manufacturer ?? '',
    record.catalogMatch?.name ?? '',
    record.catalogMatch?.category ?? '',
    ...(record.catalogMatch?.oemReferences ?? []),
  ];

  for (const c of candidates) {
    if (!c) continue;
    const lower = String(c).toLowerCase();
    const n = normalizeReference(String(c));
    if (lower === q || n === qNorm) return true;
    if (lower.includes(q)) return true;
    if (qNorm.length >= 2 && n.includes(qNorm)) return true;
  }
  return false;
}

/** Filter stock records by query without using CMUP. */
export function filterStockByReference<T extends SearchableStockRecord>(
  records: T[],
  query: string
): T[] {
  const q = (query ?? '').trim();
  if (!q) return records;
  return records.filter((r) => matchesStockReference(r, q));
}
