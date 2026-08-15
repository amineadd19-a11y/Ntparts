'use client';

import { Part } from '@/types';
import Link from 'next/link';
import VerificationBadge from '@/components/common/VerificationBadge';
import FavoriteButton from '@/components/common/FavoriteButton';
import Image from 'next/image';
import { Package } from 'lucide-react';

interface PartCardProps {
  part: Part;
  showFavorite?: boolean;
}

export default function PartCard({ part, showFavorite = true }: PartCardProps) {
  const primaryImage = part.images?.find((img) => img.isPrimary);
  const manufacturer = part.specifications?.manufacturer;
  const model = part.specifications?.model;

  return (
    <Link href={`/parts/${encodeURIComponent(part.id)}`} className="block h-full">
      <div className="nt-card nt-card-hover group flex h-full flex-col overflow-hidden rounded-2xl">
        <div className="relative h-44 w-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || part.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <Package size={26} className="text-slate-400" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider">{part.category}</span>
            </div>
          )}
          {showFavorite && (
            <div className="absolute right-3 top-3" onClick={(e) => e.preventDefault()}>
              <FavoriteButton partId={part.id} />
            </div>
          )}
        </div>

        <div className="flex flex-grow flex-col p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-600">{part.category}</span>
            {manufacturer && <span className="truncate">{manufacturer}{model ? ` · ${model}` : ''}</span>}
          </div>

          <h3 className="mb-2 line-clamp-2 text-base font-extrabold leading-snug text-slate-950">
            {part.name}
          </h3>

          {part.oemReferences?.length ? (
            <p className="mb-4 text-xs text-slate-500">
              OEM: <span className="font-semibold text-slate-700">{part.oemReferences[0].referenceNumber}</span>
            </p>
          ) : (
            <p className="mb-4 text-xs text-slate-400">OEM reference pending verification</p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <VerificationBadge status={part.verificationStatus} size="sm" />
            <span className="text-xs font-bold text-blue-700 transition group-hover:text-blue-800">
              Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
