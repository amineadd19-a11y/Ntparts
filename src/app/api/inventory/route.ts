import { NextResponse } from 'next/server';
import { gunzipSync } from 'node:zlib';
import { CATALOG_PARTS } from '@/data/catalog';
import {
  INVENTORY_GZIP_BASE64,
  INVENTORY_ITEM_COUNT,
  INVENTORY_RECORDS_LOADED,
  INVENTORY_SNAPSHOT_DATE,
  INVENTORY_SOURCE,
  INVENTORY_TOTAL_QUANTITY,
  INVENTORY_TOTAL_VALUE,
} from '@/data/inventory-snapshot';
import { normalizeReference } from '@/lib/catalog/normalize';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type InventoryTuple = [string, number];

function decodeInventory(): InventoryTuple[] {
  if (!INVENTORY_GZIP_BASE64 || INVENTORY_GZIP_BASE64.length < 100) {
    return [];
  }
  try {
    const json = gunzipSync(Buffer.from(INVENTORY_GZIP_BASE64, 'base64')).toString('utf8');
    const parsed = JSON.parse(json) as Array<[string, number]>;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is InventoryTuple =>
        Array.isArray(row) &&
        typeof row[0] === 'string' &&
        row[0].length > 0 &&
        typeof row[1] === 'number' &&
        Number.isFinite(row[1])
    );
  } catch {
    // Do not invent stock lines if the payload cannot be decoded.
    return [];
  }
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

  const raw = decodeInventory();
  const records = raw.map(([reference, quantity]) => ({
    reference,
    quantity,
    catalogMatch: referenceMap.get(normalizeReference(reference)) ?? null,
  }));

  return NextResponse.json(
    {
      source: INVENTORY_SOURCE,
      snapshotDate: INVENTORY_SNAPSHOT_DATE,
      // Official Inventaire.pdf aggregate totals (snapshot summary)
      itemCount: INVENTORY_ITEM_COUNT,
      totalQuantity: INVENTORY_TOTAL_QUANTITY,
      totalValue: INVENTORY_TOTAL_VALUE,
      // Actual searchable line-level rows recovered from the source payload
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
