import { NextRequest, NextResponse } from 'next/server';
import {
  INVENTORY_ITEM_COUNT,
  INVENTORY_RECORDS_LOADED,
  INVENTORY_SNAPSHOT_DATE,
  INVENTORY_SOURCE,
  INVENTORY_TOTAL_QUANTITY,
  INVENTORY_TOTAL_VALUE,
} from '@/data/inventory-snapshot';
import { INVENTORY_RECORDS } from '@/data/inventory-records';
import {
  enrichInventoryRecord,
  recordMatchesQuery,
  type EnrichedStockRecord,
} from '@/lib/inventory/enrich';
import { normalizeReference } from '@/lib/catalog/normalize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function buildAllRecords(): EnrichedStockRecord[] {
  return INVENTORY_RECORDS.map(([reference, quantity]) =>
    enrichInventoryRecord(reference, quantity, INVENTORY_SOURCE, INVENTORY_SNAPSHOT_DATE)
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? '').trim();
  const refParam = (searchParams.get('ref') ?? '').trim();
  const matchedOnly = searchParams.get('matchedOnly') === '1';
  const limitRaw = Number.parseInt(searchParams.get('limit') ?? '0', 10);
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 500) : 0;

  const all = buildAllRecords();

  // Single-part detail by exact/normalized reference
  if (refParam) {
    const key = normalizeReference(refParam);
    const detail =
      all.find((r) => normalizeReference(r.reference) === key || r.reference === refParam) ??
      all.find((r) => recordMatchesQuery(r, refParam));
    if (!detail) {
      return NextResponse.json(
        { error: 'Reference not found in stock snapshot', reference: refParam },
        { status: 404, headers: { 'Cache-Control': 'public, s-maxage=60' } }
      );
    }
    return NextResponse.json(
      {
        source: INVENTORY_SOURCE,
        snapshotDate: INVENTORY_SNAPSHOT_DATE,
        itemCount: INVENTORY_ITEM_COUNT,
        totalQuantity: INVENTORY_TOTAL_QUANTITY,
        totalValue: INVENTORY_TOTAL_VALUE,
        record: detail,
      },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } }
    );
  }

  let records = all;
  if (matchedOnly) {
    records = records.filter((r) => r.catalogMatch !== null);
  }
  if (q) {
    records = records.filter((r) => recordMatchesQuery(r, q));
  }

  const totalMatches = records.length;
  if (limit > 0) {
    records = records.slice(0, limit);
  }

  const withPrice = all.filter((r) => r.purchasePrice !== null).length;

  return NextResponse.json(
    {
      source: INVENTORY_SOURCE,
      snapshotDate: INVENTORY_SNAPSHOT_DATE,
      itemCount: INVENTORY_ITEM_COUNT,
      totalQuantity: INVENTORY_TOTAL_QUANTITY,
      totalValue: INVENTORY_TOTAL_VALUE,
      records,
      recordsLoaded: all.length,
      recordsExpected: INVENTORY_RECORDS_LOADED,
      totalMatches,
      recordsWithPurchasePrice: withPrice,
      query: q || null,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    }
  );
}
