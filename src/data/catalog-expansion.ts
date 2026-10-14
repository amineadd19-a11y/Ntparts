/**
 * DISCOVERY LAYER — offline / not published in the live catalogue.
 *
 * Historical structural templates without OEM numbers.
 * Kept for reference only. Live merge uses real sources only:
 *   (core OEM-backed + SOURCE_BACKED_PARTS + RENPAR).
 *
 * Rules:
 * - Do NOT re-import into catalog.ts without concrete OEM evidence.
 * - Template combinations (manufacturer × model × part template) without
 *   source-backed references must remain discovery/unverified data.
 * - LLM confidence is never sufficient to promote a row to verified/live.
 */
import type { Part } from '@/types';

export const CATALOG_EXPANSION: Part[] = [];
export const CATALOG_EXPANSION_STATUS = 'offline-not-published' as const;
export const CATALOG_EXPANSION_POLICY =
  'templates-without-oem-evidence-never-enter-live-catalogue' as const;
