# Supabase Setup Guide (for Product Scraper)

This project works great with **Supabase Postgres**. Follow these steps:

## 1) Get your Database URL
Supabase Dashboard → **Project Settings** → **Database** → **Connection string** (URI).

- For **direct connection** (recommended for Prisma in dev): use the *URI* with `?sslmode=require`
- For **pooled connection** (via PgBouncer, port 6543): use the *URI (pooler)* and append `?pgbouncer=true&sslmode=require&connection_limit=1`

> Example:
```
postgresql://postgres:YOUR_PASSWORD@aws-...supabase.co:5432/postgres?sslmode=require
# or pooled:
postgresql://postgres:YOUR_PASSWORD@aws-...supabase.co:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1
```

Update `.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@HOST:PORT/postgres?sslmode=require
```

## 2) Prisma setup
```bash
pnpm install
pnpm db:push      # creates tables in Supabase
pnpm db:studio    # optional GUI
```

## 3) Running the API against Supabase
```bash
pnpm dev
# API: http://localhost:8080
```

## 4) About RLS (Row Level Security)
- If you **enable RLS** on these tables, Prisma connections must satisfy policies. For server-only ingestion, simplest is to **keep RLS off** for scraper tables, or connect as a role that bypasses policies (the default `postgres` superuser bypasses RLS unless FORCE RLS is set).
- Alternatively, keep scraper tables in a dedicated schema (e.g., `scraper`) with RLS disabled.

## 5) Deploying the API
Supabase Edge Functions cannot run Playwright/Chromium. Deploy the Node API to a VM or container platform (Render/Railway/Fly.io/AWS EC2) and point `DATABASE_URL` to your Supabase Postgres.
