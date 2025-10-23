import { Page } from 'playwright';
import { parsePrice, parseRating, parseRatingCount } from '../utils/normalize';

export async function extractHepsiburada(page: Page){
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});

  // Hepsiburada is a heavy JavaScript SPA - wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
    console.log('[HEPSIBURADA DEBUG] Network idle timeout');
  });

  // Take screenshot for debugging
  const timestamp = Date.now();
  await page.screenshot({ path: `debug-hepsiburada-${timestamp}.png`, fullPage: false }).catch(() => {
    console.log('[HEPSIBURADA DEBUG] Screenshot failed');
  });

  // Wait for product title
  await page.waitForSelector('h1#product-name, h1.product-name, h1', { timeout: 30000 }).catch(() => {
    console.log('[HEPSIBURADA DEBUG] Title selector timed out');
  });

  const name = (
    await page.locator('h1#product-name').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('h1.product-name').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('h1').first().textContent({ timeout: 5000 }).catch(() => null) ||
    'Unknown Product'
  ).trim();

  console.log('[HEPSIBURADA DEBUG] Product name:', name);

  // Wait specifically for price to load (Hepsiburada loads prices via JavaScript)
  console.log('[HEPSIBURADA DEBUG] Waiting for price element to appear...');
  await page.waitForSelector('[data-bind*="currentPriceBeforePoint"], [data-test-id*="price"], .price-value', { timeout: 20000 }).catch(() => {
    console.log('[HEPSIBURADA DEBUG] Price element wait timeout');
  });

  // Add additional wait for dynamic content
  await page.waitForTimeout(2000);

  // Debug: Try to find ALL elements containing TL or price-like text
  const allTextWithTL = await page.locator('*:has-text("TL"), *:has-text("₺")').allTextContents().catch(() => []);
  console.log('[HEPSIBURADA DEBUG] All elements with TL/₺:', allTextWithTL.slice(0, 10)); // Log first 10

  // Try multiple price selectors with detailed logging
  let priceText = null;

  const priceSelectors = [
    '[data-bind="markupText:currentPriceBeforePoint"]',
    '[data-bind*="currentPrice"]',
    '[data-test-id*="price"]',
    '.product-price',
    '[data-bind*="price"]',
    '.price',
    '.price-value',
    'span.price',
    'div.price',
    'span[class*="price"]',
    'div[class*="price"]',
    '[itemprop="price"]'
  ];

  for (const selector of priceSelectors) {
    const text = await page.locator(selector).first().textContent({ timeout: 2000 }).catch(() => null);
    if (text && text.trim()) {
      // Extract only the first price match from the text (ignore savings, old prices, etc.)
      const firstPriceMatch = text.match(/[\d.,]+\s*TL|₺\s*[\d.,]+/);
      const cleanedText = firstPriceMatch ? firstPriceMatch[0] : text.trim();
      console.log(`[HEPSIBURADA DEBUG] Found price with selector "${selector}":`, cleanedText);
      if (!priceText) priceText = cleanedText;
    }
  }

  if (!priceText) {
    // Last resort: search in page content for TL amounts
    const pageText = await page.content();
    const tlMatch = pageText.match(/[\d.,]+\s*TL|₺\s*[\d.,]+/i);
    if (tlMatch) {
      console.log('[HEPSIBURADA DEBUG] Found price in page content:', tlMatch[0]);
      priceText = tlMatch[0];
    } else {
      priceText = '0 TL';
    }
  }

  console.log('[HEPSIBURADA DEBUG] Selected price text:', priceText);
  const { amount: price, currency } = parsePrice(priceText);
  console.log('[HEPSIBURADA DEBUG] Parsed price:', price, currency);

  const ratingText = (
    await page.locator('.rating-score').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('.ratings-point').textContent({ timeout: 5000 }).catch(() => null) ||
    '0'
  );
  const rating = parseRating(ratingText);

  const ratingCountText = (
    await page.locator('.rating-count').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('.total-review').textContent({ timeout: 5000 }).catch(() => null) ||
    '0'
  );
  const ratingCount = parseRatingCount(ratingCountText);

  // Try multiple image selectors with detailed logging
  let img = null;
  const imageSelectors = [
    '.product-images img',
    '.productImage img',
    '.gallery img',
    '.image-gallery img',
    'img[id*="product"]',
    'img[id*="Product"]',
    'img[class*="ProductImage"]',
    'img[alt*="product"]',
    'img[alt*="Product"]',
    'main img:not([src*="badge"]):not([src*="icon"])',  // Exclude badges and icons
    'img[class*="product"]:not([src*="badge"])',
    'img:not([src*="badge"]):not([src*="icon"])'
  ];

  for (const selector of imageSelectors) {
    const src = await page.locator(selector).first().getAttribute('src', { timeout: 2000 }).catch(() => null);
    if (src && src.trim()) {
      // Skip badge and icon images
      if (src.includes('badge') || src.includes('icon') || src.includes('logo')) {
        console.log(`[HEPSIBURADA DEBUG] Skipping badge/icon image: ${src.substring(0, 80)}`);
        continue;
      }
      console.log(`[HEPSIBURADA DEBUG] Found image with selector "${selector}":`, src.substring(0, 80));
      if (!img) img = src;
    }
  }

  if (!img) {
    console.log('[HEPSIBURADA DEBUG] No image found, trying to get first non-badge img on page');
    const allImages = await page.locator('img').all();
    for (const imgEl of allImages) {
      const src = await imgEl.getAttribute('src').catch(() => null);
      if (src && !src.includes('badge') && !src.includes('icon') && !src.includes('logo')) {
        img = src;
        console.log(`[HEPSIBURADA DEBUG] Found fallback image:`, src.substring(0, 80));
        break;
      }
    }
  }

  console.log('[HEPSIBURADA DEBUG] Final image URL:', img ? img.substring(0, 80) : 'none');

  return { name, price, currency: currency||'TRY', rating, ratingCount, images: img?[img]:[], categoryPath: [] as string[], seller: undefined as any };
}
