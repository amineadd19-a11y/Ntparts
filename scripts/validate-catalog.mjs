import fs from 'node:fs';
import { URL } from 'node:url';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const file = read('../src/data/catalog.ts');
const coreFile = read('../src/data/catalog-core.ts');
const imagesFile = read('../src/data/catalog-images.ts');
const oemFile = read('../src/data/catalog-oem.ts');
const sourceBackedFile = read('../src/data/catalog-source-backed.ts');
const renparFile = read('../src/data/catalog-renpar.ts');
const suppliedDafFile = read('../src/data/catalog-supplied-daf.ts');
const errors = [];
const warnings = [];

const registryMatch = file.match(/const OEM_REFERENCE_REGISTRY(?:\s*:\s*[^=]+)?\s*=\s*\[[\s\S]*?\n\];/);
if (!registryMatch) errors.push('Legacy OEM reference registry not found.');
const registryBody = registryMatch?.[0].split('= [', 2)[1] || '';
const registryRecords = registryBody.match(/\{[\s\S]*?\}/g) || [];
if (!registryRecords.length) errors.push('Legacy OEM reference registry is empty.');

function validateRecord(record, label) {
  if (!/modelIds:\s*\[[^\]]*\]/.test(record) && label === 'legacy registry') {
    errors.push('Every legacy OEM record must declare modelIds; an empty array means exact fitment is not proven.');
  }
  const url = record.match(/sourceUrl:\s*'([^']+)'/)?.[1];
  if (label === 'catalog-oem.ts' && !url) {
    errors.push('Every catalog-oem.ts reference record must declare sourceUrl provenance.');
  }
  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') errors.push(`Non-HTTPS source in ${label}: ${url}`);
    } catch {
      errors.push(`Invalid source URL in ${label}: ${url}`);
    }
  }
  if (label === 'legacy registry' && !/evidence:\s*'(official|parts-catalog|secondary)'/.test(record)) {
    errors.push('Every legacy OEM record must declare evidence level.');
  }
}

for (const record of registryRecords) validateRecord(record, 'legacy registry');

// Validate the actual reference registry consumed by the live catalogue.
// The legacy registry above is retained for backward compatibility but is not
// the sole source of truth: catalog-oem.ts and source-backed imports feed live data.
const oemRecords = oemFile.match(/\{[\s\S]*?referenceNumber:\s*'[^']+'[\s\S]*?sourceUrl:\s*'[^']+'[\s\S]*?\}/g) || [];
if (!oemRecords.length) errors.push('No source-backed records found in catalog-oem.ts.');
for (const record of oemRecords) {
  validateRecord(record, 'catalog-oem.ts');
  const ref = record.match(/referenceNumber:\s*'([^']+)'/)?.[1]?.trim();
  if (!ref) errors.push('Empty referenceNumber in catalog-oem.ts.');
}
if (!/export const SOURCE_BACKED_PARTS:\s*Part\[\]\s*=\s*\[/.test(sourceBackedFile)) {
  errors.push('Live source-backed catalogue export missing.');
}
if (!/export const RENPAR_CATALOG_PARTS/.test(renparFile)) errors.push('RENPAR catalogue export missing.');
if (!/export const SUPPLIED_DAF_CATALOG_PARTS/.test(suppliedDafFile)) errors.push('Supplied DAF catalogue export missing.');
if (!/\{\s*\[\.\.\.coreOemBacked,\s*\.\.\.sourceBackedWithPhotos,\s*\.\.\.suppliedDafWithPhotos,\s*\.\.\.renparWithPhotos\s*\]/.test(file)) {
  errors.push('Live merge no longer includes all expected source-backed catalogue feeds.');
}

// Check provenance URLs and non-empty reference values in source-backed imports.
const sourceBackedUrls = [...sourceBackedFile.matchAll(/sourceUrl:\s*'([^']+)'/g)].map((m) => m[1]);
if (!sourceBackedUrls.length) errors.push('No sourceUrl provenance found in source-backed catalogue.');
for (const url of sourceBackedUrls) {
  try {
    if (new URL(url).protocol !== 'https:') errors.push(`Non-HTTPS source in catalog-source-backed.ts: ${url}`);
  } catch {
    errors.push(`Invalid source URL in catalog-source-backed.ts: ${url}`);
  }
}
const sourceBackedRefs = [...sourceBackedFile.matchAll(/number:\s*'([^']*)'/g)].map((m) => m[1].trim());
if (!sourceBackedRefs.length) errors.push('No OEM/reference numbers found in source-backed catalogue.');
if (sourceBackedRefs.some((ref) => !ref)) errors.push('Empty OEM/reference number in source-backed catalogue.');

// Synthetic / placeholder patterns must never appear in catalogue source files.
for (const pattern of [
  /A000105\d{3}/,
  /\bREN7\d{3}\b/,
  /\bIVE7\d{3}\b/,
  /id:\s*'xr-hq(?:-|[0-9])/,
  /FAKE-OEM/,
  /TODO-REF/,
  /placeholder-oem/i,
]) {
  if ([file, coreFile, oemFile, sourceBackedFile, renparFile, suppliedDafFile].some((source) => pattern.test(source))) {
    errors.push(`Synthetic placeholder pattern detected: ${pattern}`);
  }
}

// Real product photos only — ban stock photo hosts.
for (const host of ['images.unsplash.com', 'images.pexels.com', 'cdn.pixabay.com', 'via.placeholder.com']) {
  if (imagesFile.includes(host) || coreFile.includes(host) || file.includes(host)) {
    errors.push(`Stock/placeholder image host not allowed: ${host}`);
  }
}
if (!/MANN-FILTER \/ mann-filter\.com/.test(imagesFile)) {
  errors.push('Official MANN-FILTER photo attribution missing from catalog-images.ts');
}

const refs = [
  ...registryBody.matchAll(
    /manufacturerId:\s*'([^']+)'[\s\S]*?partTemplateSlug:\s*'([^']+)'[\s\S]*?referenceNumber:\s*'([^']+)'[\s\S]*?modelIds:\s*\[([^\]]*)\]/g,
  ),
].map((m) => ({
  manufacturer: m[1],
  template: m[2],
  ref: m[3].toLowerCase().replace(/[^a-z0-9]/g, ''),
  models: m[4].replace(/['\s]/g, '').split(',').filter(Boolean).sort().join(','),
}));

const seen = new Set();
for (const item of refs) {
  const key = `${item.manufacturer}|${item.template}|${item.ref}|${item.models}`;
  if (seen.has(key)) warnings.push(`Duplicate exact OEM registry record: ${key}`);
  seen.add(key);
}

if (!fs.existsSync(new URL('../src/lib/catalog/pipeline.ts', import.meta.url))) {
  errors.push('Catalogue merge pipeline module missing (src/lib/catalog/pipeline.ts).');
}
if (!fs.existsSync(new URL('../src/lib/catalog/normalize.ts', import.meta.url))) {
  errors.push('Reference normalize module missing (src/lib/catalog/normalize.ts).');
}

const sourceUrls = [...file.matchAll(/sourceUrl:\s*'https?:\/\/[^']+'/g)].length;
const crossRefs = (file.match(/id:\s*'xr-[^']+'/g) || []).length;
const unscoped = refs.filter((item) => !item.models).length;

if (errors.length) {
  console.error('CATALOG VALIDATION FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('CATALOG VALIDATION OK');
console.log(`- ${refs.length} legacy registry records checked`);
console.log(`- ${oemRecords.length} live catalog-oem reference records checked`);
console.log(`- ${sourceBackedRefs.length} source-backed OEM/reference values checked`);
console.log(`- ${sourceUrls} legacy-registry source URLs`);
console.log(`- ${sourceBackedUrls.length} source-backed import URLs`);
console.log(`- ${crossRefs} legacy cross-reference records`);
console.log(`- ${unscoped} legacy OEM records without proven exact fitment (not treated as compatibility)`);
console.log('- Synthetic placeholder patterns: none detected');
console.log('- Image policy: real manufacturer photos only (no stock hosts)');
console.log('- Fitment policy: OEMs remain source-listed unless exact application is explicitly proven');
console.log('- Live merge feeds + merge pipeline + normalize modules: present');
for (const warning of warnings) console.warn(`WARN: ${warning}`);
