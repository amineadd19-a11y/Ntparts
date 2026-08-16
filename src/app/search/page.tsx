'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
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
  const query = (searchParams.get('q') || '').trim();
  const { language, addToSearchHistory } = useAppStore();
  const t = (key: string) => getTranslation(key, language);

  const results = useMemo(() => (query ? searchParts(query, CATALOG_PARTS) : []), [query]);

  useEffect(() => {
    if (query) addToSearchHistory(query);
  }, [query, addToSearchHistory]);

  const verifiedCount = useMemo(
    () =>
      results.filter((p) => p.oemReferences?.some((r) => r.verificationStatus === 'verified')).length,
    [results],
  );
  const sourceListedCount = useMemo(
    () =>
      results.filter((p) => p.oemReferences?.some((r) => r.verificationStatus === 'source-listed')).length,
    [results],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900">{t('search.title')}</h1>
        <SearchBar placeholder={t('home.searchPlaceholder')} />
        <p className="mt-3 text-xs text-slate-500">
          Search prioritizes exact verified OEM, then source-listed references, then aftermarket and partial matches.
        </p>
      </div>

      {query ? (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span>
              {t('search.results')}: <span className="font-bold text-slate-900">{results.length}</span>
            </span>
            {verifiedCount > 0 && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {verifiedCount} verified OEM
              </span>
            )}
            {sourceListedCount > 0 && (
              <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                {sourceListedCount} source-listed
              </span>
            )}
          </div>

          <div className="mb-8">
            <AdSlot placement="search-top" />
          </div>

          {results.length > 0 ? (
            <>
              <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((part) => (
                  <PartCard key={part.id} part={part} />
                ))}
              </div>
              <div className="mt-8">
                <AdSlot placement="search-bottom" />
              </div>
            </>
          ) : (
            <EmptyState
              title={t('search.noResults')}
              message="No matching parts for this query. Try an OEM number, aftermarket reference, manufacturer or model."
              actionLabel={t('nav.home')}
              actionHref="/"
            />
          )}
        </>
      ) : (
        <EmptyState
          title="Start searching"
          message="Use the search bar above to find truck parts by OEM reference, part number, aftermarket code, manufacturer or model."
          actionLabel={t('nav.home')}
          actionHref="/"
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SearchPageContent />
    </Suspense>
  );
}
