# Product Scraper - Issues Fixed

This document tracks all errors encountered and fixed during development of the Product Scraper & Recommender system.

---

## 1. Turkish Price Format Parsing Error

**Issue**: Turkish prices using dot as thousands separator were incorrectly parsed
- Input: `61.999 TL` (sixty-one thousand, nine hundred ninety-nine)
- Expected: `61999`
- Actual: `61.999` (sixty-one point nine nine nine)

**Root Cause**: Price parser didn't recognize Turkish number format where:
- Dot (`.`) = thousands separator
- Comma (`,`) = decimal separator
- Example: `1.234,56` = one thousand two hundred thirty-four point five six

**Solution**: Added heuristic in `packages/scraper-core/src/utils/normalize.ts`
```typescript
// If last part after dot has 3 digits, it's likely thousands separator
if(lastPart && lastPart.length === 3) {
  n = n.replace(/\./g,''); // Remove dots for thousands
}
```

**File**: `packages/scraper-core/src/utils/normalize.ts`

**Test Result**: ✅ Trendyol now correctly shows 61,999 TRY

---

## 2. Hepsiburada Incorrect Price (7 TRY)

**Issue**: Hepsiburada product showing 7 TRY instead of actual price (551.65 TRY)

**Root Cause**: Regex was capturing random "7Tl" text instead of actual price element

**Solution**: Added explicit wait for price element and better selector fallbacks
```typescript
await page.waitForSelector('[data-bind*="currentPriceBeforePoint"], [data-test-id*="price"], .price-value', { timeout: 20000 });
```

**File**: `packages/scraper-core/src/extractors/hepsiburada.ts:33-36`

**Test Result**: ✅ Hepsiburada now correctly extracts 551.65 TRY

---

## 3. Database Numeric Field Overflow - Precision Too Small

**Issue**: `PostgresError { code: "22003", message: "numeric field overflow" }`
```
A field with precision 10, scale 2 must round to an absolute value less than 10^8
```

**Root Cause**: Database schema limited prices to `Decimal(10,2)` which maxes at 99,999,999.99

**Solution**: Increased precision in schema for all price fields
```prisma
// Before
priceAmount   Decimal  @db.Decimal(10,2)

// After
priceAmount   Decimal  @db.Decimal(12,2)  // Supports up to 9,999,999,999.99
```

**Files Changed**:
- `packages/db/prisma/schema.prisma:28` (Product.priceAmount)
- `packages/db/prisma/schema.prisma:60` (ProductSeller.priceAmount)
- `packages/db/prisma/schema.prisma:72` (Recommendation.priceAmount)

**Commands Run**:
```bash
npx prisma db push --schema=./packages/db/prisma/schema.prisma
npx prisma generate
```

**Test Result**: ✅ Database now accepts larger prices

---

## 4. Database Overflow - Astronomical Number (Scientific Notation)

**Issue**: Database overflow error persisted with value `5.516564990982565e+30`

**Root Cause**: Hepsiburada selector grabbed entire price section containing multiple prices:
```
"551,65 TL649,90 TLKazancımı gör98,25 TL..."
```
All digits concatenated: `5516564999825` → scientific notation

**Debug Evidence**:
```
[HEPSIBURADA DEBUG] Found price: "551,65 TL649,90 TLKazancımı gör98,25 TL..."
[HEPSIBURADA DEBUG] Parsed price: 5.516564990982565e+30 TRY
```

**Solution**: Extract only FIRST price using regex
```typescript
const firstPriceMatch = text.match(/[\d.,]+\s*TL|₺\s*[\d.,]+/);
const cleanedText = firstPriceMatch ? firstPriceMatch[0] : text.trim();
```

**File**: `packages/scraper-core/src/extractors/hepsiburada.ts:66-69`

**Test Result**: ✅ Now extracts only "551,65 TL" correctly

---

## 5. Empty Recommendations - Trendyol Search Selectors

**Issue**: Trendyol returning empty recommendations array

**Root Cause**: Outdated CSS selectors didn't match actual HTML structure
- Old selectors: `.prdct-desc-cntnr .name`, `.prc-box-dscntd`
- Actual HTML: `<img class="p-card-img" alt="Product Name">`, prices in text content

**Debug Evidence**:
```
[TRENDYOL SEARCH] Found 20 product items on page 1
[TRENDYOL SEARCH] Skipping item - missing required fields: { name: false, priceText: false }
```

**Solution**: Updated selectors based on actual HTML
```typescript
// Name from img alt attribute
const name = (await it.$eval('.p-card-img', el => el.getAttribute('alt'))).trim();

// Price from text content via regex
const allText = await it.textContent() || '';
const priceMatches = allText.match(/[\d.,]+\s*TL/g);
const priceText = priceMatches[priceMatches.length - 1]; // Last price = discounted
```

**File**: `packages/scraper-core/src/search/trendyolSearch.ts:41-47`

**Test Result**: ✅ Trendyol now returns 8 recommendations

---

## 6. Empty Recommendations - Hepsiburada Search Selectors

**Issue**: Hepsiburada returning empty recommendations

**Root Cause Multiple Issues**:

### 6a. Wrong Element Selector
**Problem**: `.productListContent-item` selector matched 0 elements

**Solution**: Use more specific fallback chain
```typescript
let items = await page.$$('.productListContent-item');
if (items.length === 0) {
  items = await page.$$('li[id^="i"]');  // Match li with id="i0", "i1", etc.
}
if (items.length === 0) {
  items = await page.$$('article');
}
```

**File**: `packages/scraper-core/src/search/hepsiburadaSearch.ts:27-38`

---

### 6b. Installment Price Captured Instead of Actual Price
**Problem**: Extracting 183 TRY (installment) instead of 551 TRY (actual)
- Text content: "3 x 183 TL 551,65 TL"
- Regex captured: "183 TL" (first match)
- Expected: "551,65 TL" (last match = actual price)

**Solution**: Take LAST price from matches
```typescript
const priceMatches = allText.match(/[\d.,]+\s*TL|₺\s*[\d.,]+/g);
if (priceMatches && priceMatches.length > 0) {
  priceText = priceMatches[priceMatches.length - 1]; // Last price = actual
}
```

**File**: `packages/scraper-core/src/search/hepsiburadaSearch.ts:67-71`

**Test Result**: ✅ Now extracts 551.65 TRY correctly

---

### 6c. Search Query Too Specific
**Problem**: Searching with full product name returned only the exact same product
- Query: "English Home Evelina New Bone China 4 Parça 2 Kişilik Kahve Fincan Takımı 90 ml Koyu Yeşil"
- Results: Only the exact same product with same color/size

**Solution**: Simplify search query by removing specifics
```typescript
function simplifySearchQuery(name: string, marketplace: Marketplace): string {
  if (marketplace === 'TRENDYOL' || marketplace === 'HEPSIBURADA') {
    return name
      .replace(/\d+\s*(ml|cm|mm|kg|g|adet|parça|kişilik)/gi, '') // Remove sizes
      .replace(/\s+\d+\s*$/g, '') // Remove trailing numbers
      .replace(/\s+(beyaz|siyah|kırmızı|mavi|yeşil|sarı|pembe|mor|turuncu|gri|kahverengi|lacivert|koyu|açık)\s*$/gi, '') // Remove colors
      .substring(0, 60)
      .trim();
  }
  return name;
}
```

**Example Transformation**:
- Original: "English Home Evelina New Bone China 4 Parça 2 Kişilik Kahve Fincan Takımı 90 ml Koyu Yeşil"
- Simplified: "English Home Evelina New Bone China Kahve Fincan Takımı"

**File**: `packages/scraper-core/src/scrape.ts:56-72`

**Test Result**: ✅ Returns 8 diverse recommendations from English Home coffee cup sets

---

## 7. TypeScript Compilation Errors - Null Checks

**Issue**: `error TS18047: 'allText' is possibly 'null'`

**Root Cause**: TypeScript strict null checks, `textContent()` can return null

**Solution**: Add `|| ''` fallback
```typescript
const allText = await it.textContent().catch(() => '') || '';
```

**Files**:
- `packages/scraper-core/src/search/trendyolSearch.ts:44`
- `packages/scraper-core/src/search/hepsiburadaSearch.ts:60`

**Test Result**: ✅ TypeScript compilation successful

---

## Summary of Changes

### Files Modified:
1. ✅ `packages/db/prisma/schema.prisma` - Increased decimal precision
2. ✅ `packages/scraper-core/src/utils/normalize.ts` - Turkish number format support
3. ✅ `packages/scraper-core/src/extractors/hepsiburada.ts` - Better price/image extraction
4. ✅ `packages/scraper-core/src/extractors/trendyol.ts` - Added debug logging
5. ✅ `packages/scraper-core/src/search/hepsiburadaSearch.ts` - Fixed selectors & price logic
6. ✅ `packages/scraper-core/src/search/trendyolSearch.ts` - Fixed selectors & price logic
7. ✅ `packages/scraper-core/src/scrape.ts` - Added search query simplification

### Final Test Results:

#### Amazon India
✅ **Working** - 8 recommendations

#### Trendyol
✅ **Working** - 8 recommendations
- Example: iPhone 16 (61,999 TRY) → recommends iPhone 15, iPhone 16 Plus, etc.

#### Hepsiburada
✅ **Working** - 8 recommendations
- Example: English Home Evelina (551.65 TRY) → recommends Rabecca, Octavia, Exotic Artsy coffee cup sets (449-560 TRY range)

---

## Key Learnings

1. **International Number Formats**: Always account for locale-specific formats (Turkish: 1.234,56 vs US: 1,234.56)
2. **Database Precision**: Plan for edge cases - prices can be larger than expected
3. **CSS Selectors**: Modern SPAs change class names frequently - use fallback chains
4. **Price Extraction**: E-commerce sites show multiple prices (installments, discounts) - extract strategically
5. **Search Query Optimization**: Remove specifics (size/color/variants) for better recommendation diversity
6. **Dynamic Content**: JavaScript-heavy sites need explicit waits (`networkidle`, `waitForSelector`)

---

## 8. All Ratings Showing 0 - Search Results Rating Extraction

**Issue**: All recommendations showing `"rating": {"value": 0, "count": 0}` across all 3 marketplaces

**Root Causes**:
1. **Search result selectors missing**: CSS selectors like `.rating-star`, `.rating-count` don't exist in search results HTML
2. **Turkish decimal format in parseRating()**: Regex `/[\d.]+/` only matched periods, not commas (Turkish: "4,6")

**Debug Evidence**:
```
[TRENDYOL SEARCH DEBUG] Rating extracted: 4.6(7323)
[TRENDYOL SEARCH] Found product: ..., rating: 0
```

**Solutions**:

### 8a. Hepsiburada - Text-based Rating Extraction
**File**: `packages/scraper-core/src/search/hepsiburadaSearch.ts:78-86`

Added regex to extract rating from text content pattern "4,5(38)":
```typescript
// Extract rating from text: "4,5(38)" -> rating: 4.5, count: 38
let ratingText = null;
let countText = null;
const allText = await it.textContent().catch(() => '') || '';
const ratingMatch = allText.match(/(\d+[,\.]\d+)\((\d+)\)/);
if (ratingMatch) {
  ratingText = ratingMatch[1]; // "4,5" or "4.5"
  countText = ratingMatch[2];  // "38"
}
```

### 8b. Trendyol - Text-based Rating Extraction
**File**: `packages/scraper-core/src/search/trendyolSearch.ts:52-62`

Same pattern for Trendyol "4.6(7323)":
```typescript
const ratingMatch = allText.match(/(\d+[,\.]\d+)\((\d+)\)/);
```

### 8c. Amazon India - Fallback Rating Extraction
**File**: `packages/scraper-core/src/search/amazonSearch.ts:61-68`

Added fallback for "4.5 out of 5 stars" pattern:
```typescript
if (!ratingText) {
  const allText = await it.textContent().catch(() => '') || '';
  const ratingMatch = allText.match(/(\d+[,\.]\d+)\s*(?:out of|stars)/i);
  if (ratingMatch) {
    ratingText = ratingMatch[1];
  }
}
```

### 8d. Rating Parser - Turkish Comma Support
**File**: `packages/scraper-core/src/utils/normalize.ts:79-85`

**Problem**: `parseRating("4,6")` returned 0 because regex only matched digits and periods

**Solution**: Updated regex to handle both comma and period as decimal separator:
```typescript
export function parseRating(text:string): number{
  // Handle both comma and period as decimal separator (4.6 or 4,6)
  const m = text.match(/[\d.,]+/);
  const normalized = m ? m[0].replace(',', '.') : '0'; // Replace comma with period
  const v = parseFloat(normalized);
  return Math.min(5, isNaN(v)?0:v);
}
```

**Test Results**:
- ✅ **Hepsiburada**: Ratings 4.6-4.9 with review counts (5-286 reviews)
- ✅ **Trendyol**: Ratings 4.6-4.7 with review counts (50-665 reviews)
- ✅ **Amazon**: Ratings working with existing selectors + text fallback

---

*Last Updated: 2025-10-20*
*Total Issues Fixed: 11* (8 main issues + 3 sub-issues)
*All Critical Features: ✅ Working*
