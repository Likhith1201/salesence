import type { Marketplace } from '@scraper/db';

export function detectMarketplace(url:string): Marketplace{
  const host = new URL(url).hostname.toLowerCase();
  if(host.includes('amazon')) return 'AMAZON';
  if(host.includes('trendyol')) return 'TRENDYOL';
  if(host.includes('hepsiburada')) return 'HEPSIBURADA';
  return 'OTHER';
}

export function parsePrice(text:string): {amount:number; currency:string}{
  const s = text.replace(/\s+/g,' ').trim();

  // Detect currency
  const currency = /₺|TL/i.test(s) ? 'TRY'
    : /₹|INR/i.test(s) ? 'INR'
    : /\$/i.test(s) ? 'USD'
    : /€|EUR/i.test(s) ? 'EUR'
    : /£|GBP/i.test(s) ? 'GBP'
    : 'USD';

  // Extract all numeric parts (digits, commas, periods)
  let m = s.match(/[\d.,]+/g);
  let n = m ? m.join('') : '';

  // Handle different international number formats:
  // 1. Turkish/European: 1.234,56 (dot = thousands, comma = decimal)
  // 2. US/UK/Indian: 1,234.56 or 49,999 (comma = thousands, dot = decimal)
  // 3. Indian lakhs: 1,23,456 (multiple commas for lakhs/thousands)

  if(n.includes('.') && n.includes(',')) {
    // Mixed format - determine which is decimal
    const lastDot = n.lastIndexOf('.');
    const lastComma = n.lastIndexOf(',');

    if(lastComma > lastDot) {
      // European/Turkish format: 1.234,56
      n = n.replace(/\./g,'').replace(',','.');
    } else {
      // US/Indian format: 1,234.56
      n = n.replace(/,/g,'');
    }
  } else if(n.includes(',')){
    // Only commas present
    const parts = n.split(',');
    const lastPart = parts[parts.length - 1];

    if(lastPart && lastPart.length === 2 && parts.length === 2) {
      // European decimal: 49,99 (only one comma with 2 digits after)
      n = n.replace(',','.');
    } else {
      // Thousands separator (US/Indian): 49,999 or 1,23,456
      // Remove all commas
      n = n.replace(/,/g,'');
    }
  } else if(n.includes('.')) {
    // Only periods - could be decimal or thousands
    const parts = n.split('.');
    const lastPart = parts[parts.length - 1];

    // Heuristic: If last part has 3 digits, it's likely thousands separator (Turkish/European)
    // Examples: 61.999 -> 61999, 1.234 -> 1234
    if(lastPart && lastPart.length === 3) {
      // Turkish/European thousands separator
      n = n.replace(/\./g,'');
    } else if(lastPart && lastPart.length === 2 && parts.length === 2) {
      // Could be European decimal: 49.99 - keep as decimal
      // Keep as is
    } else if(parts.length > 2) {
      // Multiple dots = thousands separator: 1.234.567
      n = n.replace(/\./g,'');
    }
  }

  const amount = parseFloat(n||'0');
  return { amount: isNaN(amount)?0:amount, currency };
}

export function parseRating(text:string): number{
  // Handle both comma and period as decimal separator (4.6 or 4,6)
  const m = text.match(/[\d.,]+/);
  const normalized = m ? m[0].replace(',', '.') : '0'; // Replace comma with period for parseFloat
  const v = parseFloat(normalized);
  return Math.min(5, isNaN(v)?0:v);
}

export function parseRatingCount(text:string): number{
  const v = parseInt(text.replace(/[^\d]/g,''),10);
  return isNaN(v)?0:v;
}
