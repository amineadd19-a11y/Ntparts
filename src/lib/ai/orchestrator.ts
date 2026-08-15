import type { AIAnalysisResponse } from './types';
import { searchPart } from './catalog-tools';
import { researchWeb } from './web-research';

function buildCatalogSection(matches: ReturnType<typeof searchPart>): string {
  if (!matches.length) return 'INTERNAL CATALOGUE: No matching NTParts records found.';
  const lines = matches.slice(0, 8).map((match, index) => {
    const refs = match.references.length ? match.references.join(', ') : 'none recorded';
    return `${index + 1}. ${match.name} | ${match.manufacturer ?? 'Unknown manufacturer'} ${match.model ?? ''}\n   REFERENCES: ${refs}\n   VERIFICATION: ${match.verificationStatus}`;
  });
  return `INTERNAL CATALOGUE\n\n${lines.join('\n')}`;
}

function suggestions(question: string): string[] {
  const q = question.trim();
  return [
    `Verify the exact reference "${q}" against the manufacturer catalogue.`,
    'Provide the truck model, engine and chassis/VIN when compatibility depends on configuration.',
    'Do not order from an unverified cross-reference without confirming the application.',
  ];
}

/**
 * PartMind's primary path is deliberately provider-independent.
 * It searches the live web directly and combines that evidence with the
 * NTParts catalogue. Gemini is no longer required for the AI endpoint to work.
 */
export async function analyzeWithProviders(question: string): Promise<AIAnalysisResponse> {
  const trimmed = question.trim();
  if (!trimmed) throw new Error('A part reference or question is required.');

  const [catalogMatches, web] = await Promise.all([
    Promise.resolve(searchPart(trimmed)),
    researchWeb(trimmed),
  ]);

  const catalogSection = buildCatalogSection(catalogMatches);
  const answer = `${web.answer}\n\n${catalogSection}\n\nVERIFICATION\nLive web evidence and internal catalogue data are presented separately. NTParts does not promote an unverified search result to OEM truth.\n\nCONFIDENCE: ${web.sources.length >= 3 || catalogMatches.length > 0 ? 65 : 35}`;

  const status: AIAnalysisResponse['status'] = web.sources.some((source) => source.evidence === 'OFFICIAL') && catalogMatches.some((match) => match.verificationStatus === 'verified')
    ? 'probable'
    : 'unverified';

  return {
    answer,
    confidence: web.sources.length >= 3 && catalogMatches.length > 0 ? 75 : web.sources.length > 0 || catalogMatches.length > 0 ? 60 : 35,
    status,
    catalogMatches: catalogMatches.slice(0, 12),
    sources: web.sources,
    sourceConflicts: [],
    suggestions: suggestions(trimmed),
  };
}
