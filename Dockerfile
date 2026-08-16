FROM node:22.13.0-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PUBLIC_PORT=3000

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/*

COPY server.mjs ./server.mjs

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=12 CMD curl -fsS http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.mjs"]
