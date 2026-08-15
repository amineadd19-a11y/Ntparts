import type { Metadata } from 'next';
import React, { ReactNode } from 'react';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'NTParts — Professional Truck Parts Catalogue & OEM Reference',
  description:
    'Search OEM references, part numbers and compatibility across major truck manufacturers. A professional industrial catalogue for technicians and parts specialists.',
  keywords: [
    'truck parts',
    'OEM references',
    'truck spare parts',
    'Volvo',
    'DAF',
    'Scania',
    'MAN',
    'Mercedes-Benz',
    'Renault Trucks',
    'Iveco',
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0f172a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-100 text-slate-900 antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
