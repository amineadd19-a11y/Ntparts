'use client';

import { getPartById, CATALOG_MANUFACTURERS } from '@/data/catalog';
import PartGallery from '@/components/gallery/PartGallery';
import VerificationBadge from '@/components/common/VerificationBadge';
import FavoriteButton from '@/components/common/FavoriteButton';
import AdSlot from '@/components/ads/AdSlot';
import { useAppStore } from '@/store';
import { getTranslation } from '@/data/translations';
import Link from 'next/link';

export default function PartPage({ params }: { params: { id: string } }) {
  const { language } = useAppStore();
  const t = (key: string) => getTranslation(key, language);
  const part = getPartById(decodeURIComponent(params.id));
  if (!part) return <div className="max-w-7xl mx-auto px-4 py-12"><p className="text-center text-gray-600">Part not found</p><div className="text-center mt-4"><Link href="/parts" className="text-blue-600 hover:underline">Back to Parts</Link></div></div>;
  const isUnverified = part.verificationStatus === 'needs-verification';
  return <div className="max-w-7xl mx-auto px-4 py-12">{isUnverified && <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4"><p className="text-yellow-800 text-sm"><strong>Note:</strong> {t('common.demo')} — Verify exact fitment with manufacturer / VIN.</p></div>}<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"><div className="lg:col-span-2"><PartGallery images={part.images || []} partName={part.name} /></div><div className="space-y-6"><div><div className="flex items-start justify-between gap-4 mb-4"><h1 className="text-2xl font-bold text-gray-900">{part.name}</h1><FavoriteButton partId={part.id} size={28} /></div><p className="text-gray-600 mb-4">{part.description}</p><VerificationBadge status={part.verificationStatus} size="lg" />{part.specifications?.manufacturer && <p className="text-sm text-gray-500 mt-2">{part.specifications.manufacturer} {part.specifications.model}</p>}</div>{part.oemReferences?.length > 0 && <div className="border-t pt-6"><h3 className="font-semibold text-gray-900 mb-3">{t('part.oemReferences')}</h3><div className="space-y-2">{part.oemReferences.map((ref) => <div key={ref.id} className="bg-gray-50 p-3 rounded"><p className="font-mono text-sm font-semibold text-gray-900">{ref.referenceNumber}</p><p className="text-xs text-gray-600 mt-1">{CATALOG_MANUFACTURERS.find((m) => m.id === ref.manufacturerId)?.name || ref.manufacturerId}</p><p className="text-xs text-gray-500 mt-1">{ref.verificationStatus === 'verified' ? '✓ Verified OEM' : ref.verificationStatus === 'source-listed' ? '◉ Source listed — exact fitment not verified' : '⚠ Unverified'}</p>{ref.source && <a href={ref.source} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Source</a>}</div>)}</div></div>}{part.sources?.length > 0 && <div className="border-t pt-6"><h3 className="font-semibold text-gray-900 mb-3">Authoritative source</h3>{part.sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer" className="block rounded-lg bg-blue-50 border border-blue-100 p-3 text-sm text-blue-800 hover:bg-blue-100">{source.name} · Open official source ↗</a>)}<p className="text-xs text-gray-500 mt-2">The source establishes the manufacturer/catalogue context. It does not by itself prove exact vehicle fitment for this reference.</p></div>}<div className="mt-6"><AdSlot placement="part-detail" /></div></div></div></div>;
}
