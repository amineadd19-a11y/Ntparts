/**
 * Global state management using Zustand
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  language: 'en' | 'fr' | 'ar';
  setLanguage: (lang: 'en' | 'fr' | 'ar') => void;
  favorites: string[];
  toggleFavorite: (partId: string) => void;
  isFavorite: (partId: string) => boolean;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  recentParts: string[];
  addRecentPart: (partId: string) => void;
  selectedManufacturer: string | null;
  setSelectedManufacturer: (id: string | null) => void;
  selectedModel: string | null;
  setSelectedModel: (id: string | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      language: 'fr',
      setLanguage: (lang) => set({ language: lang }),
      favorites: [],
      toggleFavorite: (partId) =>
        set((state) => ({
          favorites: state.favorites.includes(partId)
            ? state.favorites.filter((id) => id !== partId)
            : [...state.favorites, partId],
        })),
      isFavorite: (partId) => get().favorites.includes(partId),
      searchHistory: [],
      addToSearchHistory: (query) =>
        set((state) => ({
          searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 20),
        })),
      clearSearchHistory: () => set({ searchHistory: [] }),
      recentParts: [],
      addRecentPart: (partId) =>
        set((state) => ({
          recentParts: [partId, ...state.recentParts.filter((id) => id !== partId)].slice(0, 10),
        })),
      selectedManufacturer: null,
      setSelectedManufacturer: (id) => set({ selectedManufacturer: id }),
      selectedModel: null,
      setSelectedModel: (id) => set({ selectedModel: id }),
    }),
    {
      name: 'ntparts-store-v3',
      partialize: (s) => ({
        language: s.language,
        favorites: s.favorites,
        searchHistory: s.searchHistory.slice(0, 10),
        recentParts: s.recentParts.slice(0, 10),
      }),
    }
  )
);
