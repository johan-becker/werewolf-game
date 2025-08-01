#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Preparing CI-compatible lockfile...');

// Backup current lockfile
const lockfilePath = path.join(process.cwd(), 'package-lock.json');
const backupPath = path.join(process.cwd(), 'package-lock.local.json');

if (fs.existsSync(lockfilePath)) {
  fs.copyFileSync(lockfilePath, backupPath);
  console.log('✅ Backed up local lockfile');
}

// Generate linux/amd64 lockfile using Docker
try {
  console.log('🐳 Generating CI lockfile with Docker (linux/amd64)...');
  
  execSync(`
    docker run --rm \
      --platform linux/amd64 \
      -v ${process.cwd()}:/app \
      -w /app \
      node:18-alpine \
      sh -c "npm ci --package-lock-only --force"
  `, { stdio: 'inherit' });
  
  console.log('✅ Generated CI-compatible lockfile');
  console.log('📝 Please commit the updated package-lock.json');
} catch (error) {
  console.error('❌ Failed to generate CI lockfile');
  console.error('💡 Make sure Docker is running and try again');
  
  // Restore backup if it exists
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, lockfilePath);
    console.log('🔄 Restored original lockfile');
  }
  
  process.exit(1);
}