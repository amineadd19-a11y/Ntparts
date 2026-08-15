'use client';

import Link from 'next/link';
import { Menu, X, Heart, Globe, Search, Truck, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; }, [language]);

  const languages: Array<{ code: 'en' | 'fr' | 'ar'; label: string }> = [
    { code: 'en', label: 'EN' }, { code: 'fr', label: 'FR' }, { code: 'ar', label: 'AR' },
  ];
  const links = [['/', 'nav.home'], ['/search', 'nav.search'], ['/trucks', 'nav.trucks'], ['/parts', 'nav.parts'], ['/about', 'nav.about']];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-white shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-slate-950" />
            <span className="relative text-sm font-black tracking-tight">NT</span>
          </div>
          <div className="hidden sm:block leading-none">
            <div className="text-[17px] font-black tracking-tight text-slate-950">NTPARTS</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">Truck Parts Intelligence</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/80 p-1">
          {links.map(([href, key]) => (
            <Link key={href} href={href} className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-950 hover:shadow-sm">
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/search" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-300 hover:text-sky-600" aria-label="Search">
            <Search size={18} />
          </Link>
          <Link href="/favorites" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-sky-300 hover:text-sky-600" aria-label="Favorites">
            <Heart size={18} />
          </Link>
          <div className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 h-10">
            <Globe size={15} className="text-slate-400" />
            <select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'ar')} className="bg-transparent text-xs font-bold text-slate-600 outline-none cursor-pointer">
              {languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}
            </select>
          </div>
          <Link href="/search" className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800">
            <Search size={16} /> {t('nav.search')}
          </Link>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 md:hidden">
          <div className="grid gap-1">
            {links.map(([href, key]) => <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"><Package size={17} className="text-slate-400" />{t(key)}</Link>)}
            <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"><Heart size={17} className="text-slate-400" />{t('nav.favorites')}</Link>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3"><Globe size={16} className="text-slate-400" /><select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'ar')} className="bg-transparent text-sm font-semibold outline-none">{languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}</select></div>
        </nav>
      )}
    </header>
  );
}
