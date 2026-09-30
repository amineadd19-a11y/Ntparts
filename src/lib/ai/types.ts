export type EvidenceLevel =
  | 'OFFICIAL'
  | 'MANUFACTURER'
  | 'AUTHORIZED_DISTRIBUTOR'
  | 'PROFESSIONAL_CATALOG'
  | 'SECONDARY'
  | 'UNVERIFIED';

export interface AISource {
  title: string;
  url: string;
  domain: string;
  evidence: EvidenceLevel;
  confidence: number;
  retrievedAt: string;
}

export interface CatalogMatch {
  id: string;
  name: string;
  manufacturer?: string;
  model?: string;
  category?: string;
  references: string[];
  verificationStatus: string;
  sourceUrls: string[];
  relevance: number;
}

/** Human-facing verification labels (PartMind). */
export type PartMindStatusLabel =
  | 'VERIFIED'
  | 'LIKELY'
  | 'NOT VERIFIED'
  | 'SOURCE CONFLICT';

export interface AIAnalysisResponse {
  answer: string;
  confidence: number;
  status: 'verified' | 'probable' | 'conflict' | 'unverified';
  /** Explicit label for UI / clients */
  statusLabel: PartMindStatusLabel;
  /** Short evidence summary for clients */
  evidenceSummary: string;
  catalogMatches: CatalogMatch[];
  sources: AISource[];
  sourceConflicts: string[];
  suggestions: string[];
}
