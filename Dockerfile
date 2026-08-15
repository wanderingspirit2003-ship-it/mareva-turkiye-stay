FROM node:22.13.0-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PUBLIC_PORT=3000

COPY server.mjs ./server.mjs

EXPOSE 3000

CMD ["node", "server.mjs"]
