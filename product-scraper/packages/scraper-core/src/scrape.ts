import { chromium, BrowserContext } from 'playwright';
import { db, Marketplace } from '@scraper/db';
import { upsertProduct, upsertSeller, linkProductToSeller, saveRecommendations } from '@scraper/db';
import type { Product } from '@prisma/client';
import { config } from './config';
import { detectMarketplace, parsePrice } from './utils/normalize';
import { checkRobotsTxt } from './utils/robots';
import { extractAmazon } from './extractors/amazon';
import { extractTrendyol } from './extractors/trendyol';
import { extractHepsiburada } from './extractors/hepsiburada';
import { AmazonSearch } from './search/amazonSearch';
import { TrendyolSearch } from './search/trendyolSearch';
import { HepsiburadaSearch } from './search/hepsiburadaSearch';
import { rankRecommendations } from './recommend/recommender';

function agent(): string{
  const arr = Array.isArray(config.userAgentsArr) ? config.userAgentsArr : ['Mozilla/5.0'];
  return arr[Math.floor(Math.random()*arr.length)];
}

async function ctx(): Promise<BrowserContext>{
  const browser = await chromium.launch({ headless: config.headlessBool });
  const context = await browser.newContext({ userAgent: agent(), viewport: { width: 1280, height: 800 }});
  return context;
}

export async function scrapeProduct(url:string, requestId:string): Promise<{ product: Product; marketplace: Marketplace; scrapingMode: 'html' }> {
  const market = detectMarketplace(url);
  if(!(await checkRobotsTxt(url))){ throw new Error('ROBOTS_DISALLOWED'); }

  const context = await ctx();
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

  let data:any;
  if(market==='AMAZON') data = await extractAmazon(page);
  else if(market==='TRENDYOL') data = await extractTrendyol(page);
  else if(market==='HEPSIBURADA') data = await extractHepsiburada(page);
  else throw new Error('Unsupported marketplace');

  await page.close();

  const product = await upsertProduct({
    marketplace: market, productUrl: url, name: data.name,
    priceAmount: data.price, priceCurrency: data.currency,
    ratingValue: data.rating, ratingCount: data.ratingCount,
    images: data.images, specs: {}, categoryPath: data.categoryPath||[]
  });

  await context.close();

  return { product, marketplace: market, scrapingMode: 'html' as const };
}

// Simplify product name for search - remove sizes, colors, specific variants to get better recommendations
function simplifySearchQuery(name: string, marketplace: Marketplace): string {
  // For Turkish sites, remove specific details like sizes, colors, variant numbers
  if (marketplace === 'TRENDYOL' || marketplace === 'HEPSIBURADA') {
    return name
      // Remove sizes/measurements: "90 ml", "100 cm", "2 kg", etc.
      .replace(/\d+\s*(ml|cm|mm|kg|g|adet|parça|kişilik)/gi, '')
      // Remove standalone numbers at end (variant/model numbers)
      .replace(/\s+\d+\s*$/g, '')
      // Remove common color words at end
      .replace(/\s+(beyaz|siyah|kırmızı|mavi|yeşil|sarı|pembe|mor|turuncu|gri|kahverengi|lacivert|koyu|açık)\s*$/gi, '')
      // Keep only first ~60 chars for efficiency
      .substring(0, 60)
      .trim();
  }
  // For Amazon, use full name (already works well)
  return name;
}

export async function searchAndRecommend(product:any, marketplace:Marketplace, requestId:string, sourceUrl?:string){
  const context = await ctx();
  let searcher:any;
  if(marketplace==='AMAZON') searcher = new AmazonSearch(context, sourceUrl);
  else if(marketplace==='TRENDYOL') searcher = new TrendyolSearch(context);
  else if(marketplace==='HEPSIBURADA') searcher = new HepsiburadaSearch(context);
  else throw new Error('Unsupported marketplace');

  const searchQuery = simplifySearchQuery(product.name, marketplace);
  console.log(`[SEARCH] Original: "${product.name.substring(0, 80)}..."`);
  console.log(`[SEARCH] Simplified: "${searchQuery}"`);
  const results = await searcher.search(searchQuery, Number(process.env.SEARCH_PAGES_TO_FETCH||1));
  const ranked = rankRecommendations(results, Number(product.priceAmount), Number(process.env.MAX_RECOMMENDATIONS)||8, Number(process.env.PRICE_BAND_PERCENTAGE)||25 );

  await saveRecommendations(product.id, ranked.map((r,i)=> ({
    recommendedProductUrl: r.productUrl,
    name: r.name,
    priceAmount: r.price,
    priceCurrency: r.currency,
    ratingValue: r.rating,
    ratingCount: r.ratingCount,
    imageUrl: r.imageUrl,
    marketplace,
    rank: r.rank
  })));

  await context.close();

  return ranked.map(r => ({
    name: r.name,
    priceAmount: r.price,
    priceCurrency: r.currency,
    ratingValue: r.rating,
    ratingCount: r.ratingCount,
    imageUrl: r.imageUrl,
    recommendedProductUrl: r.productUrl
  }));
}
