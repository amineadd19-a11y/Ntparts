'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PackageCheck, Search, RefreshCw, ExternalLink } from 'lucide-react';

type RecordItem = { reference: string; quantity: number; catalogMatch: { partId: string; name: string; category: string } | null };
type InventoryResponse = { source: string; snapshotDate: string; itemCount: number; totalQuantity: number; totalValue: number; records: RecordItem[]; recordsLoaded?: number };

export default function StockPage() {
  const [data, setData] = useState<InventoryResponse | null>(null);
  const [query, setQuery] = useState('');
  const [matchedOnly, setMatchedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Inventory request failed');
      setData(await response.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const records = useMemo(() => {
    const qRaw = query.trim();
    const q = qRaw.toLowerCase();
    const qNorm = qRaw.toLowerCase().replace(/[\s\-\/._]/g, '');
    return (data?.records ?? []).filter((item) => {
      if (matchedOnly && !item.catalogMatch) return false;
      if (!q) return true;
      const ref = item.reference ?? '';
      const refLower = ref.toLowerCase();
      const refNorm = refLower.replace(/[\s\-\/._]/g, '');
      const name = (item.catalogMatch?.name ?? '').toLowerCase();
      const category = (item.catalogMatch?.category ?? '').toLowerCase();
      if (refLower === q || refNorm === qNorm) return true;
      if (refLower.includes(q) || (qNorm.length >= 2 && refNorm.includes(qNorm))) return true;
      if (name.includes(q) || category.includes(q)) return true;
      return false;
    });
  }, [data, matchedOnly, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">NTParts Stock</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Available Now</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Current stock snapshot imported from the supplied Sage inventory. Search by reference (exact, partial, or normalized). Use catalogue links when a match exists.</p>
        </div>
        <button onClick={() => void load()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:border-emerald-300 hover:text-emerald-700">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {data && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-xs font-bold uppercase text-emerald-700">Stock lines</p><p className="mt-1 text-2xl font-black text-slate-950">{data.itemCount.toLocaleString()}</p></div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4"><p className="text-xs font-bold uppercase text-sky-700">Units in stock</p><p className="mt-1 text-2xl font-black text-slate-950">{data.totalQuantity.toLocaleString()}</p></div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4"><p className="text-xs font-bold uppercase text-violet-700">Stock value</p><p className="mt-1 text-2xl font-black text-slate-950">{data.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Snapshot</p><p className="mt-1 text-2xl font-black text-slate-950">{data.snapshotDate}</p></div>
          </div>

          <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reference, part name or category..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" /></div>
            <button onClick={() => setMatchedOnly((value) => !value)} className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${matchedOnly ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-white text-slate-700'}`}>Catalogue matches only</button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-[1.1fr_0.55fr_1.8fr_0.8fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">
              <span>Reference</span><span>Qty</span><span>NTParts catalogue</span><span>Status</span>
            </div>
            {loading ? <div className="p-12 text-center text-sm text-slate-500">Loading current stock...</div> : records.slice(0, 300).map((item) => (
              <div key={item.reference} className="grid grid-cols-[1.1fr_0.55fr_1.8fr_0.8fr] items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-0 hover:bg-slate-50">
                <span className="font-mono font-bold text-slate-900">{item.reference}</span>
                <span className="font-black text-emerald-700">{item.quantity}</span>
                <span className="min-w-0">{item.catalogMatch ? <Link href={`/parts/${item.catalogMatch.partId}`} className="font-semibold text-slate-800 hover:text-emerald-700">{item.catalogMatch.name}<span className="ml-2 text-xs font-normal text-slate-400">{item.catalogMatch.category}</span></Link> : <span className="text-slate-400">Reference not yet mapped</span>}</span>
                <span>{item.catalogMatch ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700"><PackageCheck size={13}/> Available</span> : <span className="text-xs font-semibold text-slate-400">Stock source</span>}</span>
              </div>
            ))}
            {records.length > 300 && <p className="border-t border-slate-100 p-4 text-center text-xs text-slate-500">Showing 300 of {records.length.toLocaleString()} matching stock lines. Refine the search to narrow the list.</p>}
            {!loading && records.length === 0 && (
              <div className="p-12 text-center text-sm text-slate-500">
                {query.trim()
                  ? <>No stock reference matches <span className="font-mono font-semibold text-slate-700">&quot;{query.trim()}&quot;</span>. Try another reference, or clear the search to browse available lines.</>
                  : <>No stock lines are loaded from the inventory snapshot.</>}
              </div>
            )}
          </div>

          {(data.recordsLoaded === 0 && !query.trim()) && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              Aggregate inventory figures above come from <strong>{data.source}</strong> (snapshot {data.snapshotDate}).
              Line-level stock rows could not be recovered from the snapshot payload. No fabricated references or quantities are shown.
            </div>
          )}
          {typeof data.recordsLoaded === 'number' && data.recordsLoaded > 0 && data.recordsLoaded < data.itemCount && (
            <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-sky-900">
              Showing <strong>{data.recordsLoaded.toLocaleString()}</strong> searchable stock lines recovered from <strong>{data.source}</strong>.
              Official snapshot totals remain <strong>{data.itemCount.toLocaleString()}</strong> references / <strong>{data.totalQuantity.toLocaleString()}</strong> units.
              Unrecovered lines are omitted rather than invented.
            </div>
          )}
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            Source: <strong>{data.source}</strong>, snapshot {data.snapshotDate}. Stock availability is an inventory snapshot, not a live warehouse reservation. Catalogue mapping does not by itself prove vehicle fitment. Missing values are marked as not verified — no data is invented.
          </div>
        </>
      )}
    </main>
  );
}
