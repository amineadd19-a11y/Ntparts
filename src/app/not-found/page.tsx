'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return <div className="min-h-screen flex items-center justify-center px-4"><div className="text-center max-w-md"><AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1><p className="text-gray-600 mb-6">Page not found. The part or resource you&apos;re looking for doesn&apos;t exist.</p><Link href="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Return to Home</Link></div></div>;
}
