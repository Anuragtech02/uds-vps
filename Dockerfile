FROM node:18-alpine AS base

# Install dependencies - only production for the final stage if possible
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# This installs ALL dependencies, including devDependencies
RUN npm ci --force

# Builder stage - build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production dependencies stage - create a pruned node_modules
FROM base AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Install ONLY production dependencies
RUN npm ci --omit=dev --force # or 'npm install --production' for older npm

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.next ./.next
# Copy package.json to run 'npm start', and the pruned production node_modules
COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json ./

RUN chown -R nextjs:nodejs .next # May need to chown other copied files too if running as nextjs

USER nextjs

EXPOSE 3000
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]