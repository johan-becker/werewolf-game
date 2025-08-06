# Production Dockerfile for Werewolf Backend
FROM node:18-alpine AS base

# Install dependencies needed for building native extensions
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy root package files (package-lock.json is essential for monorepo npm ci)
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/
COPY scripts/ ./scripts/

# Install ALL dependencies first (including dev) for workspace setup
RUN npm ci --workspaces --include-workspace-root && npm cache clean --force

# Builder stage
FROM base AS builder

# Install all dependencies (including dev) for building
RUN npm ci --workspaces --include-workspace-root

# Copy source code
COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared

# Build the shared package first
WORKDIR /app/packages/shared
RUN npm run build || echo "Shared build not configured yet"

# Build the backend application
WORKDIR /app/packages/backend
RUN npm run db:generate || echo "Prisma not configured yet"
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy root package files (package-lock.json is essential for monorepo npm ci)
COPY package*.json ./
COPY turbo.json ./
COPY packages/backend/package.json ./packages/backend/
COPY packages/shared/package.json ./packages/shared/
COPY scripts/ ./scripts/

# Copy built shared package FIRST (needed for workspace resolution)
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/package.json ./packages/shared/

# Install production dependencies (after shared package is available)
RUN npm ci --workspaces --include-workspace-root --omit=dev && npm cache clean --force

# Copy built backend application
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/prisma ./packages/backend/prisma

# Copy necessary files
COPY --chown=nodejs:nodejs packages/backend/package.json ./packages/backend/

WORKDIR /app/packages/backend

# Generate Prisma client
RUN npx prisma generate

USER nodejs

EXPOSE 3000 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "dist/server.js"]