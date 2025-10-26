import { Router, type Router as RouterType } from 'express';
import { z } from 'zod';
import { createLogger } from '../lib/logger';
import { scrapeProduct, searchAndRecommend } from '@scraper/scraper-core';
import { AnalyzeResponse } from '../lib/responseTypes';

const router: RouterType = Router();
const schema = z.object({ url: z.string().url() });
const log = createLogger('analyze');

router.post('/', async (req,res,next)=>{
  const started = Date.now();
  // Log the incoming body for debugging
  log.info({ body: req.body }, '[POST /] Request received'); 

  try{
    const parsed = schema.parse(req.body);
    const r1 = await scrapeProduct(parsed.url, 'req-'+started);
    const recs = await searchAndRecommend(r1.product, r1.marketplace, 'req-'+started, parsed.url);

    const response: AnalyzeResponse = {
      productDetails: {
        name: r1.product.name,
        price: { amount: Number(r1.product.priceAmount), currency: r1.product.priceCurrency },
        rating: { value: Number(r1.product.ratingValue||0), count: r1.product.ratingCount||0 },
        images: r1.product.images as string[],
        categoryPath: r1.product.categoryPath
      },
      recommendations: recs.map(x=> ({
        name: x.name,
        price: { amount: Number(x.priceAmount), currency: x.priceCurrency },
        rating: { value: Number(x.ratingValue), count: x.ratingCount||0 },
        image: x.imageUrl,
        productUrl: x.recommendedProductUrl
      })),
      meta: { marketplace: r1.marketplace, scrapingMode: r1.scrapingMode, tookMs: Date.now()-started }
    };
    log.info({tookMs: response.meta.tookMs, recs: response.recommendations.length}, 'done');
    res.json(response);
  }catch(e){
    // --- CRITICAL FIX: EXPLICITLY LOG THE FULL ERROR STACK ---
    // This ensures the Render logs will contain the crash details (Playwright/dependency error).
    log.error({ error: e, requestBody: req.body }, 'CRITICAL ANALYSIS CRASH: Check stack trace below.');
    // Pass the error to the general Express error handler (as you were doing before)
    next(e); 
  }
});

export default router;
