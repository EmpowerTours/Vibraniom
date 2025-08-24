# base image
FROM node:20-alpine AS base
WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json* ./

# Install dependencies
RUN --mount=type=cache,id=s/ccb9e493-7b96-4ab3-92ba-e12f98ac84a5-npm-cache,target=/root/.npm \
    npm install

# Copy configuration files first
COPY next.config.* ./
COPY tsconfig.json ./
COPY tailwind.config.* ./

# Copy source code
COPY . .

# Debug: Verify the required files exist
RUN echo "=== Verifying required files ===" && \
    ls -la lib/wagmi.ts && \
    ls -la components/YinYang.tsx && \
    echo "All required files found!"

# build phase
RUN --mount=type=cache,id=s/ccb9e493-7b96-4ab3-92ba-e12f98ac84a5-next-cache,target=/app/.next/cache \
    --mount=type=cache,id=s/ccb9e493-7b96-4ab3-92ba-e12f98ac84a5-node-modules-cache,target=/app/node_modules/.cache \
    npm run build

# production phase
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
