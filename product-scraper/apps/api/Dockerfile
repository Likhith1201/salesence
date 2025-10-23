FROM node:20-bullseye
RUN npm i -g pnpm@8
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/scraper-core/package.json ./packages/scraper-core/
RUN pnpm install

COPY . .
RUN pnpm --filter @scraper/db build && pnpm --filter @scraper/scraper-core build && pnpm --filter api build

# Install Playwright Chromium
RUN pnpm --filter @scraper/scraper-core exec playwright install --with-deps chromium

EXPOSE 8080
CMD ["node","apps/api/dist/server.js"]
