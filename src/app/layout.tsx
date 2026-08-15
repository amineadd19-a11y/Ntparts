import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NTParts — Truck Parts & OEM References',
  description: 'Find truck parts, OEM references and compatibility information across major truck manufacturers.',
  keywords: ['truck parts', 'OEM references', 'truck spare parts', 'Volvo', 'DAF', 'Scania', 'MAN', 'Mercedes-Benz', 'Renault Trucks', 'Iveco'],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en" dir="ltr"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="theme-color" content="#1e40af" /><meta name="description" content="NTParts - Find the right truck part" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /></head><body className="bg-gray-50 text-gray-900 antialiased"><Header /><main className="min-h-screen">{children}</main><Footer /></body></html>;
}
