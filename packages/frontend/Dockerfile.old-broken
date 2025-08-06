# Production Dockerfile for Werewolf Frontend
FROM --platform=linux/amd64 node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache python3 make g++ git libc6-compat

WORKDIR /app

# Force npm to use platform-specific resolution
ENV npm_config_force=true
ENV npm_config_legacy_peer_deps=true

# Install global packages with specific versions
RUN npm install -g npm@10.2.4 turbo@1.12.4

# Copy root package files first
COPY package.json package-lock.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./

# Create package directories
RUN mkdir -p packages/frontend packages/shared

# Copy package.json files
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/

# Debug: Print package structure
RUN echo "=== Package Structure ===" && \
    ls -la && \
    echo "=== Root package.json ===" && \
    cat package.json | grep -A5 '"workspaces"' && \
    echo "=== NPM Version ===" && \
    npm --version && \
    echo "=== Node Version ===" && \
    node --version

# Install with detailed logging
RUN npm ci --workspaces --include-workspace-root --omit=dev --loglevel=verbose || \
    (echo "=== NPM CI Failed, trying alternative approach ===" && \
     npm install --workspaces --include-workspace-root --omit=dev --legacy-peer-deps)

# Clean cache after successful install
RUN npm cache clean --force

# Builder stage
FROM base AS builder

# Install all dependencies for building
RUN npm ci --workspaces --include-workspace-root --loglevel=verbose

# Copy source code
COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared

# Build shared package
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

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1

CMD ["node", "packages/frontend/server.js"]