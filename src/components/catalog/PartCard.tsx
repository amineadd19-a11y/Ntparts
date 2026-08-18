'use client';

import { Part } from '@/types';
import Link from 'next/link';
import VerificationBadge from '@/components/common/VerificationBadge';
import FavoriteButton from '@/components/common/FavoriteButton';
import Image from 'next/image';
import { Package } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store';
import { getTranslation, translateCategory } from '@/data/translations';

interface PartCardProps {
  part: Part;
  showFavorite?: boolean;
}

function primaryOemStatus(part: Part): 'verified' | 'source-listed' | 'unverified' | null {
  if (!part.oemReferences?.length) return null;
  if (part.oemReferences.some((r) => r.verificationStatus === 'verified')) return 'verified';
  if (part.oemReferences.some((r) => r.verificationStatus === 'source-listed')) return 'source-listed';
  return 'unverified';
}

export default function PartCard({ part, showFavorite = true }: PartCardProps) {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const primaryImage = part.images?.find((img) => img.isPrimary) || part.images?.[0];
  const manufacturer = part.specifications?.manufacturer;
  const model = part.specifications?.model;
  const aftermarket = part.specifications?.aftermarketReference;
  const [failed, setFailed] = useState(!primaryImage?.url);

  const categoryLabel = translateCategory(part.category, language);
  const oemStatus = primaryOemStatus(part);
  const primaryOem = part.oemReferences?.[0]?.referenceNumber;

  return (
    <Link href={`/parts/${encodeURIComponent(part.id)}`} className="block h-full">
      <div className="nt-card nt-card-hover group flex h-full flex-col overflow-hidden rounded-xl">
        <div className="relative h-44 w-full flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-100 to-white">
          {primaryImage?.url && !failed ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage?.alt || part.name}
              fill
              sizes="(max-width:640px) 100vw, 25vw"
              className="object-contain p-3 transition duration-300 group-hover:scale-105"
              onError={() => setFailed(true)}
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
                <Package size={22} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">No product photo</span>
            </div>
          )}
          {showFavorite && (
            <div className="absolute end-2.5 top-2.5" onClick={(e) => e.preventDefault()}>
              <FavoriteButton partId={part.id} />
            </div>
          )}
          {oemStatus === 'verified' && (
            <span className="absolute start-2.5 top-2.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              VERIFIED OEM
            </span>
          )}
          {oemStatus === 'source-listed' && (
            <span className="absolute start-2.5 top-2.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
              SOURCE-LISTED
            </span>
          )}
        </div>

        <div className="flex flex-grow flex-col p-4">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">{categoryLabel}</span>
            {manufacturer && (
              <span className="truncate">
                {manufacturer}
                {model ? ` · ${model}` : ''}
              </span>
            )}
          </div>

          <h3 className="mb-1.5 line-clamp-2 text-[15px] font-extrabold leading-snug text-slate-900">
            {part.name}
          </h3>

          {primaryOem ? (
            <p className="mb-1 text-[11px] text-slate-500">
              OEM:{' '}
              <span className="font-mono font-semibold text-slate-700">{primaryOem}</span>
            </p>
          ) : (
            <p className="mb-1 text-[11px] text-slate-400">{t('part.oemPending')}</p>
          )}

          {aftermarket && (
            <p className="mb-3 text-[11px] text-slate-500">
              Aftermarket:{' '}
              <span className="font-mono font-semibold text-slate-600">{aftermarket}</span>
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <VerificationBadge status={part.verificationStatus} size="sm" />
            <span className="text-[11px] font-bold text-sky-700 transition group-hover:text-sky-800">
              {t('common.details')} →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
