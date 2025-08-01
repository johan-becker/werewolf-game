# Production Dockerfile for Werewolf Frontend
FROM node:18-alpine AS base

WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy package files for workspace setup
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies with workspace support
RUN npm ci --workspaces --include-workspace-root --omit=dev && npm cache clean --force

# Builder stage
FROM base AS builder

# Install all dependencies (including dev) for building
RUN npm ci --workspaces --include-workspace-root

# Copy source code
COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared

# Build the shared package first
WORKDIR /app/packages/shared
RUN npm run build || echo "Shared build not configured yet"

# Build the frontend application
WORKDIR /app/packages/frontend
RUN npm run build

# Production stage  
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
COPY turbo.json ./
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install production dependencies only
RUN npm ci --workspaces --include-workspace-root --omit=dev && npm cache clean --force

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/.next/static ./packages/frontend/.next/static
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/public ./packages/frontend/public
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/dist ./packages/shared/dist

# Copy Next.js config
COPY --chown=nodejs:nodejs packages/frontend/next.config.js ./packages/frontend/

WORKDIR /app/packages/frontend

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

CMD ["node", "server.js"]