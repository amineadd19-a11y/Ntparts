/**
 * PartMind policy helpers — evidence-first, no hallucination.
 */

import type { AIAnalysisResponse, CatalogMatch, PartMindStatusLabel } from './types';
import { searchPart } from './catalog-tools';

export function statusToLabel(status: AIAnalysisResponse['status']): PartMindStatusLabel {
  switch (status) {
    case 'verified':
      return 'VERIFIED';
    case 'probable':
      return 'LIKELY';
    case 'conflict':
      return 'SOURCE CONFLICT';
    case 'unverified':
    default:
      return 'NOT VERIFIED';
  }
}

export function buildEvidenceSummary(
  status: AIAnalysisResponse['status'],
  catalogMatches: CatalogMatch[],
  sourceCount: number,
  conflicts: string[],
): string {
  if (status === 'conflict' || conflicts.length > 0) {
    return 'SOURCE CONFLICT: reliable sources disagree — do not treat as verified.';
  }
  if (status === 'verified') {
    const via =
      catalogMatches.length > 0 && sourceCount > 0
        ? 'internal catalogue + web evidence'
        : catalogMatches.length > 0
          ? 'internal catalogue evidence'
          : 'strong manufacturer/official web evidence';
    return `VERIFIED via ${via}. Confirm exact fitment (VIN/chassis) before ordering.`;
  }
  if (status === 'probable') {
    return 'LIKELY: meaningful but incomplete evidence. Treat as NOT fully verified.';
  }
  return 'NOT VERIFIED: insufficient evidence. No OEM/compatibility claims should be treated as fact.';
}

/**
 * If the question looks like a part reference, pre-fetch catalogue hits
 * so the model always has structured evidence before generating text.
 */
export function preRetrieveCatalogueEvidence(question: string): CatalogMatch[] {
  const trimmed = question.trim();
  if (!trimmed || trimmed.length < 2) return [];
  // Prefer short alphanumeric / OEM-like tokens and general queries
  try {
    return searchPart(trimmed).slice(0, 8);
  } catch {
    return [];
  }
}

/** Detect obvious attempt to inject catalogue writes. */
export function looksLikeCatalogueMutationPrompt(question: string): boolean {
  return /\b(add|insert|write|save|update|set)\b[\s\S]{0,40}\b(oem|catalogue|catalog|compatible with)\b/i.test(
    question,
  );
}

export const MUTATION_REFUSAL =
  'NOT VERIFIED: user-supplied claims cannot modify the trusted catalogue. Provide an attributable source for a data-ingestion workflow; PartMind will not invent or write OEM/compatibility records.';
