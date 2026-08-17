'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';
import { CATALOG_PARTS } from '@/data/catalog';
import { normalizeReference } from '@/lib/catalog/normalize';

function matchesPart(part: (typeof CATALOG_PARTS)[number], q: string): boolean {
  const raw = q.trim();
  if (!raw) return true;
  const lower = raw.toLowerCase();
  const norm = normalizeReference(raw);
  const candidates: string[] = [
    part.name,
    part.category,
    part.description ?? '',
    part.specifications?.manufacturer ?? '',
    part.specifications?.aftermarketReference ?? '',
    ...part.oemReferences.flatMap((o) => [o.referenceNumber, ...(o.alternateNumbers ?? [])]),
  ];
  for (const c of candidates) {
    if (!c) continue;
    const s = String(c);
    if (s.toLowerCase().includes(lower)) return true;
    if (norm.length >= 2 && normalizeReference(s).includes(norm)) return true;
  }
  return false;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, addToSearchHistory } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const q = (searchParams.get('q') ?? '').trim();
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    if (q) addToSearchHistory(q);
  }, [q, addToSearchHistory]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const p of CATALOG_PARTS) if (p.category) set.add(p.category);
    return Array.from(set).sort();
  }, []);

  const results = useMemo(() => {
    let list = CATALOG_PARTS.filter((p) => matchesPart(p, q));
    if (category !== 'all') list = list.filter((p) => p.category === category);
    return list.slice(0, 100);
  }, [q, category]);

  const totalUnfiltered = useMemo(() => CATALOG_PARTS.filter((p) => matchesPart(p, q)).length, [q]);

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="border-b border-slate-800 bg-navy-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-400">
            {language === 'fr' ? 'Recherche industrielle' : language === 'ar' ? 'بحث صناعي' : 'Industrial search'}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
            {language === 'fr' ? 'Trouver une pièce' : language === 'ar' ? 'البحث عن قطعة' : 'Find a part'}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            {language === 'fr'
              ? 'Recherche exacte, partielle et normalisée sur références OEM et aftermarket.'
              : language === 'ar'
                ? 'بحث دقيق وجزئي ومُطبَّع على مراجع OEM والبدائل.'
                : 'Exact, partial and normalized search across OEM and aftermarket references.'}
          </p>
          <div className="mt-6">
            <SearchBar placeholder={t('home.searchPlaceholder')} autoFocus={!q} variant="hero" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            {q ? (
              <>
                <strong className="font-bold text-navy-900">{totalUnfiltered}</strong>{' '}
                {language === 'fr' ? 'résultats pour' : language === 'ar' ? 'نتيجة لـ' : 'results for'}{' '}
                <span className="font-mono font-semibold text-sky-700">&quot;{q}&quot;</span>
              </>
            ) : (
              <span>
                {language === 'fr'
                  ? 'Saisissez une référence, un nom ou un constructeur.'
                  : language === 'ar'
                    ? 'أدخل مرجعاً أو اسماً أو شركة مصنعة.'
                    : 'Enter a reference, name or manufacturer.'}
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" aria-hidden />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-sky-400"
              aria-label="Category"
            >
              <option value="all">
                {language === 'fr' ? 'Toutes catégories' : language === 'ar' ? 'كل الفئات' : 'All categories'}
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {results.map((part) => (
            <Link
              key={part.id}
              href={`/parts/${part.id}`}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-nt-sm transition hover:border-sky-300 hover:shadow-nt sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-navy-900 group-hover:text-sky-800">{part.name}</span>
                  {part.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-800">
                      <ShieldCheck size={11} aria-hidden /> Verified
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{part.description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{part.category}</span>
                  {part.oemReferences.slice(0, 3).map((o) => (
                    <span key={o.referenceNumber} className="rounded-md bg-sky-50 px-2 py-0.5 font-mono text-xs font-semibold text-sky-800">
                      {o.referenceNumber}
                    </span>
                  ))}
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-sky-700 group-hover:text-sky-900">
                <Package size={15} aria-hidden />
                {language === 'fr' ? 'Voir' : language === 'ar' ? 'عرض' : 'View'}
                <ArrowRight size={14} aria-hidden className={language === 'ar' ? 'rotate-180' : ''} />
              </span>
            </Link>
          ))}

          {q && results.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <Search className="mx-auto text-slate-300" size={32} aria-hidden />
              <p className="mt-4 text-sm font-semibold text-slate-600">
                {language === 'fr' ? 'Aucun résultat dans le catalogue.' : language === 'ar' ? 'لا نتائج في الكتالوج.' : 'No catalogue matches.'}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {language === 'fr'
                  ? 'Essayez une autre référence ou consultez le stock disponible.'
                  : language === 'ar'
                    ? 'جرّب مرجعاً آخر أو اطّلع على المخزون المتوفر.'
                    : 'Try another reference or check available stock.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/stock" className="rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-accent-500">
                  {language === 'fr' ? 'Stock disponible' : language === 'ar' ? 'السلع المتوفرة' : 'Available stock'}
                </Link>
                <button type="button" onClick={() => router.push('/search')} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-slate-300">
                  {language === 'fr' ? 'Effacer' : language === 'ar' ? 'مسح' : 'Clear'}
                </button>
              </div>
            </div>
          )}

          {!q && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-sm text-slate-500">
              {language === 'fr'
                ? 'Recherchez par numéro OEM, référence aftermarket, nom de pièce ou constructeur.'
                : language === 'ar'
                  ? 'ابحث برقم OEM أو مرجع بديل أو اسم القطعة أو الشركة المصنعة.'
                  : 'Search by OEM number, aftermarket reference, part name or manufacturer.'}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">Loading search…</div>}>
      <SearchResults />
    </Suspense>
  );
}
