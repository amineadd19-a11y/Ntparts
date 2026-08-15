'use client';

import Link from 'next/link';
import { ShieldCheck, Search, Truck, Database } from 'lucide-react';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';

export default function Footer() {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const year = new Date().getFullYear();

  const copy =
    language === 'fr'
      ? {
          tagline: 'Catalogue pièces industrielles',
          blurb:
            'Catalogue professionnel de références OEM, numéros de pièces et compatibilités poids lourds — conçu pour les techniciens et spécialistes pièces.',
          verified: 'Données vérifiées',
          structured: 'Données structurées',
          advanced: 'Recherche avancée',
          allMfr: 'Tous les constructeurs',
          company: 'Entreprise',
          privacy: 'Politique de confidentialité',
          terms: "Conditions d'utilisation",
          dataPolicy: 'Politique qualité des données',
          rights: 'Tous droits réservés.',
          disclaimer:
            'Les numéros OEM ne sont jamais inventés. Vérifiez toujours la compatibilité avant commande.',
        }
      : language === 'ar'
        ? {
            tagline: 'كتالوج القطع الصناعية',
            blurb:
              'كتالوج احترافي لأرقام OEM وقطع الشاحنات والتوافق — للمحترفين والفنيين.',
            verified: 'بيانات موثّقة',
            structured: 'بيانات منظّمة',
            advanced: 'بحث متقدم',
            allMfr: 'كل الشركات',
            company: 'الشركة',
            privacy: 'سياسة الخصوصية',
            terms: 'شروط الاستخدام',
            dataPolicy: 'سياسة جودة البيانات',
            rights: 'جميع الحقوق محفوظة.',
            disclaimer: 'أرقام OEM لا تُختلق أبداً. تحقق من التوافق قبل الطلب.',
          }
        : {
            tagline: 'Industrial Parts Intelligence',
            blurb:
              'Professional catalogue for OEM references, part numbers and truck compatibility — built for technicians and parts specialists.',
            verified: 'Verification-aware',
            structured: 'Structured data',
            advanced: 'Advanced search',
            allMfr: 'All manufacturers',
            company: 'Company',
            privacy: 'Privacy Policy',
            terms: 'Terms of Use',
            dataPolicy: 'Data quality policy',
            rights: 'All rights reserved.',
            disclaimer: 'OEM numbers are never guessed. Always verify fitment before ordering.',
          };

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
                <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  {copy.tagline}
                </div>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-400">{copy.blurb}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-300">
                <ShieldCheck size={11} /> {copy.verified}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-300">
                <Database size={11} /> {copy.structured}
              </span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('nav.search')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/search" className="inline-flex items-center gap-2 transition hover:text-sky-300">
                  <Search size={13} /> {copy.advanced}
                </Link>
              </li>
              <li>
                <Link href="/parts" className="transition hover:text-sky-300">
                  {t('nav.parts')}
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="transition hover:text-sky-300">
                  {t('nav.favorites')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('nav.trucks')}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/trucks" className="inline-flex items-center gap-2 transition hover:text-sky-300">
                  <Truck size={13} /> {copy.allMfr}
                </Link>
              </li>
              <li>
                <Link href="/trucks/volvo-trucks" className="transition hover:text-sky-300">
                  Volvo Trucks
                </Link>
              </li>
              <li>
                <Link href="/trucks/scania" className="transition hover:text-sky-300">
                  Scania
                </Link>
              </li>
              <li>
                <Link href="/trucks/mercedes-benz-trucks" className="transition hover:text-sky-300">
                  Mercedes-Benz
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
              {copy.company}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/about" className="transition hover:text-sky-300">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <a href="#" className="transition hover:text-sky-300">
                  {copy.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-sky-300">
                  {copy.terms}
                </a>
              </li>
              <li>
                <a href="#" className="transition hover:text-sky-300">
                  {copy.dataPolicy}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            © {year} NTParts. {copy.rights}
          </p>
          <p className="text-xs text-slate-600">{copy.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
