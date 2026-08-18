'use client';

import Link from 'next/link';
import { Search, Truck, ArrowRight, ShieldCheck, Database, ChevronRight, Settings2, PackageSearch, FileCheck, Layers, PackageCheck } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import ManufacturerCard from '@/components/catalog/ManufacturerCard';
import AdSlot from '@/components/ads/AdSlot';
import PartsIntelligence from '@/components/ai/PartsIntelligence';
import { TRUCK_MANUFACTURERS } from '@/types/catalog';
import { CATALOG_STATS } from '@/data/catalog';
import {
  INVENTORY_ITEM_COUNT,
  INVENTORY_SNAPSHOT_DATE,
  INVENTORY_TOTAL_QUANTITY,
  INVENTORY_SOURCE,
} from '@/data/inventory-snapshot';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';
import { stockLabel } from '@/data/stock-labels';

type TruckManufacturer = (typeof TRUCK_MANUFACTURERS)[number];

export default function Home() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <section className="nt-hero-grid border-b border-slate-800" aria-labelledby="hero-heading"><div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-18"><div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]"><div className="animate-fade-up"><div className="nt-badge mb-6"><FileCheck size={13} aria-hidden /> Real source-backed catalogue</div><h1 id="hero-heading" className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">Find the right part for your <span className="nt-gradient-text">truck.</span></h1><p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">Search OEM references, part numbers and aftermarket cross-references from public manufacturer and catalogue sources — no demo or synthetic part data.</p><div className="mt-8 max-w-2xl"><SearchBar placeholder={t('home.searchPlaceholder')} /></div><div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">{['OEM number','Part number','Truck model','Manufacturer'].map((label) => <span key={label} className="rounded-md border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-slate-400">{label}</span>)}</div><div className="mt-8 flex flex-wrap gap-3"><Link href="/search" className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:bg-sky-400">Advanced search <ArrowRight size={16} aria-hidden /></Link><Link href="/trucks" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-sky-500/40 hover:text-sky-300"><Truck size={16} aria-hidden /> Select truck</Link></div></div><div className="animate-fade-up rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur"><div className="mb-5 flex items-center justify-between"><div><div className="font-extrabold text-white">Catalogue overview</div><div className="mt-1 text-xs text-slate-500">Real records only</div></div><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400"><Database size={18} aria-hidden /></div></div><div className="grid grid-cols-2 gap-3"><Stat value={CATALOG_STATS.manufacturers} label="Manufacturers" /><Stat value={CATALOG_STATS.models} label="Truck models" /><Stat value={CATALOG_STATS.parts.toLocaleString()} label="Part records" /><Stat value={CATALOG_STATS.aftermarketBrands} label="Aftermarket brands" /></div><div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs leading-5 text-emerald-300"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden /><span><b className="text-emerald-200">Real catalogue only:</b> every published part carries source-backed OEM or catalogue evidence.</span></div></div></div></div></section>
      <section className="border-b border-slate-200 bg-white" aria-label="Catalogue statistics"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 px-4 sm:grid-cols-4 sm:px-6 lg:px-8"><MiniStat value={CATALOG_STATS.manufacturers} label="Manufacturers" /><MiniStat value={CATALOG_STATS.models} label="Models" /><MiniStat value={CATALOG_STATS.parts.toLocaleString()} label="Part records" /><MiniStat value={CATALOG_STATS.verifiedOEMReferences} label="Verified OEM refs" /></div></section>
      <PartsIntelligence />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="stock-heading">
        <Link
          href="/stock"
          className="group block overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-white to-sky-50 shadow-lg shadow-emerald-900/5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-xl"
        >
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100/80 px-3 py-1 text-xs font-black uppercase tracking-[0.15em] text-emerald-800">
                <PackageCheck size={14} aria-hidden />
                {stockLabel(language, 'title')}
              </div>
              <h2 id="stock-heading" className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {stockLabel(language, 'subtitle')}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                {stockLabel(language, 'description')}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition group-hover:bg-emerald-500">
                  {stockLabel(language, 'view')}
                  <ArrowRight size={16} aria-hidden className={language === 'ar' ? 'rotate-180' : ''} />
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Snapshot {INVENTORY_SNAPSHOT_DATE} · {INVENTORY_SOURCE}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-100 bg-white/90 p-4 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  {stockLabel(language, 'references')}
                </div>
                <div className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                  {INVENTORY_ITEM_COUNT.toLocaleString()}
                </div>
              </div>
              <div className="rounded-xl border border-sky-100 bg-white/90 p-4 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                  {stockLabel(language, 'quantity')}
                </div>
                <div className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                  {INVENTORY_TOTAL_QUANTITY.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="manufacturers-heading"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-600">Browse by vehicle</p><h2 id="manufacturers-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-900">Truck manufacturers</h2><p className="mt-2 max-w-xl text-sm text-slate-500">Select a manufacturer to explore models and source-backed parts.</p></div><Link href="/trucks" className="hidden items-center gap-1 text-sm font-bold text-sky-700 sm:flex">View all <ChevronRight size={16} aria-hidden /></Link></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{TRUCK_MANUFACTURERS.slice(0, 8).map((m: TruckManufacturer) => <ManufacturerCard key={m.id} manufacturer={m} />)}</div><div className="mt-8 text-center sm:hidden"><Link href="/trucks" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700">View all manufacturers <ChevronRight size={16} aria-hidden /></Link></div></section>
      <section className="border-y border-slate-200 bg-white py-16" aria-labelledby="why-heading"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-10 max-w-2xl"><p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-600">Why NTParts</p><h2 id="why-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-900">Built for professional workflows</h2></div><div className="grid gap-5 md:grid-cols-3"><InfoCard icon={<PackageSearch size={20} aria-hidden />} title="Search by OEM or part number" text="Find exact references and cross-references from source-backed catalogue data." /><InfoCard icon={<Settings2 size={20} aria-hidden />} title="Choose your vehicle" text="Filter by manufacturer, model and system so you only review relevant entries." /><InfoCard icon={<ShieldCheck size={20} aria-hidden />} title="Know what is verified" text="Keep verified OEM references separate from data that still needs confirmation before ordering." /></div></div></section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-slate-900/20"><div className="grid gap-8 p-8 md:grid-cols-[1.25fr_0.75fr] md:p-12"><div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300"><Layers size={13} aria-hidden /> Systems coverage</div><h2 className="text-3xl font-black tracking-tight">From brakes to injectors</h2><p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">Browse real source-backed parts across braking, engine, cooling, transmission, electrical, suspension and cabin systems.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/parts" className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400">Browse all parts <ArrowRight size={15} aria-hidden /></Link><Link href="/search" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:border-sky-500/40 hover:bg-slate-900"><Search size={15} aria-hidden /> Start searching</Link></div></div><div className="grid grid-cols-2 gap-2.5 self-center">{['Brakes','Engine','Filters','Cooling','Transmission','Electrical'].map((label) => <div key={label} className="rounded-lg border border-slate-700/80 bg-slate-900/80 px-4 py-3.5 text-sm font-semibold text-slate-300">{label}</div>)}</div></div></div></section>
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"><AdSlot placement="homepage-bottom" /></section>
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) { return <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-3.5"><div className="text-xl font-black text-white">{value}</div><div className="mt-0.5 text-[11px] font-semibold text-slate-500">{label}</div></div>; }
function MiniStat({ value, label }: { value: number | string; label: string }) { return <div className="px-4 py-5 first:pl-0 sm:px-6"><div className="text-xl font-black text-slate-900 sm:text-2xl">{value}</div><div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div></div>; }
function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sky-400">{icon}</div><h3 className="font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>; }
