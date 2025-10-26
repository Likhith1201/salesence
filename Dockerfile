# Use a robust Node base image that supports Playwright dependencies
FROM node:22-bullseye-slim

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /usr/src/app

# --- STEP 1: Install Playwright's Linux System Dependencies (PASSED) ---
RUN apt-get update && apt-get install -y \
    libnss3 libatk-bridge2.0-0 libxshmfence-dev libgbm-dev libasound2 \
    libatk1.0-0 libcups2 libgconf-2-4 libgtk-3-0 \
    libnspr4 libxss1 libnss3-dev libcups2-dev libxrandr2 procps \
    libjpeg62-turbo \
    && rm -rf /var/lib/apt/lists/*

# Copy all files into the container
COPY . .

# --- STEP 2: Install Node Dependencies ---
RUN pnpm install --shamefully-hoist --no-frozen-lockfile

# --- STEP 3: Execute Binaries & Build (FIXED) ---
# We use the full path ./node_modules/.bin/ for Playwright and Prisma 
# to bypass pnpm's path resolution issues.
RUN ./node_modules/.bin/playwright install chromium && \
    ./node_modules/.bin/prisma generate --schema ./packages/db/prisma/schema.prisma && \
    npm run build

# Start the production server using your npm script
CMD ["npm", "run", "start:prod"]
