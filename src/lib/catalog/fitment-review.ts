import type { Compatibility, Part } from '@/types';
import { isVerifiedCompatibility, MAX_FITMENT_EVIDENCE_AGE_DAYS } from './trust-policy';

export type FitmentReviewReason =
  | 'legacy-flag-not-verified'
  | 'relationship-status-not-verified'
  | 'evidence-missing'
  | 'evidence-status-not-verified'
  | 'unsupported-source-type'
  | 'source-title-missing'
  | 'source-url-invalid'
  | 'source-reference-missing'
  | 'vehicle-configuration-missing'
  | 'checked-date-invalid'
  | 'checked-date-in-future'
  | 'evidence-stale';

export interface FitmentReviewItem {
  partId: string;
  partName: string;
  relationshipId: string;
  generationId: string;
  engineId?: string;
  status: 'needs-review';
  reasons: FitmentReviewReason[];
  sourceTitle?: string;
  sourceUrl?: string;
  checkedAt?: string;
  vehicleConfiguration?: string;
}

/**
 * Build a read-only queue of relationships that must be reviewed by a human.
 * This function never changes verification state or promotes evidence.
 */
export function buildFitmentReviewQueue(
  parts: readonly Part[],
  now: Date = new Date(),
): FitmentReviewItem[] {
  const nowMs = now.getTime();
  const maxAgeMs = MAX_FITMENT_EVIDENCE_AGE_DAYS * 24 * 60 * 60 * 1000;
  const queue: FitmentReviewItem[] = [];

  for (const part of parts) {
    for (const relationship of part.compatibility ?? []) {
      if (isVerifiedCompatibility(relationship)) continue;

      const reasons: FitmentReviewReason[] = [];
      const evidence = relationship.evidence;

      if (relationship.verified !== true) reasons.push('legacy-flag-not-verified');
      if (relationship.verificationStatus !== 'verified') reasons.push('relationship-status-not-verified');
      if (!evidence) {
        reasons.push('evidence-missing');
      } else {
        if (evidence.status !== 'verified') reasons.push('evidence-status-not-verified');
        if (evidence.sourceType !== 'official' && evidence.sourceType !== 'parts-catalog') reasons.push('unsupported-source-type');
        if (!evidence.sourceTitle?.trim()) reasons.push('source-title-missing');
        if (!evidence.sourceReference?.trim()) reasons.push('source-reference-missing');
        if (!evidence.vehicleConfiguration?.trim()) reasons.push('vehicle-configuration-missing');

        let validHttpUrl = false;
        try {
          const url = new URL(evidence.sourceUrl);
          validHttpUrl = (url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password;
        } catch {
          validHttpUrl = false;
        }
        if (!validHttpUrl) reasons.push('source-url-invalid');

        const checkedAtMs = Date.parse(evidence.checkedAt);
        if (!Number.isFinite(checkedAtMs)) {
          reasons.push('checked-date-invalid');
        } else if (checkedAtMs > nowMs) {
          reasons.push('checked-date-in-future');
        } else if (nowMs - checkedAtMs > maxAgeMs) {
          reasons.push('evidence-stale');
        }
      }

      // Fail closed even if a future policy condition is added without a matching reason.
      if (reasons.length === 0) reasons.push('relationship-status-not-verified');

      queue.push({
        partId: part.id,
        partName: part.name,
        relationshipId: relationship.id,
        generationId: relationship.generationId,
        ...(relationship.engineId ? { engineId: relationship.engineId } : {}),
        status: 'needs-review',
        reasons,
        ...(evidence?.sourceTitle ? { sourceTitle: evidence.sourceTitle } : {}),
        ...(evidence?.sourceUrl ? { sourceUrl: evidence.sourceUrl } : {}),
        ...(evidence?.checkedAt ? { checkedAt: evidence.checkedAt } : {}),
        ...(evidence?.vehicleConfiguration ? { vehicleConfiguration: evidence.vehicleConfiguration } : {}),
      });
    }
  }

  return queue;
}
