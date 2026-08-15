'use client';

import Link from 'next/link';
import { ShieldCheck, Search, Truck, Database } from 'lucide-react';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function Footer() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-sky-600 to-slate-900" />
                <span className="relative text-xs font-black">NT</span>
              </div>
              <div>
                <div className="text-base font-black tracking-tight">NTPARTS</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Industrial Parts Intelligence
                </div>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-400">
              Professional catalogue for OEM references, part numbers and truck compatibility — built for technicians and parts specialists.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-300">
                <ShieldCheck size={11} /> Verification-aware
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-300">
                <Database size={11} /> Structured data
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">{t('nav.search')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/search" className="inline-flex items-center gap-2 transition hover:text-sky-300">
                  <Search size={13} /> Advanced search
                </Link>
              </li>
              <li>
                <Link href="/parts" className="transition hover:text-sky-300">{t('nav.parts')}</Link>
              </li>
              <li>
                <Link href="/favorites" className="transition hover:text-sky-300">{t('nav.favorites')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">{t('nav.trucks')}</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/trucks" className="inline-flex items-center gap-2 transition hover:text-sky-300">
                  <Truck size={13} /> All manufacturers
                </Link>
              </li>
              <li>
                <Link href="/trucks/volvo-trucks" className="transition hover:text-sky-300">Volvo Trucks</Link>
              </li>
              <li>
                <Link href="/trucks/scania" className="transition hover:text-sky-300">Scania</Link>
              </li>
              <li>
                <Link href="/trucks/mercedes-benz-trucks" className="transition hover:text-sky-300">Mercedes-Benz</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about" className="transition hover:text-sky-300">{t('nav.about')}</Link>
              </li>
              <li>
                <a href="#" className="transition hover:text-sky-300">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="transition hover:text-sky-300">Terms of Use</a>
              </li>
              <li>
                <a href="#" className="transition hover:text-sky-300">Data quality policy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {year} NTParts. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            OEM numbers are never guessed. Always verify fitment before ordering.
          </p>
        </div>
      </div>
    </footer>
  );
}
