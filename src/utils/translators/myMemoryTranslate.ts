/**
 * MyMemory Translation API Implementation
 * Free Tier: 10,000 words/day
 * Good fallback option, no API key required
 */

export async function translateWithMyMemory(
  text: string,
  targetLang: string = 'tr',
  sourceLang: string = 'en'
): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus !== 200) {
      throw new Error(`MyMemory translation failed: ${data.responseStatus}`);
    }

    return data.responseData.translatedText;
  } catch (error) {
    console.error('MyMemory Translate error:', error);
    throw error;
  }
}

/**
 * Batch translate with delay to respect rate limits
 */
export async function batchTranslateWithMyMemory(
  texts: string[],
  targetLang: string = 'tr',
  sourceLang: string = 'en'
): Promise<string[]> {
  const translations: string[] = [];

  for (let i = 0; i < texts.length; i++) {
    try {
      const translation = await translateWithMyMemory(texts[i], targetLang, sourceLang);
      translations.push(translation);

      // Add delay to respect rate limits (1 request per second)
      if (i < texts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to translate item ${i}:`, error);
      translations.push(texts[i]); // Keep original on error
    }
  }

  return translations;
}
