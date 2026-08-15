'use client';

import { Part } from '@/types';
import Link from 'next/link';
import VerificationBadge from '@/components/common/VerificationBadge';
import FavoriteButton from '@/components/common/FavoriteButton';
import Image from 'next/image';

interface PartCardProps { part: Part; showFavorite?: boolean; }

export default function PartCard({ part, showFavorite = true }: PartCardProps) {
  const primaryImage = part.images?.find((img) => img.isPrimary);
  return <Link href={`/parts/${encodeURIComponent(part.id)}`}><div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-600 transition overflow-hidden cursor-pointer h-full flex flex-col"><div className="relative w-full h-48 bg-gray-100 flex-shrink-0 overflow-hidden">{primaryImage ? <Image src={primaryImage.url} alt={primaryImage.alt || part.name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">📦</div>}{showFavorite && <div className="absolute top-2 right-2" onClick={(e) => e.preventDefault()}><FavoriteButton partId={part.id} /></div>}</div><div className="p-4 flex-grow flex flex-col"><div className="flex-grow"><h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">{part.name}</h3><p className="text-sm text-gray-600 mb-3">{part.category}</p>{part.oemReferences?.length ? <p className="text-xs text-gray-500 mb-3">OEM: {part.oemReferences[0].referenceNumber} · {part.oemReferences[0].verificationStatus === 'verified' ? 'Verified' : 'Source listed'}</p> : null}</div><div className="flex items-center justify-between mt-auto"><VerificationBadge status={part.verificationStatus} size="sm" /><span className="text-xs text-blue-600 font-medium">Details →</span></div></div></div></Link>;
}
