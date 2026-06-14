# ── Stage 1: Dependencies ──────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files only (better layer caching)
COPY package*.json ./
RUN npm ci --frozen-lockfile && npm cache clean --force

# ── Stage 2: Build ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Bring in installed deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source (respects .dockerignore)
COPY . .

# Build args for environment injection at build time
ARG VITE_API_URL=/api
ARG VITE_SOCKET_URL=http://localhost:5000
ARG VITE_STRIPE_PUBLIC_KEY=""
ARG VITE_GOOGLE_CLIENT_ID=""

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# TypeScript check + Vite production build
RUN npm run build

# ── Stage 3: Production runtime (Nginx) ───────────────────────────────────────
FROM nginx:1.25-alpine AS runner

# Security: drop to non-root
RUN addgroup -g 1001 -S nginx_group && \
    adduser  -u 1001 -S nginx_user -G nginx_group

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config: SPA routing + gzip + security headers
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Adjust nginx dirs for non-root
RUN chown -R nginx_user:nginx_group /usr/share/nginx/html && \
    chown -R nginx_user:nginx_group /var/cache/nginx && \
    chown -R nginx_user:nginx_group /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown nginx_user:nginx_group /var/run/nginx.pid

USER nginx_user
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
