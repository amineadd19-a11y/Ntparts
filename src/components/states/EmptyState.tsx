'use client';

import { PackageX } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps { title?: string; message?: string; actionLabel?: string; actionHref?: string; }

export default function EmptyState({ title = 'No Results Found', message = 'Try adjusting your search or browse our catalogue.', actionLabel = 'Back to Home', actionHref = '/' }: EmptyStateProps) {
  return <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border border-gray-200 p-6"><PackageX className="text-gray-400 mb-4" size={48} /><h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3><p className="text-gray-600 mb-6">{message}</p><Link href={actionHref} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">{actionLabel}</Link></div>;
}
