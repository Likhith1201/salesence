export interface MockAnalysisResult {
  id: string;
  url: string;
  marketplace: string;
  platform: string;
  product: {
    id?: string;
    name: string;
    price: string;
    priceAmount?: number;
    currency?: string;
    originalPrice?: string;
    originalPriceAmount?: number;
    imageUrl: string;
    images?: string[];
    imageQuality: number;
    category: string;
    rating: number;
    reviewCount: number;
  };
  recommendations?: Array<{
    id: string;
    name: string;
    price: string;
    priceAmount?: number;
    currency?: string;
    originalPriceAmount?: number;
    rating: number;
    reviewCount: number;
    image: string;
    productUrl: string;
  }>;
  analysis: {
    titleSuggestions: string[];
    descriptionSuggestions: string[];
    pricingSuggestions: string[];
    imageSuggestions: string[];
    keywordSuggestions: string[];
    overallScore: number;
    competitorAnalysis: {
      averagePrice: string;
      averagePriceAmount?: number;
      currency?: string;
      pricePosition: 'above' | 'below' | 'competitive';
      marketShare: number;
    };
  };
  generatedAt: string;
}

const productNames = [
  "Wireless Bluetooth Headphones with Active Noise Cancellation",
  "Premium Espresso Machine with Built-in Grinder",
  "Smart Fitness Tracker with Heart Rate & GPS",
  "Ergonomic Office Chair with Adjustable Lumbar Support",
  "Stainless Steel Insulated Water Bottle - 32oz",
  "LED Desk Lamp with Wireless Charging & USB Port",
  "Portable Phone Stand for Desk and Travel",
  "Organic Cotton Bed Sheets - Queen Size 400 Thread Count",
  "Professional Kitchen Knife Set with Bamboo Block",
  "Bluetooth Speaker with 20-Hour Battery Life & Waterproof",
  "Smart Home Security Camera with Night Vision",
  "Electric Standing Desk with Memory Preset",
  "Portable Bluetooth Projector with 4K Support",
  "Robot Vacuum Cleaner with Mapping Technology",
  "Wireless Gaming Mouse with RGB Lighting",
  "Smart Thermostat with Energy Saving Features",
  "Portable Power Bank with Fast Charging",
  "Wireless Earbuds with Active Noise Cancellation",
  "Smart Watch with Health Monitoring",
  "Electric Bike with Folding Design"
];

const categories = [
  "Electronics", "Home & Kitchen", "Health & Fitness",
  "Office Products", "Sports & Outdoors", "Beauty & Personal Care"
];

const titleSuggestions = [
  "Include primary keyword at the beginning for better SEO",
  "Add emotional triggers like 'Premium', 'Professional', or 'Luxury'",
  "Mention key benefits and features in the title",
  "Use power words like 'Ultimate', 'Advanced', 'Pro', 'Elite'",
  "Include size/quantity information for clarity",
  "Add seasonal relevance and trending keywords",
  "Highlight unique selling propositions (USP)",
  "Use numbers and specific details to build trust",
  "Include brand name if well-known",
  "Add urgency or scarcity indicators when appropriate"
];

const descriptionSuggestions = [
  "Start with a compelling hook in the first sentence",
  "Use bullet points for key features",
  "Include technical specifications",
  "Add social proof and testimonials",
  "Mention warranty and return policy",
  "Use action words and benefit-focused language"
];

const pricingSuggestions = [
  "Price is 15% higher than market average - consider lowering to $X.XX for better competitiveness",
  "Competitive pricing detected - maintain current price point for optimal positioning",
  "Bundle with complementary accessories to increase average order value by 25%",
  "Offer limited-time discount (10-15%) to boost conversions and clear inventory",
  "Price matches top competitors - excellent market positioning maintained",
  "Consider psychological pricing (e.g., $19.99 vs $20.00) for better conversion rates",
  "Implement dynamic pricing based on demand and competitor movements",
  "Offer tiered pricing options to capture different customer segments",
  "Use price anchoring with 'was/now' pricing strategy",
  "Consider seasonal pricing adjustments based on market trends"
];

const imageSuggestions = [
  "Add lifestyle images showing product in use",
  "Include size comparison with common objects",
  "Show product from multiple angles",
  "Add infographic highlighting key features",
  "Use consistent lighting and background",
  "Include packaging and unboxing shots"
];

const keywordSuggestions = [
  "wireless, bluetooth, noise-cancelling",
  "premium, professional, high-quality",
  "ergonomic, comfortable, durable",
  "portable, travel-friendly, compact",
  "smart, advanced, innovative",
  "organic, natural, eco-friendly"
];

export const generateMockAnalysis = (url: string, marketplace: string, platform: string): MockAnalysisResult => {
  const productName = productNames[Math.floor(Math.random() * productNames.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const price = (Math.random() * 200 + 10).toFixed(2);
  const originalPrice = Math.random() > 0.6 ? (parseFloat(price) * 1.2).toFixed(2) : undefined;

  // More realistic random scores with wider range
  const imageQuality = Math.floor(Math.random() * 40) + 60; // 60-99%
  const rating = Math.round((Math.random() * 2 + 3) * 10) / 10; // 3.0-5.0
  const reviewCount = Math.floor(Math.random() * 5000) + 10; // 10-5000 (not always 100+)

  // Calculate score more realistically based on these metrics
  let overallScore = 0;

  // Image quality contribution (0-25)
  overallScore += Math.floor(imageQuality * 0.25);

  // Rating contribution (0-30)
  overallScore += Math.floor((rating / 5.0) * 30);

  // Review count contribution (0-20)
  const reviewScore = Math.min(reviewCount / 500, 1) * 20;
  overallScore += Math.floor(reviewScore);

  // Random variation (0-25)
  overallScore += Math.floor(Math.random() * 25);

  // Ensure reasonable range: 40-100
  overallScore = Math.max(40, Math.min(100, overallScore));

  return {
    id: Math.random().toString(36).substr(2, 9),
    url,
    marketplace,
    platform,
    product: {
      name: productName,
      price: `$${price}`,
      priceAmount: parseFloat(price),
      currency: 'USD',
      originalPrice: originalPrice ? `$${originalPrice}` : undefined,
      originalPriceAmount: originalPrice ? parseFloat(originalPrice) : undefined,
      imageUrl: "/placeholder.svg",
      imageQuality,
      category,
      rating,
      reviewCount
    },
    analysis: {
      titleSuggestions: titleSuggestions.slice(0, Math.floor(Math.random() * 3) + 3),
      descriptionSuggestions: descriptionSuggestions.slice(0, Math.floor(Math.random() * 3) + 3),
      pricingSuggestions: pricingSuggestions.slice(0, Math.floor(Math.random() * 2) + 2),
      imageSuggestions: imageSuggestions.slice(0, Math.floor(Math.random() * 3) + 3),
      keywordSuggestions: keywordSuggestions.slice(0, Math.floor(Math.random() * 3) + 3),
      overallScore,
      competitorAnalysis: {
        averagePrice: `$${(parseFloat(price) * (0.8 + Math.random() * 0.4)).toFixed(2)}`,
        averagePriceAmount: parseFloat(price) * (0.8 + Math.random() * 0.4),
        currency: 'USD',
        pricePosition: Math.random() > 0.5 ? 'competitive' : Math.random() > 0.5 ? 'above' : 'below',
        marketShare: Math.floor(Math.random() * 30) + 15
      }
    },
    generatedAt: new Date().toISOString()
  };
};
