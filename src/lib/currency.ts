import { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";

// Static exchange rate for demonstration purposes
// In a real application, you would fetch this from a live API
const EXCHANGE_RATES = {
  USD_TO_TRY: 32.5, // Approximate exchange rate
};

export const useCurrency = () => {
  const { t, i18n } = useTranslation();

  // Memoize to ensure recalculation when language changes
  const isTurkish = useMemo(() => i18n.language === "tr", [i18n.language]);
  const currencySymbol = useMemo(() => t("currencySymbol"), [t, i18n.language]);
  const currencyCode = useMemo(() => t("currency"), [t, i18n.language]);

  const formatPrice = useCallback((amount: number): string => {
    const symbol = isTurkish ? "₺" : "$";

    if (isTurkish) {
      const tryAmount = amount * EXCHANGE_RATES.USD_TO_TRY;
      return `${symbol}${tryAmount.toLocaleString('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`;
    } else {
      return `${symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })}`;
    }
  }, [isTurkish]);

  const convertPrice = useCallback((usdAmount: number): number => {
    return isTurkish ? usdAmount * EXCHANGE_RATES.USD_TO_TRY : usdAmount;
  }, [isTurkish]);

  return {
    formatPrice,
    convertPrice,
    currencySymbol,
    currencyCode,
    isTurkish,
  };
};