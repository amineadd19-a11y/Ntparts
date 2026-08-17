'use client';

import { useState, useCallback, FormEvent, ChangeEvent, useRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  variant?: 'hero' | 'light';
}

export default function SearchBar({
  placeholder = 'Search OEM, part number, truck model...',
  onSearch,
  autoFocus = false,
  variant = 'hero',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToSearchHistory, searchHistory } = useAppStore();

  const runSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;
      setIsLoading(true);
      addToSearchHistory(trimmed);
      onSearch?.(trimmed);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setTimeout(() => setIsLoading(false), 400);
    },
    [onSearch, router, addToSearchHistory],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const isHero = variant === 'hero';

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search">
      <div className="relative flex items-center">
        <label htmlFor="global-search" className="sr-only">
          Search parts
        </label>
        <input
          ref={inputRef}
          id="global-search"
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          className={
            isHero
              ? 'w-full rounded-xl border border-slate-600/60 bg-slate-900/80 px-5 py-4 pl-12 pr-24 text-base font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] outline-none transition placeholder:text-slate-500 focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/15'
              : 'w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 pl-12 pr-24 text-base font-medium text-navy-900 shadow-nt-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100'
          }
        />
        <Search
          className={`pointer-events-none absolute left-4 ${isHero ? 'text-slate-500' : 'text-slate-400'}`}
          size={20}
          aria-hidden
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className={`absolute right-14 flex h-8 w-8 items-center justify-center rounded-lg transition ${
              isHero ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
            }`}
            aria-label="Clear"
          >
            <X size={16} />
          </button>
        )}
        {isLoading ? (
          <Loader2
            className={`absolute right-3 animate-spin ${isHero ? 'text-sky-400' : 'text-sky-600'}`}
            size={20}
            aria-hidden
          />
        ) : (
          <button
            type="submit"
            className="absolute right-2 flex h-10 items-center gap-1.5 rounded-lg bg-sky-500 px-3 text-sm font-bold text-navy-950 transition hover:bg-sky-400"
            aria-label="Search"
          >
            <Search size={16} />
            <span className="hidden sm:inline">Search</span>
          </button>
        )}
      </div>
      {searchHistory.length > 0 && query.length === 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {searchHistory.slice(0, 5).map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => runSearch(h)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                isHero
                  ? 'border border-slate-700 bg-slate-900/60 text-slate-400 hover:border-sky-500/40 hover:text-sky-300'
                  : 'border border-slate-200 bg-slate-50 text-slate-500 hover:border-sky-300 hover:text-sky-700'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}
