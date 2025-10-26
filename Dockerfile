# Use a robust Node base image that supports Playwright dependencies
FROM node:22-bullseye-slim

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# --- STEP 1: Install Playwright's Linux System Dependencies (SUCCESSFUL) ---
RUN apt-get update && apt-get install -y \
    libnss3 libatk-bridge2.0-0 libxshmfence-dev libgbm-dev libasound2 \
    libatk1.0-0 libcups2 libgconf-2-4 libgtk-3-0 \
    libnspr4 libxss1 libnss3-dev libcups2-dev libxrandr2 procps \
    libjpeg62-turbo \
    && rm -rf /var/lib/apt/lists/*

# Copy all files into the container
COPY . .

# --- STEP 2: Install Node Dependencies AND Playwright Browser (FIXED) ---
# 1. pnpm install: Installs all packages including Playwright core
RUN pnpm install --shamefully-hoist --no-frozen-lockfile

# 2. Sequential commands: Now that pnpm install is complete, 
#    the shell context can reliably find 'playwright' and 'prisma'.
RUN pnpm exec playwright install chromium && \
    ./node_modules/.bin/prisma generate --schema ./packages/db/prisma/schema.prisma && \
    npm run build

# Start the production server using your npm script
CMD ["npm", "run", "start:prod"]
