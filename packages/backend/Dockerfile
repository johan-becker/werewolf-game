# Production Dockerfile for Backend
FROM node:18-alpine AS base

# Install dependencies needed for building native extensions
RUN apk add --no-cache python3 make g++ git

WORKDIR /app

# Install turbo globally
RUN npm install -g turbo

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.base.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Builder stage
FROM base AS builder

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY packages/backend ./packages/backend
COPY packages/shared ./packages/shared

# Build the application
WORKDIR /app/packages/backend
RUN npm run db:generate
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/shared/package*.json ./packages/shared/

RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder --chown=nodejs:nodejs /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared/dist ./packages/shared/dist

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