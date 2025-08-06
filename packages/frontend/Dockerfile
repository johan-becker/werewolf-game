# Production Dockerfile for Werewolf Frontend
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache python3 make g++ git libc6-compat

WORKDIR /app

# Install global packages
RUN npm install -g turbo

# Copy only frontend and shared package files (avoid workspace complexity)
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/
COPY tsconfig.base.json ./

# Copy root package-lock.json (essential for npm ci in monorepo)
COPY package-lock.json ./

# Create a temporary package.json for just frontend and shared
RUN echo '{"name": "werewolf-frontend-build", "private": true, "workspaces": ["packages/frontend", "packages/shared"]}' > package.json

# Install dependencies
RUN npm ci --workspaces --include-workspace-root --omit=dev && npm cache clean --force

# Builder stage
FROM base AS builder

# Install all dependencies for building
RUN npm ci --workspaces --include-workspace-root

# Copy source code
COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared

# Build shared package if it exists
WORKDIR /app/packages/shared
RUN npm run build || echo "Shared package build not configured, skipping"

# Build frontend
WORKDIR /app/packages/frontend
RUN npm run build

# Production stage with minimal image
FROM node:18-alpine AS production

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Only copy necessary files
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/.next/static ./packages/frontend/.next/static
# Copy public directory
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/public ./packages/frontend/public

USER nodejs
EXPOSE 3000

# Simple health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))" || exit 1

CMD ["node", "server.js"]
EOF < /dev/null