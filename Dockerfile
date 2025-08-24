# base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=s/<your-service-id>-npm-cache,target=/root/.npm \
    npm ci
COPY . .
# build phase
RUN --mount=type=cache,id=s/<your-service-id>-next-cache,target=/app/.next/cache \
    --mount=type=cache,id=s/<your-service-id>-node-modules-cache,target=/app/node_modules/.cache \
    npm run build
# production phase
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
