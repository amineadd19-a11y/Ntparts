/**
 * Reference normalization utilities for NTParts catalogue.
 * Never invents data — only normalizes formatting for comparison.
 */

/** Strip spaces, hyphens, slashes, dots and lowercase for identity comparison. */
export function normalizeReference(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\-\/._]/g, '')
    .trim();
}

/** Soft normalize for display comparison (keep alphanumerics, collapse spaces). */
export function softNormalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[._\/]+/g, '-')
    .trim();
}

/** True when two references are the same after normalization. */
export function referencesMatch(a: string, b: string): boolean {
  const na = normalizeReference(a);
  const nb = normalizeReference(b);
  if (!na || !nb) return false;
  return na === nb;
}

/** Build a stable identity key from candidate reference strings. */
export function referenceIdentityKey(...candidates: Array<string | undefined | null>): string {
  const keys = candidates
    .filter((v): v is string => Boolean(v && String(v).trim()))
    .map((v) => normalizeReference(v))
    .filter(Boolean)
    .sort();
  return keys.join('|');
}
