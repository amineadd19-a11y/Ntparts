/**
 * OFFLINE — not published in the live catalogue.
 *
 * Historical structural templates without OEM numbers.
 * Kept for reference only. Live merge uses real sources only
 * (core OEM-backed + SOURCE_BACKED_PARTS + RENPAR).
 *
 * Do not re-import into catalog.ts without concrete OEM evidence.
 */
import type { Part } from '@/types';

export const CATALOG_EXPANSION: Part[] = [];
export const CATALOG_EXPANSION_STATUS = 'offline-not-published' as const;
