'use client';

import { useState, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { debounce } from '@/utils/search';
import { useRouter } from 'next/navigation';

interface SearchBarProps { placeholder?: string; onSearch?: (query: string) => void; }

export default function SearchBar({ placeholder = 'Search...', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSearch = useCallback(debounce((searchQuery: string) => { if (searchQuery.trim()) { setIsLoading(true); onSearch?.(searchQuery); router.push(`/search?q=${encodeURIComponent(searchQuery)}`); setIsLoading(false); } }, 300), [onSearch, router]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { const value = e.target.value; setQuery(value); handleSearch(value); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`); };
  return <form onSubmit={handleSubmit} className="relative w-full"><div className="relative flex items-center"><input type="text" value={query} onChange={handleChange} placeholder={placeholder} className="w-full px-4 py-3 pl-12 pr-12 text-lg rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-600 transition" aria-label="Search parts" /><Search className="absolute left-4 text-gray-400" size={20} />{isLoading ? <Loader2 className="absolute right-4 text-blue-600 animate-spin" size={20} /> : <button type="submit" className="absolute right-4 text-gray-400 hover:text-gray-600" aria-label="Search"><Search size={20} /></button>}</div></form>;
}
