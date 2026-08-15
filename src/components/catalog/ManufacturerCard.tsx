'use client';

import Link from 'next/link';

interface ManufacturerCardProps { manufacturer: { id: string; name: string; modelCount?: number; partCount?: number; }; }

export default function ManufacturerCard({ manufacturer }: ManufacturerCardProps) {
  return <Link href={`/trucks/${manufacturer.id}`} className="block h-full"><div className="bg-white rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition p-6 cursor-pointer h-full"><div className="w-12 h-12 mb-4 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold">{manufacturer.name.slice(0, 2).toUpperCase()}</div><h3 className="text-lg font-semibold text-gray-900 mb-2">{manufacturer.name}</h3><div className="flex gap-4 text-sm text-gray-500"><span>{manufacturer.modelCount ?? 0} models</span><span>{manufacturer.partCount ?? 0} parts</span></div><div className="mt-5 text-blue-600 font-medium text-sm">Browse catalogue →</div></div></Link>;
}
