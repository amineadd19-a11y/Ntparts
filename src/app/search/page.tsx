'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, ArrowRight, ShieldCheck, Filter } from 'lucide-react';
import SearchBar from '@/components/search/SearchBar';
import VerificationBadge from '@/components/common/VerificationBadge';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';
import { CATALOG_PARTS, CATALOG_MANUFACTURERS } from '@/data/catalog';
import { searchCatalogue } from '@/lib/catalog/search';

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

  const searchResult = useMemo(() => {
    if (!q) return { results: [], total: 0 };
    return searchCatalogue(q, {
      limit: 100,
      category: category === 'all' ? undefined : category,
    });
  }, [q, category]);

  const manufacturerNames = useMemo(() => new Map(CATALOG_MANUFACTURERS.map((m) => [m.id, m.name])), []);

  const totalUnfiltered = useMemo(() => {
    if (!q) return 0;
    return searchCatalogue(q, { limit: 500 }).total;
  }, [q]);

  return (
    <main className="min-h-screen bg-slate-100">
      <section className="nt-hero-grid border-b border-slate-800 px-4 py-10 sm:px-6 lg:px-8">
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
          <div className="text-sm text-slate-600" aria-live="polite">
            {q ? (
              <>
                <strong className="font-bold text-navy-900">{totalUnfiltered}</strong>{' '}
                {language === 'fr' ? 'résultats pour' : language === 'ar' ? 'نتيجة لـ' : 'results for'}{' '}
                <span className="rounded-md bg-sky-50 px-1.5 py-1 font-mono font-semibold text-sky-700">{'“' + q + '”'}</span>
                {category !== 'all' && (
                  <span className="ml-2 inline-flex rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
                    {searchResult.total} {language === 'fr' ? 'dans cette catégorie' : language === 'ar' ? 'في هذه الفئة' : 'in this category'}
                  </span>
                )}
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
          </div>
          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 shadow-sm sm:self-auto">
            <Filter size={14} className="text-slate-400" aria-hidden />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 min-w-0 bg-transparent text-sm font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label={language === 'fr' ? 'Filtrer par catégorie' : language === 'ar' ? 'تصفية حسب الفئة' : 'Filter by category'}
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

        <div className="space-y-4">
          {searchResult.results.map(({ part, matchKind, verificationStatus }, index) => (
            <article
              key={part.id}
              style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
              className="nt-card nt-card-hover animate-fade-up group flex flex-col gap-4 rounded-2xl p-4 sm:p-5 lg:flex-row lg:items-start lg:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-navy-900 transition-colors group-hover:text-sky-800">{part.name}</h2>
                  <VerificationBadge status={verificationStatus} size="sm" />
                  {matchKind.startsWith('exact') && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold uppercase text-sky-800">
                      <ShieldCheck size={11} aria-hidden /> Exact ref
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{part.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{part.category}</span>
                  {part.oemReferences.map((o) => (
                    <span key={o.id} className="inline-flex flex-wrap items-center gap-1 rounded-md bg-sky-50 px-2 py-1 text-xs text-sky-900">
                      <span className="font-semibold">{manufacturerNames.get(o.manufacturerId) ?? o.manufacturerId}</span>
                      <span className="font-mono font-bold">{o.referenceNumber}</span>
                    </span>
                  ))}
                  {part.oemReferences.flatMap((o) => o.alternateNumbers ?? []).map((ref, altIndex) => (
                    <span key={part.id + '-alt-' + altIndex + '-' + ref} className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs text-slate-600">
                      {ref}
                    </span>
                  ))}
                </div>
                {(part.crossReferences.length > 0 || (part.crossBrandReferences?.length ?? 0) > 0) && (
                  <div className="mt-4 rounded-xl border border-emerald-200/90 bg-emerald-50/80 p-3 sm:p-4">
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-emerald-900">
                      {language === 'fr' ? 'Références équivalentes / autres marques' : language === 'ar' ? 'المراجع المكافئة / ماركات أخرى' : 'Equivalent references / other brands'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(part.crossBrandReferences ?? []).map((xref) => (
                        <a
                          key={xref.brand + '-' + xref.referenceNumber}
                          href={xref.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={xref.notes ?? xref.verificationStatus}
                          className="rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs text-emerald-950 transition-colors hover:border-emerald-400 hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                        >
                          <b>{xref.brand}</b>
                          <span className="ml-2 font-mono font-bold">{xref.referenceNumber}</span>
                          <span className="ml-2 text-[10px] text-emerald-700">({xref.verificationStatus})</span>
                          <span className="ml-1" aria-hidden="true">↗</span>
                        </a>
                      ))}
                      {part.crossReferences.map((xref) => {
                        const linkedPart = CATALOG_PARTS.find((candidate) => candidate.id === xref.referencedPartId);
                        const linkedRefs = linkedPart?.oemReferences ?? [];
                        return (
                          <span key={xref.id} title={xref.notes ?? xref.relationshipType} className="rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs text-emerald-950">
                            <b>{linkedPart?.name ?? xref.referencedPartId}</b>
                            {linkedRefs.map((ref) => (
                              <span key={ref.id} className="ml-2 font-mono">{(manufacturerNames.get(ref.manufacturerId) ?? ref.manufacturerId) + ': ' + ref.referenceNumber}</span>
                            ))}
                            <span className="ml-2 text-[10px] text-emerald-700">({xref.relationshipType})</span>
                          </span>
                        );
                      })}
                    </div>
                    <p className="mt-3 text-[11px] leading-4 text-emerald-800">
                      {language === 'fr' ? 'Confirmez la compatibilité exacte avant commande.' : language === 'ar' ? 'تأكد من التوافق الدقيق قبل الطلب.' : 'Confirm exact fitment before ordering.'}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-100 pt-3 lg:w-28 lg:flex-col lg:items-end lg:border-0 lg:pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'fr' ? 'Fiche pièce' : language === 'ar' ? 'تفاصيل القطعة' : 'Part details'}
                </span>
                <Link
                  href={`/parts/${part.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  <Package size={15} aria-hidden />
                  {language === 'fr' ? 'Voir' : language === 'ar' ? 'عرض' : 'View'}
                  <ArrowRight size={14} aria-hidden className={language === 'ar' ? 'rotate-180' : ''} />
                </Link>
              </div>
            </article>
          ))}

          {q && searchResult.results.length === 0 && (
            <div className="animate-fade-up rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="text-slate-400" size={26} aria-hidden />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-700">
                {language === 'fr' ? 'Aucun résultat dans le catalogue.' : language === 'ar' ? 'لا نتائج في الكتالوج.' : 'No catalogue matches.'}
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {language === 'fr'
                  ? 'Essayez une autre référence ou consultez le stock disponible.'
                  : language === 'ar'
                    ? 'جرّب مرجعاً آخر أو اطّلع على المخزون المتوفر.'
                    : 'Try another reference or check available stock.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/stock" className="rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-accent-500">
                  {language === 'fr' ? 'Stock disponible' : language === 'ar' ? 'السلع المتوفرة' : 'Available stock'}
                </Link>
                <button type="button" onClick={() => router.push('/search')} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300">
                  {language === 'fr' ? 'Effacer' : language === 'ar' ? 'مسح' : 'Clear'}
                </button>
              </div>
            </div>
          )}

          {!q && (
            <div className="animate-fade-up rounded-2xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm leading-6 text-slate-500 sm:p-10">
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
