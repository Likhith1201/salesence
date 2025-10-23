import { BrowserContext } from 'playwright';
import { parsePrice, parseRating, parseRatingCount } from '../utils/normalize';
export type SearchResult = { name:string; price:number; currency:string; rating:number; ratingCount?:number; imageUrl:string; productUrl:string };

export class HepsiburadaSearch{
  constructor(private ctx: BrowserContext){}
  async search(term:string, pages:number=1): Promise<SearchResult[]>{
    console.log(`[HEPSIBURADA SEARCH] Starting search for "${term}", pages: ${pages}`);
    const res:SearchResult[] = [];
    for(let i=1;i<=pages;i++){
      const page = await this.ctx.newPage();
      const searchUrl = `https://www.hepsiburada.com/ara?q=${encodeURIComponent(term)}&sayfa=${i}`;
      console.log(`[HEPSIBURADA SEARCH] Navigating to: ${searchUrl}`);
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
        console.log('[HEPSIBURADA SEARCH] Network idle timeout');
      });
      await page.waitForTimeout(3000); // Wait for dynamic content

      // Take screenshot for debugging
      const timestamp = Date.now();
      await page.screenshot({ path: `debug-hepsiburada-search-${timestamp}.png`, fullPage: false }).catch(() => {
        console.log('[HEPSIBURADA SEARCH] Screenshot failed');
      });

      // Try multiple selectors - be very specific to match actual product cards
      let items = await page.$$('.productListContent-item');
      if (items.length === 0) {
        console.log(`[HEPSIBURADA SEARCH] .productListContent-item found 0 items, trying alternatives...`);
        // Try to find <li> elements that contain product cards
        items = await page.$$('li[id^="i"]').catch(() => []);
        console.log(`[HEPSIBURADA SEARCH] li[id^="i"] found ${items.length} items`);
      }
      if (items.length === 0) {
        items = await page.$$('article').catch(() => []);
        console.log(`[HEPSIBURADA SEARCH] article found ${items.length} items`);
      }
      console.log(`[HEPSIBURADA SEARCH] Found ${items.length} product items on page ${i}`);

      // Debug: dump HTML of first item
      if (items.length > 0) {
        const firstItemHTML = await items[0].innerHTML().catch(() => 'failed to get HTML');
        console.log(`[HEPSIBURADA SEARCH] First item HTML:`, firstItemHTML.substring(0, 1000));

        const allText = await items[0].textContent().catch(() => '');
        console.log(`[HEPSIBURADA SEARCH] First item text:`, allText?.substring(0, 300));
      }
      for(const it of items){
        // Hepsiburada search results: try different selectors
        let name = (await it.$eval('.product-title', el => el.textContent).catch(() => null))?.trim();
        if (!name) {
          // Try title attribute on link
          name = (await it.$eval('a', el => el.getAttribute('title')).catch(() => null))?.trim();
        }

        // Price: try multiple selectors
        let priceText = await it.$eval('.price-value', el => el.textContent).catch(() => null);
        if (!priceText) {
          priceText = await it.$eval('[data-test-id="price"]', el => el.textContent).catch(() => null);
        }
        if (!priceText) {
          priceText = await it.$eval('.price', el => el.textContent).catch(() => null);
        }
        if (!priceText) {
          // Extract from all text content - take the LAST price (actual price, after installments)
          const allText = await it.textContent().catch(() => '') || '';
          const priceMatches = allText.match(/[\d.,]+\s*TL|₺\s*[\d.,]+/g);
          if (priceMatches && priceMatches.length > 0) {
            // Take the LAST price - typically the actual product price comes after installments
            // e.g., "3 x 183 TL 551,65 TL" -> we want "551,65 TL"
            priceText = priceMatches[priceMatches.length - 1];
          }
        }

        const imageUrl = await it.$eval('img', el => el.getAttribute('src')).catch(() => null);
        const href = await it.$eval('a', el => el.getAttribute('href')).catch(() => null);

        // Extract rating from text: "4,5(38)" -> rating: 4.5, count: 38
        let ratingText = null;
        let countText = null;
        const allText = await it.textContent().catch(() => '') || '';
        const ratingMatch = allText.match(/(\d+[,\.]\d+)\((\d+)\)/); // Matches "4,5(38)" or "4.5(38)"
        if (ratingMatch) {
          ratingText = ratingMatch[1]; // "4,5" or "4.5"
          countText = ratingMatch[2];  // "38"
        }
        if(!name || !priceText || !imageUrl || !href) {
          console.log(`[HEPSIBURADA SEARCH] Skipping item - missing required fields:`, { name: !!name, priceText: !!priceText, imageUrl: !!imageUrl, href: !!href });
          continue;
        }
        const { amount, currency } = parsePrice(priceText);
        const rating = ratingText? parseRating(ratingText): 0;
        const ratingCount = countText? parseRatingCount(countText): 0;
        console.log(`[HEPSIBURADA SEARCH] Found product: ${name.substring(0, 50)}..., price: ${amount} ${currency}, rating: ${rating}`);
        res.push({ name, price: amount, currency: currency||'TRY', rating, ratingCount, imageUrl, productUrl: `https://www.hepsiburada.com${href}` });
      }
      await page.close();
    }
    console.log(`[HEPSIBURADA SEARCH] Completed search, found ${res.length} total products`);
    return res;
  }
}
