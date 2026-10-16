#!/usr/bin/env node
/**
 * Evidence-quality audit for catalogue source links.
 *
 * This is intentionally report-only: it never changes product data or upgrades
 * a reference's verification status. Root/homepage links are weak provenance
 * because they do not identify the exact product or cross-reference.
 */
import fs from 'node:fs';
import { URL } from 'node:url';

const files = [
  'src/data/catalog.ts',
  'src/data/catalog-oem.ts',
  'src/data/catalog-source-backed.ts',
];

const all = [];
const errors = [];

for (const path of files) {
  if (!fs.existsSync(path)) {
    errors.push(`Missing catalogue source file: ${path}`);
    continue;
  }

  const content = fs.readFileSync(path, 'utf8');
  const matches = [...content.matchAll(/sourceUrl:\s*['"]([^'"]+)['"]/g)];

  for (const match of matches) {
    const raw = match[1];
    try {
      const parsed = new URL(raw);
      if (parsed.protocol !== 'https:') {
        errors.push(`Non-HTTPS source in ${path}: ${raw}`);
        continue;
      }
      const isHomepage = parsed.pathname === '/' && !parsed.search && !parsed.hash;
      all.push({ file: path, url: parsed.href, host: parsed.hostname, isHomepage });
    } catch {
      errors.push(`Invalid source URL in ${path}: ${raw}`);
    }
  }
}

const uniqueUrls = new Set(all.map((item) => item.url));
const homepageLinks = all.filter((item) => item.isHomepage);
const homepageHosts = new Map();
for (const item of homepageLinks) {
  const key = `${item.file} | ${item.url}`;
  homepageHosts.set(key, (homepageHosts.get(key) || 0) + 1);
}

console.log('NTParts OEM source-quality audit (report only)');
console.log(`- Source URL occurrences: ${all.length}`);
console.log(`- Unique source URLs: ${uniqueUrls.size}`);
console.log(`- Homepage/root URLs needing stronger product-level evidence: ${homepageLinks.length}`);
console.log(`- Invalid/non-HTTPS source links: ${errors.length}`);

if (homepageLinks.length) {
  console.log('\\nWEAK PROVENANCE — replace with a product page, searchable catalogue result, or document page when possible:');
  for (const [key, count] of [...homepageHosts.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`- ${key}${count > 1 ? ` (used ${count} times)` : ''}`);
  }
}

if (errors.length) {
  console.error('\\nSOURCE URL ERRORS:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('\\nNo malformed or non-HTTPS source URLs found.');
}

console.log('\\nPolicy: this audit does not prove OEM equivalence or VIN fitment; source-listed references remain source-listed.');
