const fs = require('node:fs');
const path = require('node:path');

describe('NTParts project smoke checks', () => {
  const root = path.resolve(__dirname, '..');

  test('required project files are present', () => {
    for (const file of [
      'package.json',
      'next.config.js',
      'tsconfig.json',
      'README.md',
      'scripts/validate-catalog.mjs',
      '.github/workflows/quality-gate.yml',
    ]) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
  });

  test('package scripts expose the quality checks', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    expect(pkg.scripts).toEqual(
      expect.objectContaining({
        build: expect.any(String),
        lint: expect.any(String),
        test: expect.any(String),
        'type-check': expect.any(String),
        'validate:catalog': expect.any(String),
        'quality-gate': expect.any(String),
      }),
    );
  });

  test('catalog data sources exist', () => {
    for (const file of [
      'src/data/catalog.ts',
      'src/data/catalog-core.ts',
      'src/data/catalog-oem.ts',
      'src/lib/catalog/pipeline.ts',
      'src/lib/ai/gemini.ts',
    ]) {
      expect(fs.existsSync(path.join(root, file))).toBe(true);
    }
  });
});
