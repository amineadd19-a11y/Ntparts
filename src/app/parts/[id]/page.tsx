'use client';

import { getPartById, CATALOG_MANUFACTURERS } from '@/data/catalog';
import PartGallery from '@/components/gallery/PartGallery';
import VerificationBadge from '@/components/common/VerificationBadge';
import FavoriteButton from '@/components/common/FavoriteButton';
import AdSlot from '@/components/ads/AdSlot';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Hash, ShieldCheck, Tag, Building2, Layers } from 'lucide-react';

export default function PartPage({ params }: { params: { id: string } }) {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const part = getPartById(decodeURIComponent(params.id));
  if (!part) return <div className="mx-auto max-w-7xl px-4 py-12"><p className="text-center text-slate-600">Part not found</p><div className="mt-4 text-center"><Link href="/parts" className="font-semibold text-sky-700 hover:underline">Back to Parts</Link></div></div>;

  const manufacturerName = part.specifications?.manufacturer || CATALOG_MANUFACTURERS.find((m: (typeof CATALOG_MANUFACTURERS)[number]) => m.id === part.specifications?.manufacturerId)?.name;
  const modelName = part.specifications?.model;
  const manufacturerId = part.specifications?.manufacturerId;
  const brands = (part.specifications?.aftermarketBrands || '').split(',').map((b) => b.trim()).filter(Boolean);
  const crossList = (part.specifications?.crossReferences || '').split(',').map((c) => c.trim()).filter(Boolean);
  const isUnverified = part.verificationStatus === 'needs-verification';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link href={manufacturerId ? `/trucks/${manufacturerId}` : '/parts'} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-900"><ArrowLeft size={16} />{manufacturerName || 'Parts'}</Link>
        {isUnverified && <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><strong>Note:</strong> {t('common.demo')} — Verify exact fitment with manufacturer / VIN before ordering.</div>}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><PartGallery images={part.images || []} partName={part.name} /></div></div>
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">{part.category}</span><VerificationBadge status={part.verificationStatus} size="sm" /></div><div className="flex items-start justify-between gap-3"><h1 className="text-2xl font-black tracking-tight text-slate-900">{part.name}</h1><FavoriteButton partId={part.id} size={26} /></div><p className="mt-3 text-sm leading-relaxed text-slate-600">{part.description}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"><div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Building2 size={12} /> Manufacturer</div><p className="text-sm font-bold text-slate-900">{manufacturerName || '—'}</p></div><div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100"><div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400"><Layers size={12} /> Model</div><p className="text-sm font-bold text-slate-900">{modelName || '—'}</p></div></div></div>
            {part.oemReferences?.length > 0 ? <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm"><div className="mb-4 flex items-center gap-2"><ShieldCheck className="text-emerald-600" size={20} /><h2 className="text-base font-black text-slate-900">{t('part.oemReferences') || 'OEM references'}</h2></div><div className="space-y-4">{part.oemReferences.map((ref) => <div key={ref.id} className="rounded-xl border border-emerald-100 bg-white p-4"><div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Primary OEM</p><p className="mt-1 font-mono text-xl font-black tracking-tight text-slate-900">{ref.referenceNumber}</p></div><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">{ref.verificationStatus === 'verified' ? '✓ Verified' : ref.verificationStatus === 'source-listed' ? 'Source listed' : 'Unverified'}</span></div>{(ref.alternateNumbers?.length ?? 0) > 0 && <div className="mt-3"><p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Cross-references / aftermarket</p><div className="flex flex-wrap gap-1.5">{ref.alternateNumbers!.map((alt) => <span key={alt} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] font-semibold text-slate-700"><Hash size={10} className="text-slate-400" />{alt}</span>)}</div></div>}{ref.source && <a href={ref.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline">Source catalogue <ExternalLink size={12} /></a>}</div>)}</div></div> : <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-base font-black text-slate-900">OEM references</h2><p className="mt-2 text-sm text-slate-500">Exact OEM for this configuration requires manufacturer catalogue lookup.</p></div>}
            {brands.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-3 flex items-center gap-2"><Tag size={16} className="text-slate-400" /><h2 className="text-sm font-black text-slate-900">Aftermarket brands</h2></div><div className="flex flex-wrap gap-2">{brands.map((b) => <span key={b} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800 ring-1 ring-sky-100">{b}</span>)}</div></div>}
            {crossList.length > 0 && !part.oemReferences?.length && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-3 text-sm font-black text-slate-900">Cross-references</h2><div className="flex flex-wrap gap-1.5">{crossList.map((c) => <code key={c} className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">{c}</code>)}</div></div>}
            {part.sources?.length > 0 && <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="mb-3 text-sm font-black text-slate-900">Authoritative source</h2>{part.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-900 transition hover:bg-sky-100"><span>{source.name}</span><ExternalLink size={14} /></a>)}<p className="mt-2 text-[11px] leading-relaxed text-slate-500">Source establishes manufacturer context — not automatic proof of exact vehicle fitment.</p></div>}
            <AdSlot placement="part-detail" />
          </div>
        </div>
      </div>
    </div>
  );
}
