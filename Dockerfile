# Use the official Node.js image (we will install pnpm manually)
FROM node:22-bullseye as base

# Set the working directory for all subsequent commands
WORKDIR /usr/src/app

# --- FIX: Install pnpm globally since the base image doesn't include it ---
# The previous image tag 'node:22-bullseye-pnpm' was invalid.
RUN npm install -g pnpm

# --- STEP 1: Install Playwright's Linux System Dependencies ---
# These are required to run the headless browser
RUN apt-get update && apt-get install -y \
    libnss3 libatk-bridge2.0-0 libxshmfence-dev libgbm-dev libasound2 \
    libatk1.0-0 libcups2 libgconf-2-4 libgtk-3-0 \
    libnspr4 libxss1 libnss3-dev libcups2-dev libxrandr2 procps \
    libjpeg62-turbo \
    && rm -rf /var/lib/apt/lists/*

# --- STEP 2: Copy package files and install dependencies ---
# Copy just the necessary files for dependency installation (for layer caching)
COPY package.json pnpm-lock.yaml ./
COPY product-scraper/package.json ./product-scraper/
COPY product-scraper/packages/db/package.json ./product-scraper/packages/db/
COPY product-scraper/packages/scraper-core/package.json ./product-scraper/packages/scraper-core/
COPY product-scraper/apps/api/package.json ./product-scraper/apps/api/

# The --shamefully-hoist flag is often needed in monorepos where packages rely on hoisted dependencies
RUN pnpm install --shamefully-hoist --no-frozen-lockfile

# --- STEP 3: Copy the rest of the application code ---
COPY . .

# --- STEP 4: Build the application ---
# We use 'pnpm exec' for reliability with pnpm installed binaries in a Docker environment.
# We explicitly set the path to the Prisma schema for the monorepo structure.
RUN pnpm exec playwright install chromium && \
    pnpm exec prisma generate --schema ./packages/db/prisma/schema.prisma && \
    npm run build

# --- STEP 5: Run the production server ---
# Use the smaller, production-ready image
FROM node:22-bullseye-slim

# Copy the system libraries installed in the first stage
COPY --from=base /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu

# Copy the application code from the build stage
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .

# Expose the port (e.g., 3000 as configured in server.ts)
EXPOSE 3000

# Start the application using the correct script defined in product-scraper/package.json
CMD [ "pnpm", "start:prod" ]
