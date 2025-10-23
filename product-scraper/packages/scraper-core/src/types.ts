import type { Marketplace, Product } from '@scraper/db';
export type ScrapingMode = 'api'|'html';

export interface ScrapeResult {
  product: Product;
  marketplace: Marketplace;
  scrapingMode: ScrapingMode;
  primarySeller?: { name:string; externalId:string };
}
