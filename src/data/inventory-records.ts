/**
 * Live stock is intentionally reset. Historical Inventaire.pdf tuples remain
 * in Git history and the inventory-records-*.ts archive files, but are not
 * loaded as current stock until a fresh, dated inventory is supplied.
 */
export const INVENTORY_RECORDS: readonly [string, number][] = [];
