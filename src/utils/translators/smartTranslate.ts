/**
 * Smart Translation System with Hybrid Approach
 * Tries multiple translation services with fallback
 * Uses caching to minimize API calls
 */

import { translateWithGoogle, batchTranslateWithGoogle } from './googleTranslate';
import { translateWithMyMemory, batchTranslateWithMyMemory } from './myMemoryTranslate';
import { translateWithLibre, batchTranslateWithLibre } from './libreTranslate';
import { translationCache } from './translationCache';

type TranslatorFunction = (text: string, targetLang: string, sourceLang: string) => Promise<string>;

interface TranslationOptions {
  targetLang?: string;
  sourceLang?: string;
  skipCache?: boolean;
  preferredService?: 'google' | 'mymemory' | 'libre';
}

/**
 * Smart translate with automatic fallback
 */
export async function smartTranslate(
  text: string,
  options: TranslationOptions = {}
): Promise<string> {
  const {
    targetLang = 'tr',
    sourceLang = 'en',
    skipCache = false,
    preferredService,
  } = options;

  // Return immediately if text is empty
  if (!text || text.trim() === '') {
    return text;
  }

  // Check cache first
  if (!skipCache) {
    const cached = translationCache.get(text, targetLang);
    if (cached) {
      console.log('✓ Using cached translation');
      return cached;
    }
  }

  // Define translators in order of preference
  const translators: Array<{ name: string; fn: TranslatorFunction }> = [
    { name: 'Google Translate', fn: translateWithGoogle },
    { name: 'MyMemory', fn: translateWithMyMemory },
    { name: 'LibreTranslate', fn: translateWithLibre },
  ];

  // Reorder if preferred service is specified
  if (preferredService) {
    const serviceMap: Record<string, string> = {
      google: 'Google Translate',
      mymemory: 'MyMemory',
      libre: 'LibreTranslate',
    };
    const preferredName = serviceMap[preferredService];
    const preferredIndex = translators.findIndex((t) => t.name === preferredName);
    if (preferredIndex > 0) {
      const [preferred] = translators.splice(preferredIndex, 1);
      translators.unshift(preferred);
    }
  }

  // Try each translator
  for (const translator of translators) {
    try {
      console.log(`Trying ${translator.name}...`);
      const result = await translator.fn(text, targetLang, sourceLang);

      if (result && result !== text) {
        console.log(`✓ Translated with ${translator.name}`);
        // Cache the successful translation
        translationCache.set(text, targetLang, result);
        return result;
      }
    } catch (error) {
      console.warn(`${translator.name} failed:`, error);
      continue;
    }
  }

  // All translators failed, return original text
  console.warn('All translation services failed, returning original text');
  return text;
}

/**
 * Batch translate multiple texts
 */
export async function batchSmartTranslate(
  texts: string[],
  options: TranslationOptions = {}
): Promise<string[]> {
  const { targetLang = 'tr', sourceLang = 'en', skipCache = false } = options;

  // Check cache and separate cached from uncached
  const results: string[] = new Array(texts.length);
  const uncachedIndices: number[] = [];
  const uncachedTexts: string[] = [];

  texts.forEach((text, index) => {
    if (!skipCache) {
      const cached = translationCache.get(text, targetLang);
      if (cached) {
        results[index] = cached;
        return;
      }
    }
    uncachedIndices.push(index);
    uncachedTexts.push(text);
  });

  // If everything is cached, return immediately
  if (uncachedTexts.length === 0) {
    console.log('✓ All translations from cache');
    return results;
  }

  console.log(`Translating ${uncachedTexts.length} uncached texts...`);

  // Try batch translation services
  try {
    const translations = await batchTranslateWithGoogle(uncachedTexts, targetLang, sourceLang);
    uncachedIndices.forEach((index, i) => {
      results[index] = translations[i];
      translationCache.set(texts[index], targetLang, translations[i]);
    });
    return results;
  } catch (error) {
    console.warn('Google batch translation failed, falling back to individual translations');
  }

  // Fallback: translate individually
  for (let i = 0; i < uncachedIndices.length; i++) {
    const index = uncachedIndices[i];
    const text = texts[index];
    results[index] = await smartTranslate(text, options);
  }

  return results;
}

/**
 * Translate with retry logic
 */
export async function translateWithRetry(
  text: string,
  options: TranslationOptions = {},
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await smartTranslate(text, options);
    } catch (error) {
      lastError = error as Error;
      console.warn(`Translation attempt ${attempt} failed:`, error);

      if (attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  console.error('All translation attempts failed:', lastError);
  return text; // Return original on failure
}

/**
 * Get translation statistics
 */
export function getTranslationStats() {
  return translationCache.getStats();
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  translationCache.clear();
}

/**
 * Export translations for backup
 */
export function exportTranslations(): string {
  return translationCache.export();
}

/**
 * Import translations from backup
 */
export function importTranslations(data: string): boolean {
  return translationCache.import(data);
}
