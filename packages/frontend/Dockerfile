# Production Dockerfile for Werewolf Frontend
FROM --platform=linux/amd64 node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache python3 make g++ git libc6-compat

WORKDIR /app

# Force npm to use platform-specific resolution
ENV npm_config_force=true
ENV npm_config_legacy_peer_deps=true

# Install global packages with specific versions
RUN npm install -g npm@10.2.4

# Copy only frontend and shared package files (avoid workspace complexity)
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/
COPY tsconfig.base.json ./

# Copy root package-lock.json (essential for npm ci in monorepo)
COPY package-lock.json ./

# Create a temporary package.json for just frontend and shared
RUN echo '{"name": "werewolf-frontend-build", "private": true, "workspaces": ["packages/frontend", "packages/shared"]}' > package.json

# Debug: Print package structure
RUN echo "=== Package Structure ===" && \
    ls -la && \
    echo "=== Temp package.json ===" && \
    cat package.json && \
    echo "=== NPM Version ===" && \
    npm --version

# Install production dependencies only
RUN npm ci --workspaces --omit=dev --loglevel=verbose || \
    npm install --workspaces --omit=dev --legacy-peer-deps

# Clean cache after successful install
RUN npm cache clean --force

# Builder stage
FROM base AS builder

# Install all dependencies for building (including dev dependencies)
RUN npm ci --workspaces --loglevel=verbose || \
    npm install --workspaces --legacy-peer-deps

# Copy source code
COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared

# Build shared package first
WORKDIR /app/packages/shared
RUN npm run build || echo "Shared build skipped"

# Build frontend
WORKDIR /app/packages/frontend
RUN npm run build

# Production stage with minimal image
FROM --platform=linux/amd64 node:18-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Only copy necessary files
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/.next/static ./packages/frontend/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/public ./packages/frontend/public

USER nodejs
EXPOSE 3000

# Simple health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:3000/', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]