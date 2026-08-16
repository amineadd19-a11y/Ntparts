import type { Part } from '@/types';
import * as CORE from '@/data/catalog-core';
import { CATALOG_EXPANSION } from '@/data/catalog-expansion';
import { RENPAR_CATALOG_PARTS } from '@/data/catalog-renpar';
import { SOURCE_BACKED_PARTS } from '@/data/catalog-source-backed';
import { deduplicateAndMerge } from '@/lib/catalog/pipeline';
import { normalizeReference } from '@/lib/catalog/normalize';

/** Source-backed OEM registry used by the catalog validation gate. Empty modelIds means exact fitment is not proven. */
const OEM_REFERENCE_REGISTRY = [
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '21707134', modelIds: [], sourceUrl: 'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html', evidence: 'parts-catalog' },
  { manufacturerId: 'renault-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '5001846641', modelIds: [], sourceUrl: 'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html', evidence: 'parts-catalog' },
  { manufacturerId: 'mack', partTemplateSlug: 'oil-filter', referenceNumber: '21707136', modelIds: [], sourceUrl: 'https://www.mann-filter.com/en/catalog/search-results/product.html/w11025_mann-filter.html', evidence: 'parts-catalog' },
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'air-filter', referenceNumber: '21377915', modelIds: [], sourceUrl: 'https://www.mann-filter.com/', evidence: 'parts-catalog' },
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '22480372', modelIds: [], sourceUrl: 'https://www.sampa.com/en/productdetail?code=033.141', evidence: 'official' },
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'cabin-filter', referenceNumber: '11007388', modelIds: [], sourceUrl: 'https://www.mann-filter.com/en/catalog/search-results/product.html/cu2785_mann-filter.html', evidence: 'parts-catalog' },
  { manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'air-filter', referenceNumber: 'A0040949104', modelIds: [], sourceUrl: 'https://www.mann-filter.com/', evidence: 'parts-catalog' },
  { manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'oil-filter', referenceNumber: 'A5411800009', modelIds: [], sourceUrl: 'https://www.mann-filter.com/', evidence: 'parts-catalog' },
  { manufacturerId: 'daf-trucks', partTemplateSlug: 'fuel-filter', referenceNumber: '1699168', modelIds: [], sourceUrl: 'https://www.mann-filter.com/', evidence: 'parts-catalog' },
  { manufacturerId: 'daf-trucks', partTemplateSlug: 'oil-filter', referenceNumber: '2142288', modelIds: [], sourceUrl: 'https://www.mann-filter.com/', evidence: 'parts-catalog' },
  { manufacturerId: 'scania', partTemplateSlug: 'air-dryer', referenceNumber: '1774598', modelIds: [], sourceUrl: 'https://plenty.parts/parts/cojali/all/6002007', evidence: 'secondary' },
  { manufacturerId: 'scania', partTemplateSlug: 'brake-valve', referenceNumber: '571190', modelIds: [], sourceUrl: 'https://plenty.parts/', evidence: 'secondary' },
  { manufacturerId: 'scania', partTemplateSlug: 'air-spring', referenceNumber: '1738475', modelIds: [], sourceUrl: 'https://plenty.parts/parts/cojali/all/2214400', evidence: 'secondary' },
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'air-spring', referenceNumber: '1607728', modelIds: [], sourceUrl: 'https://plenty.parts/parts/cojali/all/2214400', evidence: 'secondary' },
  { manufacturerId: 'daf-trucks', partTemplateSlug: 'brake-valve', referenceNumber: '1677510', modelIds: [], sourceUrl: 'https://www.ic24.uk/', evidence: 'secondary' },
  { manufacturerId: 'renault-trucks', partTemplateSlug: 'air-dryer', referenceNumber: '5001874313', modelIds: [], sourceUrl: 'https://www.recambioscamion.com/', evidence: 'secondary' },
  { manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'brake-valve', referenceNumber: 'A0014300460', modelIds: [], sourceUrl: 'https://www.intercars24.ee/', evidence: 'secondary' },
  { manufacturerId: 'scania', partTemplateSlug: 'brake-pad', referenceNumber: '2325212', modelIds: [], sourceUrl: 'https://truckstopgroup.co.uk/', evidence: 'secondary' },
  { manufacturerId: 'scania', partTemplateSlug: 'brake-disc', referenceNumber: '1852817', modelIds: [], sourceUrl: 'https://www.scania.com/', evidence: 'official' },
  { manufacturerId: 'man-truck-bus', partTemplateSlug: 'brake-pad', referenceNumber: 'K059965K50', modelIds: [], sourceUrl: 'https://www.knorr-bremse.com/', evidence: 'official' },
  { manufacturerId: 'daf-trucks', partTemplateSlug: 'brake-chamber', referenceNumber: '1387439', modelIds: [], sourceUrl: 'https://www.ebs.co.uk/', evidence: 'secondary' },
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'gasket-set', referenceNumber: '21539731', modelIds: [], sourceUrl: 'https://www.elring.com/', evidence: 'official' },
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'gasket-set', referenceNumber: '477785', modelIds: [], sourceUrl: 'https://www.elring.com/', evidence: 'official' },
  { manufacturerId: 'scania', partTemplateSlug: 'gasket-set', referenceNumber: '1112908', modelIds: [], sourceUrl: 'https://www.elring.com/', evidence: 'official' },
  { manufacturerId: 'mercedes-benz-trucks', partTemplateSlug: 'gasket-set', referenceNumber: 'A0010742280', modelIds: [], sourceUrl: 'https://www.elring.com/', evidence: 'official' },
  { manufacturerId: 'daf-trucks', partTemplateSlug: 'silentblock', referenceNumber: '1291233', modelIds: [], sourceUrl: 'https://www.lema-parts.it/', evidence: 'official' },
  { manufacturerId: 'daf-trucks', partTemplateSlug: 'silentblock', referenceNumber: '0366351', modelIds: [], sourceUrl: 'https://www.lema-parts.it/', evidence: 'official' },
  { manufacturerId: 'renault-trucks', partTemplateSlug: 'silentblock', referenceNumber: '5000815738', modelIds: [], sourceUrl: 'https://www.lema-parts.it/', evidence: 'official' },
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'silentblock', referenceNumber: '20532891', modelIds: [], sourceUrl: 'https://www.elring.com/', evidence: 'official' },
  { manufacturerId: 'volvo-trucks', partTemplateSlug: 'mirror', referenceNumber: '21360516', modelIds: [], sourceUrl: 'https://www.sampa.com/', evidence: 'official' },
];

const coreParts: Part[] = CORE.CATALOG_PARTS.map((part) => ({
  ...part,
  images: (part.images ?? []).filter((image) => image.source?.includes('MANN-FILTER')),
}));

/** Merge all catalogue sources through the shared dedup/merge pipeline. */
const merged = deduplicateAndMerge([
  ...coreParts,
  ...CATALOG_EXPANSION,
  ...RENPAR_CATALOG_PARTS,
  ...SOURCE_BACKED_PARTS,
]);

export const CATALOG_PARTS: Part[] = merged.parts;
export const CATALOG_MERGE_STATS = merged.stats;

export const CATALOG_MANUFACTURERS: typeof CORE.CATALOG_MANUFACTURERS = CORE.CATALOG_MANUFACTURERS;
export const CATALOG_MODELS: typeof CORE.CATALOG_MODELS = CORE.CATALOG_MODELS;
export const CATALOG_CATEGORIES: string[] = Array.from(new Set(CATALOG_PARTS.map((part) => part.category)));
export const CATALOG_SYSTEMS: string[] = Array.from(new Set(CATALOG_PARTS.map((part) => part.systemId)));
export const CATALOG_AFTERMARKET_BRANDS: string[] = Array.from(
  new Set(
    CATALOG_PARTS.flatMap((part) =>
      (part.specifications?.aftermarketBrands ?? '')
        .split(',')
        .map((brand) => brand.trim())
        .filter(Boolean),
    ),
  ),
).sort();

export const CATALOG_STATS = {
  manufacturers: CATALOG_MANUFACTURERS.length,
  models: CATALOG_MODELS.length,
  partTemplates:
    CORE.CATALOG_STATS.partTemplates +
    CATALOG_EXPANSION.length / Math.max(CATALOG_MODELS.length, 1),
  parts: CATALOG_PARTS.length,
  categories: CATALOG_CATEGORIES.length,
  systems: CATALOG_SYSTEMS.length,
  aftermarketBrands: CATALOG_AFTERMARKET_BRANDS.length,
  verifiedOEMReferences: CATALOG_PARTS.reduce(
    (count, part) =>
      count + part.oemReferences.filter((ref) => ref.verificationStatus === 'verified').length,
    0,
  ),
  sourceBackedRecords: SOURCE_BACKED_PARTS.length,
  mergeInput: CATALOG_MERGE_STATS.input,
  mergeOutput: CATALOG_MERGE_STATS.output,
  mergeCollapsed: CATALOG_MERGE_STATS.merged,
};

const list = (value?: string): string[] =>
  value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];

export function searchCatalog(query: string): Part[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATALOG_PARTS;
  const compact = normalizeReference(query);

  return CATALOG_PARTS.filter((part) => {
    const refs = part.oemReferences.flatMap((oem) => [
      oem.referenceNumber,
      ...(oem.alternateNumbers ?? []),
    ]);
    if (refs.some((ref) => ref.toLowerCase().includes(q) || normalizeReference(ref).includes(compact)))
      return true;

    return [
      part.id,
      part.name,
      part.category,
      part.description ?? '',
      part.specifications?.manufacturer ?? '',
      part.specifications?.model ?? '',
      part.specifications?.crossReferences ?? '',
      part.specifications?.aftermarketReference ?? '',
      ...list(part.specifications?.tags),
      ...list(part.specifications?.aftermarketBrands),
    ]
      .join(' ')
      .toLowerCase()
      .includes(q);
  });
}

export function getPartsByManufacturer(id: string): Part[] {
  const normalized = id.trim().toLowerCase();
  return CATALOG_PARTS.filter(
    (part) => part.specifications?.manufacturerId?.toLowerCase() === normalized,
  );
}

export function getPartsByModel(id: string, model: string): Part[] {
  const manufacturer = id.trim().toLowerCase();
  const modelName = model.trim().toLowerCase();
  return CATALOG_PARTS.filter(
    (part) =>
      part.specifications?.manufacturerId?.toLowerCase() === manufacturer &&
      part.specifications?.model?.toLowerCase() === modelName,
  );
}

export function getPartsByCategory(category: string): Part[] {
  const normalized = category.trim().toLowerCase();
  return CATALOG_PARTS.filter((part) => part.category.toLowerCase() === normalized);
}

export function getPartsBySystem(systemId: string): Part[] {
  return CATALOG_PARTS.filter((part) => part.systemId === systemId);
}

export function getPartsByAftermarketBrand(brand: string): Part[] {
  const normalized = brand.trim().toLowerCase();
  return CATALOG_PARTS.filter((part) =>
    list(part.specifications?.aftermarketBrands).some((item) => item.toLowerCase() === normalized),
  );
}

export function getPartsByTag(tag: string): Part[] {
  const normalized = tag.trim().toLowerCase();
  return CATALOG_PARTS.filter((part) =>
    list(part.specifications?.tags).some((item) => item.toLowerCase() === normalized),
  );
}

export function getPartsByOEM(referenceNumber: string): Part[] {
  const normalized = referenceNumber.trim().toLowerCase();
  const compact = normalizeReference(referenceNumber);
  return CATALOG_PARTS.filter((part) =>
    part.oemReferences.some((oem) =>
      [oem.referenceNumber, ...(oem.alternateNumbers ?? [])].some(
        (reference) =>
          reference.toLowerCase() === normalized ||
          normalizeReference(reference) === compact ||
          normalizeReference(reference).includes(compact),
      ),
    ),
  );
}

export function getPartById(id: string): Part | undefined {
  return CATALOG_PARTS.find((part) => part.id === id);
}

export function getVerifiedOEMParts(): Part[] {
  return CATALOG_PARTS.filter((part) =>
    part.oemReferences.some((reference) => reference.verificationStatus === 'verified'),
  );
}

export { CATALOG_EXPANSION, RENPAR_CATALOG_PARTS, SOURCE_BACKED_PARTS, OEM_REFERENCE_REGISTRY };
