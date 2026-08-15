'use client';

import { favoritesStorage } from '@/utils/storage';
import { CATALOG_PARTS } from '@/data/catalog';
import PartCard from '@/components/catalog/PartCard';
import EmptyState from '@/components/states/EmptyState';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function FavoritesPage() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const [favorites, setFavorites] = useState<typeof CATALOG_PARTS>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const favIds = favoritesStorage.get().map((f) => f.partId); setFavorites(CATALOG_PARTS.filter((p) => favIds.includes(p.id))); setIsLoading(false); }, []);
  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-12">Loading favorites…</div>;
  return <div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-gray-900 mb-8">{t('nav.favorites')}</h1>{favorites.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{favorites.map((part) => <PartCard key={part.id} part={part} />)}</div> : <EmptyState title="No Favorites Yet" message="Add parts to your favorites to view them here." actionLabel="Browse Parts" actionHref="/parts" />}</div>;
}
