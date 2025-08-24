# base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=s/96c55632-2a8b-4f28-9939-01e9e520acad-npm-cache,target=/root/.npm \
    npm ci
COPY . .
# build phase
RUN --mount=type=cache,id=s/96c55632-2a8b-4f28-9939-01e9e520acad-next-cache,target=/app/.next/cache \
    --mount=type=cache,id=s/96c55632-2a8b-4f28-9939-01e9e520acad-node-modules-cache,target=/app/node_modules/.cache \
    npm run build
# production phase
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
