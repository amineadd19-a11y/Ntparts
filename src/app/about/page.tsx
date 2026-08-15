import Link from 'next/link';
import { CATALOG_STATS } from '@/data/catalog';
import { ShieldCheck, Database, Search } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-12 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">NTParts</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Catalogue & data quality</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-500">
          A searchable truck-parts reference catalogue designed to separate discovery data from
          confirmed fitment. The application never treats a manufacturer homepage as proof that an
          individual part fits a particular vehicle.
        </p>
      </div>

      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Manufacturers" value={CATALOG_STATS.manufacturers} />
        <Stat label="Models" value={CATALOG_STATS.models} />
        <Stat label="Part records" value={CATALOG_STATS.parts} />
        <Stat label="OEM records" value={CATALOG_STATS.verifiedOEMReferences} />
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-950">Verification levels</h2>
          </div>
          <ul className="mt-2 space-y-3 text-sm leading-6 text-slate-600">
            <li>
              <strong className="text-slate-900">Verified:</strong> reserved for a record whose source
              explicitly proves the reference/application relationship.
            </li>
            <li>
              <strong className="text-slate-900">Source listed:</strong> the reference is associated with
              an authoritative manufacturer/OEM source, but exact application still requires
              catalogue/VIN confirmation.
            </li>
            <li>
              <strong className="text-slate-900">Needs verification:</strong> do not use the record as an
              ordering decision without independent confirmation.
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Search size={18} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-950">How to use the catalogue</h2>
          </div>
          <ol className="mt-2 list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-600">
            <li>Search by OEM/reference, part name or truck model.</li>
            <li>Open the part record and inspect its manufacturer source.</li>
            <li>Confirm model, generation, engine, axle/chassis and VIN where required.</li>
            <li>Only then use an aftermarket cross-reference or place an order.</li>
          </ol>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <Database size={18} />
            </div>
            <h2 className="text-xl font-extrabold text-slate-950">Data policy</h2>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            OEM numbers are never guessed. Catalogue entries are discovery templates — not proof of
            fitment. Exact OEM references require manufacturer catalogue lookup using the exact truck
            configuration.
          </p>
        </section>
      </div>

      <Link
        href="/parts"
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
      >
        Browse parts →
      </Link>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-2xl font-black text-slate-950">{value.toLocaleString()}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}
