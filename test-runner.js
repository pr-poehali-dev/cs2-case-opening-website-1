const { execSync } = require('child_process');

try {
  console.log('Running vitest tests...\n');
  const output = execSync('bunx vitest run', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  console.log(output);
} catch (error) {
  console.log(error.stdout);
  console.log(error.stderr);
  process.exit(error.status);
}
