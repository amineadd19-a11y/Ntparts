'use client';

import { CATALOG_PARTS } from '@/data/catalog';
import PartCard from '@/components/catalog/PartCard';
import AdSlot from '@/components/ads/AdSlot';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function PartsPage() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  return <div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-gray-900 mb-8">{t('nav.parts')}</h1><div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-blue-800 text-sm">{CATALOG_PARTS.length} parts indexed. OEM references shown as source-listed are not automatically fitment-verified.</p></div><div className="mb-8"><AdSlot placement="parts-top" /></div>{CATALOG_PARTS.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">{CATALOG_PARTS.map((part) => <PartCard key={part.id} part={part} />)}</div> : <div className="rounded-lg border border-gray-200 bg-white p-10 text-center"><h2 className="text-xl font-semibold text-gray-900 mb-2">No parts found</h2><p className="text-gray-600">The catalog is being updated.</p></div>}<div className="mt-12"><AdSlot placement="parts-bottom" /></div></div>;
}
