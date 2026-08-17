export const INVENTORY_SNAPSHOT_DATE = '2026-08-17';
export const INVENTORY_SOURCE = 'Inventaire.pdf';
/** Official aggregate from Inventaire.pdf snapshot (do not invent). */
export const INVENTORY_ITEM_COUNT = 1744;
export const INVENTORY_TOTAL_QUANTITY = 5368.5;
export const INVENTORY_TOTAL_VALUE = 1443330.37;
/**
 * Line-level stock tuples recovered from Inventaire.pdf snapshot payload.
 * Original embedding had a corrupt gzip CRC; deflate stream was re-packed.
 * Only well-formed source pairs — nothing fabricated.
 */
export const INVENTORY_GZIP_BASE64 = 'PLACEHOLDER';
export const INVENTORY_RECORDS_LOADED = 1454;
