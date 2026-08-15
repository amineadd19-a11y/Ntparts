'use client';

import Link from 'next/link';
import { Search, Truck, ArrowRight, ShieldCheck, Database, ChevronRight, Settings2, PackageSearch, CircleCheck } from 'lucide-react';
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
  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_430px]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"><CircleCheck size={14}/> Professional truck parts catalogue</div>
            <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Find the right part for your <span className="text-blue-600">truck.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">Search OEM references, part numbers, truck models and aftermarket equivalents in one professional catalogue.</p>
            <div className="mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,.10)]"><SearchBar placeholder={t('home.searchPlaceholder')} /></div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500"><span className="rounded-md bg-slate-100 px-3 py-1.5">OEM number</span><span className="rounded-md bg-slate-100 px-3 py-1.5">Part number</span><span className="rounded-md bg-slate-100 px-3 py-1.5">Truck model</span><span className="rounded-md bg-slate-100 px-3 py-1.5">Manufacturer</span></div>
            <div className="mt-7 flex flex-wrap gap-3"><Link href="/search" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700">Advanced search <ArrowRight size={16}/></Link><Link href="/trucks" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-blue-300 hover:text-blue-700"><Truck size={17}/> Select truck</Link></div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><div className="font-extrabold">Catalogue overview</div><div className="mt-1 text-xs text-slate-500">Structured parts data</div></div><Database className="text-blue-600" size={22}/></div><div className="grid grid-cols-2 gap-3"><Stat value={CATALOG_STATS.manufacturers} label="Manufacturers"/><Stat value={CATALOG_STATS.models} label="Truck models"/><Stat value={CATALOG_STATS.parts.toLocaleString()} label="Part records"/><Stat value={CATALOG_STATS.aftermarketBrands} label="Aftermarket brands"/></div><div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800"><ShieldCheck size={16} className="mt-0.5 shrink-0"/><span><b>Verification-aware:</b> OEM references are separated from unverified fitment data.</span></div></div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-200 bg-white"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-4 sm:grid-cols-4 sm:px-6 lg:px-8"><MiniStat value={CATALOG_STATS.manufacturers} label="Manufacturers"/><MiniStat value={CATALOG_STATS.models} label="Models"/><MiniStat value={CATALOG_STATS.parts.toLocaleString()} label="Part records"/><MiniStat value={CATALOG_STATS.verifiedOEMReferences} label="Verified OEM refs"/></div></section>

    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="mb-7 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-blue-600">Browse by vehicle</p><h2 className="mt-2 text-3xl font-black tracking-tight">Truck manufacturers</h2><p className="mt-2 text-sm text-slate-500">Select a manufacturer to explore models and compatible parts.</p></div><Link href="/trucks" className="hidden items-center gap-1 text-sm font-bold text-blue-700 sm:flex">View all <ChevronRight size={16}/></Link></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{TRUCK_MANUFACTURERS.map(m => <ManufacturerCard key={m.id} manufacturer={m}/>)}</div></section>

    <section className="bg-white py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-3"><InfoCard icon={<PackageSearch/>} title="Search by OEM or part number" text="Find exact references, names and cross references quickly."/><InfoCard icon={<Settings2/>} title="Choose your vehicle" text="Filter by manufacturer, model, year and engine."/><InfoCard icon={<ShieldCheck/>} title="Know what is verified" text="Keep verified OEM references separate from data that needs confirmation."/></div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><AdSlot placement="homepage-bottom"/></section>
  </main>;
}
function Stat({value,label}:{value:number|string;label:string}){return <div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-2xl font-black text-slate-950">{value}</div><div className="mt-1 text-xs font-semibold text-slate-500">{label}</div></div>}
function MiniStat({value,label}:{value:number|string;label:string}){return <div className="px-4 py-5 first:pl-0 sm:px-6"><div className="text-xl font-black sm:text-2xl">{value}</div><div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div></div>}
function InfoCard({icon,title,text}:{icon:React.ReactNode;title:string;text:string}){return <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200 hover:shadow-md"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">{icon}</div><h3 className="font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>}
