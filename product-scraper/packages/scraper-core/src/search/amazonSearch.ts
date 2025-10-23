import { BrowserContext } from 'playwright';
import { parsePrice, parseRating, parseRatingCount } from '../utils/normalize';

export type SearchResult = { name:string; price:number; currency:string; rating:number; ratingCount?:number; imageUrl:string; productUrl:string };

export class AmazonSearch{
  private domain: string;

  constructor(private ctx: BrowserContext, sourceUrl?: string) {
    // Detect Amazon domain from source URL (amazon.com, amazon.in, etc.)
    if (sourceUrl) {
      const hostname = new URL(sourceUrl).hostname;
      this.domain = hostname; // e.g., www.amazon.in or www.amazon.com
    } else {
      this.domain = 'www.amazon.com';
    }
  }

  async search(term:string, pages:number=1): Promise<SearchResult[]>{
    const res:SearchResult[] = [];
    console.log(`[AMAZON SEARCH] Searching for "${term}" on ${this.domain}, ${pages} page(s)`);

    for(let i=1;i<=pages;i++){
      const page = await this.ctx.newPage();
      const searchUrl = `https://${this.domain}/s?k=${encodeURIComponent(term)}&page=${i}`;
      console.log(`[AMAZON SEARCH] Loading: ${searchUrl}`);

      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });

      // Wait for search results to load
      await page.waitForSelector('[data-component-type="s-search-result"], .s-result-item', { timeout: 10000 }).catch(() => {
        console.log('[AMAZON SEARCH] Search results selector timed out');
      });

      const items = await page.$$('[data-component-type="s-search-result"]');
      console.log(`[AMAZON SEARCH] Found ${items.length} search result items`);

      let skipped = 0;
      for(const it of items){
        // Try multiple selectors for product name
        const name = (
          await it.$eval('h2 a span', el => el.textContent).catch(() => null) ||
          await it.$eval('h2 span', el => el.textContent).catch(() => null) ||
          await it.$eval('.a-text-normal', el => el.textContent).catch(() => null) ||
          await it.$eval('h2', el => el.textContent).catch(() => null)
        )?.trim();

        const priceText = await it.$eval('.a-price .a-offscreen', el => el.textContent).catch(() => null);
        const imageUrl = await it.$eval('img.s-image', el => el.getAttribute('src')).catch(() => null);

        // Try multiple selectors for product URL
        const href =
          await it.$eval('h2 a', el => el.getAttribute('href')).catch(() => null) ||
          await it.$eval('a.a-link-normal', el => el.getAttribute('href')).catch(() => null) ||
          await it.$eval('.s-title-instructions-style a', el => el.getAttribute('href')).catch(() => null);

        // Try CSS selectors first, then fallback to text extraction
        let ratingText = await it.$eval('.a-icon-star-small span', el => el.textContent).catch(() => null);
        let countText = await it.$eval('span[aria-label*="stars"]', el => el.getAttribute('aria-label')).catch(() => null);

        // Fallback: Extract rating from text if selectors fail
        if (!ratingText) {
          const allText = await it.textContent().catch(() => '') || '';
          const ratingMatch = allText.match(/(\d+[,\.]\d+)\s*(?:out of|stars)/i); // Matches "4.5 out of 5 stars"
          if (ratingMatch) {
            ratingText = ratingMatch[1];
          }
        }

        if(!name || !priceText || !imageUrl || !href) {
          skipped++;
          if (skipped <= 3) { // Only log first 3 to avoid spam
            console.log(`[AMAZON SEARCH] Skipped item - name:${!!name}, price:${!!priceText}, img:${!!imageUrl}, href:${!!href}`);
          }
          continue;
        }

        const { amount, currency } = parsePrice(priceText);
        const rating = ratingText? parseRating(ratingText) : 0;
        const ratingCount = countText? parseRatingCount(countText): 0;
        // Use the detected domain for product URLs
        const fullUrl = href.startsWith('http') ? href : `https://${this.domain}${href}`;
        res.push({ name, price: amount, currency, rating, ratingCount, imageUrl, productUrl: fullUrl });
      }

      console.log(`[AMAZON SEARCH] Extracted ${res.length} products, skipped ${skipped} items`);
      await page.close();
    }

    console.log(`[AMAZON SEARCH] Total results: ${res.length}`);
    return res;
  }
}
