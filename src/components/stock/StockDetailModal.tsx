'use client';

import Link from 'next/link';
import { X, Tag, Boxes, Banknote, FileText, ExternalLink } from 'lucide-react';
import type { StockLabelKey } from '@/data/stock-labels';

type CatalogMatch = {
  partId: string;
  name: string;
  category: string;
  description?: string;
  manufacturer?: string;
  verificationStatus?: string;
  oemReferences?: string[];
  aftermarketReference?: string;
};

export type StockRecordItem = {
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
  priceField: string | null;
  priceSnapshot: string | null;
  stockSource: string;
  stockSnapshot: string;
  catalogMatch: CatalogMatch | null;
  searchRefs: string[];
};

function formatPrice(value: number | null, currency: string | null, na: string): string {
  if (value === null || value === undefined) return na;
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency ?? 'MAD'}`;
}

export default function StockDetailModal({
  selected,
  onClose,
  L,
}: {
  selected: StockRecordItem;
  onClose: () => void;
  L: (key: StockLabelKey) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stock-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white shadow-nt-lg sm:rounded-3xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-accent-600">{L('details')}</p>
            <h2 id="stock-detail-title" className="font-mono text-xl font-black text-navy-950">
              {selected.reference}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
            aria-label={L('close')}
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <section>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
              <FileText size={14} aria-hidden /> {L('identification')}
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
              <Boxes size={14} aria-hidden /> {L('stockAvailable')}
            </h3>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-accent-100 bg-accent-50 p-3">
                <dt className="text-[10px] font-bold uppercase text-slate-400">{L('stockAvailable')}</dt>
                <dd className="mt-0.5 text-2xl font-black text-accent-800">{selected.quantity}</dd>
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
              <Banknote size={14} aria-hidden /> {L('pricing')}
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
                <dd className="mt-0.5 font-semibold text-slate-800">{selected.currency ?? L('notAvailable')}</dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-[10px] font-bold uppercase text-slate-400">{L('priceSource')}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-slate-800">
                  {selected.priceSource
                    ? `${selected.priceSource}${selected.priceField ? ` · ${selected.priceField}` : ''}`
                    : L('notAvailable')}
                </dd>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-[10px] font-bold uppercase text-slate-400">{L('date')}</dt>
                <dd className="mt-0.5 font-semibold text-slate-800">{selected.priceSnapshot ?? L('notAvailable')}</dd>
              </div>
            </dl>
          </section>

          <section>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">
              <Tag size={14} aria-hidden /> {L('technical')}
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
          </section>

          {selected.catalogMatch && (
            <Link
              href={`/parts/${selected.catalogMatch.partId}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-accent-500"
            >
              <ExternalLink size={16} aria-hidden /> {L('openCatalogue')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
