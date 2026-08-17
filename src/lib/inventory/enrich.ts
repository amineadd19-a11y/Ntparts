/**
 * Inventory enrichment for Stock disponible.
 * Stock and purchase cost come from Inventaire.pdf only for this stock view.
 * Never invents prices, OEM numbers, or quantities.
 */
import { CATALOG_PARTS } from '@/data/catalog';
import { INVENTORY_CMUP } from '@/data/inventory-cmup';
import { normalizeReference } from '@/lib/catalog/normalize';

export type PurchasePriceInfo = {
  purchasePrice: number;
  currency: 'MAD';
  priceSource: 'Inventaire.pdf';
  priceSnapshot: '2026-08-17';
};

export type CatalogMatchInfo = {
  partId: string;
  name: string;
  category: string;
  description?: string;
  manufacturer?: string;
  verificationStatus?: string;
  oemReferences?: string[];
  aftermarketReference?: string;
  sourcePrice?: string;
  sourceDocument?: string;
};

export type EnrichedStockRecord = {
  reference: string;
  normalizedReference: string;
  quantity: number;
  stock: number;
  gamme: string | null;
  description: string | null;
  manufacturer: string | null;
  purchasePrice: number | null;
  currency: string | null;
  priceSource: string | null;
  pricePage: number | null;
  stockSource: string;
  stockSnapshot: string;
  catalogMatch: CatalogMatchInfo | null;
  searchRefs: string[];
};

let _catalogIndex: Map<string, CatalogMatchInfo> | null = null;
let _catalogSearchRefs: Map<string, string[]> | null = null;

export function getPriceIndex(): Map<string, PurchasePriceInfo> {
  return new Map(
    Object.entries(INVENTORY_CMUP).map(([reference, purchasePrice]) => [reference, {
      purchasePrice,
      currency: 'MAD',
      priceSource: 'Inventaire.pdf',
      priceSnapshot: '2026-08-17',
    }])
  );
}

export function getCatalogIndex(): Map<string, CatalogMatchInfo> {
  if (_catalogIndex) return _catalogIndex;
  const map = new Map<string, CatalogMatchInfo>();
  const searchMap = new Map<string, string[]>();

  for (const part of CATALOG_PARTS) {
    const oemRefs = part.oemReferences.flatMap((item) => [
      item.referenceNumber,
      ...(item.alternateNumbers ?? []),
    ]);
    const aftermarket = part.specifications?.aftermarketReference;
    const allRefs = [...oemRefs, ...(aftermarket ? [aftermarket] : [])]
      .map((r) => String(r).trim())
      .filter(Boolean);
    const uniqueRefs = Array.from(new Set(allRefs));

    const info: CatalogMatchInfo = {
      partId: part.id,
      name: part.name,
      category: part.category,
      description: part.description,
      manufacturer: part.specifications?.manufacturer ?? part.specifications?.manufacturerId,
      verificationStatus: part.verificationStatus,
      oemReferences: uniqueRefs.slice(0, 24),
      aftermarketReference: aftermarket,
      sourcePrice: part.specifications?.sourcePrice,
      sourceDocument: part.specifications?.sourceDocument,
    };

    for (const ref of uniqueRefs) {
      const key = normalizeReference(ref);
      if (!key) continue;
      if (!map.has(key)) map.set(key, info);
      const existing = searchMap.get(key) ?? [];
      for (const r of uniqueRefs) if (!existing.includes(r)) existing.push(r);
      searchMap.set(key, existing);
    }
  }

  _catalogIndex = map;
  _catalogSearchRefs = searchMap;
  return map;
}

export function getCatalogSearchRefs(): Map<string, string[]> {
  getCatalogIndex();
  return _catalogSearchRefs ?? new Map();
}

export function enrichInventoryRecord(
  reference: string,
  quantity: number,
  stockSource: string,
  stockSnapshot: string
): EnrichedStockRecord {
  const normalizedReference = normalizeReference(reference);
  const catalog = getCatalogIndex().get(normalizedReference) ?? null;
  const price = INVENTORY_CMUP[normalizedReference];
  const purchasePrice = Number.isFinite(price) ? price : null;

  const gamme = catalog?.aftermarketReference ?? null;
  const description = catalog?.name ?? null;
  const manufacturer = catalog?.manufacturer ?? null;

  const searchRefs: string[] = [];
  const push = (v: string | null | undefined) => {
    if (!v) return;
    const s = String(v).trim();
    if (s && !searchRefs.includes(s)) searchRefs.push(s);
  };
  push(reference);
  for (const r of getCatalogSearchRefs().get(normalizedReference) ?? []) push(r);

  return {
    reference,
    normalizedReference,
    quantity,
    stock: quantity,
    gamme,
    description,
    manufacturer,
    purchasePrice,
    currency: purchasePrice === null ? null : 'MAD',
    priceSource: purchasePrice === null ? null : 'Inventaire.pdf',
    pricePage: null,
    stockSource,
    stockSnapshot,
    catalogMatch: catalog,
    searchRefs,
  };
}

export function recordMatchesQuery(record: EnrichedStockRecord, query: string): boolean {
  const qRaw = query.trim();
  if (!qRaw) return true;
  const q = qRaw.toLowerCase();
  const qNorm = normalizeReference(qRaw);
  const candidates = [
    record.reference,
    record.normalizedReference,
    ...(record.searchRefs ?? []),
    record.gamme ?? '',
    record.description ?? '',
    record.manufacturer ?? '',
    record.catalogMatch?.name ?? '',
    record.catalogMatch?.category ?? '',
    ...(record.catalogMatch?.oemReferences ?? []),
  ];
  for (const c of candidates) {
    if (!c) continue;
    const lower = c.toLowerCase();
    const n = normalizeReference(c);
    if (lower === q || n === qNorm) return true;
    if (lower.includes(q)) return true;
    if (qNorm.length >= 2 && n.includes(qNorm)) return true;
  }
  return false;
}
