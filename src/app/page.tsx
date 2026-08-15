'use client';

import Link from 'next/link';
import {
  Search,
  Truck,
  ArrowRight,
  ShieldCheck,
  Database,
  ChevronRight,
  Settings2,
  PackageSearch,
  FileCheck,
  Layers,
  Bot,
} from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import ManufacturerCard from '@/components/catalog/ManufacturerCard';
import AdSlot from '@/components/ads/AdSlot';
import PartsIntelligence from '@/components/ai/PartsIntelligence';
import { TRUCK_MANUFACTURERS } from '@/types/catalog';
import { CATALOG_STATS } from '@/data/catalog';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function Home() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <section className="nt-hero-grid border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-18">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="animate-fade-up">
              <div className="nt-badge mb-6"><FileCheck size={13} /> Professional truck parts catalogue</div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">Find the right part for your <span className="nt-gradient-text">truck.</span></h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">Search OEM references, part numbers, truck models and aftermarket equivalents in one structured industrial catalogue built for workshop workflows.</p>
              <div className="mt-8 max-w-2xl"><SearchBar placeholder={t('home.searchPlaceholder')} /></div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">{['OEM number', 'Part number', 'Truck model', 'Manufacturer'].map((label) => <span key={label} className="rounded-md border border-slate-700/80 bg-slate-900/60 px-3 py-1.5 text-slate-400">{label}</span>)}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/partmind" className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/25 transition hover:-translate-y-0.5 hover:bg-sky-400"><Bot size={16} /> PartMind AI <ArrowRight size={16} /></Link>
                <Link href="/search" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-sky-500/40 hover:text-sky-300">Advanced search <ArrowRight size={16} /></Link>
                <Link href="/trucks" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-sky-500/40 hover:text-sky-300"><Truck size={16} /> Select truck</Link>
              </div>
            </div>
            <div className="animate-fade-up rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="mb-5 flex items-center justify-between"><div><div className="font-extrabold text-white">Catalogue overview</div><div className="mt-1 text-xs text-slate-500">Structured industrial data</div></div><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400"><Database size={18} /></div></div>
              <div className="grid grid-cols-2 gap-3"><Stat value={CATALOG_STATS.manufacturers} label="Manufacturers" /><Stat value={CATALOG_STATS.models} label="Truck models" /><Stat value={CATALOG_STATS.parts.toLocaleString()} label="Part records" /><Stat value={CATALOG_STATS.aftermarketBrands} label="Aftermarket brands" /></div>
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs leading-5 text-emerald-300"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-400" /><span><b className="text-emerald-200">Verification-aware:</b> OEM references are separated from unverified fitment data.</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 px-4 sm:grid-cols-4 sm:px-6 lg:px-8"><MiniStat value={CATALOG_STATS.manufacturers} label="Manufacturers" /><MiniStat value={CATALOG_STATS.models} label="Models" /><MiniStat value={CATALOG_STATS.parts.toLocaleString()} label="Part records" /><MiniStat value={CATALOG_STATS.verifiedOEMReferences} label="Verified OEM refs" /></div></section>
      <PartsIntelligence />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-600">Browse by vehicle</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Truck manufacturers</h2><p className="mt-2 max-w-xl text-sm text-slate-500">Select a manufacturer to explore models and compatible parts.</p></div><Link href="/trucks" className="hidden items-center gap-1 text-sm font-bold text-sky-700 sm:flex">View all <ChevronRight size={16} /></Link></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{TRUCK_MANUFACTURERS.slice(0, 8).map((m) => <ManufacturerCard key={m.id} manufacturer={m} />)}</div><div className="mt-8 text-center sm:hidden"><Link href="/trucks" className="inline-flex items-center gap-1 text-sm font-bold text-sky-700">View all manufacturers <ChevronRight size={16} /></Link></div></section>
      <section className="border-y border-slate-200 bg-white py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="mb-10 max-w-2xl"><p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-600">Why NTParts</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Built for professional workflows</h2></div><div className="grid gap-5 md:grid-cols-3"><InfoCard icon={<PackageSearch size={20} />} title="Search by OEM or part number" text="Find exact references, names and cross references quickly with a structured industrial search experience." /><InfoCard icon={<Settings2 size={20} />} title="Choose your vehicle" text="Filter by manufacturer, model and system so you only review relevant catalogue entries." /><InfoCard icon={<ShieldCheck size={20} />} title="Know what is verified" text="Keep verified OEM references separate from data that still needs confirmation before ordering." /></div></div></section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-2xl shadow-slate-900/20"><div className="grid gap-8 p-8 md:grid-cols-[1.25fr_0.75fr] md:p-12"><div><div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-300"><Layers size={13} /> Systems coverage</div><h2 className="text-3xl font-black tracking-tight">From brakes to injectors</h2><p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">Explore catalogue templates across braking, engine, cooling, transmission, electrical, suspension and cabin systems for major European and North American trucks.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/parts" className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-sky-400">Browse all parts <ArrowRight size={15} /></Link><Link href="/search" className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-5 py-3 text-sm font-bold text-white transition hover:border-sky-500/40 hover:bg-slate-900"><Search size={15} /> Start searching</Link></div></div><div className="grid grid-cols-2 gap-2.5 self-center">{['Brakes', 'Engine', 'Filters', 'Cooling', 'Transmission', 'Electrical'].map((label) => <div key={label} className="rounded-lg border border-slate-700/80 bg-slate-900/80 px-4 py-3.5 text-sm font-semibold text-slate-300">{label}</div>)}</div></div></div></section>
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8"><AdSlot placement="homepage-bottom" /></section>
    </main>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) { return <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-3.5"><div className="text-xl font-black text-white">{value}</div><div className="mt-0.5 text-[11px] font-semibold text-slate-500">{label}</div></div>; }
function MiniStat({ value, label }: { value: number | string; label: string }) { return <div className="px-4 py-5 first:pl-0 sm:px-6"><div className="text-xl font-black text-slate-900 sm:text-2xl">{value}</div><div className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div></div>; }
function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200 hover:shadow-md"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-sky-400">{icon}</div><h3 className="font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>; }
