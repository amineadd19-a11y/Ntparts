import fs from 'node:fs';
import { URL } from 'node:url';

const file = fs.readFileSync(new URL('../src/data/catalog.ts', import.meta.url), 'utf8');
const coreFile = fs.readFileSync(new URL('../src/data/catalog-core.ts', import.meta.url), 'utf8');
const errors = [];
const warnings = [];

const registryMatch = file.match(/const OEM_REFERENCE_REGISTRY(?:\s*:\s*[^=]+)?\s*=\s*\[[\s\S]*?\n\];/);
if (!registryMatch) errors.push('OEM reference registry not found.');
const registryBody = registryMatch?.[0].split('= [', 2)[1] || '';
const registryRecords = registryBody.match(/\{[\s\S]*?\}/g) || [];
if (!registryRecords.length) errors.push('OEM reference registry is empty.');

for (const record of registryRecords) {
  if (!/modelIds:\s*\[[^\]]*\]/.test(record))
    errors.push('Every OEM record must declare modelIds; an empty array means exact fitment is not proven.');
  const url = record.match(/sourceUrl:\s*'([^']+)'/)?.[1];
  if (!url) errors.push('Every OEM record must declare sourceUrl provenance.');
  else {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:') errors.push(`Non-HTTPS OEM source: ${url}`);
    } catch {
      errors.push(`Invalid OEM source URL: ${url}`);
    }
  }
  if (!/evidence:\s*'(official|parts-catalog|secondary)'/.test(record))
    errors.push('Every OEM record must declare evidence level.');
}

// Synthetic / placeholder patterns that must never appear
for (const pattern of [
  /A000105\d{3}/,
  /\bREN7\d{3}\b/,
  /\bIVE7\d{3}\b/,
  /id:\s*'xr-hq(?:-|[0-9])/,
  /FAKE-OEM/,
  /TODO-REF/,
  /placeholder-oem/i,
]) {
  if (pattern.test(file) || pattern.test(coreFile))
    errors.push(`Synthetic placeholder pattern detected: ${pattern}`);
}

const refs = [
  ...registryBody.matchAll(
    /manufacturerId:\s*'([^']+)'[\s\S]*?partTemplateSlug:\s*'([^']+)'[\s\S]*?referenceNumber:\s*'([^']+)'[\s\S]*?modelIds:\s*\[([^\]]*)\]/g,
  ),
].map((m) => ({
  manufacturer: m[1],
  template: m[2],
  ref: m[3].toLowerCase().replace(/[^a-z0-9]/g, ''),
  models: m[4]
    .replace(/['\s]/g, '')
    .split(',')
    .filter(Boolean)
    .sort()
    .join(','),
}));

const seen = new Set();
for (const item of refs) {
  const key = `${item.manufacturer}|${item.template}|${item.ref}|${item.models}`;
  if (seen.has(key)) warnings.push(`Duplicate exact OEM registry record: ${key}`);
  seen.add(key);
}

// Pipeline presence
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
console.log(`- ${refs.length} source-listed OEM reference records`);
console.log(`- ${sourceUrls} OEM source URLs`);
console.log(`- ${crossRefs} cross-reference records`);
console.log(`- ${unscoped} OEM records without proven exact fitment (not treated as compatibility)`);
console.log('- Synthetic placeholder patterns: none detected');
console.log('- Fitment policy: OEMs remain source-listed unless exact application is explicitly proven');
console.log('- Merge pipeline + normalize modules: present');
for (const warning of warnings) console.warn(`WARN: ${warning}`);
