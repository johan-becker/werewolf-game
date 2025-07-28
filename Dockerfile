FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER nodejs

EXPOSE 3000

CMD ["npm", "start"]