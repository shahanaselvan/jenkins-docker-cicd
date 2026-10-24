FROM node:20-alpine

WORKDIR /usr/src/app

# Copy manifest first so dependency layers are cached between builds
COPY package.json ./
RUN npm install --omit=dev

COPY app ./app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Run as the non-root user that ships with the node image
USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "app/server.js"]
