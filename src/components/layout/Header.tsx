'use client';

import Link from 'next/link';
import { Menu, X, Heart, Globe, Search, Package, PackageCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';
import { stockLabel } from '@/data/stock-labels';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const stockNavLabel = stockLabel(language, 'nav');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const languages: Array<{ code: 'fr' | 'en' | 'ar'; label: string }> = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  const tagline =
    language === 'fr'
      ? 'Catalogue pièces industrielles'
      : language === 'ar'
        ? 'كتالوج القطع الصناعية'
        : 'Industrial Parts Intelligence';

  const links = [
    ['/', 'nav.home'],
    ['/search', 'nav.search'],
    ['/trucks', 'nav.trucks'],
    ['/parts', 'nav.parts'],
    ['/stock', 'nav.stock'],
    ['/about', 'nav.about'],
  ];

  const labelFor = (key: string) => (key === 'nav.stock' ? stockNavLabel : t(key));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-white shadow-lg shadow-sky-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-sky-600 to-slate-900" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.15)_50%,transparent_60%)]" />
            <span className="relative text-sm font-black tracking-tight">NT</span>
          </div>
          <div className="hidden sm:block leading-none">
            <div className="text-[16px] font-black tracking-tight text-white">NTPARTS</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">{tagline}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 rounded-xl border border-slate-700/80 bg-slate-900/80 p-1 md:flex">
          {links.map(([href, key]) => (
            <Link key={href} href={href} className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition hover:bg-slate-800 hover:text-white ${key === 'nav.stock' ? 'text-emerald-300' : 'text-slate-300'}`}>
              {labelFor(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <Link href="/search" className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-sky-500/50 hover:text-sky-400 sm:flex" aria-label={t('nav.search')}><Search size={17} /></Link>
          <Link href="/favorites" className="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-sky-500/50 hover:text-sky-400 sm:flex" aria-label={t('nav.favorites')}><Heart size={17} /></Link>
          <div className="hidden h-9 items-center gap-1.5 rounded-lg border border-sky-500/40 bg-slate-900 px-2.5 sm:flex">
            <Globe size={14} className="text-sky-400" />
            <select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'ar')} className="cursor-pointer bg-transparent text-xs font-bold text-sky-300 outline-none">
              {languages.map((lang) => <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">{lang.label}</option>)}
            </select>
          </div>
          <Link href="/stock" className="hidden items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-400 lg:flex"><PackageCheck size={15} /> {stockNavLabel}</Link>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-slate-800 bg-slate-950 px-4 pb-5 pt-3 md:hidden">
          <div className="grid gap-1">
            {links.map(([href, key]) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-slate-300 hover:bg-slate-900 hover:text-white">
                {key === 'nav.stock' ? <PackageCheck size={16} className="text-emerald-400" /> : <Package size={16} className="text-slate-500" />}
                {labelFor(key)}
              </Link>
            ))}
            <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"><Heart size={16} className="text-slate-500" />{t('nav.favorites')}</Link>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-sky-500/40 bg-slate-900 px-4 py-3">
            <Globe size={15} className="text-sky-400" />
            <select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'ar')} className="bg-transparent text-sm font-semibold text-sky-300 outline-none">
              {languages.map((lang) => <option key={lang.code} value={lang.code} className="bg-slate-900">{lang.label}</option>)}
            </select>
          </div>
        </nav>
      )}
    </header>
  );
}
