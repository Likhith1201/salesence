// API Type Definitions matching backend response structure

export interface ProductDetails {
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  rating: {
    value: number;
    count: number;
  };
  images: string[];
  categoryPath: string[];
}

export interface Recommendation {
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  rating: {
    value: number;
    count: number;
  };
  image: string;
  productUrl: string;
}

export interface AnalyzeResponse {
  productDetails: ProductDetails;
  recommendations: Recommendation[];
  meta: {
    marketplace: string;
    scrapingMode: string;
    tookMs: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}
