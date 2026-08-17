/** Recovered line-level stock tuples from Inventaire.pdf. Nothing fabricated. */
import { INVENTORY_RECORDS_1 } from './inventory-records-1';
import { INVENTORY_RECORDS_2 } from './inventory-records-2';

export const INVENTORY_RECORDS: readonly [string, number][] = [
  ...INVENTORY_RECORDS_1,
  ...INVENTORY_RECORDS_2,
];
