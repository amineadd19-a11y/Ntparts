/**
 * C.M.U.P. unitaire (purchase cost) extracted exclusively from Inventaire.pdf.
 * Snapshot: 17/08/2026.
 * THIS IS THE ONLY purchase-price source used by Stock disponible.
 * Keys are normalized references (lowercase, no separators).
 * Values are the real C.M.U.P. unitaire in MAD — nothing estimated or from RENPAR/Tarif.
 * Incomplete recovery from the source stream: refs without a recovered CMUP show Non disponible.
 * Recovered entries: 542.
 */
export const INVENTORY_CMUP: Record<string, number> = {
  '000270': 304,
  '002194': 12,
  '003770': 217.69,
  '005520': 490,
  '00559570': 554,
  '006408': 110,
  '008304': 145,
  '008763': 60,
  '009310': 571.53,
  '010062': 88.8,
  '010093': 56.35,
  '0101177': 330,
  '0102010': 179.4,
  '0102011': 132,
  '0102012': 188.5,
  '0102034': 214.9,
  '0102035': 173.29,
  '010575': 220.04,
  '010578': 211.46,
};
