'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { CATALOG_PARTS, CATALOG_STATS, searchCatalog } from '@/data/catalog';
import PartCard from '@/components/catalog/PartCard';
import AdSlot from '@/components/ads/AdSlot';
import { useAppStore } from '@/store';

const PAGE_SIZE = 48;

export default function PartsPage() {
  const { language } = useAppStore();
  const isArabic = language === 'ar';
  const isFrench = language === 'fr';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [manufacturer, setManufacturer] = useState('all');
  const [page, setPage] = useState(1);

  const categories = useMemo(
    () => Array.from(new Set(CATALOG_PARTS.map((part) => part.category).filter(Boolean))).sort(),
    [],
  );
  const manufacturers = useMemo(
    () => Array.from(new Set(CATALOG_PARTS.map((part) => part.specifications?.manufacturer).filter((value): value is string => Boolean(value)))).sort(),
    [],
  );
  const filtered = useMemo(() => {
    const base = query.trim() ? searchCatalog(query) : CATALOG_PARTS;
    return base.filter((part) =>
      (category === 'all' || part.category === category) &&
      (manufacturer === 'all' || part.specifications?.manufacturer === manufacturer),
    );
  }, [query, category, manufacturer]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') ?? params.get('search');
    if (initialQuery) setQuery(initialQuery.slice(0, 120));
  }, []);

  useEffect(() => setPage(1), [query, category, manufacturer]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const text = {
    eyebrow: isArabic ? 'كتالوج قطع الشاحنات' : isFrench ? 'Catalogue poids lourds' : 'Truck & bus parts catalogue',
    title: isArabic ? 'كتالوج قطع حقيقي بمراجع المصدر' : isFrench ? 'Catalogue de pièces documenté' : 'A real, source-backed parts catalogue',
    intro: isArabic
      ? 'ابحث برقم القطعة أو مرجع OEM أو المرجع التجاري. كل سجل مرتبط بالمصدر والصف، والتوافق الدقيق مع المركبة غير مؤكد تلقائياً.'
      : isFrench
        ? 'Recherchez par référence de pièce, OEM ou référence équipementier. Les références sont attribuées à leur source; la compatibilité exacte reste à confirmer.'
        : 'Search part numbers, OEM references and aftermarket references. Records retain source-page provenance; exact vehicle fitment is not automatically verified.',
    search: isArabic ? 'بحث بالاسم أو المرجع...' : isFrench ? 'Nom ou référence...' : 'Search name or reference...',
    category: isArabic ? 'كل الفئات' : isFrench ? 'Toutes catégories' : 'All categories',
    manufacturer: isArabic ? 'كل المصنّعين' : isFrench ? 'Tous constructeurs' : 'All manufacturers',
    results: isArabic ? 'نتيجة' : isFrench ? 'résultats' : 'results',
    noResults: isArabic ? 'ما لقيناش قطع مطابقة' : isFrench ? 'Aucune pièce trouvée' : 'No matching parts found',
    noResultsHint: isArabic ? 'جرّب مرجعاً آخر أو احذف بعض الفلاتر.' : isFrench ? 'Essayez une autre référence ou retirez un filtre.' : 'Try another reference or clear a filter.',
    previous: isArabic ? 'السابق' : isFrench ? 'Précédent' : 'Previous',
    next: isArabic ? 'التالي' : isFrench ? 'Suivant' : 'Next',
    sourceOnly: isArabic ? 'مراجع من مصادر موثقة؛ لا يوجد مخزون أو أسعار بيع منشورة.' : isFrench ? 'Références sourcées; aucun stock ni prix de vente publié.' : 'Source-listed references only; no stock or selling prices are published.',
    page: isArabic ? 'صفحة' : isFrench ? 'Page' : 'Page',
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-800 bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">{text.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{text.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">{text.intro}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_240px]">
            <label className="relative block">
              <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 ps-10 pe-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20" />
            </label>
            <label className="relative block">
              <Filter size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden />
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900 py-3 ps-9 pe-3 text-sm text-white outline-none focus:border-sky-400">
                <option value="all">{text.category}</option>
                {categories.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <select value={manufacturer} onChange={(event) => setManufacturer(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm text-white outline-none focus:border-sky-400">
                <option value="all">{text.manufacturer}</option>
                {manufacturers.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>{filtered.length.toLocaleString()} {text.results} · {CATALOG_STATS.manufacturers} manufacturers indexed</span>
            <span>{text.sourceOnly}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AdSlot placement="parts-top" />
        {visible.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((part) => <PartCard key={part.id} part={part} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">{text.noResults}</h2>
            <p className="mt-2 text-sm text-slate-500">{text.noResultsHint}</p>
            <button type="button" onClick={() => { setQuery(''); setCategory('all'); setManufacturer('all'); }} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white">Clear filters</button>
          </div>
        )}

        {filtered.length > 0 && (
          <nav aria-label="Catalogue pagination" className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={16} aria-hidden />{text.previous}</button>
            <span className="text-sm font-semibold text-slate-600">{text.page} {page} / {pageCount}</span>
            <button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">{text.next}<ChevronRight size={16} aria-hidden /></button>
          </nav>
        )}
        <div className="mt-10"><AdSlot placement="parts-bottom" /></div>
      </div>
    </main>
  );
}
