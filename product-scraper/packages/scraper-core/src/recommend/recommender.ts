export interface SearchResult { name:string; price:number; currency:string; rating:number; ratingCount?:number; imageUrl:string; productUrl:string; }
export interface RankedRecommendation extends SearchResult { rank:number; }

export function rankRecommendations(results:SearchResult[], basePrice:number, max:number=8, bandPct:number=25): RankedRecommendation[]{
  const min = basePrice*(1-bandPct/100);
  const maxp = basePrice*(1+bandPct/100);

  console.log(`[RECOMMENDER] Input: ${results.length} results, basePrice: ${basePrice}, band: ±${bandPct}% (${min.toFixed(0)} - ${maxp.toFixed(0)})`);

  // Count filter reasons
  let filteredOutNoPrice = 0;
  let filteredOutNoRating = 0;
  let filteredOutPriceTooLow = 0;
  let filteredOutPriceTooHigh = 0;

  const filtered = results.filter(r => {
    if (r.price <= 0) {
      filteredOutNoPrice++;
      return false;
    }
    // Allow products without ratings - they'll just be ranked lower
    // if (r.rating <= 0) {
    //   filteredOutNoRating++;
    //   return false;
    // }
    if (r.price < min) {
      filteredOutPriceTooLow++;
      return false;
    }
    if (r.price > maxp) {
      filteredOutPriceTooHigh++;
      return false;
    }
    return true;
  });

  console.log(`[RECOMMENDER] Filtered out: ${filteredOutNoPrice} no price, ${filteredOutNoRating} no rating, ${filteredOutPriceTooLow} too cheap, ${filteredOutPriceTooHigh} too expensive`);
  console.log(`[RECOMMENDER] After filtering: ${filtered.length} products`);

  const sorted = filtered.sort((a,b)=> (b.rating-a.rating) || (a.price-b.price) || ((b.ratingCount||0)-(a.ratingCount||0)));
  const final = sorted.slice(0,max).map((r,i)=>({...r, rank:i+1}));

  console.log(`[RECOMMENDER] Returning ${final.length} recommendations`);
  return final;
}
