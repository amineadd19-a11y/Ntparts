import type { MetadataRoute } from 'next';
import { CATALOG_MANUFACTURERS, CATALOG_PARTS } from '@/data/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://ntparts.vercel.app';
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/parts`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/trucks`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/search`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.5 },
    ...CATALOG_MANUFACTURERS.map((m) => ({ url: `${base}/trucks/${m.id}`, changeFrequency: 'weekly' as const, priority: 0.7 })),
    ...CATALOG_PARTS.slice(0, 5000).map((p) => ({ url: `${base}/parts/${encodeURIComponent(p.id)}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
