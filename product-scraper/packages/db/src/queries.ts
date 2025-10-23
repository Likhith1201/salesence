import { db, Marketplace } from './index';
import { Decimal } from '@prisma/client/runtime/library';
import type { Product, Seller, Prisma } from '@prisma/client';

export async function upsertProduct(data: {
  marketplace: Marketplace; productUrl:string; name:string;
  priceAmount:number; priceCurrency:string;
  ratingValue?:number|null; ratingCount?:number|null;
  images:string[]; specs?:any; categoryPath?:string[];
}): Promise<Product> {
  return db.product.upsert({
    where:{ productUrl: data.productUrl },
    create:{
      ...data,
      priceAmount: new Decimal(data.priceAmount.toString()),
      ratingValue: data.ratingValue==null? null : new Decimal(String(data.ratingValue)),
      images: data.images as any,
      specs: data.specs as any,
      categoryPath: data.categoryPath || []
    },
    update:{
      name:data.name,
      priceAmount:new Decimal(data.priceAmount.toString()),
      priceCurrency:data.priceCurrency,
      ratingValue: data.ratingValue==null? null : new Decimal(String(data.ratingValue)),
      ratingCount: data.ratingCount ?? undefined,
      images: data.images as any,
      specs: data.specs as any,
      categoryPath: data.categoryPath || []
    }
  });
}

export async function upsertSeller(data: {
  marketplace: Marketplace; externalId:string; name:string;
  ratingValue?:number|null; sellerUrl?:string; meta?:any;
}): Promise<Seller> {
  return db.seller.upsert({
    where:{ marketplace_externalId:{ marketplace: data.marketplace, externalId: data.externalId } },
    create:{ ...data },
    update:{ name:data.name, ratingValue: data.ratingValue==null? null : new Decimal(String(data.ratingValue)), sellerUrl:data.sellerUrl, meta:data.meta }
  });
}

export async function linkProductToSeller(productId:string, sellerId:string, priceAmount:number, priceCurrency:string, isPrimary:boolean=false){
  return db.productSeller.create({
    data: {
      productId, sellerId,
      priceAmount: new Decimal(priceAmount.toString()),
      priceCurrency, isPrimary
    }
  });
}

export async function saveRecommendations(sourceProductId:string, rows: Array<{recommendedProductUrl:string; name:string; priceAmount:number; priceCurrency:string; ratingValue:number; ratingCount?:number; imageUrl:string; marketplace:Marketplace; rank:number; }>): Promise<Prisma.BatchPayload> {
  await db.recommendation.deleteMany({ where:{ sourceProductId } });
  return db.recommendation.createMany({ data: rows.map(r => ({
    sourceProductId,
    recommendedProductUrl: r.recommendedProductUrl,
    name: r.name,
    priceAmount: new Decimal(r.priceAmount.toString()),
    priceCurrency: r.priceCurrency,
    ratingValue: new Decimal(r.ratingValue.toString()),
    ratingCount: r.ratingCount,
    imageUrl: r.imageUrl,
    marketplace: r.marketplace,
    rank: r.rank
  }))});
}
