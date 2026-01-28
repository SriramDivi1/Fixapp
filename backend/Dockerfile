# Backend Dockerfile
FROM node:20-alpine AS builder

# Install pnpm for faster package management
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner

# Install pnpm
RUN npm install -g pnpm

# Create app user
RUN addgroup --system --gid 1001 fixapp
RUN adduser --system --uid 1001 fixapp

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder --chown=fixapp:fixapp /app/dist ./dist

# Switch to non-root user
USER fixapp

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]