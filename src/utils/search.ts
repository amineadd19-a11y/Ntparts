/**
 * NTParts - Smart Search Utilities
 */

import { Part, SearchResult } from '@/types';
import { CATALOG_PARTS } from '@/data/catalog';

const normalizeSearchText = (value: string): string =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const getSearchScore = (part: Part, query: string): number => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return 0;
  const name = normalizeSearchText(part.name);
  const description = normalizeSearchText(part.description || '');
  const category = normalizeSearchText(part.category);
  let score = 0;
  if (name === normalizedQuery) score += 100;
  if (name.startsWith(normalizedQuery)) score += 70;
  if (name.includes(normalizedQuery)) score += 50;
  if (category === normalizedQuery) score += 35;
  else if (category.includes(normalizedQuery)) score += 20;
  if (description.includes(normalizedQuery)) score += 15;
  for (const oem of part.oemReferences || []) {
    const reference = normalizeSearchText(oem.referenceNumber);
    if (reference === normalizedQuery) score += 200;
    else if (reference.includes(normalizedQuery)) score += 120;
    for (const alternate of oem.alternateNumbers || []) {
      const normalizedAlternate = normalizeSearchText(alternate);
      if (normalizedAlternate === normalizedQuery) score += 180;
      else if (normalizedAlternate.includes(normalizedQuery)) score += 110;
    }
  }
  for (const crossReference of part.crossReferences || []) {
    const referencedPartId = normalizeSearchText(crossReference.referencedPartId);
    if (referencedPartId === normalizedQuery) score += 80;
    else if (referencedPartId.includes(normalizedQuery)) score += 40;
  }
  for (const [key, value] of Object.entries(part.specifications || {})) {
    const normalizedKey = normalizeSearchText(key);
    const normalizedValue = normalizeSearchText(value);
    if (normalizedValue === normalizedQuery) score += 60;
    else if (normalizedValue.includes(normalizedQuery)) score += 30;
    if (normalizedKey.includes(normalizedQuery)) score += 10;
  }
  return score;
};

export const searchParts = (query: string, parts: Part[] = CATALOG_PARTS): Part[] => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];
  return parts.map((part) => ({ part, score: getSearchScore(part, trimmedQuery) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.part.name.localeCompare(b.part.name))
    .map((result) => result.part);
};

export const filterPartsByCategory = (parts: Part[], category: string): Part[] =>
  parts.filter((part) => part.category === category);

export const sortPartsByRelevance = (parts: Part[], query: string): Part[] =>
  [...parts].sort((a, b) => {
    const scoreA = getSearchScore(a, query);
    const scoreB = getSearchScore(b, query);
    return scoreB !== scoreA ? scoreB - scoreA : a.name.localeCompare(b.name);
  });

export const searchHistoryStorage = {
  get(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('searchHistory');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch { return []; }
  },
  add(query: string): void {
    if (typeof window === 'undefined') return;
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;
    try {
      const history = this.get().filter((item) => item !== normalizedQuery);
      localStorage.setItem('searchHistory', JSON.stringify([normalizedQuery, ...history].slice(0, 20)));
    } catch { /* ignore localStorage errors */ }
  },
  clear(): void {
    if (typeof window === 'undefined') return;
    try { localStorage.removeItem('searchHistory'); } catch { /* ignore localStorage errors */ }
  },
};

class SearchCache {
  private cache: Map<string, SearchResult[]> = new Map();
  private maxSize = 50;
  get(key: string): SearchResult[] | null { return this.cache.get(key) || null; }
  set(key: string, results: SearchResult[]): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, results);
  }
  clear(): void { this.cache.clear(); }
}

export const searchCache = new SearchCache();

/** Find parts and explicit cross-reference records already present in the catalog. */
export function searchCrossReferences(query: string) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  return CATALOG_PARTS.flatMap((part) => (part.crossReferences || []).map((crossReference) => ({
    ...crossReference,
    partId: part.id,
    manufacturerId: part.specifications?.manufacturerId || '',
    partTemplateSlug: part.id.split('-').slice(1).join('-'),
    description: crossReference.notes || crossReference.relationshipType,
    numbers: part.oemReferences.flatMap((oem) => [oem.referenceNumber, ...(oem.alternateNumbers || [])]),
  }))).filter((reference) => {
    const haystack = [reference.referencedPartId, reference.partId, reference.manufacturerId, reference.description, ...reference.numbers].join(' ');
    return normalizeSearchText(haystack).includes(normalized);
  });
}

export function searchByAnyReference(query: string) {
  const normalized = query.trim();
  if (!normalized || normalized.length < 2) return { parts: [], crossReferences: [], total: 0 };
  const parts = searchParts(normalized);
  const crossReferences = searchCrossReferences(normalized);
  return { parts, crossReferences, total: parts.length + crossReferences.length };
}

export function getEquivalents(oemNumber: string) {
  return searchCrossReferences(oemNumber).map((m) => ({
    description: m.description,
    manufacturerId: m.manufacturerId,
    part: m.partTemplateSlug,
    numbers: m.numbers,
  }));
}
