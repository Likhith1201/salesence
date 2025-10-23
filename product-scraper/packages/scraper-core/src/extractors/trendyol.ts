import { Page } from 'playwright';
import { parsePrice, parseRating, parseRatingCount } from '../utils/normalize';

export async function extractTrendyol(page: Page){
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});

  // Trendyol is a JavaScript SPA - wait for network to be idle
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
    console.log('[TRENDYOL DEBUG] Network idle timeout');
  });

  // Take screenshot for debugging
  const timestamp = Date.now();
  await page.screenshot({ path: `debug-trendyol-${timestamp}.png`, fullPage: false }).catch(() => {
    console.log('[TRENDYOL DEBUG] Screenshot failed');
  });

  // Wait for product title
  await page.waitForSelector('h1.pr-new-br, .product-name, h1', { timeout: 30000 }).catch(() => {
    console.log('[TRENDYOL DEBUG] Title selector timed out');
  });

  const name = (
    await page.locator('h1.pr-new-br').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('.product-name').textContent({ timeout: 5000 }).catch(() => null) ||
    await page.locator('h1').first().textContent({ timeout: 5000 }).catch(() => null) ||
    'Unknown Product'
  ).trim();

  console.log('[TRENDYOL DEBUG] Product name:', name);

  // Debug: Try to find ALL elements containing TL or price-like text
  const allTextWithTL = await page.locator('*:has-text("TL"), *:has-text("₺")').allTextContents().catch(() => []);
  console.log('[TRENDYOL DEBUG] All elements with TL/₺:', allTextWithTL.slice(0, 10)); // Log first 10

  // Try multiple price selectors with detailed logging
  let priceText = null;

  const priceSelectors = [
    '.prc-dsc',
    '.prc-slg',
    'span.prc-dsc',
    'span.prc-slg',
    '[data-price]',
    '.product-price',
    '.price-container',
    'span[class*="price"]',
    'div[class*="price"]'
  ];

  for (const selector of priceSelectors) {
    const text = await page.locator(selector).first().textContent({ timeout: 2000 }).catch(() => null);
    if (text && text.trim()) {
      console.log(`[TRENDYOL DEBUG] Found price with selector "${selector}":`, text.trim());
      if (!priceText) priceText = text.trim();
    }
  }

  if (!priceText) {
    // Last resort: search in page content for TL amounts
    const pageText = await page.content();
    const tlMatch = pageText.match(/[\d.,]+\s*TL|₺\s*[\d.,]+/i);
    if (tlMatch) {
      console.log('[TRENDYOL DEBUG] Found price in page content:', tlMatch[0]);
      priceText = tlMatch[0];
    } else {
      priceText = '0 TL';
    }
  }

  console.log('[TRENDYOL DEBUG] Selected price text:', priceText);
  const { amount: price, currency } = parsePrice(priceText);
  console.log('[TRENDYOL DEBUG] Parsed price:', price, currency);

  const ratingText = (await page.locator('.ratings-point').textContent({ timeout: 5000 }).catch(() => null)) || '0';
  const rating = parseRating(ratingText);

  const ratingCountText = (await page.locator('.ratings-count').textContent({ timeout: 5000 }).catch(() => null)) || '0';
  const ratingCount = parseRatingCount(ratingCountText);

  // Try multiple image selectors with detailed logging
  let img = null;
  const imageSelectors = [
    '.product-images img',
    '.productImage img',
    'img[class*="product"]',
    'img[class*="Product"]',
    '.gallery img',
    '.image-viewer img',
    'img[alt*="product"]',
    'img[alt*="Product"]',
    'main img'
  ];

  for (const selector of imageSelectors) {
    const src = await page.locator(selector).first().getAttribute('src', { timeout: 2000 }).catch(() => null);
    if (src && src.trim()) {
      console.log(`[TRENDYOL DEBUG] Found image with selector "${selector}":`, src.substring(0, 80));
      if (!img) img = src;
    }
  }

  if (!img) {
    console.log('[TRENDYOL DEBUG] No image found, trying to get first img on page');
    img = await page.locator('img').first().getAttribute('src', { timeout: 2000 }).catch(() => null);
  }

  console.log('[TRENDYOL DEBUG] Final image URL:', img ? img.substring(0, 80) : 'none');

  return { name, price, currency: currency||'TRY', rating, ratingCount, images: img?[img]:[], categoryPath: [] as string[], seller: undefined as any };
}
