import { Page } from 'playwright';
import { parsePrice, parseRating, parseRatingCount } from '../utils/normalize';

export async function extractAmazon(page: Page){
  // Wait for page to fully load
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});

  // Take screenshot for debugging (optional - can be removed later)
  // await page.screenshot({ path: 'debug-amazon.png', fullPage: false });

  // Wait for product title - Amazon loads this dynamically
  await page.waitForSelector('#productTitle, h1[id*="title"], .product-title-word-break', { timeout: 30000 }).catch(() => {
    console.log('[SCRAPER DEBUG] Title selector timed out');
  });

  // Try multiple title selectors
  const name = (
    await page.locator('#productTitle').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('h1[id*="title"]').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('.product-title-word-break').textContent({ timeout: 5000 }).catch(() => null) ||
    'Unknown Product'
  ).trim();

  console.log('[SCRAPER DEBUG] Product name:', name);

  // Wait for price section to load
  await page.waitForSelector('.a-price, #corePrice_feature_div, #corePriceDisplay_desktop_feature_div', { timeout: 10000 }).catch(() => {});

  // Debug: Get ALL price-related text on page
  const allPriceOffscreen = await page.locator('.a-price .a-offscreen').allTextContents().catch(() => []);
  const allPriceWhole = await page.locator('.a-price-whole').allTextContents().catch(() => []);
  console.log('[SCRAPER DEBUG] All .a-offscreen prices:', allPriceOffscreen);
  console.log('[SCRAPER DEBUG] All .a-price-whole:', allPriceWhole);

  // Try to get price - prioritize offscreen (has full formatted text)
  let priceText =
    await page.locator('.a-price .a-offscreen').first().textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('#priceblock_ourprice').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('#priceblock_dealprice').textContent({ timeout: 5000 }).catch(() => null) ||
    '$0.00';

  console.log('[SCRAPER DEBUG] Selected price text:', priceText);

  const { amount: price, currency } = parsePrice(priceText);

  console.log('[SCRAPER DEBUG] Parsed price:', price, currency);

  const ratingText = (await page.locator('span[data-hook="rating-out-of-text"], i[data-hook="average-star-rating"]').first().textContent({ timeout: 5000 }).catch(() => null)) || '0';
  const rating = parseRating(ratingText);

  const ratingCountText = (await page.locator('#acrCustomerReviewText, span[data-hook="total-review-count"]').first().textContent({ timeout: 5000 }).catch(() => null)) || '0';
  const ratingCount = parseRatingCount(ratingCountText);

  const img = await page.locator('#imgTagWrapperId img, #landingImage, #main-image').first().getAttribute('src', { timeout: 5000 }).catch(() => null);

  return {
    name,
    price,
    currency,
    rating,
    ratingCount,
    images: img ? [img] : [],
    categoryPath: [] as string[],
    seller: undefined as any
  };
}
