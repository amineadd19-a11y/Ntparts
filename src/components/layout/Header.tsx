'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, Globe, Search, Package, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage } = useAppStore();
  const t = (key: string) => getTranslation(key, language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  const languages: Array<{ code: 'fr' | 'en' | 'ar'; label: string; name: string }> = [
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ar', label: 'AR', name: 'العربية' },
  ];

  const tagline =
    language === 'fr'
      ? 'Catalogue pièces poids lourds'
      : language === 'ar'
        ? 'كتالوج قطع الشاحنات والحافلات'
        : 'Truck & Bus Parts Intelligence';

  const links: Array<[string, string]> = [
    ['/', 'nav.home'],
    ['/search', 'nav.search'],
    ['/trucks', 'nav.trucks'],
    ['/vehicles', 'nav.vehicles'],
    ['/vin-decoder', 'nav.vin'],
    ['/parts', 'nav.parts'],
    ['/about', 'nav.about'],
  ];

  const labelFor = (key: string) => key === 'nav.vehicles'
    ? language === 'ar' ? 'المركبات' : language === 'fr' ? 'Véhicules' : 'Vehicles'
    : key === 'nav.vin'
      ? language === 'ar' ? 'فك رقم الهيكل VIN' : language === 'fr' ? 'Décodeur VIN' : 'VIN decoder'
      : t(key);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="nt-header sticky top-0 z-50">
      <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 xl:px-8">
        <Link href="/" className="group flex min-w-0 shrink-0 items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <span className="nt-brand-mark" aria-hidden="true">
            <span>NT</span>
          </span>
          <span className="min-w-0 leading-none">
            <span className="block text-[17px] font-black tracking-[-0.055em] text-slate-950">NTPARTS<span className="text-sky-600">.</span></span>
            <span className="mt-1.5 hidden text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:block">{tagline}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {links.map(([href, key]) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`nt-nav-link ${active ? 'nt-nav-link-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {labelFor(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/search" className="nt-header-icon hidden sm:inline-flex" aria-label={t('nav.search')}>
            <Search size={17} aria-hidden="true" />
          </Link>
          <Link href="/favorites" className="nt-header-icon hidden sm:inline-flex" aria-label={t('nav.favorites')}>
            <Heart size={17} aria-hidden="true" />
          </Link>
          <label className="nt-language-control hidden sm:flex">
            <Globe size={15} aria-hidden="true" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'ar')}
              aria-label="Language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
            <ChevronDown size={13} aria-hidden="true" className="pointer-events-none opacity-60" />
          </label>
          <button
            type="button"
            className="nt-header-icon xl:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="nt-mobile-nav xl:hidden" aria-label="Mobile navigation">
          <div className="mx-auto grid max-w-[1440px] gap-1 px-4 pb-4 pt-2 sm:px-6">
            {links.map(([href, key]) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`nt-mobile-link ${active ? 'nt-mobile-link-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Package size={16} aria-hidden="true" />
                  <span>{labelFor(key)}</span>
                </Link>
              );
            })}
            <Link href="/favorites" className="nt-mobile-link">
              <Heart size={16} aria-hidden="true" />
              <span>{t('nav.favorites')}</span>
            </Link>
            <label className="nt-mobile-language">
              <Globe size={16} aria-hidden="true" />
              <span className="text-sm font-semibold">{language === 'ar' ? 'اللغة' : language === 'fr' ? 'Langue' : 'Language'}</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'ar')}
                aria-label="Language"
              >
                {languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
              </select>
            </label>
          </div>
        </nav>
      )}
    </header>
  );
}
