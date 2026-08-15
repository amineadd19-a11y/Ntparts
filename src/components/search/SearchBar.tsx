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
          className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 pl-12 pr-14 text-base font-medium text-slate-900 shadow-[0_10px_40px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          aria-label="Search parts"
        />
        <Search className="absolute left-4 text-slate-400" size={20} />
        {isLoading ? (
          <Loader2 className="absolute right-4 animate-spin text-blue-600" size={20} />
        ) : (
          <button
            type="submit"
            className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
