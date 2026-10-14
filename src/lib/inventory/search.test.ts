import { matchesStockReference, filterStockByReference } from './search';
import { INVENTORY_RECORDS } from '@/data/inventory-records';
import { normalizeReference } from '@/lib/catalog/normalize';

describe('Stock reference search (independent of CMUP)', () => {
  test('stale inventory snapshot is not exposed as current stock', () => {
    expect(INVENTORY_RECORDS).toEqual([]);
  });

  test('exact and normalized references are searchable without CMUP', () => {
    const record = { reference: '000.270', quantity: 4, purchasePrice: null as number | null };
    expect(matchesStockReference(record, '000.270')).toBe(true);
    expect(matchesStockReference(record, '000270')).toBe(true);
    expect(matchesStockReference(record, 'NOPE')).toBe(false);
  });

  test('partial reference search works', () => {
    const records = [
      { reference: '000.270', quantity: 4, purchasePrice: null },
      { reference: '000.271', quantity: 2, purchasePrice: 10 },
      { reference: '6002', quantity: 280, purchasePrice: null },
    ];
    expect(filterStockByReference(records, '000').map((row) => row.reference)).toEqual([
      '000.270', '000.271',
    ]);
  });

  test('search trims whitespace and ignores letter case', () => {
    const record = { reference: '5ZM980', quantity: 100, purchasePrice: null as number | null };
    expect(matchesStockReference(record, '  5zm980  ')).toBe(true);
  });

  test('empty search returns all provided records without CMUP filtering', () => {
    const records = [
      { reference: '6002', quantity: 280, purchasePrice: null },
      { reference: '000.270', quantity: 4, purchasePrice: 304 },
    ];
    expect(filterStockByReference(records, '').length).toBe(2);
  });

  test('matches verified alternate references and catalogue references', () => {
    const record = {
      reference: 'PRIMARY',
      quantity: 1,
      purchasePrice: null as number | null,
      searchRefs: ['ALT-123'],
      catalogMatch: { oemReferences: ['OEM-456'] },
    };
    expect(matchesStockReference(record, 'ALT123')).toBe(true);
    expect(matchesStockReference(record, 'OEM-456')).toBe(true);
  });

  test('normalizeReference treats formatting variants as equal', () => {
    expect(normalizeReference('000.270')).toBe(normalizeReference('000270'));
    expect(normalizeReference('000-270')).toBe(normalizeReference('000 270'));
    expect(normalizeReference('5ZM980')).toBe(normalizeReference('5zm980'));
  });
});
