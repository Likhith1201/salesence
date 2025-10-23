import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env from workspace root (process.cwd() when running pnpm dev from root)
dotenv.config();

const schema = z.object({
  nodeEnv: z.enum(['development','production','test']).default('development'),
  port: z.coerce.number().default(8080),
  databaseUrl: z.string(),
  scrapingMode: z.enum(['api','html']).default('html'),
  rateLimitPerDomainPerSec: z.coerce.number().default(0.5),
  maxRetries: z.coerce.number().default(3),
  headless: z.string().default('false'),
  proxyUrl: z.string().optional(),
  userAgents: z.string().default('["Mozilla/5.0"]'),
  maxRecommendations: z.coerce.number().default(8),
  searchPagesToFetch: z.coerce.number().default(1),
  priceBandPercentage: z.coerce.number().default(25),
  logLevel: z.string().default('info')
});

const raw = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DATABASE_URL,
  scrapingMode: process.env.SCRAPING_MODE,
  rateLimitPerDomainPerSec: process.env.RATE_LIMIT_PER_DOMAIN_PER_SEC,
  maxRetries: process.env.MAX_RETRIES,
  headless: process.env.HEADLESS,
  proxyUrl: process.env.PROXY_URL,
  userAgents: process.env.USER_AGENTS_JSON,
  maxRecommendations: process.env.MAX_RECOMMENDATIONS,
  searchPagesToFetch: process.env.SEARCH_PAGES_TO_FETCH,
  priceBandPercentage: process.env.PRICE_BAND_PERCENTAGE,
  logLevel: process.env.LOG_LEVEL
};

const parsed = schema.parse(raw);
export const config = {
  ...parsed,
  headlessBool: String(parsed.headless).toLowerCase()==='true',
  userAgentsArr: (()=>{ try { return JSON.parse(parsed.userAgents as unknown as string); } catch { return ['Mozilla/5.0']; }})()
};
export type AppConfig = typeof config;
