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
      <div className="nt-card nt-card-hover group flex h-full flex-col rounded-2xl p-6">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-slate-100 text-blue-700 shadow-sm">
            <span className="text-lg font-black tracking-tight">
              {manufacturer.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="rounded-full bg-slate-50 p-2 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <h3 className="text-lg font-extrabold tracking-tight text-slate-950">{manufacturer.name}</h3>

        <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Truck size={14} className="text-slate-400" />
            {manufacturer.modelCount ?? 0} models
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{(manufacturer.partCount ?? 0).toLocaleString()} parts</span>
        </div>

        <div className="mt-auto pt-6 text-sm font-bold text-blue-700 transition group-hover:text-blue-800">
          Browse catalogue →
        </div>
      </div>
    </Link>
  );
}
