import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Hash, ShieldCheck, Layers } from 'lucide-react';
import PartCard from '@/components/catalog/PartCard';
import AdSlot from '@/components/ads/AdSlot';
import {
  CATALOG_MANUFACTURERS,
  CATALOG_PARTS,
} from '@/data/catalog';

export default function ManufacturerSystemPage({
  params,
}: {
  params: { manufacturer: string; category: string };
}) {
  const manufacturer = CATALOG_MANUFACTURERS.find(
    (item) => item.id === params.manufacturer
  );
  if (!manufacturer) notFound();

  const category = decodeURIComponent(params.category);
  const parts = CATALOG_PARTS.filter(
    (part) =>
      part.specifications?.manufacturerId === manufacturer.id &&
      part.category === category
  );

  if (parts.length === 0) notFound();

  const withOem = parts.filter((p) => p.oemReferences?.length > 0);
  const modelsCovered = Array.from(
    new Set(parts.map((p) => p.specifications?.model).filter(Boolean))
  );

  // Collect unique OEM / cross numbers for this system view
  const oemSamples = withOem.flatMap((p) =>
    p.oemReferences.flatMap((oem) => [
      {
        partName: p.name,
        model: p.specifications?.model,
        number: oem.referenceNumber,
        alts: oem.alternateNumbers ?? [],
        partId: p.id,
      },
    ])
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href={`/trucks/${manufacturer.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
        >
          <ArrowLeft size={16} /> {manufacturer.name}
        </Link>

        {/* Header */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-7 sm:px-8">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-400">
              <span>{manufacturer.name}</span>
              <span className="text-slate-500">/</span>
              <span>System</span>
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              {category}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Indexed part templates for this system. Cards with a green OEM badge carry
              published manufacturer / aftermarket reference numbers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-3">
            <div className="flex items-center gap-3 bg-white px-5 py-4">
              <Layers size={18} className="text-slate-400" />
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Parts</p>
                <p className="text-xl font-black text-slate-900">{parts.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white px-5 py-4">
              <ShieldCheck size={18} className="text-emerald-600" />
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">With OEM</p>
                <p className="text-xl font-black text-emerald-700">{withOem.length}</p>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-3 bg-white px-5 py-4 sm:col-span-1">
              <Hash size={18} className="text-sky-600" />
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400">Models</p>
                <p className="text-sm font-bold text-slate-800">
                  {modelsCovered.join(' · ') || '—'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <AdSlot placement="system-top" />

        {/* OEM quick index */}
        {oemSamples.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 text-lg font-black text-slate-900">
              Published OEM & cross-references
            </h2>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3">Part</th>
                      <th className="px-4 py-3">Model</th>
                      <th className="px-4 py-3">OEM</th>
                      <th className="px-4 py-3">Cross / aftermarket</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oemSamples.map((row, i) => (
                      <tr
                        key={`${row.partId}-${row.number}-${i}`}
                        className="border-b border-slate-50 transition hover:bg-sky-50/50"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/parts/${encodeURIComponent(row.partId)}`}
                            className="font-semibold text-slate-900 hover:text-sky-700"
                          >
                            {row.partName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{row.model}</td>
                        <td className="px-4 py-3">
                          <code className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-800">
                            {row.number}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {row.alts.slice(0, 6).map((alt) => (
                              <span
                                key={alt}
                                className="rounded-full bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-sky-800 ring-1 ring-sky-100"
                              >
                                {alt}
                              </span>
                            ))}
                            {row.alts.length > 6 && (
                              <span className="text-[10px] font-semibold text-slate-400">
                                +{row.alts.length - 6}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Part cards */}
        <section>
          <h2 className="mb-4 text-lg font-black text-slate-900">All parts in this system</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {parts.map((part) => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">
          Always verify fitment against vehicle configuration and official manufacturer data
          before ordering.
        </p>
      </section>
    </main>
  );
}
