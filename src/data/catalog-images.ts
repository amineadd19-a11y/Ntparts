/**
 * REAL product photos only.
 *
 * Policy:
 * - Only official manufacturer catalogue assets with attributable CDN URLs.
 * - No Unsplash, Pexels, stock, or decorative placeholders.
 * - If no real photo exists for a part, return an empty array (UI shows "No product photo").
 *
 * Current sources:
 * - MANN-FILTER Adobe Scene7 catalogue CDN (mann-filter.com)
 */

const MANN = (asset: string) =>
  `https://s7g10.scene7.com/is/image/mannhummel/${asset}?qlt=85&wid=900&dpr=off&fmt=png-alpha`;

export type ProductImage = {
  id: string;
  partId: string;
  url: string;
  title: string;
  alt: string;
  isPrimary: boolean;
  source: string;
};

/** Official MANN-FILTER product photos keyed by part template slug or reference. */
export const MANN_FILTER_IMAGES: Record<
  string,
  { primary: string; secondary?: string; label: string; catalogUrl: string }
> = {
  // By template slug
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
    primary: MANN('WDK_11_102_1'),
    secondary: MANN('HU_12_140_x'),
    label: 'MANN-FILTER WDK / filtration range',
    catalogUrl: 'https://www.mann-filter.com/',
  },
  'cabin-filter': {
    primary: MANN('CU_2785'),
    secondary: MANN('CU_2785-dim-1'),
    label: 'MANN-FILTER CU 2785',
    catalogUrl:
      'https://www.mann-filter.com/en/catalog/search-results/product.html/cu2785_mann-filter.html',
  },

  // By concrete reference (normalized keys)
  w11025: {
    primary: MANN('W_11_025-1'),
    secondary: MANN('W_11_025-dim'),
    label: 'MANN-FILTER W 11 025',
    catalogUrl:
      'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html',
  },
  'w 11 025': {
    primary: MANN('W_11_025-1'),
    secondary: MANN('W_11_025-dim'),
    label: 'MANN-FILTER W 11 025',
    catalogUrl:
      'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html',
  },
  cu2785: {
    primary: MANN('CU_2785'),
    secondary: MANN('CU_2785-dim-1'),
    label: 'MANN-FILTER CU 2785',
    catalogUrl:
      'https://www.mann-filter.com/en/catalog/search-results/product.html/cu2785_mann-filter.html',
  },
  'cu 2785': {
    primary: MANN('CU_2785'),
    secondary: MANN('CU_2785-dim-1'),
    label: 'MANN-FILTER CU 2785',
    catalogUrl:
      'https://www.mann-filter.com/en/catalog/search-results/product.html/cu2785_mann-filter.html',
  },
  cu2184: {
    primary: MANN('CU_2184'),
    label: 'MANN-FILTER CU 2184',
    catalogUrl: 'https://www.mann-filter.com/',
  },
  'cu 2184': {
    primary: MANN('CU_2184'),
    label: 'MANN-FILTER CU 2184',
    catalogUrl: 'https://www.mann-filter.com/',
  },
  tb1394: {
    primary: MANN('TB_1394_1_x'),
    label: 'MANN-FILTER TB 1394/1 x',
    catalogUrl: 'https://www.mann-filter.com/',
  },
  'tb 1394': {
    primary: MANN('TB_1394_1_x'),
    label: 'MANN-FILTER TB 1394/1 x',
    catalogUrl: 'https://www.mann-filter.com/',
  },
};

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function lookupMann(
  candidates: string[],
): { primary: string; secondary?: string; label: string; catalogUrl: string } | null {
  for (const raw of candidates) {
    if (!raw) continue;
    const direct = MANN_FILTER_IMAGES[raw.toLowerCase().trim()];
    if (direct) return direct;
    const compact = normalizeKey(raw);
    for (const [key, value] of Object.entries(MANN_FILTER_IMAGES)) {
      if (normalizeKey(key) === compact) return value;
      if (normalizeKey(value.label).includes(compact) && compact.length >= 5) return value;
    }
  }
  return null;
}

function toImages(
  mann: { primary: string; secondary?: string; label: string; catalogUrl: string },
  partId: string,
  partName: string,
): ProductImage[] {
  const images: ProductImage[] = [
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
      title: `${mann.label} technical view`,
      alt: `${partName} — ${mann.label} technical view`,
      isPrimary: false,
      source: 'MANN-FILTER / mann-filter.com',
    });
  }
  return images;
}

/**
 * Resolve real product photos for a part.
 * Returns [] when no attributable manufacturer photo is available.
 */
export function resolveProductImages(
  slug: string,
  partId: string,
  partName: string,
  extraRefs: string[] = [],
): ProductImage[] {
  const mann = lookupMann([slug, partName, ...extraRefs]);
  if (mann) return toImages(mann, partId, partName);
  return [];
}

/** Attach real photos to a part from its OEM / aftermarket references when possible. */
export function imagesForPartRefs(
  partId: string,
  partName: string,
  references: string[],
  categoryHint?: string,
): ProductImage[] {
  const mann = lookupMann([...references, categoryHint || '', partName]);
  if (mann) return toImages(mann, partId, partName);
  return [];
}
