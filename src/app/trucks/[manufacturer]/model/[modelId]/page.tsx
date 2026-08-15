import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Database } from 'lucide-react';
import PartCard from '@/components/catalog/PartCard';
import AdSlot from '@/components/ads/AdSlot';
import {
  CATALOG_MANUFACTURERS,
  CATALOG_MODELS,
  CATALOG_PARTS,
} from '@/data/catalog';

export default function ManufacturerModelPage({
  params,
}: {
  params: { manufacturer: string; modelId: string };
}) {
  const manufacturer = CATALOG_MANUFACTURERS.find(
    (item) => item.id === params.manufacturer
  );
  if (!manufacturer) notFound();

  const modelId = decodeURIComponent(params.modelId);
  const model = CATALOG_MODELS.find(
    (m) => m.id === modelId && m.manufacturerId === manufacturer.id
  );
  if (!model) notFound();

  const parts = CATALOG_PARTS.filter(
    (part) =>
      part.specifications?.manufacturerId === manufacturer.id &&
      part.specifications?.model === model.name
  );

  const withOem = parts.filter((p) => p.oemReferences?.length > 0);
  const categories = Array.from(new Set(parts.map((p) => p.category))).sort();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href={`/trucks/${manufacturer.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
        >
          <ArrowLeft size={16} /> {manufacturer.name}
        </Link>

        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-7 sm:px-8">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-400">
              <Database size={14} />
              <span>{manufacturer.name}</span>
              <span className="text-slate-500">/</span>
              <span>Model</span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {model.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Complete part template index for this model line, including published OEM and
              cross-reference numbers where available.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-3">
            <div className="bg-white px-5 py-4">
              <p className="text-[10px] font-bold uppercase text-slate-400">Parts</p>
              <p className="text-2xl font-black text-slate-900">{parts.length}</p>
            </div>
            <div className="bg-white px-5 py-4">
              <p className="text-[10px] font-bold uppercase text-slate-400">With OEM</p>
              <p className="flex items-center gap-1.5 text-2xl font-black text-emerald-700">
                <ShieldCheck size={20} /> {withOem.length}
              </p>
            </div>
            <div className="col-span-2 bg-white px-5 py-4 sm:col-span-1">
              <p className="text-[10px] font-bold uppercase text-slate-400">Systems</p>
              <p className="text-sm font-bold text-slate-800">{categories.join(' · ')}</p>
            </div>
          </div>
        </div>

        <AdSlot placement="model-top" />

        {/* Jump links by system */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/trucks/${manufacturer.id}/system/${encodeURIComponent(cat)}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-800"
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* OEM block */}
        {withOem.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-black text-slate-900">
              OEM numbers for {model.name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {withOem.map((part) =>
                part.oemReferences.map((oem) => (
                  <Link
                    key={oem.id}
                    href={`/parts/${encodeURIComponent(part.id)}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-sky-300 hover:shadow-md"
                  >
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {part.category} · {part.name}
                    </p>
                    <p className="mt-2 font-mono text-lg font-black text-slate-900">
                      {oem.referenceNumber}
                    </p>
                    {(oem.alternateNumbers?.length ?? 0) > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {oem.alternateNumbers!.slice(0, 4).map((alt) => (
                          <span
                            key={alt}
                            className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))
              )}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-lg font-black text-slate-900">All parts</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {parts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
