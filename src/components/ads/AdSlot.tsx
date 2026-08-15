'use client';

export default function AdSlot({ placement }: { placement: string }) {
  return <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center" role="region" aria-label={`Advertisement slot: ${placement}`}><p className="text-gray-500 text-sm mb-2">Advertisement</p><p className="text-gray-600 text-sm">Advertising space • Ready for Google AdSense or similar service</p><div className="mt-4 bg-gray-200 rounded h-32 flex items-center justify-center text-gray-400 text-xs">Ad space [{placement}]</div></div>;
}
