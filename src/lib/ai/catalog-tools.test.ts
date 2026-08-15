import { compareParts, findCrossReferences, searchPart } from './catalog-tools';

describe('NTParts catalog intelligence tools', () => {
  it('finds an exact OEM reference without fabricating data', () => {
    const results = searchPart('K059965K50');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.references.includes('K059965K50'))).toBe(true);
  });

  it('returns cross-reference candidates with provenance fields', () => {
    const results = findCrossReferences('K059965K50');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty('sourceUrls');
    expect(results[0]).toHaveProperty('verificationStatus');
  });

  it('does not claim unrelated parts are the same part', () => {
    const result = compareParts('K059965K50', 'A5411800009');
    expect(result.sameCatalogPart).toBe(false);
    expect(result.conclusion).not.toBe('SAME PART');
  });

  it('normalizes reference punctuation and spacing', () => {
    const compact = searchPart('K059965K50');
    const spaced = searchPart('K0 59965-K50');
    expect(compact.map((item) => item.id)).toEqual(spaced.map((item) => item.id));
  });
});
