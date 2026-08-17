import { NextResponse } from 'next/server';
import { gunzipSync } from 'node:zlib';
import { CATALOG_PARTS } from '@/data/catalog';
import { INVENTORY_GZIP_BASE64, INVENTORY_ITEM_COUNT, INVENTORY_SNAPSHOT_DATE, INVENTORY_SOURCE, INVENTORY_TOTAL_QUANTITY, INVENTORY_TOTAL_VALUE } from '@/data/inventory-snapshot';
import { normalizeReference } from '@/lib/catalog/normalize';

type InventoryTuple = [string, number];

function decodeInventory(): InventoryTuple[] {
  const json = gunzipSync(Buffer.from(INVENTORY_GZIP_BASE64, 'base64')).toString('utf8');
  return JSON.parse(json) as InventoryTuple[];
}

export async function GET() {
  const referenceMap = new Map<string, { partId: string; name: string; category: string }>();
  for (const part of CATALOG_PARTS) {
    for (const ref of part.oemReferences.flatMap((item) => [item.referenceNumber, ...(item.alternateNumbers ?? [])])) {
      const key = normalizeReference(ref);
      if (key && !referenceMap.has(key)) referenceMap.set(key, { partId: part.id, name: part.name, category: part.category });
    }
  }

  const records = decodeInventory().map(([reference, quantity]) => ({
    reference,
    quantity,
    catalogMatch: referenceMap.get(normalizeReference(reference)) ?? null,
  }));

  return NextResponse.json({
    source: INVENTORY_SOURCE,
    snapshotDate: INVENTORY_SNAPSHOT_DATE,
    itemCount: INVENTORY_ITEM_COUNT,
    totalQuantity: INVENTORY_TOTAL_QUANTITY,
    totalValue: INVENTORY_TOTAL_VALUE,
    records,
  }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } });
}
