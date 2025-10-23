// Translation Service - OpenAI (primary), LibreTranslate and MyMemory (free fallbacks)
// Intelligent fallback system with caching

interface TranslationCache {
  [key: string]: string;
}

class TranslationService {
  private cache: TranslationCache = {};
  private cacheKey = 'salesence_translations';
  private translating = new Map<string, Promise<string>>();

  constructor() {
    this.loadCache();
  }

  /**
   * Main translation method with caching and fallback
   */
  async translate(text: string, targetLang: string = 'tr'): Promise<string> {
    if (!text || text.trim() === '') return text;

    const cacheKey = this.getCacheKey(text, targetLang);

    // Check cache first
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    // Check if already translating (prevent duplicate requests)
    if (this.translating.has(cacheKey)) {
      return this.translating.get(cacheKey)!;
    }

    // Start new translation
    const translationPromise = this.performTranslation(text, targetLang);
    this.translating.set(cacheKey, translationPromise);

    try {
      const result = await translationPromise;
      this.cacheTranslation(cacheKey, result);
      return result;
    } finally {
      this.translating.delete(cacheKey);
    }
  }

  /**
   * Translate multiple texts in batch
   */
  async translateBatch(texts: string[], targetLang: string = 'tr'): Promise<string[]> {
    const results = await Promise.all(
      texts.map(text => this.translate(text, targetLang))
    );
    return results;
  }

  /**
   * Translate an object with multiple text fields
   */
  async translateObject<T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[],
    targetLang: string = 'tr'
  ): Promise<T> {
    const translated = { ...obj };

    for (const field of fields) {
      if (typeof obj[field] === 'string') {
        translated[field] = await this.translate(obj[field] as string, targetLang);
      }
    }

    return translated;
  }

  /**
   * Perform actual translation with fallback logic
   */
  private async performTranslation(text: string, targetLang: string): Promise<string> {
    const isDebug = import.meta.env.VITE_TRANSLATION_DEBUG === 'true';

    // Try OpenAI first (best quality if API key available)
    const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (openaiKey && openaiKey !== 'your_openai_api_key_here') {
      try {
        if (isDebug) console.log('🔄 Trying OpenAI translation...');
        const result = await this.translateWithOpenAI(text, targetLang);
        if (result && result !== text) {
          console.log('✅ Translated with OpenAI');
          return result;
        }
      } catch (error) {
        console.warn('⚠️ OpenAI failed:', error);
      }
    } else if (isDebug) {
      console.log('⏭️ Skipping OpenAI (no API key configured)');
    }

    // Try Google Translate (free, no API key, best fallback)
    try {
      if (isDebug) console.log('🔄 Trying Google Translate...');
      const result = await this.translateWithGoogle(text, targetLang);
      if (result && result !== text) {
        console.log('✅ Translated with Google Translate');
        return result;
      }
    } catch (error) {
      console.warn('⚠️ Google Translate failed:', error);
    }

    // Try MyMemory (free, no API key, decent quality)
    try {
      if (isDebug) console.log('🔄 Trying MyMemory translation...');
      const result = await this.translateWithMyMemory(text, targetLang);
      if (result && result !== text) {
        console.log('✅ Translated with MyMemory');
        return result;
      }
    } catch (error) {
      console.warn('⚠️ MyMemory failed:', error);
    }

    // Fallback to LibreTranslate (requires API key now)
    const libreKey = import.meta.env.VITE_LIBRETRANSLATE_API_KEY;
    if (libreKey) {
      try {
        if (isDebug) console.log('🔄 Trying LibreTranslate...');
        const result = await this.translateWithLibre(text, targetLang);
        if (result && result !== text) {
          console.log('✅ Translated with LibreTranslate');
          return result;
        }
      } catch (error) {
        console.warn('⚠️ LibreTranslate failed:', error);
      }
    } else if (isDebug) {
      console.log('⏭️ Skipping LibreTranslate (no API key configured)');
    }

    // All failed, return original
    console.warn('❌ All translation services failed, returning original text');
    return text;
  }

  /**
   * OpenAI GPT Translation (Best quality, requires API key)
   */
  private async translateWithOpenAI(text: string, targetLang: string): Promise<string> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const targetLanguage = targetLang === 'tr' ? 'Turkish' : targetLang;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the given text to ${targetLanguage}. Return ONLY the translation, nothing else. Maintain the original tone and style.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }

  /**
   * LibreTranslate API (Requires API key from portal.libretranslate.com)
   */
  private async translateWithLibre(text: string, targetLang: string): Promise<string> {
    const apiKey = import.meta.env.VITE_LIBRETRANSLATE_API_KEY;
    const baseUrl = import.meta.env.VITE_LIBRETRANSLATE_URL || 'https://libretranslate.com';

    const body: any = {
      q: text,
      source: 'en',
      target: targetLang,
      format: 'text',
    };

    if (apiKey) {
      body.api_key = apiKey;
    }

    const response = await fetch(`${baseUrl}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`LibreTranslate error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.translatedText;
  }

  /**
   * Google Translate API (Free, No API key required)
   * Uses unofficial Google Translate API endpoint
   */
  private async translateWithGoogle(text: string, targetLang: string): Promise<string> {
    // Google Translate unofficial API endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Translate error: ${response.status}`);
    }

    const data = await response.json();

    // Google Translate returns a nested array structure
    // Format: [[[translatedText, originalText, ...]]]
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }

    throw new Error('Google Translate returned unexpected format');
  }

  /**
   * MyMemory Translation API (Free, 10k words/day)
   */
  private async translateWithMyMemory(text: string, targetLang: string): Promise<string> {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|${targetLang}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`MyMemory error: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus !== 200) {
      throw new Error('MyMemory translation failed');
    }

    return data.responseData.translatedText;
  }

  /**
   * Cache management
   */
  private getCacheKey(text: string, lang: string): string {
    return `${lang}:${text.substring(0, 100)}`; // Use first 100 chars as key
  }

  private cacheTranslation(key: string, translation: string) {
    this.cache[key] = translation;
    this.saveCache();
  }

  private loadCache() {
    try {
      const stored = localStorage.getItem(this.cacheKey);
      if (stored) {
        this.cache = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
  }

  private saveCache() {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save translation cache:', error);
    }
  }

  /**
   * Clear cache (useful for debugging)
   */
  clearCache() {
    this.cache = {};
    localStorage.removeItem(this.cacheKey);
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      entries: Object.keys(this.cache).length,
      size: new Blob([JSON.stringify(this.cache)]).size,
    };
  }
}

// Export singleton instance
export const translationService = new TranslationService();

// Export for convenience
export const translate = (text: string, targetLang?: string) =>
  translationService.translate(text, targetLang);

export const translateBatch = (texts: string[], targetLang?: string) =>
  translationService.translateBatch(texts, targetLang);
