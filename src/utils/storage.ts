/**
 * Client-side storage utilities for favorites and search history
 */

const FAVORITES_KEY = 'ntparts-favorites';
const SEARCH_HISTORY_KEY = 'ntparts-search-history';
const MAX_SEARCH_HISTORY = 50;

export interface StoredFavorite { partId: string; addedAt: string; }
export interface StoredSearchItem { query: string; timestamp: string; type: 'text' | 'image' | 'filter'; }

export const favoritesStorage = {
  get: (): StoredFavorite[] => {
    if (typeof window === 'undefined') return [];
    try { const stored = localStorage.getItem(FAVORITES_KEY); return stored ? JSON.parse(stored) : []; }
    catch { return []; }
  },
  add: (partId: string): void => {
    if (typeof window === 'undefined') return;
    try { const favorites = favoritesStorage.get(); if (!favorites.some((f) => f.partId === partId)) { favorites.push({ partId, addedAt: new Date().toISOString() }); localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); } }
    catch { /* ignore storage errors */ }
  },
  remove: (partId: string): void => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoritesStorage.get().filter((f) => f.partId !== partId))); }
    catch { /* ignore storage errors */ }
  },
  isFavorite: (partId: string): boolean => favoritesStorage.get().some((f) => f.partId === partId),
};

export const searchHistoryStorage = {
  get: (): StoredSearchItem[] => {
    if (typeof window === 'undefined') return [];
    try { const stored = localStorage.getItem(SEARCH_HISTORY_KEY); return stored ? JSON.parse(stored) : []; }
    catch { return []; }
  },
  add: (query: string, type: 'text' | 'image' | 'filter' = 'text'): void => {
    if (typeof window === 'undefined') return;
    try { let history = searchHistoryStorage.get().filter((item) => item.query !== query); history.unshift({ query, type, timestamp: new Date().toISOString() }); localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_SEARCH_HISTORY))); }
    catch { /* ignore storage errors */ }
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    try { localStorage.removeItem(SEARCH_HISTORY_KEY); } catch { /* ignore storage errors */ }
  },
};
