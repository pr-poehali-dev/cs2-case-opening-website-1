import { spawn } from 'child_process';

const vitest = spawn('bunx', ['vitest', 'run'], {
  stdio: 'inherit',
  shell: true
});

vitest.on('close', (code) => {
  process.exit(code);
});
