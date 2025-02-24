# ---- Base Node ----
FROM node:18-alpine AS base
WORKDIR /app
# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# ---- Dependencies ----
FROM base AS deps
# Install dependencies needed for node-gyp and build
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production
# If using Yarn, replace with:
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile --production

# ---- Builder ----
FROM base AS builder
# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy app source
COPY . .

# Set build-time environment variables for optimization
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build
# If using Yarn, replace with:
# RUN yarn build

# ---- Production ----
FROM base AS runner
WORKDIR /app

# Create a non-root user to run the app and own app files
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Set runtime environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy only necessary files for production
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Leverage output standalone to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create and set permissions for the cache directory
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]