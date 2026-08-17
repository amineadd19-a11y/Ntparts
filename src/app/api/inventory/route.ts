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
import inventoryRecords1 from '@/data/inventory-records-1.json';
import inventoryRecords2 from '@/data/inventory-records-2.json';
import { normalizeReference } from '@/lib/catalog/normalize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type InventoryTuple = [string, number];

function loadInventory(): InventoryTuple[] {
  const parts = [inventoryRecords1, inventoryRecords2];
  const out: InventoryTuple[] = [];
  for (const part of parts) {
    if (!Array.isArray(part)) continue;
    for (const row of part as Array<[string, number]>) {
      if (
        Array.isArray(row) &&
        typeof row[0] === 'string' &&
        row[0].length > 0 &&
        typeof row[1] === 'number' &&
        Number.isFinite(row[1])
      ) {
        out.push([row[0], row[1]]);
      }
    }
  }
  return out;
}

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

  const raw = loadInventory();
  const records = raw.map(([reference, quantity]) => ({
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
