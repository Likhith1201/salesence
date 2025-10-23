/**
 * Currency symbol mapping
 */
const CURRENCY_SYMBOLS: Record<string, string> = {
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

/**
 * Format a price with its original currency (not language-dependent)
 * Use this when displaying prices from API that already have a currency
 */
export const formatPriceWithCurrency = (amount: number, currencyCode: string): string => {
  const symbol = CURRENCY_SYMBOLS[currencyCode] || `${currencyCode} `;

  // For some currencies, symbol goes after the amount
  const symbolAfter = ['SEK', 'NOK', 'DKK', 'PLN', 'CHF'];

  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  if (symbolAfter.includes(currencyCode)) {
    return `${formattedAmount}${symbol}`;
  }

  return `${symbol}${formattedAmount}`;
};

/**
 * Parse price string to extract numeric value and currency code
 * Handles various formats like "$123.45", "₹1999.00", "123.45 USD"
 */
export const parsePriceString = (priceString: string): { amount: number; currency?: string } => {
  if (!priceString) return { amount: 0 };

  // Try to extract currency from symbol
  for (const [code, symbol] of Object.entries(CURRENCY_SYMBOLS)) {
    if (priceString.includes(symbol.trim())) {
      const numericString = priceString.replace(new RegExp(`[${symbol}\s,]`, 'g'), '');
      const amount = parseFloat(numericString) || 0;
      return { amount, currency: code };
    }
  }

  // Fallback: extract just the number
  const numericString = priceString.replace(/[^0-9.]/g, '');
  const amount = parseFloat(numericString) || 0;
  return { amount };
};
