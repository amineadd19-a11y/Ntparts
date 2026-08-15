'use client';

import { TRUCK_MANUFACTURERS } from '@/types/catalog';
import ManufacturerCard from '@/components/catalog/ManufacturerCard';
import AdSlot from '@/components/ads/AdSlot';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function TrucksPage() { const { language } = useAppStore(); const t = (key: string) => getTranslation(key, language); return <div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-gray-900 mb-8">{t('nav.trucks')}</h1><div className="mb-8"><AdSlot placement="trucks-top" /></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">{TRUCK_MANUFACTURERS.map((manufacturer) => <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />)}</div><div className="mt-12"><AdSlot placement="trucks-bottom" /></div></div>; }
