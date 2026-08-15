import fs from 'node:fs';
import { URL } from 'node:url';

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), 'utf8');
const catalog = read('../src/data/catalog.ts');
const oem = read('../src/data/catalog-oem.ts');
const images = read('../src/data/catalog-images.ts');

const errors = [];
const warnings = [];

function checkHttpsUrls(source, label) {
  for (const match of source.matchAll(/https?:\/\/[^'`\s)]+/g)) {
    try {
      const parsed = new URL(match[0]);
      if (parsed.protocol !== 'https:') errors.push(`${label}: non-HTTPS URL ${match[0]}`);
    } catch {
      errors.push(`${label}: invalid URL ${match[0]}`);
    }
  }
}

// Main OEM registry: explicit fitment + provenance are mandatory.
const registryMatch = catalog.match(/const OEM_REFERENCE_REGISTRY:[\s\S]*?= \[[\s\S]*?\n\];/);
if (!registryMatch) errors.push('OEM reference registry not found in catalog.ts.');
const registryBody = registryMatch?.[0].split('= [', 2)[1] || '';
const registryRecords = registryBody.match(/\{[\s\S]*?\}/g) || [];
if (!registryRecords.length) errors.push('OEM reference registry is empty.');

for (const record of registryRecords) {
  if (!/modelIds:\s*\[[^\]]+\]/.test(record)) errors.push('Every catalog.ts OEM record must declare modelIds.');
  const url = record.match(/sourceUrl:\s*'([^']+)'/)?.[1];
  if (!url) errors.push('Every catalog.ts OEM record must declare sourceUrl.');
  else {
    try { if (new URL(url).protocol !== 'https:') errors.push(`Non-HTTPS OEM source: ${url}`); }
    catch { errors.push(`Invalid OEM source URL: ${url}`); }
  }
  if (!/evidence:\s*'(official|parts-catalog|secondary)'/.test(record)) errors.push('Every catalog.ts OEM record must declare evidence level.');
}

// Secondary verified registry: every record must have a concrete part number and source.
const oemRecords = oem.match(/\{[\s\S]*?\n\s*\},/g) || [];
if (!oemRecords.length) errors.push('catalog-oem.ts registry is empty.');
const bareBrand = /^(?:EBS|FEBI|TEXTAR|WABCO|HALDEX|KNORR|BOSCH|MAHLE|MANN|SAMPA|COJALI|ELRING|LEMA|HENGST|AJUSA|REINZ)$/i;
const oemKeys = new Set();
for (const record of oemRecords) {
  const manufacturer = record.match(/manufacturerId:\s*'([^']+)'/)?.[1];
  const template = record.match(/partTemplateSlug:\s*'([^']+)'/)?.[1];
  const ref = record.match(/referenceNumber:\s*'([^']+)'/)?.[1];
  const source = record.match(/sourceUrl:\s*'([^']+)'/)?.[1];
  if (!manufacturer || !template || !ref || !source) errors.push('Every catalog-oem.ts record must declare manufacturerId, partTemplateSlug, referenceNumber and sourceUrl.');
  if (ref && bareBrand.test(ref.trim())) errors.push(`Bare brand used as reference number: ${ref}`);
  const alternates = record.match(/alternateNumbers:\s*\[([\s\S]*?)\]/)?.[1] || '';
  for (const value of [...alternates.matchAll(/'([^']+)'/g)].map((m) => m[1])) {
    if (bareBrand.test(value.trim())) errors.push(`Bare brand used as alternate number: ${value}`);
  }
  if (manufacturer && template && ref) {
    const key = `${manufacturer}|${template}|${ref.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    if (oemKeys.has(key)) warnings.push(`Duplicate verified OEM record: ${key}`);
    oemKeys.add(key);
  }
  if (source) checkHttpsUrls(source, `catalog-oem.ts ${ref || 'record'}`);
}

// Detect known synthetic placeholders across both registries.
for (const pattern of [/A000105\d{3}/, /\bREN7\d{3}\b/, /\bIVE7\d{3}\b/, /id:\s*'xr-hq(?:-|[0-9])/]) {
  if (pattern.test(catalog) || pattern.test(oem)) errors.push(`Synthetic placeholder pattern detected: ${pattern}`);
}

// Cross-registry duplicate check on normalized OEM/reference pairs.
const catalogRefs = [...registryBody.matchAll(/manufacturerId:\s*'([^']+)'[\s\S]*?partTemplateSlug:\s*'([^']+)'[\s\S]*?referenceNumber:\s*'([^']+)'/g)]
  .map((m) => `${m[1]}|${m[2]}|${m[3].toLowerCase().replace(/[^a-z0-9]/g, '')}`);
for (const key of catalogRefs) if (oemKeys.has(key)) warnings.push(`Reference appears in both registries; verify intentional merge: ${key}`);

// Image registry: URLs must be HTTPS and every fallback image must have attribution metadata.
checkHttpsUrls(images, 'catalog-images.ts');
if (!/source:\s*'MANN-FILTER \/ mann-filter\.com'/.test(images)) errors.push('MANN image records must retain official source attribution.');
if (!/source:\s*'reference'/.test(images)) errors.push('Fallback images must be explicitly marked as reference imagery.');
const imageUrls = [...images.matchAll(/https:\/\/[^'`\s)]+/g)].map((m) => m[0]);
if (!imageUrls.length) errors.push('No product image URLs found.');

const sourceUrls = [...catalog.matchAll(/sourceUrl:\s*'https?:\/\/[^']+'/g)].length;
const crossRefs = (catalog.match(/id:\s*'xr-[^']+'/g) || []).length;

if (errors.length) {
  console.error('CATALOG VALIDATION FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('CATALOG VALIDATION OK');
console.log(`- ${catalogRefs.length} source-listed OEM reference records`);
console.log(`- ${oemRecords.length} verified cross-reference records`);
console.log(`- ${sourceUrls} catalog OEM source URLs`);
console.log(`- ${crossRefs} catalog cross-reference records`);
console.log(`- ${imageUrls.length} image URLs checked`);
console.log('- Synthetic placeholder patterns: none detected');
console.log('- Fitment policy: source-listed OEMs require explicit application scope');
for (const warning of warnings) console.warn(`WARN: ${warning}`);
