import { BrowserContext } from 'playwright';
import { parsePrice, parseRating, parseRatingCount } from '../utils/normalize';
export type SearchResult = { name:string; price:number; currency:string; rating:number; ratingCount?:number; imageUrl:string; productUrl:string };

export class TrendyolSearch{
  constructor(private ctx: BrowserContext){}
  async search(term:string, pages:number=1): Promise<SearchResult[]>{
    console.log(`[TRENDYOL SEARCH] Starting search for "${term}", pages: ${pages}`);
    const res:SearchResult[] = [];
    for(let i=1;i<=pages;i++){
      const page = await this.ctx.newPage();
      const searchUrl = `https://www.trendyol.com/sr?q=${encodeURIComponent(term)}&pi=${i}`;
      console.log(`[TRENDYOL SEARCH] Navigating to: ${searchUrl}`);
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
        console.log('[TRENDYOL SEARCH] Network idle timeout');
      });
      await page.waitForTimeout(3000); // Wait for dynamic content

      // Take screenshot for debugging
      const timestamp = Date.now();
      await page.screenshot({ path: `debug-trendyol-search-${timestamp}.png`, fullPage: false }).catch(() => {
        console.log('[TRENDYOL SEARCH] Screenshot failed');
      });

      const items = await page.$$('.p-card-wrppr');
      console.log(`[TRENDYOL SEARCH] Found ${items.length} product items on page ${i}`);

      // Debug: dump HTML of first item to see structure
      if (items.length > 0) {
        const firstItemHTML = await items[0].innerHTML().catch(() => 'failed to get HTML');
        console.log(`[TRENDYOL SEARCH] First item HTML:`, firstItemHTML.substring(0, 2000));

        // Try to find text content for debugging
        const allText = await items[0].textContent().catch(() => '');
        console.log(`[TRENDYOL SEARCH] First item text:`, allText?.substring(0, 300));
      }

      for(const it of items){
        // Trendyol search results: name is in img alt attribute
        const name = (await it.$eval('.p-card-img', el => el.getAttribute('alt')).catch(() => null))?.trim();

        // Price is in the text content - extract numbers with TL
        const allText = await it.textContent().catch(() => '') || '';
        const priceMatches = allText.match(/[\d.,]+\s*TL/g);
        // Take the last price (discounted price if available, otherwise regular price)
        const priceText = priceMatches && priceMatches.length > 0 ? priceMatches[priceMatches.length - 1] : null;

        const imageUrl = await it.$eval('.p-card-img', el => el.getAttribute('src')).catch(() => null);
        const href = await it.$eval('a', el => el.getAttribute('href')).catch(() => null);

        // Extract rating from text: "4.6(7323)" -> rating: 4.6, count: 7323
        let ratingText = null;
        let countText = null;
        const ratingMatch = allText.match(/(\d+[,\.]\d+)\((\d+)\)/); // Matches "4.6(7323)" or "4,6(7323)"
        if (ratingMatch) {
          ratingText = ratingMatch[1]; // "4.6" or "4,6"
          countText = ratingMatch[2];  // "7323"
        }
        if(!name || !priceText || !imageUrl || !href) {
          console.log(`[TRENDYOL SEARCH] Skipping item - missing required fields:`, { name: !!name, priceText: !!priceText, imageUrl: !!imageUrl, href: !!href });
          continue;
        }
        const { amount, currency } = parsePrice(priceText);
        const rating = ratingText? parseRating(ratingText): 0;
        const ratingCount = countText? parseRatingCount(countText): 0;
        console.log(`[TRENDYOL SEARCH] Found product: ${name.substring(0, 50)}..., price: ${amount} ${currency}, rating: ${rating}`);
        res.push({ name, price: amount, currency: currency||'TRY', rating, ratingCount, imageUrl, productUrl: `https://www.trendyol.com${href}` });
      }
      await page.close();
    }
    console.log(`[TRENDYOL SEARCH] Completed search, found ${res.length} total products`);
    return res;
  }
}
