import { matchesStockReference, filterStockByReference } from './search';
import { enrichInventoryRecord, recordMatchesQuery } from './enrich';
import { INVENTORY_RECORDS } from '@/data/inventory-records';
import { normalizeReference } from '@/lib/catalog/normalize';

const ALL = INVENTORY_RECORDS.map(([reference, quantity]) =>
  enrichInventoryRecord(reference, quantity, 'Inventaire.pdf', '2026-08-17')
);

function find(query: string) {
  return ALL.filter((r) => recordMatchesQuery(r, query));
}

describe('Stock reference search (independent of CMUP)', () => {
  test('exact reference search: 000.270', () => {
    const hits = find('000.270');
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits[0].reference).toBe('000.270');
    expect(hits[0].quantity).toBe(4);
    expect(hits[0].purchasePrice).toBe(304);
  });

  test('normalized unformatted search: 000270 finds 000.270', () => {
    const hits = find('000270');
    expect(hits.some((h) => h.reference === '000.270')).toBe(true);
  });

  test('reference with missing CMUP is still found: 6002', () => {
    const hits = find('6002');
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits[0].reference).toBe('6002');
    expect(hits[0].quantity).toBe(280);
    expect(hits[0].purchasePrice).toBeNull();
  });

  test('reference with missing CMUP: 5ZM980', () => {
    const hits = find('5ZM980');
    expect(hits.some((h) => h.reference === '5ZM980')).toBe(true);
    const row = hits.find((h) => h.reference === '5ZM980')!;
    expect(row.quantity).toBe(100);
    expect(row.purchasePrice).toBeNull();
  });

  test('lowercase search: 5zm980 finds 5ZM980', () => {
    const hits = find('5zm980');
    expect(hits.some((h) => h.reference === '5ZM980')).toBe(true);
  });

  test('reference with missing CMUP: 1315298001', () => {
    const hits = find('1315298001');
    expect(hits.length).toBeGreaterThanOrEqual(1);
    expect(hits[0].reference).toBe('1315298001');
    expect(hits[0].quantity).toBe(1);
    expect(hits[0].purchasePrice).toBeNull();
  });

  test('partial reference search', () => {
    const hits = find('000');
    expect(hits.length).toBeGreaterThan(1);
    expect(hits.some((h) => h.reference === '000.270')).toBe(true);
  });

  test('search with leading/trailing spaces', () => {
    const hits = find('  6002  ');
    expect(hits.some((h) => h.reference === '6002')).toBe(true);
  });

  test('empty search returns all records (no CMUP filter)', () => {
    const hits = find('');
    expect(hits.length).toBe(ALL.length);
    expect(hits.length).toBe(1454);
  });

  test('missing CMUP never removes a record from the dataset', () => {
    const withoutPrice = ALL.filter((r) => r.purchasePrice === null);
    expect(withoutPrice.length).toBeGreaterThan(0);
    for (const row of withoutPrice.slice(0, 25)) {
      const hits = find(row.reference);
      expect(hits.some((h) => h.reference === row.reference)).toBe(true);
    }
  });

  test('matchesStockReference does not require purchasePrice', () => {
    const bare = { reference: 'TEST.REF', quantity: 1, purchasePrice: null as number | null };
    expect(matchesStockReference(bare, 'TEST.REF')).toBe(true);
    expect(matchesStockReference(bare, 'testref')).toBe(true);
    expect(matchesStockReference(bare, 'NOPE')).toBe(false);
  });

  test('filterStockByReference preserves no-CMUP rows', () => {
    const filtered = filterStockByReference(ALL, '6002');
    expect(filtered.length).toBeGreaterThanOrEqual(1);
    expect(filtered[0].purchasePrice).toBeNull();
  });

  test('normalizeReference treats formatting variants as equal', () => {
    expect(normalizeReference('000.270')).toBe(normalizeReference('000270'));
    expect(normalizeReference('000-270')).toBe(normalizeReference('000 270'));
    expect(normalizeReference('5ZM980')).toBe(normalizeReference('5zm980'));
  });
});
