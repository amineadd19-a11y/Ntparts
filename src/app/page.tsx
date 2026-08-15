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
} from 'lucide-react';
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
    <main className="min-h-screen bg-[#f4f7fa] text-slate-900">
      {/* Hero */}
      <section className="nt-hero-grid border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="animate-fade-up">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3.5 py-1.5 text-xs font-bold text-blue-700">
                <FileCheck size={14} />
                Professional truck parts catalogue
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
                Find the right part for your{' '}
                <span className="nt-gradient-text">truck.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                Search OEM references, part numbers, truck models and aftermarket equivalents in one
                structured professional catalogue built for real workshop workflows.
              </p>

              <div className="mt-8 max-w-2xl">
                <SearchBar placeholder={t('home.searchPlaceholder')} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">OEM number</span>
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">Part number</span>
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">Truck model</span>
                <span className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">Manufacturer</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Advanced search <ArrowRight size={16} />
                </Link>
                <Link
                  href="/trucks"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                >
                  <Truck size={17} /> Select truck
                </Link>
              </div>
            </div>

            <div className="animate-fade-up rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-950">Catalogue overview</div>
                  <div className="mt-1 text-xs text-slate-500">Structured parts data</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Database size={20} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Stat value={CATALOG_STATS.manufacturers} label="Manufacturers" />
                <Stat value={CATALOG_STATS.models} label="Truck models" />
                <Stat value={CATALOG_STATS.parts.toLocaleString()} label="Part records" />
                <Stat value={CATALOG_STATS.aftermarketBrands} label="Aftermarket brands" />
              </div>

              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs leading-5 text-emerald-900">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>
                  <b>Verification-aware:</b> OEM references are separated from unverified fitment data.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-100 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
          <MiniStat value={CATALOG_STATS.manufacturers} label="Manufacturers" />
          <MiniStat value={CATALOG_STATS.models} label="Models" />
          <MiniStat value={CATALOG_STATS.parts.toLocaleString()} label="Part records" />
          <MiniStat value={CATALOG_STATS.verifiedOEMReferences} label="Verified OEM refs" />
        </div>
      </section>

      {/* Manufacturers */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Browse by vehicle</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Truck manufacturers</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              Select a manufacturer to explore models and compatible parts.
            </p>
          </div>
          <Link href="/trucks" className="hidden items-center gap-1 text-sm font-bold text-blue-700 sm:flex">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUCK_MANUFACTURERS.slice(0, 8).map((m) => (
            <ManufacturerCard key={m.id} manufacturer={m} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/trucks" className="inline-flex items-center gap-1 text-sm font-bold text-blue-700">
            View all manufacturers <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Why NTParts</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Built for professional workflows</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <InfoCard
              icon={<PackageSearch size={22} />}
              title="Search by OEM or part number"
              text="Find exact references, names and cross references quickly with a structured search experience."
            />
            <InfoCard
              icon={<Settings2 size={22} />}
              title="Choose your vehicle"
              text="Filter by manufacturer, model and system so you only review relevant catalogue entries."
            />
            <InfoCard
              icon={<ShieldCheck size={22} />}
              title="Know what is verified"
              text="Keep verified OEM references separate from data that still needs confirmation before ordering."
            />
          </div>
        </div>
      </section>

      {/* Categories teaser */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl">
          <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-sky-300">
                <Layers size={14} /> Systems coverage
              </div>
              <h2 className="text-3xl font-black tracking-tight">From brakes to injectors</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                Explore catalogue templates across braking, engine, cooling, transmission, electrical,
                suspension and cabin systems for major European and North American trucks.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/parts"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Browse all parts <ArrowRight size={16} />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <Search size={16} /> Start searching
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-center">
              {['Brakes', 'Engine', 'Filters', 'Cooling', 'Transmission', 'Electrical'].map((label) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-slate-200"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <AdSlot placement="homepage-bottom" />
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="text-2xl font-black text-slate-950">{value}</div>
      <div className="mt-1 text-xs font-semibold text-slate-500">{label}</div>
    </div>
  );
}

function MiniStat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="px-4 py-6 first:pl-0 sm:px-6">
      <div className="text-xl font-black text-slate-950 sm:text-2xl">{value}</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h3 className="font-extrabold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
