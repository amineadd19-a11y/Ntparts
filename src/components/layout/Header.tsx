'use client';

import Link from 'next/link';
import { Menu, X, Heart, Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  useEffect(() => { document.documentElement.lang = language; document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'; }, [language]);
  const languages: Array<{ code: 'en' | 'fr' | 'ar'; label: string }> = [{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }, { code: 'ar', label: 'العربية' }];
  const links = [['/', 'nav.home'], ['/search', 'nav.search'], ['/trucks', 'nav.trucks'], ['/parts', 'nav.parts'], ['/about', 'nav.about']];
  return <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex justify-between items-center h-16"><Link href="/" className="flex items-center gap-2"><div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">TP</div><span className="text-xl font-bold text-gray-900 hidden sm:inline">NTParts</span></Link><nav className="hidden md:flex gap-8 items-center">{links.map(([href, key]) => <Link key={href} href={href} className="text-gray-600 hover:text-gray-900 transition">{t(key)}</Link>)}<Link href="/favorites" className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"><Heart size={18} /><span className="text-sm">{t('nav.favorites')}</span></Link></nav><div className="flex items-center gap-4"><div className="flex items-center gap-2"><Globe size={18} className="text-gray-600" /><select value={language} onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'ar')} className="text-sm bg-transparent border-none cursor-pointer text-gray-600 hover:text-gray-900">{languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.label}</option>)}</select></div><button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button></div></div>{mobileMenuOpen && <nav className="md:hidden pb-4 border-t border-gray-200">{links.map(([href, key]) => <Link key={href} href={href} className="block py-2 text-gray-600 hover:text-gray-900 transition">{t(key)}</Link>)}<Link href="/favorites" className="flex items-center gap-2 py-2 text-gray-600 hover:text-gray-900 transition"><Heart size={18} />{t('nav.favorites')}</Link></nav>}</div></header>;
}
