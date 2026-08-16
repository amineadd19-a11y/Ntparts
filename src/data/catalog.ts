import type { Part } from '@/types';
import * as CORE from '@/data/catalog-core';
import { CATALOG_EXPANSION } from '@/data/catalog-expansion';
import { RENPAR_CATALOG_PARTS } from '@/data/catalog-renpar';

const coreParts: Part[] = CORE.CATALOG_PARTS.map((part) => ({
  ...part,
  images: (part.images ?? []).filter((image) => image.source?.includes('MANN-FILTER')),
}));

const normalizeRef = (value: string): string => value.toLowerCase().replace(/[\s\-\/.]/g, '');

/**
 * Merge catalog sources while removing exact ID/reference collisions.
 * Source-listed references remain source-listed; they are never upgraded to verified
 * merely because they exist in the merged catalog.
 */
const mergeUniqueParts = (parts: Part[]): Part[] => {
  const seen = new Set<string>();
  const result: Part[] = [];

  for (const part of parts) {
    const keys = [
      part.id,
      part.specifications?.aftermarketReference ?? '',
      ...part.oemReferences.flatMap((oem) => [oem.referenceNumber, ...(oem.alternateNumbers ?? [])]),
    ]
      .filter(Boolean)
      .map(normalizeRef);

    if (keys.some((key) => seen.has(key))) continue;
    keys.forEach((key) => seen.add(key));
    result.push(part);
  }

  return result;
};

export const CATALOG_PARTS: Part[] = mergeUniqueParts([
  ...coreParts,
  ...CATALOG_EXPANSION,
  ...RENPAR_CATALOG_PARTS,
]);

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
        .filter(Boolean)
    )
  )
).sort();

export const CATALOG_STATS = {
  manufacturers: CATALOG_MANUFACTURERS.length,
  models: CATALOG_MODELS.length,
  partTemplates: CORE.CATALOG_STATS.partTemplates + CATALOG_EXPANSION.length / Math.max(CATALOG_MODELS.length, 1),
  parts: CATALOG_PARTS.length,
  categories: CATALOG_CATEGORIES.length,
  systems: CATALOG_SYSTEMS.length,
  aftermarketBrands: CATALOG_AFTERMARKET_BRANDS.length,
  verifiedOEMReferences: CATALOG_PARTS.reduce(
    (count, part) => count + part.oemReferences.filter((ref) => ref.verificationStatus === 'verified').length,
    0
  ),
};

const list = (value?: string): string[] =>
  value ? value.split(',').map((item) => item.trim()).filter(Boolean) : [];

export function searchCatalog(query: string): Part[] {
  const q = query.trim().toLowerCase();
  if (!q) return CATALOG_PARTS;
  const compact = normalizeRef(query);

  return CATALOG_PARTS.filter((part) => {
    const refs = part.oemReferences.flatMap((oem) => [oem.referenceNumber, ...(oem.alternateNumbers ?? [])]);
    if (refs.some((ref) => ref.toLowerCase().includes(q) || normalizeRef(ref).includes(compact))) return true;

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
  return CATALOG_PARTS.filter((part) => part.specifications?.manufacturerId?.toLowerCase() === normalized);
}

export function getPartsByModel(id: string, model: string): Part[] {
  const manufacturer = id.trim().toLowerCase();
  const modelName = model.trim().toLowerCase();
  return CATALOG_PARTS.filter(
    (part) =>
      part.specifications?.manufacturerId?.toLowerCase() === manufacturer &&
      part.specifications?.model?.toLowerCase() === modelName
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
    list(part.specifications?.aftermarketBrands).some((item) => item.toLowerCase() === normalized)
  );
}

export function getPartsByTag(tag: string): Part[] {
  const normalized = tag.trim().toLowerCase();
  return CATALOG_PARTS.filter((part) => list(part.specifications?.tags).some((item) => item.toLowerCase() === normalized));
}

export function getPartsByOEM(referenceNumber: string): Part[] {
  const normalized = referenceNumber.trim().toLowerCase();
  const compact = normalizeRef(referenceNumber);
  return CATALOG_PARTS.filter((part) =>
    part.oemReferences.some((oem) =>
      [oem.referenceNumber, ...(oem.alternateNumbers ?? [])].some(
        (reference) =>
          reference.toLowerCase() === normalized ||
          normalizeRef(reference) === compact ||
          normalizeRef(reference).includes(compact)
      )
    )
  );
}

export function getPartById(id: string): Part | undefined {
  return CATALOG_PARTS.find((part) => part.id === id);
}

export function getVerifiedOEMParts(): Part[] {
  return CATALOG_PARTS.filter((part) =>
    part.oemReferences.some((reference) => reference.verificationStatus === 'verified')
  );
}

export { CATALOG_EXPANSION, RENPAR_CATALOG_PARTS };
