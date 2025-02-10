FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies required for Prisma
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    openssl-libs-static

# Install dependencies only when needed
COPY package*.json ./
RUN npm ci

# Copy all files
COPY . .

# Generate Prisma client
ENV PRISMA_CLI_BINARY_TARGETS=native
RUN npx prisma generate

# Build Next.js app
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Install production dependencies for Prisma
RUN apk add --no-cache \
    openssl \
    libc6-compat

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
