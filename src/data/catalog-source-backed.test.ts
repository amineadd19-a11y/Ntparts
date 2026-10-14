import { SOURCE_BACKED_PARTS } from '@/data/catalog-source-backed';
import { isLiveCatalogueEligible } from '../lib/catalog/pipeline';

describe('source-backed catalogue publication', () => {
  it('publishes cited records as source-listed without promoting them to verified fitment', () => {
    expect(SOURCE_BACKED_PARTS.length).toBeGreaterThan(0);

    for (const part of SOURCE_BACKED_PARTS) {
      expect(part.verificationStatus).toBe('source-listed');
      expect(part.oemReferences.length).toBeGreaterThan(0);
      expect(isLiveCatalogueEligible(part)).toBe(true);

      for (const reference of part.oemReferences) {
        expect(reference.verificationStatus).toBe('source-listed');
        expect(reference.source).toMatch(/^https?:\/\//i);
      }

      expect(part.compatibility).toEqual([]);
      expect(part.specifications?.oemStatus).toContain('NOT INDEPENDENTLY VERIFIED');
    }
  });
});
