/**
 * Translation Cache Manager
 * Stores translations in localStorage to avoid repeated API calls
 */

const CACHE_KEY = 'salesence_translation_cache';
const CACHE_VERSION = 'v1';

interface TranslationCache {
  version: string;
  translations: Record<string, Record<string, string>>; // { sourceText: { targetLang: translation } }
  timestamp: number;
}

class TranslationCacheManager {
  private cache: TranslationCache;

  constructor() {
    this.cache = this.loadCache();
  }

  private loadCache(): TranslationCache {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.version === CACHE_VERSION) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }

    // Return empty cache if load fails or version mismatch
    return {
      version: CACHE_VERSION,
      translations: {},
      timestamp: Date.now(),
    };
  }

  private saveCache(): void {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  get(text: string, targetLang: string): string | null {
    const cached = this.cache.translations[text];
    if (cached && cached[targetLang]) {
      return cached[targetLang];
    }
    return null;
  }

  set(text: string, targetLang: string, translation: string): void {
    if (!this.cache.translations[text]) {
      this.cache.translations[text] = {};
    }
    this.cache.translations[text][targetLang] = translation;
    this.cache.timestamp = Date.now();
    this.saveCache();
  }

  has(text: string, targetLang: string): boolean {
    return this.get(text, targetLang) !== null;
  }

  clear(): void {
    this.cache = {
      version: CACHE_VERSION,
      translations: {},
      timestamp: Date.now(),
    };
    this.saveCache();
  }

  // Get cache statistics
  getStats() {
    const translationCount = Object.keys(this.cache.translations).length;
    const size = new Blob([JSON.stringify(this.cache)]).size;
    return {
      count: translationCount,
      sizeKB: (size / 1024).toFixed(2),
      timestamp: new Date(this.cache.timestamp).toLocaleString(),
    };
  }

  // Export cache for backup
  export(): string {
    return JSON.stringify(this.cache, null, 2);
  }

  // Import cache from backup
  import(data: string): boolean {
    try {
      const imported = JSON.parse(data);
      if (imported.version === CACHE_VERSION) {
        this.cache = imported;
        this.saveCache();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import cache:', error);
      return false;
    }
  }
}

export const translationCache = new TranslationCacheManager();
