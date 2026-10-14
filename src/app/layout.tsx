import type { Metadata, Viewport } from 'next';
import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ntparts-six.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NTParts — Truck parts catalogue and OEM reference research',
    template: '%s | NTParts',
  },
  description:
    'Research source-backed truck and bus parts references, OEM numbers and catalogue records. Public stock availability is currently disabled; verify fitment and stock with NTParts before ordering.',
  keywords: [
    'truck parts catalogue',
    'bus parts catalogue',
    'OEM references',
    'pièces camion',
    'poids lourds',
    'Volvo',
    'DAF',
    'Scania',
    'MAN',
    'Mercedes-Benz',
    'Renault Trucks',
    'Iveco',
    'Freightliner',
    'Kenworth',
    'cross reference',
    'parts reference research',
  ],
  authors: [{ name: 'NTParts' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'NTParts',
    title: 'NTParts — Truck parts catalogue and OEM reference research',
    description:
      'Research source-backed OEM and aftermarket catalogue references. Public stock availability and vehicle fitment are not currently confirmed by this catalogue.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NTParts — Truck parts catalogue',
    description:
      'Research OEM and aftermarket catalogue references. Confirm current stock and vehicle fitment before ordering.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b1220',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} bg-slate-100 text-navy-900 antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
