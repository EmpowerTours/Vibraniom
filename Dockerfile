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

# Enhanced Debug: Show what we actually have
RUN echo "=== Verifying required files ===" && \
    ls -la lib/wagmi.ts && \
    ls -la components/YinYang.tsx && \
    echo "=== Checking tsconfig.json ===" && \
    cat tsconfig.json 2>/dev/null || echo "tsconfig.json not found" && \
    echo "=== Checking providers.tsx imports ===" && \
    head -15 app/providers.tsx 2>/dev/null || echo "providers.tsx not found" && \
    echo "All required files found!"

# build phase with error capture
RUN echo "=== Starting build process ===" && \
    npm run build 2>&1 | tee /tmp/build.log || \
    (echo "=== BUILD FAILED - Here's the error ===" && \
     cat /tmp/build.log && \
     echo "=== End of build error ===")

# production phase
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
