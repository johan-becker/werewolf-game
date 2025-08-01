#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

console.log('🔍 Platform Check:');
console.log(`   OS: ${os.platform()} (${os.arch()})`);
console.log(`   Node: ${process.version}`);
console.log(`   NPM: ${execSync('npm --version').toString().trim()}`);

// Warn if developing on ARM64
if (os.arch() === 'arm64' && !process.env.CI) {
  console.warn(`
⚠️  WARNING: Developing on ARM64 architecture
   Your lockfile may include platform-specific packages.
   
   Run 'npm run docker:build' to test linux/amd64 compatibility
   before pushing to ensure CI builds succeed.
`);
}