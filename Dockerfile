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
ENV PORT=3000

COPY --from=build /app ./

EXPOSE 3000

CMD ["sh", "-c", "npx vinext start --hostname 0.0.0.0 --port ${PORT:-3000}"]
