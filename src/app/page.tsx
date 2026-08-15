'use client';

import Link from 'next/link';
import { Search, Truck, Zap, Award, ArrowRight, ShieldCheck, Database, ChevronRight } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import ManufacturerCard from '@/components/catalog/ManufacturerCard';
import AdSlot from '@/components/ads/AdSlot';
import { TRUCK_MANUFACTURERS } from '@/types/catalog';
import { CATALOG_STATS } from '@/data/catalog';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function Home() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,.25),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(37,99,235,.2),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[.14em] text-sky-300">
                <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_14px_rgba(56,189,248,.9)]" /> Truck parts intelligence
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-[-.035em] text-white sm:text-5xl lg:text-6xl">
                Find the right truck part.<br /><span className="text-sky-400">Faster. Smarter. Safer.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Search OEM references, part names, truck models and manufacturers in one structured catalogue built for real parts work.
              </p>

              <div className="mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/[.06] p-2 shadow-2xl backdrop-blur">
                <SearchBar placeholder={t('home.searchPlaceholder')} />
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold text-slate-400">
                <span className="rounded-lg bg-white/5 px-3 py-2">OEM number</span><span className="rounded-lg bg-white/5 px-3 py-2">Truck model</span><span className="rounded-lg bg-white/5 px-3 py-2">Part name</span><span className="rounded-lg bg-white/5 px-3 py-2">Manufacturer</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/search" className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-950/30 transition hover:-translate-y-0.5 hover:bg-sky-400"><Search size={18} /> {t('search.title')} <ArrowRight size={16} /></Link>
                <Link href="/trucks" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"><Truck size={18} /> {t('nav.trucks')}</Link>
                <Link href="/parts" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"><Zap size={18} /> {t('nav.parts')}</Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-3xl border border-white/10 bg-white/[.055] p-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between"><div><div className="text-sm font-bold text-white">Catalogue overview</div><div className="mt-1 text-xs text-slate-400">Structured data at a glance</div></div><Database className="text-sky-400" size={22} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <Stat value={CATALOG_STATS.manufacturers} label="Manufacturers" />
                  <Stat value={CATALOG_STATS.models} label="Truck models" />
                  <Stat value={CATALOG_STATS.parts.toLocaleString()} label="Part records" />
                  <Stat value={CATALOG_STATS.aftermarketBrands} label="Aftermarket brands" />
                </div>
                <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4"><div className="flex items-center gap-2 text-sm font-bold text-emerald-300"><ShieldCheck size={17} /> Verification-first catalogue</div><p className="mt-1 text-xs leading-5 text-slate-400">OEM references are kept separate from unverified fitment data.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 sm:grid-cols-4 px-4 sm:px-6 lg:px-8">
          <MiniStat value={CATALOG_STATS.manufacturers} label="Manufacturers" /><MiniStat value={CATALOG_STATS.models} label="Models" /><MiniStat value={CATALOG_STATS.parts.toLocaleString()} label="Part records" /><MiniStat value={CATALOG_STATS.verifiedOEMReferences} label="Verified OEM refs" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
        <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.16em] text-sky-600">Browse catalogue</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Truck manufacturers</h2><p className="mt-2 text-sm text-slate-500">Choose a manufacturer to explore models and compatible part records.</p></div><Link href="/trucks" className="hidden items-center gap-1 text-sm font-bold text-slate-700 hover:text-sky-600 sm:flex">View all <ChevronRight size={17} /></Link></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{TRUCK_MANUFACTURERS.map((manufacturer) => <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />)}</div>
      </section>

      <section className="bg-white py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><AdSlot placement="homepage-middle" /></div></section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard icon={<Search className="text-sky-600" size={22} />} title="Search by OEM or part" description="Go from a reference number or part name to structured catalogue results without jumping between sources." />
          <FeatureCard icon={<ShieldCheck className="text-emerald-600" size={22} />} title="Verification-aware" description="Verified OEM references are clearly separated from records that still need exact application verification." />
          <FeatureCard icon={<Truck className="text-slate-700" size={22} />} title="Built for trucks" description="European, North American and Asian manufacturers are organized into one searchable experience." />
        </div>
      </section>

      <section className="pb-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><AdSlot placement="homepage-bottom" /></div></section>
    </main>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) { return <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div className="text-2xl font-black text-white">{value}</div><div className="mt-1 text-xs font-semibold text-slate-400">{label}</div></div>; }
function MiniStat({ value, label }: { value: number | string; label: string }) { return <div className="px-4 py-5 first:pl-0 sm:px-6"><div className="text-xl font-black text-slate-950 sm:text-2xl">{value}</div><div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</div></div>; }
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) { return <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">{icon}</div><h3 className="text-base font-extrabold text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></div>; }
