# Product Scraper & Recommender (Monorepo)

Minimal runnable scaffold (TypeScript + Express + Playwright + Prisma/Postgres).
This build is light enough to unzip & run quickly; you can extend it.

## Prerequisites
- Node.js 20+ and pnpm 8+
- (Option A) Local Postgres; or (Option B) use Docker compose

## Quick Start (Local)
```bash
cp .env.example .env
# 1) Start Postgres yourself (or use Docker: see below) and update DATABASE_URL in .env if needed
pnpm install
pnpm db:push
pnpm dev
```
API runs at http://localhost:8080

Health:
```bash
curl http://localhost:8080/health
```

Analyze a product:
```bash
curl -X POST http://localhost:8080/analyze -H "Content-Type: application/json" -d '{"url":"https://www.amazon.com/dp/B08N5WRWNW"}'
```

## Quick Start (Docker)
```bash
cp .env.example .env
pnpm install
docker compose up --build
```

## Notes
- Sellers are saved to DB but not returned in API payload.
- Robots.txt is checked; if disallowed you will get 451 response.
- For stable scraping at scale add proxies; keep HEADLESS=false in dev.
