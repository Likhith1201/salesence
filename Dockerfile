# Use a robust Node base image that supports Playwright dependencies
# We use bullseye-slim for a smaller footprint but full apt-get capability
FROM node:22-bullseye-slim

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# --- CRITICAL FIX: Install Playwright's system dependencies ---
# This step runs with root access during the Docker build, bypassing the read-only error.
RUN apt-get update && apt-get install -y \
    libnss3 libatk-bridge2.0-0 libxshmfence-dev libgbm-dev libasound2 \
    libatk1.0-0 libcups2 libgconf-2-4 libgtk-3-0 libjpeg-turbo8 \
    libnspr4 libxss1 libnss3-dev libcups2-dev libxrandr2 procps \
    && rm -rf /var/lib/apt/lists/*

# Copy all files into the container
COPY . .

# Install node dependencies, Playwright browser, generate Prisma, and build
# Note: We run all build/install commands together
RUN pnpm install --shamefully-hoist --no-frozen-lockfile && \
    pnpm exec playwright install chromium && \
    ./node_modules/.bin/prisma generate --schema ./packages/db/prisma/schema.prisma && \
    npm run build

# Start the production server using your npm script
CMD ["npm", "run", "start:prod"]
