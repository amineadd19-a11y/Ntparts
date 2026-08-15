'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Truck } from 'lucide-react';

const LOGO_SLUGS: Record<string, string> = {
  'volvo-trucks': 'volvo',
  'daf-trucks': 'daf',
  'mercedes-benz-trucks': 'mercedes',
  scania: 'scania',
  'man-truck-bus': 'man',
  'renault-trucks': 'renault',
  iveco: 'iveco',
  kenworth: 'kenworth',
  peterbilt: 'peterbilt',
  freightliner: 'freightliner',
  mack: 'mack',
  'western-star': 'westernstar',
  hino: 'hino',
  isuzu: 'isuzu',
};

interface ManufacturerCardProps {
  manufacturer: {
    id: string;
    name: string;
    modelCount?: number;
    partCount?: number;
  };
}

export default function ManufacturerCard({ manufacturer }: ManufacturerCardProps) {
  const logoSlug = LOGO_SLUGS[manufacturer.id];
  const logoUrl = logoSlug ? `https://cdn.simpleicons.org/${logoSlug}` : null;

  return (
    <Link href={`/trucks/${manufacturer.id}`} className="block h-full">
      <div className="nt-card nt-card-hover group flex h-full flex-col rounded-xl p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-2 shadow-md shadow-slate-900/10 ring-1 ring-slate-200">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={`${manufacturer.name} logo`}
                width={44}
                height={44}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-sm font-black tracking-tight text-sky-600">
                {manufacturer.name.slice(0, 2).toUpperCase()}
              </span>
            )}
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
