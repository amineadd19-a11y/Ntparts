'use client';

import { TRUCK_MANUFACTURERS } from '@/types/catalog';
import ManufacturerCard from '@/components/catalog/ManufacturerCard';
import AdSlot from '@/components/ads/AdSlot';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

type TruckManufacturer = (typeof TRUCK_MANUFACTURERS)[number];

export default function TrucksPage() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Catalogue</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          {t('nav.trucks')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Browse major truck manufacturers and open model-level catalogue entries.
        </p>
      </div>

      <div className="mb-8">
        <AdSlot placement="trucks-top" />
      </div>

      <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TRUCK_MANUFACTURERS.map((manufacturer: TruckManufacturer) => (
          <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
        ))}
      </div>

      <div className="mt-12">
        <AdSlot placement="trucks-bottom" />
      </div>
    </div>
  );
}
