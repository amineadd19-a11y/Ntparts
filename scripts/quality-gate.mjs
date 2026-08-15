import { spawnSync } from 'node:child_process';

const checks = [
  ['catalog', ['scripts/validate-catalog.mjs']],
  ['type-check', ['node_modules/typescript/bin/tsc', '--noEmit']],
  ['lint', ['node_modules/eslint/bin/eslint.js', '.']],
];

for (const [name, args] of checks) {
  console.log(`\n=== ${name} ===`);
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`QUALITY GATE FAILED: ${name}`);
    process.exit(result.status || 1);
  }
}

console.log('\nQUALITY GATE PASSED');
