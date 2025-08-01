#!/bin/bash
set -e

echo "🔧 Attempting to fix npm installation issues..."

# Remove potentially corrupted files
rm -rf node_modules package-lock.json
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Reinstall with forced resolution
npm install --legacy-peer-deps --force

# Generate fresh lockfile
npm install --package-lock-only

echo "✅ NPM installation fixed"