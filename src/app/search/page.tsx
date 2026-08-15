'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/search/SearchBar';
import PartCard from '@/components/catalog/PartCard';
import LoadingState from '@/components/states/LoadingState';
import EmptyState from '@/components/states/EmptyState';
import AdSlot from '@/components/ads/AdSlot';
import { searchParts } from '@/utils/search';
import { CATALOG_PARTS } from '@/data/catalog';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { language, addToSearchHistory } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const [results, setResults] = useState(() => searchParts(query, CATALOG_PARTS));
  const [isLoading] = useState(false);
  useEffect(() => { setResults(searchParts(query, CATALOG_PARTS)); }, [query]);
  useEffect(() => { if (query && results.length === 0 && !isLoading) addToSearchHistory(query); }, [query, results.length, isLoading, addToSearchHistory]);
  return <div className="max-w-7xl mx-auto px-4 py-8"><div className="mb-8"><h1 className="text-3xl font-bold text-gray-900 mb-4">{t('search.title')}</h1><SearchBar placeholder={t('home.searchPlaceholder')} /></div>{query ? <><div className="mb-6"><p className="text-gray-600">{t('search.results')}: <span className="font-semibold">{results.length}</span> {t('common.demo')}</p></div><div className="mb-8"><AdSlot placement="search-top" /></div>{results.length > 0 ? <><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">{results.map((part) => <PartCard key={part.id} part={part} />)}</div><div className="mt-8"><AdSlot placement="search-bottom" /></div></> : <EmptyState title={t('search.noResults')} message={t('search.noResults')} actionLabel={t('nav.home')} actionHref="/" />}</> : <EmptyState title="Start Searching" message="Use the search bar above to find truck parts by name, OEM reference, or truck model." actionLabel={t('nav.home')} actionHref="/" />}</div>;
}

export default function SearchPage() { return <Suspense fallback={<LoadingState />}><SearchPageContent /></Suspense>; }
