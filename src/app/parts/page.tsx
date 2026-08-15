'use client';

import { CATALOG_PARTS } from '@/data/catalog';
import PartCard from '@/components/catalog/PartCard';
import AdSlot from '@/components/ads/AdSlot';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function PartsPage() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Catalogue</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {t('nav.parts')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Structured part records with verification status. Always confirm fitment before ordering.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/80 p-4">
        <p className="text-sm text-blue-900">
          <span className="font-bold">{CATALOG_PARTS.length.toLocaleString()}</span> parts indexed.
          OEM references shown as source-listed are not automatically fitment-verified.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot placement="parts-top" />
      </div>

      {CATALOG_PARTS.length > 0 ? (
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATALOG_PARTS.slice(0, 48).map((part) => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <h2 className="mb-2 text-xl font-semibold text-slate-900">No parts found</h2>
          <p className="text-slate-600">The catalog is being updated.</p>
        </div>
      )}

      {CATALOG_PARTS.length > 48 && (
        <p className="mb-8 text-center text-sm text-slate-500">
          Showing first 48 of {CATALOG_PARTS.length.toLocaleString()} records. Use search for precise results.
        </p>
      )}

      <div className="mt-12">
        <AdSlot placement="parts-bottom" />
      </div>
    </div>
  );
}
