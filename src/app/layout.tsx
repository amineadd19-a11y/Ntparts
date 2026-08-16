import type { Metadata, Viewport } from 'next';
import React, { ReactNode } from 'react';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ntparts.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NTParts — Professional truck parts catalogue & OEM intelligence',
    template: '%s | NTParts',
  },
  description:
    'Search OEM references, part numbers and compatibility for major truck manufacturers. Industrial catalogue built for workshops and parts specialists.',
  keywords: [
    'truck parts',
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
  ],
  authors: [{ name: 'NTParts' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'NTParts',
    title: 'NTParts — Professional truck parts catalogue',
    description:
      'Find the right part. OEM references, cross-references and fitment data for European and North American trucks.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NTParts — Truck parts catalogue',
    description: 'OEM and aftermarket truck parts intelligence.',
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
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
