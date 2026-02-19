# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npx nx build regression-ui-regression-ui

# Stage 2: Production
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/regression-ui/regression-ui/.next/standalone ./
COPY --from=builder /app/apps/regression-ui/regression-ui/.next/static ./apps/regression-ui/regression-ui/.next/static
COPY --from=builder /app/apps/regression-ui/regression-ui/public ./apps/regression-ui/regression-ui/public

EXPOSE 3000

CMD ["node", "apps/regression-ui/regression-ui/server.js"]
