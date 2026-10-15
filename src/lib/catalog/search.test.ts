import { searchCatalogue, scorePart } from './search';
import { CATALOG_PARTS } from '@/data/catalog';

function firstOemReference(): string | null {
  for (const part of CATALOG_PARTS) {
    const ref = part.oemReferences?.[0]?.referenceNumber;
    if (ref && ref.length >= 4) return ref;
  }
  return null;
}

describe('canonical catalogue search', () => {
  it('ranks exact OEM matches when catalogue has OEM data', () => {
    const oemQuery = firstOemReference();
    if (!oemQuery) {
      // Live catalogue may be empty in isolated fixtures — skip
      return;
    }
    const { results } = searchCatalogue(oemQuery, { limit: 10 });
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect(
      top.matchKind === 'exact-verified-oem' ||
        top.matchKind === 'exact-source-listed-oem' ||
        top.matchKind === 'exact-oem' ||
        top.matchKind === 'partial-oem',
    ).toBe(true);
    expect(top.verificationStatus).toBeTruthy();
  });

  it('normalizes spacing and punctuation for OEM lookup', () => {
    const oemQuery = firstOemReference();
    if (!oemQuery) return;
    const spaced = oemQuery.replace(/(.{2})/g, '$1 ').trim();
    const a = searchCatalogue(oemQuery, { limit: 5 }).results.map((r) => r.part.id);
    const b = searchCatalogue(spaced, { limit: 5 }).results.map((r) => r.part.id);
    expect(a.length).toBeGreaterThan(0);
    expect(a).toEqual(b);
  });

  it('finds DAF XF106 fuel filters by both OEM references and listed alternates', () => {
    const expectedByQuery: Array<[string, string]> = [
      ['2277128', 'src-daf-2277128-fuel-filter'],
      ['2277129', 'src-daf-2277129-fuel-filter'],
      ['1852005', 'src-daf-2277128-fuel-filter'],
      ['2164463', 'src-daf-2277129-fuel-filter'],
    ];

    for (const [query, expectedPartId] of expectedByQuery) {
      const { results } = searchCatalogue(query, { limit: 50 });
      expect(results.some((result) => result.part.id === expectedPartId)).toBe(true);
    }
  });

  it('finds DAF filter OEMs despite inserted spaces and punctuation', () => {
    const variants: Array<[string, string]> = [
      ['2277 128', 'src-daf-2277128-fuel-filter'],
      ['2277-129', 'src-daf-2277129-fuel-filter'],
    ];

    for (const [query, expectedPartId] of variants) {
      const { results } = searchCatalogue(query, { limit: 50 });
      expect(results.some((result) => result.part.id === expectedPartId)).toBe(true);
    }
  });

  it('exposes verificationStatus on every scored result', () => {
    const { results } = searchCatalogue('filter', { limit: 5 });
    for (const r of results) {
      expect(r.verificationStatus).toBeTruthy();
      expect(r.score).toBeGreaterThan(0);
    }
  });

  it('returns empty for blank query', () => {
    const { results, total } = searchCatalogue('   ');
    expect(results).toEqual([]);
    expect(total).toBe(0);
  });

  it('scorePart returns null when there is no signal', () => {
    const part = CATALOG_PARTS[0];
    if (!part) return;
    expect(scorePart(part, 'zzzznonexistenttoken999')).toBeNull();
  });
});
