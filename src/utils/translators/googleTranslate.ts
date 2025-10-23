/**
 * Google Translate API Implementation
 * Free Tier: 500,000 characters/month
 * Best quality, recommended for production
 */

export async function translateWithGoogle(
  text: string,
  targetLang: string = 'tr',
  sourceLang: string = 'en'
): Promise<string> {
  const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

  if (!API_KEY || API_KEY.trim() === '') {
    throw new Error('Google Translate API key not configured - using fallback services');
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          source: sourceLang,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Google Translate error:', error);
    throw error;
  }
}

/**
 * Batch translate multiple texts
 */
export async function batchTranslateWithGoogle(
  texts: string[],
  targetLang: string = 'tr',
  sourceLang: string = 'en'
): Promise<string[]> {
  const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY;

  if (!API_KEY || API_KEY.trim() === '') {
    throw new Error('Google Translate API key not configured - using fallback services');
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
          target: targetLang,
          source: sourceLang,
          format: 'text',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations.map((t: any) => t.translatedText);
  } catch (error) {
    console.error('Google Translate batch error:', error);
    throw error;
  }
}
