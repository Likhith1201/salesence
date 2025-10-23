/**
 * React Hook for Automatic Translation
 * Automatically translates content when language changes to Turkish
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translationService } from '@/utils/translationService';

interface UseAutoTranslateOptions {
  enabled?: boolean;
  translationKey?: string;
  skipCache?: boolean;
}

interface UseAutoTranslateReturn {
  text: string;
  isTranslating: boolean;
  error: Error | null;
  retranslate: () => void;
}

/**
 * Hook for automatic translation
 * @param originalText - The text to translate (usually in English)
 * @param options - Configuration options
 */
export function useAutoTranslate(
  originalText: string,
  options: UseAutoTranslateOptions = {}
): UseAutoTranslateReturn {
  const { enabled = true, translationKey, skipCache = false } = options;
  const { i18n, t } = useTranslation();
  const [text, setText] = useState(originalText);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const translate = async () => {
    // If not enabled or empty text, return original
    if (!enabled || !originalText || originalText.trim() === '') {
      setText(originalText);
      return;
    }

    // If not Turkish, return original
    if (i18n.language !== 'tr') {
      setText(originalText);
      return;
    }

    // Check if translation key exists in i18n
    if (translationKey && t(translationKey) !== translationKey) {
      setText(t(translationKey));
      return;
    }

    // Abort previous translation if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsTranslating(true);
    setError(null);

    try {
      const translated = await translationService.translate(originalText, 'tr');

      // Check if this translation was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setText(translated);

      // Optionally add to i18n for future use
      if (translationKey && translated !== originalText) {
        i18n.addResource('tr', 'translation', translationKey, translated);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Translation error:', error);
      setError(error);
      setText(originalText); // Fallback to original
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    translate();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalText, i18n.language, enabled, translationKey]);

  const retranslate = () => {
    translate();
  };

  return { text, isTranslating, error, retranslate };
}

/**
 * Hook for batch translation
 */
export function useBatchAutoTranslate(
  texts: string[],
  options: UseAutoTranslateOptions = {}
): UseAutoTranslateReturn & { texts: string[] } {
  const { enabled = true, skipCache = false } = options;
  const { i18n } = useTranslation();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const translate = async () => {
    if (!enabled || texts.length === 0 || i18n.language !== 'tr') {
      setTranslatedTexts(texts);
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const translated = await translationService.translateBatch(texts, 'tr');

      setTranslatedTexts(translated);
    } catch (err) {
      const error = err as Error;
      console.error('Batch translation error:', error);
      setError(error);
      setTranslatedTexts(texts);
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    translate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(texts), i18n.language, enabled]);

  const retranslate = () => {
    translate();
  };

  return { text: translatedTexts[0] || '', texts: translatedTexts, isTranslating, error, retranslate };
}
