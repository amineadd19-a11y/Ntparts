import { NextResponse } from 'next/server';
import { CATALOG_PARTS } from '@/data/catalog';
import {
  INVENTORY_ITEM_COUNT,
  INVENTORY_RECORDS_LOADED,
  INVENTORY_SNAPSHOT_DATE,
  INVENTORY_SOURCE,
  INVENTORY_TOTAL_QUANTITY,
  INVENTORY_TOTAL_VALUE,
} from '@/data/inventory-snapshot';
import { INVENTORY_RECORDS } from '@/data/inventory-records';
import { normalizeReference } from '@/lib/catalog/normalize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const referenceMap = new Map<string, { partId: string; name: string; category: string }>();
  for (const part of CATALOG_PARTS) {
    for (const ref of part.oemReferences.flatMap((item) => [
      item.referenceNumber,
      ...(item.alternateNumbers ?? []),
    ])) {
      const key = normalizeReference(ref);
      if (key && !referenceMap.has(key)) {
        referenceMap.set(key, { partId: part.id, name: part.name, category: part.category });
      }
    }
  }

  const records = INVENTORY_RECORDS.map(([reference, quantity]) => ({
    reference,
    quantity,
    catalogMatch: referenceMap.get(normalizeReference(reference)) ?? null,
  }));

  return NextResponse.json(
    {
      source: INVENTORY_SOURCE,
      snapshotDate: INVENTORY_SNAPSHOT_DATE,
      itemCount: INVENTORY_ITEM_COUNT,
      totalQuantity: INVENTORY_TOTAL_QUANTITY,
      totalValue: INVENTORY_TOTAL_VALUE,
      records,
      recordsLoaded: records.length,
      recordsExpected: INVENTORY_RECORDS_LOADED,
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    }
  );
}
