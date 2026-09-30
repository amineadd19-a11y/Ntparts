import { searchCatalogue, scorePart } from './search';
import { CATALOG_PARTS } from '@/data/catalog';

describe('canonical catalogue search', () => {
  it('ranks exact verified OEM above text name matches', () => {
    const oemQuery = 'K059965K50';
    const { results } = searchCatalogue(oemQuery, { limit: 10 });
    expect(results.length).toBeGreaterThan(0);
    const top = results[0];
    expect(
      top.matchKind === 'exact-verified-oem' ||
        top.matchKind === 'exact-source-listed-oem' ||
        top.matchKind === 'exact-oem' ||
        top.matchKind === 'partial-oem',
    ).toBe(true);
    expect(top.part.oemReferences.some((r) => r.referenceNumber.includes('K059965') || (r.alternateNumbers ?? []).some((a) => a.includes('K059965')))).toBe(true);
  });

  it('normalizes spacing and punctuation for OEM lookup', () => {
    const a = searchCatalogue('K059965K50', { limit: 5 }).results.map((r) => r.part.id);
    const b = searchCatalogue('K0 59965-K50', { limit: 5 }).results.map((r) => r.part.id);
    expect(a.length).toBeGreaterThan(0);
    expect(a).toEqual(b);
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
