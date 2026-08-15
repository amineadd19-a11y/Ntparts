/**
 * Product images
 * Filter images: official MANN-FILTER catalogue assets (Adobe Scene7 CDN used by mann-filter.com).
 * Other parts: industrial reference photos.
 */

const MANN = (asset: string) =>
  `https://s7g10.scene7.com/is/image/mannhummel/${asset}?qlt=85&wid=900&dpr=off&fmt=png-alpha`;

/** Official MANN-FILTER product photos from https://www.mann-filter.com catalogue */
export const MANN_FILTER_IMAGES: Record<
  string,
  { primary: string; secondary?: string; label: string; catalogUrl: string }
> = {
  'oil-filter': {
    primary: MANN('W_11_025-1'),
    secondary: MANN('W_11_025-dim'),
    label: 'MANN-FILTER W 11 025',
    catalogUrl:
      'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html',
  },
  'air-filter': {
    primary: MANN('C_25_990'),
    secondary: MANN('C_50_005'),
    label: 'MANN-FILTER C 25 990 / C 50 005',
    catalogUrl: 'https://www.mann-filter.com/',
  },
  'fuel-filter': {
    // Truck fuel / oil spin-on family visual from official catalogue
    primary: MANN('W_11_025-1'),
    secondary: MANN('HU_12_140_x'),
    label: 'MANN-FILTER filtration range',
    catalogUrl: 'https://www.mann-filter.com/',
  },
  'cabin-filter': {
    primary: MANN('CU_2785'),
    secondary: MANN('CU_2785-dim-1'),
    label: 'MANN-FILTER CU 2785',
    catalogUrl:
      'https://www.mann-filter.com/en/catalog/search-results/product.html/cu2785_mann-filter.html',
  },
};

const UNSplash: Record<string, string> = {
  'brake-disc':
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80&auto=format&fit=crop',
  'brake-pad':
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80&auto=format&fit=crop',
  'brake-caliper':
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=80&auto=format&fit=crop',
  'brake-chamber':
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80&auto=format&fit=crop',
  'brake-valve':
    'https://images.unsplash.com/photo-1487754180451-c456f541f709?w=900&q=80&auto=format&fit=crop',
  'air-dryer':
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80&auto=format&fit=crop',
  'water-pump':
    'https://images.unsplash.com/photo-1487754180451-c456f541f709?w=900&q=80&auto=format&fit=crop',
  thermostat:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80&auto=format&fit=crop',
  radiator:
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80&auto=format&fit=crop',
  'clutch-kit':
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=80&auto=format&fit=crop',
  'shock-absorber':
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80&auto=format&fit=crop',
  'air-spring':
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80&auto=format&fit=crop',
  'starter-motor':
    'https://images.unsplash.com/photo-1487754180451-c456f541f709?w=900&q=80&auto=format&fit=crop',
  alternator:
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=900&q=80&auto=format&fit=crop',
  turbocharger:
    'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80&auto=format&fit=crop',
  injector:
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=80&auto=format&fit=crop',
  'drive-belt':
    'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80&auto=format&fit=crop',
  mirror:
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80&auto=format&fit=crop',
};

export function resolveProductImages(
  slug: string,
  partId: string,
  partName: string
): Array<{
  id: string;
  partId: string;
  url: string;
  title: string;
  alt: string;
  isPrimary: boolean;
  source: string;
}> {
  const mann = MANN_FILTER_IMAGES[slug];
  if (mann) {
    const images = [
      {
        id: `${partId}-img-1`,
        partId,
        url: mann.primary,
        title: mann.label,
        alt: `${partName} — ${mann.label}`,
        isPrimary: true,
        source: 'MANN-FILTER / mann-filter.com',
      },
    ];
    if (mann.secondary) {
      images.push({
        id: `${partId}-img-2`,
        partId,
        url: mann.secondary,
        title: `${mann.label} dimensions`,
        alt: `${partName} — ${mann.label} technical view`,
        isPrimary: false,
        source: 'MANN-FILTER / mann-filter.com',
      });
    }
    return images;
  }

  const url = UNSplash[slug] || UNSplash['brake-disc'];
  return [
    {
      id: `${partId}-img-1`,
      partId,
      url,
      title: partName,
      alt: partName,
      isPrimary: true,
      source: 'reference',
    },
  ];
}
