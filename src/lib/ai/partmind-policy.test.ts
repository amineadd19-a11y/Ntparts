import {
  buildEvidenceSummary,
  looksLikeCatalogueMutationPrompt,
  statusToLabel,
} from './partmind-policy';

describe('PartMind policy', () => {
  it('maps statuses to explicit labels', () => {
    expect(statusToLabel('verified')).toBe('VERIFIED');
    expect(statusToLabel('probable')).toBe('LIKELY');
    expect(statusToLabel('unverified')).toBe('NOT VERIFIED');
    expect(statusToLabel('conflict')).toBe('SOURCE CONFLICT');
  });

  it('detects catalogue mutation prompts', () => {
    expect(looksLikeCatalogueMutationPrompt('Add OEM 12345 as compatible with Scania')).toBe(true);
    expect(looksLikeCatalogueMutationPrompt('What is K059965K50?')).toBe(false);
  });

  it('builds NOT VERIFIED summary without inventing evidence', () => {
    const summary = buildEvidenceSummary('unverified', [], 0, []);
    expect(summary).toMatch(/NOT VERIFIED/i);
  });

  it('flags conflicts explicitly', () => {
    const summary = buildEvidenceSummary('conflict', [], 2, ['disagree']);
    expect(summary).toMatch(/SOURCE CONFLICT/i);
  });
});
