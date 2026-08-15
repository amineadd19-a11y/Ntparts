'use client';

import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Wrench,
  Filter,
  Disc3,
  Cog,
  Zap,
  Thermometer,
  Car,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import AdSlot from '@/components/ads/AdSlot';
import {
  CATALOG_MANUFACTURERS,
  CATALOG_MODELS,
  CATALOG_PARTS,
} from '@/data/catalog';
import { useAppStore } from '@/store';
import { getTranslation, translateCategory, translateCategoryHint } from '@/data/translations';

const CATEGORY_ICONS: Record<string, typeof Wrench> = {
  Brakes: Disc3,
  Filters: Filter,
  'Cooling System': Thermometer,
  Transmission: Cog,
  Suspension: Settings2,
  Electrical: Zap,
  Engine: Wrench,
  Cabin: Car,
};

const CATEGORY_ACCENT: Record<string, string> = {
  Brakes: 'from-rose-500/10 to-rose-600/5 border-rose-200',
  Filters: 'from-sky-500/10 to-sky-600/5 border-sky-200',
  'Cooling System': 'from-cyan-500/10 to-cyan-600/5 border-cyan-200',
  Transmission: 'from-amber-500/10 to-amber-600/5 border-amber-200',
  Suspension: 'from-violet-500/10 to-violet-600/5 border-violet-200',
  Electrical: 'from-yellow-500/10 to-yellow-600/5 border-yellow-200',
  Engine: 'from-slate-500/10 to-slate-600/5 border-slate-200',
  Cabin: 'from-emerald-500/10 to-emerald-600/5 border-emerald-200',
};

export default function ManufacturerPage() {
  const params = useParams();
  const manufacturerId = String(params.manufacturer);
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);

  const manufacturer = CATALOG_MANUFACTURERS.find((item) => item.id === manufacturerId);
  if (!manufacturer) notFound();

  const models = CATALOG_MODELS.filter((model) => model.manufacturerId === manufacturer.id);
  const parts = CATALOG_PARTS.filter(
    (part) => part.specifications?.manufacturerId === manufacturer.id
  );
  const categories = Array.from(new Set(parts.map((part) => part.category))).sort();
  const verifiedCount = parts.filter((p) => p.oemReferences?.length > 0).length;

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/trucks"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
        >
          <ArrowLeft size={16} className="rtl:rotate-180" /> {t('manufacturer.backToManufacturers')}
        </Link>

        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 sm:px-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-sky-400">
              {t('manufacturer.catalogue')}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {manufacturer.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              {t('manufacturer.openSystem')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
            <div className="bg-white px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('manufacturer.models')}
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">{models.length}</p>
            </div>
            <div className="bg-white px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('manufacturer.partRecords')}
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">{parts.length}</p>
            </div>
            <div className="bg-white px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('manufacturer.systems')}
              </p>
              <p className="mt-1 text-2xl font-black text-slate-900">{categories.length}</p>
            </div>
            <div className="bg-white px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t('manufacturer.withOem')}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-2xl font-black text-emerald-700">
                <ShieldCheck size={20} /> {verifiedCount}
              </p>
            </div>
          </div>
        </div>

        <AdSlot placement="manufacturer-top" />

        <section className="mt-10">
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            {t('manufacturer.models')}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t('manufacturer.openModel')}</p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => {
              const modelParts = parts.filter((p) => p.specifications?.model === model.name);
              const oemParts = modelParts.filter((p) => p.oemReferences?.length > 0);
              return (
                <Link
                  key={model.id}
                  href={`/trucks/${manufacturer.id}/model/${encodeURIComponent(model.id)}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-sky-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sky-400">
                      <Database size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {t('part.model')}
                      </p>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-800">
                        {model.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {modelParts.length} {t('common.parts')} · {oemParts.length} OEM
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-600 rtl:rotate-180"
                  />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-black tracking-tight text-slate-900">
            {t('manufacturer.partSystems')}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t('manufacturer.openSystem')}</p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = CATEGORY_ICONS[category] ?? Wrench;
              const accent =
                CATEGORY_ACCENT[category] ?? 'from-slate-500/10 to-slate-600/5 border-slate-200';
              const count = parts.filter((p) => p.category === category).length;
              const oemCount = parts.filter(
                (p) => p.category === category && p.oemReferences?.length > 0
              ).length;
              return (
                <Link
                  key={category}
                  href={`/trucks/${manufacturer.id}/system/${encodeURIComponent(category)}`}
                  className={`group relative overflow-hidden rounded-xl border bg-gradient-to-br ${accent} p-5 shadow-sm transition hover:shadow-md`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-sm ring-1 ring-black/5">
                      <Icon size={20} className="text-slate-700" />
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-slate-400 transition group-hover:text-slate-700 rtl:rotate-180"
                    />
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-slate-900">
                    {translateCategory(category, language)}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    {translateCategoryHint(category, language)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200">
                      {count} {t('common.parts')}
                    </span>
                    {oemCount > 0 && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                        {oemCount} OEM
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={22} />
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{t('manufacturer.dataQuality')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {t('manufacturer.dataQualityText')}
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
