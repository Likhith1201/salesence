/**
 * LibreTranslate API Implementation
 * 100% Free and Open Source
 * Final fallback option
 */

const LIBRE_TRANSLATE_URL = 'https://libretranslate.com/translate';

export async function translateWithLibre(
  text: string,
  targetLang: string = 'tr',
  sourceLang: string = 'en'
): Promise<string> {
  try {
    const response = await fetch(LIBRE_TRANSLATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('LibreTranslate error:', error);
    throw error;
  }
}

/**
 * Batch translate with delay to respect rate limits
 */
export async function batchTranslateWithLibre(
  texts: string[],
  targetLang: string = 'tr',
  sourceLang: string = 'en'
): Promise<string[]> {
  const translations: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    try {
      const translation = await translateWithLibre(texts[i], targetLang, sourceLang);
      translations.push(translation);

      // Add delay to respect rate limits
      if (i < texts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Failed to translate item ${i}:`, error);
      translations.push(texts[i]); // Keep original on error
    }
  }

  return translations;
}
