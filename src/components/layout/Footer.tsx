'use client';

import Link from 'next/link';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function Footer() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const year = new Date().getFullYear();
  return <footer className="bg-gray-900 text-gray-100 mt-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"><div><h3 className="font-bold text-lg mb-4">NTParts</h3><p className="text-gray-400 text-sm">Find the right truck part.</p></div><div><h4 className="font-semibold mb-4">{t('nav.search')}</h4><ul className="space-y-2 text-sm text-gray-400"><li><Link href="/search" className="hover:text-white transition">{t('search.title')}</Link></li><li><Link href="/parts" className="hover:text-white transition">{t('nav.parts')}</Link></li></ul></div><div><h4 className="font-semibold mb-4">{t('nav.trucks')}</h4><ul className="space-y-2 text-sm text-gray-400"><li><Link href="/trucks" className="hover:text-white transition">{t('nav.trucks')}</Link></li></ul></div><div><h4 className="font-semibold mb-4">Legal</h4><ul className="space-y-2 text-sm text-gray-400"><li><a href="#" className="hover:text-white transition">Privacy</a></li><li><a href="#" className="hover:text-white transition">Terms</a></li></ul></div></div><div className="border-t border-gray-800 pt-8"><p className="text-center text-sm text-gray-400">© {year} NTParts. All rights reserved. Made with care for truck technicians worldwide.</p></div></div></footer>;
}
