'use client';

import { useState, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { debounce } from '@/utils/search';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ placeholder = 'Search...', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.trim()) {
        setIsLoading(true);
        onSearch?.(searchQuery);
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        setIsLoading(false);
      }
    }, 300),
    [onSearch, router]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-600/60 bg-slate-900/80 px-5 py-4 pl-12 pr-14 text-base font-medium text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] outline-none transition placeholder:text-slate-500 focus:border-sky-500/60 focus:ring-4 focus:ring-sky-500/15"
          aria-label="Search parts"
        />
        <Search className="absolute left-4 text-slate-500" size={20} />
        {isLoading ? (
          <Loader2 className="absolute right-4 animate-spin text-sky-400" size={20} />
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
