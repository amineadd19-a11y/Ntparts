'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  PackageCheck,
  Search,
  RefreshCw,
  X,
  Tag,
  Boxes,
  Banknote,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/store';
import { stockLabel, type StockLabelKey } from '@/data/stock-labels';

type CatalogMatch = {
  partId: string;
  name: string;
  category: string;
  description?: string;
  manufacturer?: string;
  verificationStatus?: string;
  oemReferences?: string[];
  aftermarketReference?: string;
  sourcePrice?: string;
  sourceDocument?: string;
};

type RecordItem = {
  reference: string;
  normalizedReference: string;
  quantity: number;
  stock: number;
  gamme: string | null;
  description: string | null;
  manufacturer: string | null;
  purchasePrice: number | null;
  currency: string | null;
  priceSource: string | null;
  pricePage: number | null;
  stockSource: string;
  stockSnapshot: string;
  catalogMatch: CatalogMatch | null;
  searchRefs: string[];
};

type InventoryResponse = {
  source: string;
  snapshotDate: string;
  itemCount: number;
  totalQuantity: number;
  totalValue: number;
  records: RecordItem[];
  recordsLoaded?: number;
  totalMatches?: number;
  recordsWithPurchasePrice?: number;
};

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

function formatPrice(value: number | null, currency: string | null, na: string): string {
  if (value === null || value === undefined) return na;
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency ?? 'MAD'}`;
}

export default function StockPage() {
  const { language } = useAppStore();
  const L = useCallback((key: StockLabelKey) => stockLabel(language, key), [language]);

  const [data, setData] = useState<InventoryResponse | null>(null);
  const [query, setQuery] = useState('');
  const [matchedOnly, setMatchedOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<RecordItem | null>(null);
  const debouncedQuery = useDebounced(query, 200);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Inventory request failed');
      setData(await response.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const records = useMemo(() => {
    const list = data?.records ?? [];
    const qRaw = debouncedQuery.trim();
    const q = qRaw.toLowerCase();
    const qNorm = qRaw.toLowerCase().replace(/[\s\-\/._]/g, '');

    return list.filter((item) => {
      if (matchedOnly && !item.catalogMatch) return false;
      if (!q) return true;

      const candidates = [
        item.reference,
        item.normalizedReference,
        ...(item.searchRefs ?? []),
        item.gamme ?? '',
        item.description ?? '',
        item.manufacturer ?? '',
        item.catalogMatch?.name ?? '',
        item.catalogMatch?.category ?? '',
        ...(item.catalogMatch?.oemReferences ?? []),
      ];

      for (const c of candidates) {
        if (!c) continue;
        const lower = c.toLowerCase();
        const n = lower.replace(/[\s\-\/._]/g, '');
        if (lower === q || n === qNorm) return true;
        if (lower.includes(q)) return true;
        if (qNorm.length >= 2 && n.includes(qNorm)) return true;
      }
      return false;
    });
  }, [data, matchedOnly, debouncedQuery]);

  const shown = records.slice(0, 300);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">NTParts Stock</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{L('title')}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{L('description')}</p>
        </div>
        <button
          onClick={() => void load()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> {L('refresh')}
        </button>
      </div>

      {data && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase text-emerald-700">{L('stockLines')}</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{data.itemCount.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <p className="text-xs font-bold uppercase text-sky-700">{L('unitsInStock')}</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{data.totalQuantity.toLocaleString()}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-xs font-bold uppercase text-violet-700">{L('stockValue')}</p>
              <p className="mt-1 text-2xl font-black text-slate-950">
                {data.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-500">{L('snapshot')}</p>
              <p className="mt-1 text-2xl font-black text-slate-950">{data.snapshotDate}</p>
            </div>
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={L('searchPlaceholder')}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                autoComplete="off"
              />
            </div>
            <button
              onClick={() => setMatchedOnly((v) => !v)}
              className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                matchedOnly ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-white text-slate-700'
              }`}
            >
              {L('matchedOnly')}
            </button>
          </div>

          <div className="space-y-3">
            {loading && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                Loading current stock…
              </div>
            )}
            {!loading &&
              shown.map((item) => (
                <button
                  key={item.reference}
                  type="button"
                  onClick={() => setSelected(item)}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-black text-slate-900">{item.reference}</span>
                        {item.gamme && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                            <Tag size={12} /> {item.gamme}
                          </span>
                        )}
                        {item.catalogMatch ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                            <PackageCheck size={12} /> {L('available')}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">{L('stockSource')}</span>
                        )}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-sm text-slate-600">
                        {item.description ?? item.catalogMatch?.name ?? L('notVerified')}
                      </p>
                      {item.manufacturer && (
                        <p className="mt-1 text-xs text-slate-400">
                          {L('manufacturer')}: {item.manufacturer}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-row gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{L('stockAvailable')}</p>
                        <p className="text-lg font-black text-emerald-700">{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{L('purchasePrice')}</p>
                        <p className="text-sm font-bold text-slate-800">
                          {formatPrice(item.purchasePrice, item.currency, L('notAvailable'))}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}

            {!loading && records.length > 300 && (
              <p className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center text-xs text-slate-500">
                {L('showingOf')} 300 {L('ofMatches')} {records.length.toLocaleString()} {L('matchingLines')}
              </p>
            )}

            {!loading && records.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                {query.trim() ? (
                  <>
                    {L('noResults')}{' '}
                    <span className="font-mono font-semibold text-slate-700">&quot;{query.trim()}&quot;</span>. {L('tryAnother')}
                  </>
                ) : (
                  L('noLines')
                )}
              </div>
            )}
          </div>

          {typeof data.recordsLoaded === 'number' && data.recordsLoaded > 0 && data.recordsLoaded < data.itemCount && (
            <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-sky-900">
              {L('showingOf')} <strong>{data.recordsLoaded.toLocaleString()}</strong> {L('recoveredNote')}{' '}
              <strong>{data.source}</strong>. {L('officialTotals')}{' '}
              <strong>{data.itemCount.toLocaleString()}</strong> / <strong>{data.totalQuantity.toLocaleString()}</strong>{' '}
              {L('units')}.
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            {L('source')}: <strong>{data.source}</strong>, {L('date')} {data.snapshotDate}. {L('disclaimer')}
          </div>
        </>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-emerald-600">{L('details')}</p>
                <h2 className="font-mono text-xl font-black text-slate-950">{selected.reference}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                aria-label={L('close')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-5">
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <FileText size={14} /> {L('identification')}
                </h3>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('reference')}</dt>
                    <dd className="mt-0.5 font-mono font-bold text-slate-900">{selected.reference}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('gamme')}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-800">{selected.gamme ?? L('notAvailable')}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('partDescription')}</dt>
                    <dd className="mt-0.5 text-sm text-slate-800">
                      {selected.description ?? selected.catalogMatch?.name ?? L('notVerified')}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('manufacturer')}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                      {selected.manufacturer ?? L('notVerified')}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('status')}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                      {selected.catalogMatch?.verificationStatus ?? L('notVerified')}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <Boxes size={14} /> {L('stockAvailable')}
                </h3>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-emerald-700">{L('stockAvailable')}</dt>
                    <dd className="mt-0.5 text-2xl font-black text-emerald-800">{selected.quantity}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('date')}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-800">{selected.stockSnapshot}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('source')}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-800">{selected.stockSource}</dd>
                  </div>
                </dl>
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <Banknote size={14} /> {L('pricing')}
                </h3>
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('purchasePrice')}</dt>
                    <dd className="mt-0.5 text-lg font-black text-slate-900">
                      {formatPrice(selected.purchasePrice, selected.currency, L('notAvailable'))}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('currency')}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-800">
                      {selected.currency ?? L('notAvailable')}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('priceSource')}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                      {selected.priceSource ?? L('notAvailable')}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[10px] font-bold uppercase text-slate-400">{L('pricePage')}</dt>
                    <dd className="mt-0.5 font-semibold text-slate-800">
                      {selected.pricePage != null ? String(selected.pricePage) : L('notAvailable')}
                    </dd>
                  </div>
                </dl>
              </section>

              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
                  <Tag size={14} /> {L('technical')}
                </h3>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">{L('oemRefs')}</p>
                  {selected.catalogMatch?.oemReferences && selected.catalogMatch.oemReferences.length > 0 ? (
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {selected.catalogMatch.oemReferences.map((r) => (
                        <li key={r} className="rounded-lg bg-white px-2 py-1 font-mono text-xs font-semibold text-slate-700 shadow-sm">
                          {r}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-slate-500">{L('notVerified')}</p>
                  )}
                </div>
                {selected.searchRefs.length > 1 && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Search refs</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {selected.searchRefs.slice(0, 16).map((r) => (
                        <li key={r} className="rounded-lg bg-white px-2 py-1 font-mono text-xs text-slate-600 shadow-sm">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {selected.catalogMatch && (
                <Link
                  href={`/parts/${selected.catalogMatch.partId}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-500"
                >
                  <ExternalLink size={16} /> {L('openCatalogue')}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
