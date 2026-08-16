'use client';

import { useState, useCallback, FormEvent, ChangeEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
}

export default function SearchBar({
  placeholder = 'Search OEM, part number, truck model...',
  onSearch,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const runSearch = useCallback(
    (searchQuery: string) => {
      const trimmed = searchQuery.trim();
      if (!trimmed) return;
      setIsLoading(true);
      onSearch?.(trimmed);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      // Loading state is short-lived; the target page will take over
      setTimeout(() => setIsLoading(false), 400);
    },
    [onSearch, router],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full" role="search">
      <div className="relative flex items-center">
        <label htmlFor="global-search" className="sr-only">
          Search parts
        </label>
        <input
          id="global-search"
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          enterKeyHint="search"
          className="w-full rounded-xl border border-slate-600/60 bg-slate-900/80 px-5 py-4 pl-12 pr-14 text-base font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] outline-none transition placeholder:text-slate-500 focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/15"
        />
        <Search className="pointer-events-none absolute left-4 text-slate-500" size={20} aria-hidden />
        {isLoading ? (
          <Loader2 className="absolute right-4 animate-spin text-sky-400" size={20} aria-hidden />
        ) : (
          <button
            type="submit"
            className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500 text-slate-950 transition hover:bg-sky-400"
            aria-label="Search"
          >
            <Search size={17} />
          </button>
        )}
      </div>
    </form>
  );
}
