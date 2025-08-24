# base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# build phase
RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    --mount=type=cache,id=node-modules-cache,target=/app/node_modules/.cache \
    npm run build

# production phase
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
RUN npm install --production
EXPOSE 8080
CMD ["npm", "start"]
