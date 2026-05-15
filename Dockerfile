# syntax=docker.io/docker/dockerfile:1
# NUVE — production Dockerfile for Coolify (Next.js 14 App Router, standalone output)
# Three stages: deps → builder → runner. Final image ~180 MB.

# ----------------------------------------------------------------------------
# Stage 1 — Base
# ----------------------------------------------------------------------------
FROM node:20-alpine AS base
# libc6-compat needed for some native deps (sharp etc.)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ----------------------------------------------------------------------------
# Stage 2 — Dependencies (cached on package.json change)
# ----------------------------------------------------------------------------
FROM base AS deps

# Copy lockfile + package.json only — maximises Docker layer cache.
# If you don't have a lockfile yet, run `npm install` once locally to
# generate package-lock.json before building.
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

# ----------------------------------------------------------------------------
# Stage 3 — Builder
# ----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry during build.
ENV NEXT_TELEMETRY_DISABLED=1

# Build-time env vars (public — these get inlined into the bundle).
# Coolify injects runtime env vars at container start; for NEXT_PUBLIC_*
# values you need them present at build time too. Pass via Coolify
# "Build args" if needed.
# ARG NEXT_PUBLIC_SITE_URL
# ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# ----------------------------------------------------------------------------
# Stage 4 — Runtime
# ----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Non-root user for runtime — safer in shared hosting like Coolify.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy public assets and the standalone build output.
# Standalone bundles only the necessary node_modules — small image.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Standalone bundles a `server.js` at the project root that boots Next.
CMD ["node", "server.js"]
