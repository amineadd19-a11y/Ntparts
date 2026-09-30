#!/usr/bin/env node
/**
 * Runs production quality stages sequentially with clear logging.
 * Exit non-zero on first failure so CI annotations show which stage broke.
 */
import { spawnSync } from 'node:child_process';

const stages = [
  { name: 'type-check', cmd: 'npm', args: ['run', 'type-check'] },
  { name: 'lint', cmd: 'npm', args: ['run', 'lint'] },
  { name: 'test', cmd: 'npm', args: ['test', '--', '--runInBand'] },
  { name: 'validate:catalog', cmd: 'npm', args: ['run', 'validate:catalog'] },
  { name: 'build', cmd: 'npm', args: ['run', 'build'] },
];

for (const stage of stages) {
  console.log(`\n======== QUALITY GATE: ${stage.name} ========\n`);
  const result = spawnSync(stage.cmd, stage.args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
  if (result.status !== 0) {
    console.error(`\nQUALITY GATE FAILED at stage: ${stage.name} (exit ${result.status})\n`);
    process.exit(result.status ?? 1);
  }
}

console.log('\n======== QUALITY GATE: ALL STAGES PASSED ========\n');
