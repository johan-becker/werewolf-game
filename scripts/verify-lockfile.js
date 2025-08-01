#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const lockfilePath = path.join(process.cwd(), 'package-lock.json');

if (!fs.existsSync(lockfilePath)) {
  console.error('❌ No package-lock.json found!');
  process.exit(1);
}

const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));

// Check for platform-specific packages
const platformSpecific = [];

function checkDependencies(deps, prefix = '') {
  Object.entries(deps || {}).forEach(([name, info]) => {
    if (info.os || info.cpu || info.hasInstallScript) {
      platformSpecific.push(`${prefix}${name}`);
    }
    if (info.dependencies) {
      checkDependencies(info.dependencies, `${prefix}${name} > `);
    }
  });
}

checkDependencies(lockfile.dependencies);
checkDependencies(lockfile.packages);

if (platformSpecific.length > 0) {
  console.warn(`
⚠️  Found platform-specific packages:
${platformSpecific.map(p => `   - ${p}`).join('\n')}

These may cause issues in CI/CD. Consider:
1. Running 'npm run ci:prepare' before committing
2. Testing with 'npm run docker:build'
`);
} else {
  console.log('✅ Lockfile verification passed - no platform-specific packages detected');
}