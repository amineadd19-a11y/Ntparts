/**
 * NTParts - Core Type Definitions
 */

/**
 * Explicit verification lifecycle for catalogue entities.
 *
 * - verified: supported by acceptable evidence (OEM/official/parts-catalog tiers)
 * - source-listed: present in a attributable source but exact fitment may be unproven
 * - cross-checked: corroborated across multiple sources (legacy / intermediate)
 * - needs-verification: incomplete evidence; must not be treated as production fact
 * - unverified: no acceptable evidence
 * - rejected: explicitly rejected (bad data, conflict, policy)
 *
 * LLM confidence alone MUST NEVER promote a record to verified.
 */
export type VerificationStatus =
  | 'verified'
  | 'source-listed'
  | 'cross-checked'
  | 'needs-verification'
  | 'unverified'
  | 'rejected';

export type EvidenceLevel = 'official' | 'parts-catalog' | 'secondary';

export interface Manufacturer {
  id: string;
  name: string;
  logo?: string;
  country?: string;
  description?: string;
}

export interface TruckModel {
  id: string;
  manufacturerId: string;
  name: string;
  productionStart?: number;
  productionEnd?: number;
  description?: string;
}

export interface Generation {
  id: string;
  modelId: string;
  name: string;
  startYear?: number;
  endYear?: number;
}

export interface Engine {
  id: string;
  generationId: string;
  type: string;
  displacement?: string;
  power?: string;
  torque?: string;
  fuel?: string;
}

export interface System {
  id: string;
  name: string;
  category: 'engine' | 'transmission' | 'suspension' | 'brake' | 'electrical' | 'cooling' | 'other';
  description?: string;
}

export interface Part {
  id: string;
  systemId: string;
  name: string;
  description?: string;
  category: string;
  specifications?: Record<string, string>;
  images: PartImage[];
  oemReferences: OEMReference[];
  crossReferences: CrossReference[];
  compatibility: Compatibility[];
  sources: Source[];
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PartImage {
  id: string;
  partId: string;
  url: string;
  title?: string;
  alt?: string;
  isPrimary: boolean;
  source?: string;
}

export interface OEMReference {
  id: string;
  partId: string;
  manufacturerId: string;
  modelIds?: string[];
  referenceNumber: string;
  alternateNumbers?: string[];
  verificationStatus: VerificationStatus;
  source?: string;
  evidenceLevel?: EvidenceLevel;
}

export interface CrossReference {
  id: string;
  partId: string;
  referencedPartId: string;
  relationshipType: 'compatible' | 'compatible-with-modification' | 'upgrade' | 'downgrade' | 'substitute';
  verificationStatus?: VerificationStatus;
  source?: string;
  notes?: string;
}

export interface Compatibility {
  id: string;
  partId: string;
  generationId: string;
  engineId?: string;
  notes?: string;
  verified: boolean;
}

export interface Source {
  id: string;
  partId: string;
  name: string;
  url?: string;
  type: 'official' | 'parts-catalog' | 'forum' | 'documentation' | 'other';
  reliability: 'high' | 'medium' | 'low';
}

export interface SearchResult {
  type: 'part' | 'truck' | 'manual';
  id: string;
  title: string;
  description?: string;
  image?: string;
  relevance: number;
}

export interface Favorite {
  id: string;
  userId: string;
  partId: string;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  userId: string;
  query: string;
  type: 'text' | 'image' | 'filter';
  timestamp: string;
}

export interface AIQuery {
  question: string;
  context?: {
    manufacturerId?: string;
    modelId?: string;
    generationId?: string;
    engineId?: string;
  };
}

export interface AIResponse {
  answer: string;
  sources: Source[];
  verified: boolean;
  confidence: number;
  suggestions?: Part[];
}
