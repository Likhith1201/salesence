export interface AnalyzeResponse {
  productDetails: {
    name: string;
    price: { amount:number; currency:string };
    rating: { value:number; count:number };
    images: string[];
    categoryPath?: string[];
    primarySeller?: { name:string; marketplace:string };
  };
  recommendations: Array<{
    name:string;
    price:{amount:number; currency:string};
    rating:{value:number; count:number};
    image:string;
    productUrl:string;
  }>;
  meta: { marketplace:string; scrapingMode:'api'|'html'; tookMs:number };
}
