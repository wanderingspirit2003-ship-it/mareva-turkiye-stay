FROM node:22.13.0-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22.13.0-slim AS build

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.13.0-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80
ENV PUBLIC_PORT=80
ENV VINEXT_PORT=3001

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app ./

EXPOSE 80 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=12 CMD curl -fsS http://127.0.0.1/health || exit 1

CMD ["node", "server.mjs"]
