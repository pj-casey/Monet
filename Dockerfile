# Monet — multi-stage Docker build
# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/ packages/
COPY apps/web/ apps/web/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @monet/web build

# Stage 2: Build the API
FROM node:20-alpine AS api-build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/ packages/
COPY apps/api/ apps/api/
RUN pnpm install --frozen-lockfile

# Stage 3: Production runtime
FROM node:20-alpine AS runtime
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy API source + deps
COPY --from=api-build /app/apps/api/ apps/api/
COPY --from=api-build /app/node_modules/ node_modules/
COPY --from=api-build /app/packages/ packages/
COPY --from=api-build /app/pnpm-workspace.yaml pnpm-workspace.yaml
COPY --from=api-build /app/package.json package.json

# Copy frontend build output into API public directory
COPY --from=frontend-build /app/apps/web/dist/ apps/api/public/

# Install tsx for running TypeScript
RUN pnpm install -g tsx

WORKDIR /app/apps/api
EXPOSE 3001
ENV PORT=3001

# Create data directory for SQLite
RUN mkdir -p /app/apps/api/data

CMD ["tsx", "src/index.ts"]
