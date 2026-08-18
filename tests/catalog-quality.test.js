const path = require('node:path');
const { spawnSync } = require('node:child_process');

describe('NTParts catalog quality', () => {
  const root = path.resolve(__dirname, '..');

  test('catalog validator passes', () => {
    const result = spawnSync(process.execPath, ['scripts/validate-catalog.mjs'], {
      cwd: root,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(`${result.stdout}\n${result.stderr}`).toContain('CATALOG VALIDATION OK');
  });
});
