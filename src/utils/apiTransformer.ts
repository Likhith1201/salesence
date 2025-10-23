// Transform backend API responses to frontend format
import { AnalyzeResponse } from '@/types/api.types';
import { MockAnalysisResult } from './mockDataGenerator';

/**
 * Get currency symbol from currency code
 */
function getCurrencySymbol(currencyCode: string): string {
  const currencyMap: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'TRY': '₺',
    'JPY': '¥',
    'CNY': '¥',
    'INR': '₹',
    'RUB': '₽',
    'BRL': 'R$',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': 'CHF ',
    'SEK': 'kr ',
    'NOK': 'kr ',
    'DKK': 'kr ',
    'PLN': 'zł ',
    'KRW': '₩',
  };

  return currencyMap[currencyCode] || currencyCode + ' '; // Fallback to code with space
}

/**
 * Format price with currency symbol
 */
function formatPrice(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);

  // For some currencies, symbol goes after the amount
  const symbolAfter = ['SEK', 'NOK', 'DKK', 'PLN', 'CHF'];

  if (symbolAfter.includes(currency)) {
    return `${amount.toFixed(2)}${symbol}`;
  }

  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Transform backend AnalyzeResponse to MockAnalysisResult format
 * This allows the existing UI components to work without changes
 */
export const transformApiResponseToMockFormat = (
  apiResponse: AnalyzeResponse,
  originalUrl: string
): MockAnalysisResult => {
  const { productDetails, recommendations, meta } = apiResponse;

  // Generate a unique ID from the URL
  const productId = btoa(originalUrl).substring(0, 16).replace(/[^a-zA-Z0-9]/g, '');

  // Generate AI suggestions based on the product data
  const titleSuggestions = [
    `Include primary keyword "${productDetails.name.split(' ')[0]}" at the beginning for better SEO`,
    "Add emotional triggers like 'Premium', 'Professional', or 'Luxury'",
    "Mention key benefits and features in the title",
    "Use power words like 'Ultimate', 'Advanced', 'Pro', 'Elite'",
  ];

  const descriptionSuggestions = [
    "Start with a compelling hook in the first sentence",
    "Use bullet points for key features",
    "Include technical specifications",
    "Add social proof and testimonials",
    "Mention warranty and return policy",
  ];

  const pricingSuggestions = generatePricingSuggestions(
    productDetails.price.amount,
    recommendations,
    productDetails.price.currency
  );

  const imageSuggestions = [
    "Add lifestyle images showing product in use",
    "Include size comparison with common objects",
    "Show product from multiple angles",
    "Add infographic highlighting key features",
    "Use consistent lighting and background",
  ];

  const keywordSuggestions = extractKeywords(productDetails.name);

  // Calculate scores
  const imageQuality = productDetails.images.length > 0 ?
    Math.min(85 + productDetails.images.length * 2, 99) : 85;

  const overallScore = calculateOverallScore(productDetails, recommendations);

  // Determine price position
  const averageCompetitorPrice = calculateAveragePrice(recommendations);
  const pricePosition = determinePricePosition(
    productDetails.price.amount,
    averageCompetitorPrice
  );

  return {
    id: productId,
    url: originalUrl,
    marketplace: meta.marketplace,
    platform: meta.marketplace,
    product: {
      id: productId,
      name: productDetails.name,
      price: formatPrice(productDetails.price.amount, productDetails.price.currency),
      priceAmount: productDetails.price.amount,
      currency: productDetails.price.currency,
      originalPrice: undefined,
      imageUrl: productDetails.images[0] || "/placeholder.svg",
      images: productDetails.images,
      imageQuality,
      category: productDetails.categoryPath.join(' > ') || 'General',
      rating: productDetails.rating.value,
      reviewCount: productDetails.rating.count,
    },
    recommendations: recommendations.map((rec, index) => ({
      id: `rec-${productId}-${index}`,
      name: rec.name,
      price: formatPrice(rec.price.amount, rec.price.currency),
      priceAmount: rec.price.amount,
      currency: rec.price.currency,
      rating: rec.rating.value,
      reviewCount: rec.rating.count,
      image: rec.image,
      productUrl: rec.productUrl,
    })),
    analysis: {
      titleSuggestions,
      descriptionSuggestions,
      pricingSuggestions,
      imageSuggestions,
      keywordSuggestions,
      overallScore,
      competitorAnalysis: {
        averagePrice: formatPrice(averageCompetitorPrice, productDetails.price.currency),
        averagePriceAmount: averageCompetitorPrice,
        currency: productDetails.price.currency,
        pricePosition,
        marketShare: Math.floor(Math.random() * 30) + 15, // Estimated
      },
    },
    generatedAt: new Date().toISOString(),
  };
};

/**
 * Generate pricing suggestions based on product and competitor data
 */
function generatePricingSuggestions(
  productPrice: number,
  recommendations: any[],
  currency: string
): string[] {
  const suggestions: string[] = [];
  const currencySymbol = getCurrencySymbol(currency);

  if (recommendations.length === 0) {
    suggestions.push("Competitive pricing detected - maintain current price point for optimal positioning");
    return suggestions;
  }

  const avgPrice = calculateAveragePrice(recommendations);
  const priceDiff = ((productPrice - avgPrice) / avgPrice) * 100;

  if (priceDiff > 15) {
    suggestions.push(
      `Price is ${Math.abs(priceDiff).toFixed(0)}% higher than market average - consider lowering to ${currencySymbol}${avgPrice.toFixed(2)} for better competitiveness`
    );
  } else if (priceDiff < -15) {
    suggestions.push(
      `Price is ${Math.abs(priceDiff).toFixed(0)}% lower than market average - excellent value proposition`
    );
  } else {
    suggestions.push("Competitive pricing detected - maintain current price point for optimal positioning");
  }

  suggestions.push("Bundle with complementary accessories to increase average order value by 25%");

  // Use appropriate currency example based on actual currency
  const examplePrice = currency === 'USD' ? '$19.99 vs $20.00' :
                       currency === 'EUR' ? '€19.99 vs €20.00' :
                       currency === 'TRY' ? '₺199.99 vs ₺200.00' :
                       `${currencySymbol}19.99 vs ${currencySymbol}20.00`;
  suggestions.push(`Consider psychological pricing (e.g., ${examplePrice}) for better conversion rates`);

  return suggestions;
}

/**
 * Calculate average price from recommendations
 */
function calculateAveragePrice(recommendations: any[]): number {
  if (recommendations.length === 0) return 0;

  const total = recommendations.reduce((sum, rec) => sum + rec.price.amount, 0);
  return total / recommendations.length;
}

/**
 * Determine price position relative to competitors
 */
function determinePricePosition(
  productPrice: number,
  avgCompetitorPrice: number
): 'above' | 'below' | 'competitive' {
  if (avgCompetitorPrice === 0) return 'competitive';

  const diff = ((productPrice - avgCompetitorPrice) / avgCompetitorPrice) * 100;

  if (diff > 10) return 'above';
  if (diff < -10) return 'below';
  return 'competitive';
}

/**
 * Extract keywords from product name
 */
function extractKeywords(productName: string): string[] {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'with', 'for', 'in'];
  const words = productName.toLowerCase()
    .split(/[\s,]+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));

  // Return up to 6 unique keywords
  return [...new Set(words)].slice(0, 6);
}

/**
 * Calculate overall optimization score based on product quality metrics
 * Score range: 0-100 (not capped artificially)
 */
function calculateOverallScore(productDetails: any, recommendations: any[]): number {
  console.log('🔍 CALCULATING OPTIMIZATION SCORE');
  console.log('Product:', productDetails.name);
  console.log('Input Data:', {
    imageCount: productDetails.images?.length || 0,
    rating: productDetails.rating?.value || 0,
    reviewCount: productDetails.rating?.count || 0,
    categoryDepth: productDetails.categoryPath?.length || 0,
    competitorCount: recommendations?.length || 0
  });

  let score = 0;
  const breakdown: any = {};

  // === IMAGE QUALITY (0-25 points) ===
  const imageCount = productDetails.images?.length || 0;
  if (imageCount === 0) {
    breakdown.images = 0;
  } else if (imageCount === 1) {
    score += 8;
    breakdown.images = 8;
  } else if (imageCount === 2) {
    score += 12;
    breakdown.images = 12;
  } else if (imageCount === 3) {
    score += 16;
    breakdown.images = 16;
  } else if (imageCount >= 4 && imageCount <= 6) {
    score += 20;
    breakdown.images = 20;
  } else {
    score += 25; // 7+ images is excellent
    breakdown.images = 25;
  }

  // === RATING QUALITY (0-30 points) ===
  const rating = productDetails.rating?.value || 0;
  if (rating === 0) {
    breakdown.rating = 0;
  } else if (rating < 3.0) {
    score += 5;
    breakdown.rating = 5;
  } else if (rating >= 3.0 && rating < 3.5) {
    score += 10;
    breakdown.rating = 10;
  } else if (rating >= 3.5 && rating < 4.0) {
    score += 15;
    breakdown.rating = 15;
  } else if (rating >= 4.0 && rating < 4.5) {
    score += 22;
    breakdown.rating = 22;
  } else if (rating >= 4.5 && rating < 4.8) {
    score += 27;
    breakdown.rating = 27;
  } else {
    score += 30; // 4.8+ is excellent
    breakdown.rating = 30;
  }

  // === REVIEW COUNT (0-20 points) ===
  const reviewCount = productDetails.rating?.count || 0;
  if (reviewCount === 0) {
    breakdown.reviews = 0;
  } else if (reviewCount < 10) {
    score += 3;
    breakdown.reviews = 3;
  } else if (reviewCount >= 10 && reviewCount < 50) {
    score += 7;
    breakdown.reviews = 7;
  } else if (reviewCount >= 50 && reviewCount < 100) {
    score += 10;
    breakdown.reviews = 10;
  } else if (reviewCount >= 100 && reviewCount < 500) {
    score += 15;
    breakdown.reviews = 15;
  } else {
    score += 20; // 500+ reviews is excellent
    breakdown.reviews = 20;
  }

  // === CATEGORY DEPTH (0-15 points) ===
  const categoryDepth = productDetails.categoryPath?.length || 0;
  if (categoryDepth === 0 || categoryDepth === 1) {
    breakdown.category = 0;
  } else if (categoryDepth === 2) {
    score += 5;
    breakdown.category = 5;
  } else if (categoryDepth === 3) {
    score += 10;
    breakdown.category = 10;
  } else {
    score += 15; // 4+ levels is excellent
    breakdown.category = 15;
  }

  // === COMPETITIVE ANALYSIS (0-10 points) ===
  const competitorCount = recommendations?.length || 0;
  if (competitorCount === 0) {
    breakdown.competitors = 0;
  } else if (competitorCount < 3) {
    score += 3;
    breakdown.competitors = 3;
  } else if (competitorCount < 5) {
    score += 6;
    breakdown.competitors = 6;
  } else {
    score += 10; // 5+ competitors analyzed
    breakdown.competitors = 10;
  }

  console.log('📊 Score Breakdown:', breakdown);
  console.log('🎯 FINAL SCORE:', score, '/100');

  return Math.round(score); // No artificial cap, natural max is 100
}
