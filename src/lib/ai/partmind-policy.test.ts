import {
  buildEvidenceSummary,
  looksLikeCatalogueMutationPrompt,
  statusToLabel,
  isFitmentQuestion,
} from './partmind-policy';

describe('PartMind policy', () => {
  it('maps statuses to explicit labels', () => {
    expect(statusToLabel('verified')).toBe('VERIFIED');
    expect(statusToLabel('probable')).toBe('LIKELY');
    expect(statusToLabel('unverified')).toBe('NOT VERIFIED');
    expect(statusToLabel('conflict')).toBe('SOURCE CONFLICT');
  });

  it('detects fitment questions across English, French, and Arabic/Darija', () => {
    expect(isFitmentQuestion('Is this part compatible with a Scania R450?')).toBe(true);
    expect(isFitmentQuestion('Application for this OEM reference')).toBe(true);
    expect(isFitmentQuestion('Cette pièce est compatible avec Renault Trucks ?')).toBe(true);
    expect(isFitmentQuestion('واش هاد القطعة كتركب على Volvo FH؟')).toBe(true);
    expect(isFitmentQuestion('What is K059965K50?')).toBe(false);
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
