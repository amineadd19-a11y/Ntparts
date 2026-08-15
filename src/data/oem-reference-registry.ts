/**
 * Source-backed OEM registry scaffold.
 *
 * Keep this registry intentionally conservative: only references with explicit
 * provenance belong here. Unknown fitment must remain unverified.
 */
export type EvidenceLevel =
  | 'OFFICIAL'
  | 'MANUFACTURER'
  | 'AUTHORIZED_DISTRIBUTOR'
  | 'PROFESSIONAL_CATALOG'
  | 'SECONDARY'
  | 'UNVERIFIED';

export interface OemReferenceRecord {
  referenceNumber: string;
  manufacturer: string;
  partType?: string;
  oemNumbers: string[];
  crossReferences: string[];
  applications: string[];
  modelIds: string[];
  sources: Array<{
    url: string;
    domain: string;
    sourceType: EvidenceLevel;
    claim: string;
  }>;
  evidence: EvidenceLevel;
  confidence: number;
  lastVerified: string;
}

/**
 * Populated only from verified catalog/import sources. Do not add guessed
 * references or compatibility relationships here.
 */
export const OEM_REFERENCE_REGISTRY: OemReferenceRecord[] = [];
