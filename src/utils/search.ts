/**
 * NTParts search utilities — thin facade over the canonical catalogue search engine.
 * Prefer importing from `@/lib/catalog/search` for new code.
 */

import type { Part } from '@/types';
import { CATALOG_PARTS } from '@/data/catalog';
import {
  searchCatalogue,
  searchCatalogueParts,
  searchByAnyReference,
  searchCrossReferencesCanonical,
  scorePart,
} from '@/lib/catalog/search';

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/** @deprecated Prefer searchCatalogue from @/lib/catalog/search */
export const searchParts = (query: string, parts: Part[] = CATALOG_PARTS): Part[] => {
  return searchCatalogueParts(query, { parts, limit: 200 });
};

export const filterPartsByCategory = (parts: Part[], category: string): Part[] =>
  parts.filter((part) => part.category === category);

export const sortPartsByRelevance = (parts: Part[], query: string): Part[] =>
  [...parts].sort((a, b) => {
    const scoreA = scorePart(a, query)?.score ?? 0;
    const scoreB = scorePart(b, query)?.score ?? 0;
    return scoreB !== scoreA ? scoreB - scoreA : a.name.localeCompare(b.name);
  });

export const searchHistoryStorage = {
  get(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('searchHistory');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  },
  add(query: string): void {
    if (typeof window === 'undefined') return;
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;
    try {
      const history = this.get().filter((item) => item !== normalizedQuery);
      localStorage.setItem(
        'searchHistory',
        JSON.stringify([normalizedQuery, ...history].slice(0, 20)),
      );
    } catch {
      /* ignore */
    }
  },
  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('searchHistory');
    } catch {
      /* ignore */
    }
  },
};

class SearchCache {
  private cache: Map<string, ReturnType<typeof searchCatalogue>['results']> = new Map();
  private maxSize = 50;
  get(key: string) {
    return this.cache.get(key) || null;
  }
  set(key: string, results: ReturnType<typeof searchCatalogue>['results']): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, results);
  }
  clear(): void {
    this.cache.clear();
  }
}

export const searchCache = new SearchCache();

export function searchCrossReferences(query: string) {
  return searchCrossReferencesCanonical(query);
}

export { searchByAnyReference, searchCatalogue, searchCatalogueParts };

export function getEquivalents(oemNumber: string) {
  return searchCrossReferencesCanonical(oemNumber).map((m) => ({
    description: m.description,
    manufacturerId: m.manufacturerId,
    part: m.partTemplateSlug,
    numbers: m.numbers,
    verificationStatus: m.verificationStatus,
  }));
}
