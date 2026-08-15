'use client';

import Link from 'next/link';
import { ArrowUpRight, Truck } from 'lucide-react';

interface ManufacturerCardProps {
  manufacturer: {
    id: string;
    name: string;
    modelCount?: number;
    partCount?: number;
  };
}

export default function ManufacturerCard({ manufacturer }: ManufacturerCardProps) {
  return (
    <Link href={`/trucks/${manufacturer.id}`} className="block h-full">
      <div className="nt-card nt-card-hover group flex h-full flex-col rounded-xl p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-slate-800 to-slate-950 text-sky-400 shadow-md shadow-slate-900/20">
            <span className="text-sm font-black tracking-tight">
              {manufacturer.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="rounded-lg bg-slate-100 p-1.5 text-slate-400 transition group-hover:bg-sky-50 group-hover:text-sky-600">
            <ArrowUpRight size={15} />
          </div>
        </div>

        <h3 className="text-base font-extrabold tracking-tight text-slate-900">{manufacturer.name}</h3>

        <div className="mt-2.5 flex items-center gap-2.5 text-xs font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Truck size={13} className="text-slate-400" />
            {manufacturer.modelCount ?? 0} models
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{(manufacturer.partCount ?? 0).toLocaleString()} parts</span>
        </div>

        <div className="mt-auto pt-5 text-xs font-bold uppercase tracking-wider text-sky-700 transition group-hover:text-sky-800">
          Open catalogue →
        </div>
      </div>
    </Link>
  );
}
