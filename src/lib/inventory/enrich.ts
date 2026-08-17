/**
 * Inventory enrichment: join stock lines with catalogue + verified RENPAR purchase prices.
 * Never invents prices, OEM numbers, or quantities.
 */
import { CATALOG_PARTS } from '@/data/catalog';
import { RENPAR_ROWS_1 } from '@/data/renpar-data-1';
import { RENPAR_ROWS_2 } from '@/data/renpar-data-2';
import { RENPAR_ROWS_3 } from '@/data/renpar-data-3';
import { RENPAR_ROWS_4 } from '@/data/renpar-data-4';
import type { RenparRow } from '@/data/renpar-types';
import { normalizeReference } from '@/lib/catalog/normalize';

export type PurchasePriceInfo = {
  purchasePrice: number;
  currency: 'MAD';
  priceSource: string;
  pricePage: number;
  gamme: string;
  aftermarket: string;
  description: string;
  oems: string[];
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
  /** Verified alternate references usable for search (no invented links). */
  searchRefs: string[];
};

const RENPAR_ROWS: RenparRow[] = [
  ...RENPAR_ROWS_1,
  ...RENPAR_ROWS_2,
  ...RENPAR_ROWS_3,
  ...RENPAR_ROWS_4,
];

let _priceIndex: Map<string, PurchasePriceInfo> | null = null;
let _catalogIndex: Map<string, CatalogMatchInfo> | null = null;
let _catalogSearchRefs: Map<string, string[]> | null = null;

function parsePrice(raw: string): number | null {
  const n = Number.parseFloat(String(raw).replace(',', '.').trim());
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Build normalized-ref → purchase price from RENPAR catalogue only (verified source). */
export function getPriceIndex(): Map<string, PurchasePriceInfo> {
  if (_priceIndex) return _priceIndex;
  const map = new Map<string, PurchasePriceInfo>();
  for (const [gamme, aftermarket, description, oems, price, page] of RENPAR_ROWS) {
    const purchasePrice = parsePrice(price);
    if (purchasePrice === null) continue;
    const oemList = oems.split('|').map((x) => x.trim()).filter(Boolean);
    const info: PurchasePriceInfo = {
      purchasePrice,
      currency: 'MAD',
      priceSource: 'RENPAR MOIS 11.pdf',
      pricePage: page,
      gamme,
      aftermarket,
      description: description.replace(/\s+/g, ' ').trim(),
      oems: oemList,
    };
    for (const cand of [gamme, aftermarket, ...oemList]) {
      const key = normalizeReference(cand);
      if (key && !map.has(key)) map.set(key, info);
    }
  }
  _priceIndex = map;
  return map;
}

/** Build normalized-ref → catalogue part summary (OEM + aftermarket refs). */
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
      for (const r of uniqueRefs) {
        if (!existing.includes(r)) existing.push(r);
      }
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
  const priceInfo = getPriceIndex().get(normalizedReference) ?? null;

  let purchasePrice: number | null = null;
  let currency: string | null = null;
  let priceSource: string | null = null;
  let pricePage: number | null = null;

  if (catalog?.sourcePrice) {
    const p = parsePrice(catalog.sourcePrice);
    if (p !== null) {
      purchasePrice = p;
      currency = 'MAD';
      priceSource = catalog.sourceDocument ?? 'catalogue';
    }
  }
  if (purchasePrice === null && priceInfo) {
    purchasePrice = priceInfo.purchasePrice;
    currency = priceInfo.currency;
    priceSource = priceInfo.priceSource;
    pricePage = priceInfo.pricePage;
  }

  const gamme =
    priceInfo?.gamme ??
    catalog?.aftermarketReference ??
    null;

  const description = catalog?.name ?? priceInfo?.description ?? null;
  const manufacturer = catalog?.manufacturer ?? null;

  const searchRefs: string[] = [];
  const push = (v: string | null | undefined) => {
    if (!v) return;
    const s = String(v).trim();
    if (s && !searchRefs.includes(s)) searchRefs.push(s);
  };
  push(reference);
  for (const r of getCatalogSearchRefs().get(normalizedReference) ?? []) push(r);
  if (priceInfo) {
    push(priceInfo.gamme);
    push(priceInfo.aftermarket);
    for (const o of priceInfo.oems) push(o);
  }

  return {
    reference,
    normalizedReference,
    quantity,
    stock: quantity,
    gamme,
    description,
    manufacturer,
    purchasePrice,
    currency,
    priceSource,
    pricePage,
    stockSource,
    stockSnapshot,
    catalogMatch: catalog,
    searchRefs,
  };
}

/** Match query against a stock record (exact / normalized / partial / alternate refs / gamme). */
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
