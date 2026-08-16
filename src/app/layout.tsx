import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NTParts — Professional truck parts catalogue & OEM intelligence',
  description: 'Search OEM references, part numbers and compatibility for major truck manufacturers. Industrial catalogue built for workshops and parts specialists.',
  authors: [{ name: 'NTParts' }],
  keywords: ['truck parts', 'OEM references', 'pièces camion', 'poids lourds', 'Volvo', 'DAF', 'Scania', 'MAN', 'Mercedes-Benz', 'Renault Trucks', 'Iveco', 'Freightliner', 'Kenworth', 'cross reference'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://ntparts.vercel.app' },
  openGraph: {
    title: 'NTParts — Professional truck parts catalogue',
    description: 'Find the right part. OEM references, cross-references and fitment data for European and North American trucks.',
    url: 'https://ntparts.vercel.app',
    siteName: 'NTParts',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NTParts — Truck parts catalogue',
    description: 'OEM and aftermarket truck parts intelligence.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="bg-slate-100 text-slate-900 antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
