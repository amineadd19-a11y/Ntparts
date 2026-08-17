/** Recovered line-level stock tuples from Inventaire.pdf. Nothing fabricated. */
import { INVENTORY_RECORDS_1 } from './inventory-records-1';
import { INVENTORY_RECORDS_2 } from './inventory-records-2';
import { INVENTORY_RECORDS_3 } from './inventory-records-3';
import { INVENTORY_RECORDS_4 } from './inventory-records-4';
import { INVENTORY_RECORDS_5 } from './inventory-records-5';
import { INVENTORY_RECORDS_6 } from './inventory-records-6';
import { INVENTORY_RECORDS_7 } from './inventory-records-7';
import { INVENTORY_RECORDS_8 } from './inventory-records-8';

export const INVENTORY_RECORDS: readonly [string, number][] = [
  ...INVENTORY_RECORDS_1,
  ...INVENTORY_RECORDS_2,
  ...INVENTORY_RECORDS_3,
  ...INVENTORY_RECORDS_4,
  ...INVENTORY_RECORDS_5,
  ...INVENTORY_RECORDS_6,
  ...INVENTORY_RECORDS_7,
  ...INVENTORY_RECORDS_8,
];
