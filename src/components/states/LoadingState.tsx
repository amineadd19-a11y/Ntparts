'use client';

import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return <div className="flex flex-col items-center justify-center py-12"><Loader2 className="animate-spin text-blue-600 mb-4" size={32} /><p className="text-gray-600">{message}</p></div>;
}
