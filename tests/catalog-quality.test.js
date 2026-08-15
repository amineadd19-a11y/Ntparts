const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

describe('NTParts catalog quality smoke checks', () => {
  const root = path.resolve(__dirname, '..');

  test('catalog data sources exist', () => {
    for (const file of [
      'src/data/catalog.ts',
      'src/data/catalog-oem.ts',
      'src/data/catalog-images.ts',
      'scripts/validate-catalog.mjs',
    ]) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
  });

  test('catalog validator passes', () => {
    const result = spawnSync(process.execPath, ['scripts/validate-catalog.mjs'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain('CATALOG VALIDATION OK');
  });
});
