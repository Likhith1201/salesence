/**
 * Auto-translation utilities
 * Helper functions to easily translate content across the app
 */

import { translationService } from './translationService';

/**
 * Translate dynamic content (not from i18n files)
 * Use this for user-generated content, API responses, etc.
 */
export const translateDynamic = async (text: string, targetLang: string = 'tr'): Promise<string> => {
  if (!text || text.trim() === '') return text;
  return await translationService.translate(text, targetLang);
};

/**
 * Translate multiple texts at once
 */
export const translateDynamicBatch = async (texts: string[], targetLang: string = 'tr'): Promise<string[]> => {
  return await translationService.translateBatch(texts, targetLang);
};

/**
 * Translate object fields
 */
export const translateDynamicObject = async <T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  targetLang: string = 'tr'
): Promise<T> => {
  return await translationService.translateObject(obj, fields, targetLang);
};

/**
 * Check if translation should be applied based on current language
 */
export const shouldTranslate = (currentLanguage: string): boolean => {
  return currentLanguage === 'tr';
};

/**
 * Extract all text content from an object recursively
 */
export const extractTextFields = (obj: any, excludeKeys: string[] = []): string[] => {
  const texts: string[] = [];

  const extract = (value: any) => {
    if (typeof value === 'string' && value.trim() !== '') {
      texts.push(value);
    } else if (Array.isArray(value)) {
      value.forEach(extract);
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([key, val]) => {
        if (!excludeKeys.includes(key)) {
          extract(val);
        }
      });
    }
  };

  extract(obj);
  return texts;
};

/**
 * Translate all text fields in an object automatically
 */
export const translateObjectAuto = async (
  obj: any,
  targetLang: string = 'tr',
  excludeKeys: string[] = ['id', 'url', 'image', 'imageUrl', 'href', 'src']
): Promise<any> => {
  if (typeof obj === 'string') {
    return await translationService.translate(obj, targetLang);
  }

  if (Array.isArray(obj)) {
    return await Promise.all(obj.map(item => translateObjectAuto(item, targetLang, excludeKeys)));
  }

  if (typeof obj === 'object' && obj !== null) {
    const translated: any = { ...obj };

    for (const [key, value] of Object.entries(obj)) {
      if (!excludeKeys.includes(key)) {
        translated[key] = await translateObjectAuto(value, targetLang, excludeKeys);
      }
    }

    return translated;
  }

  return obj;
};

export default {
  translateDynamic,
  translateDynamicBatch,
  translateDynamicObject,
  translateObjectAuto,
  shouldTranslate,
  extractTextFields
};
