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

# Debug: Show what we actually have
RUN echo "=== Debugging project structure ===" && \
    echo "=== Checking required files ===" && \
    ls -la lib/wagmi.ts 2>/dev/null || echo "❌ lib/wagmi.ts not found" && \
    ls -la components/YinYang.tsx 2>/dev/null || echo "❌ components/YinYang.tsx not found" && \
    ls -la yinyang.tsx 2>/dev/null || echo "❌ yinyang.tsx not found" && \
    echo "=== Checking tsconfig.json ===" && \
    cat tsconfig.json 2>/dev/null || echo "❌ tsconfig.json not found" && \
    echo "=== Checking providers.tsx imports ===" && \
    head -15 app/providers.tsx 2>/dev/null || echo "❌ providers.tsx not found"

# Build with proper error handling - this will FAIL the Docker build if npm run build fails
RUN echo "=== Starting build process ===" && \
    npm run build && \
    echo "=== Build completed successfully ===" && \
    ls -la .next/ && \
    echo "=== .next directory contents verified ==="

# production phase
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
