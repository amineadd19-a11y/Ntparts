'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Vehicle = {
  id: string;
  kind: 'truck' | 'bus';
  makeId: string;
  make: string;
  model: string;
  slug: string;
  countries: string[];
  regions: string[];
};

type VehicleResponse = {
  source: string;
  datasetLicense: string;
  attribution: string;
  attributionUrl: string;
  count: number;
  vehicles: Vehicle[];
  notice: string;
};

export default function VehiclesPage() {
  const [kind, setKind] = useState<'all' | 'truck' | 'bus'>('all');
  const [query, setQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch('/api/open-vehicles')
      .then((response) => {
        if (!response.ok) throw new Error('Vehicle data unavailable');
        return response.json() as Promise<VehicleResponse>;
      })
      .then((data) => {
        if (active) setVehicles(data.vehicles);
      })
      .catch(() => {
        if (active) setError('تعذر تحميل بيانات المركبات المجانية حالياً. حاول مرة أخرى لاحقاً.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return vehicles.filter((vehicle) => {
      if (kind !== 'all' && vehicle.kind !== kind) return false;
      if (!normalized) return true;
      return `${vehicle.make} ${vehicle.model} ${vehicle.id}`.toLocaleLowerCase().includes(normalized);
    });
  }, [vehicles, kind, query]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 max-w-3xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Free open data</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Truck & bus vehicle finder</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Search a free list of truck and bus makes and models. Vehicle identity is not proof that a part fits.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block">
          <span className="sr-only">Search make or model</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)}
            placeholder="Search make or model, e.g. Volvo, Scania, Iveco..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
        </label>
        <div className="flex gap-2" aria-label="Vehicle type">
          {(['all', 'truck', 'bus'] as const).map((value) => (
            <button key={value} onClick={() => setKind(value)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${kind === value ? 'bg-slate-900 text-white' : 'border border-slate-300 bg-white text-slate-700'}`}>
              {value === 'all' ? 'All' : value === 'truck' ? 'Trucks' : 'Buses'}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        {loading ? 'Loading open vehicle data…' : `${filtered.length.toLocaleString()} vehicles`}
      </p>
      {error && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">No vehicles match this search.</div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.slice(0, 150).map((vehicle) => (
          <article key={vehicle.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{vehicle.kind}</p>
                <h2 className="mt-1 font-bold text-slate-900">{vehicle.make}</h2>
                <p className="text-sm text-slate-600">{vehicle.model}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{vehicle.regions.join(', ') || 'Region unspecified'}</span>
            </div>
            <p className="mt-3 break-all text-xs text-slate-400">{vehicle.id}</p>
          </article>
        ))}
      </div>
      {filtered.length > 150 && <p className="mt-6 text-center text-sm text-slate-500">Showing 150 results. Refine your search to see more.</p>}

      <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm leading-6 text-blue-950">
        <p className="font-bold">Important data limitation</p>
        <p>These records identify vehicle makes and models only. They do not contain verified NTParts stock, OEM part references, engine-level configurations, or confirmed part-to-vehicle fitment. Do not use this list alone to approve an order.</p>
        <p className="mt-3">Open dataset: <a className="font-semibold underline" href="https://github.com/vehiclesdb/vehiclesdb" target="_blank" rel="noreferrer">VehiclesDB on GitHub</a> · Licensed under CC BY 4.0.</p>
        <p className="mt-2 font-semibold">Vehicle data by <a className="underline" href="https://vehiclesdb.com" target="_blank" rel="noreferrer">VehiclesDB</a></p>
      </div>
      <div className="mt-8"><Link href="/parts" className="font-semibold text-blue-700 hover:underline">Browse available part records →</Link></div>
    </main>
  );
}
