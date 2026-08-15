FROM node:22.13.0-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PUBLIC_PORT=3000

COPY server.mjs ./server.mjs

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=12 CMD ["node", "-e", "process.exit(0)"]

ENTRYPOINT ["node", "server.mjs"]
