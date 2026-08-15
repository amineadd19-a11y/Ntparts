'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorStateProps { message?: string; retry?: () => void; }

export default function ErrorState({ message = 'An error occurred. Please try again.', retry }: ErrorStateProps) {
  return <div className="flex flex-col items-center justify-center py-12 bg-red-50 rounded-lg border border-red-200 p-6"><AlertCircle className="text-red-600 mb-4" size={32} /><p className="text-red-800 font-medium mb-4">{message}</p>{retry && <button onClick={retry} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Try Again</button>}</div>;
}
