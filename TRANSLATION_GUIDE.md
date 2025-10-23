# 🌍 Automatic Translation Guide for Salesence

This guide explains how to use the automatic translation system in your Salesence project.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Setup Instructions](#setup-instructions)
3. [Usage Examples](#usage-examples)
4. [API Reference](#api-reference)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### 1. Get Your Google Translate API Key (FREE)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable "Cloud Translation API"
4. Go to Credentials → Create Credentials → API Key
5. Copy your API key

### 2. Add API Key to Environment

Open `.env` file and replace the placeholder:

```env
VITE_GOOGLE_TRANSLATE_API_KEY=your_actual_api_key_here
```

### 3. Use in Your Components

```tsx
import { useAutoTranslate } from '@/hooks/useAutoTranslate';

function ProductCard({ product }) {
  const { text: title } = useAutoTranslate(product.name);

  return <h3>{title}</h3>;
}
```

**That's it!** 🎉 Your content will automatically translate to Turkish when users switch language.

---

## ⚙️ Setup Instructions

### Installation

All dependencies are already installed. No additional packages needed!

### Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```env
   VITE_GOOGLE_TRANSLATE_API_KEY=your_key_here
   ```

3. **IMPORTANT:** Never commit `.env` to Git (already in `.gitignore`)

### How It Works

The system uses a **hybrid approach** with automatic fallback:

1. **Google Translate** (Primary) - Best quality, 500k chars/month free
2. **MyMemory** (Fallback) - Good quality, 10k words/day free
3. **LibreTranslate** (Final Fallback) - 100% free, unlimited

Plus **intelligent caching** to avoid repeated API calls.

---

## 💡 Usage Examples

### Example 1: Basic Text Translation

```tsx
import { useAutoTranslate } from '@/hooks/useAutoTranslate';

function Welcome() {
  const { text, isTranslating } = useAutoTranslate('Welcome to Salesence!');

  return (
    <h1>
      {isTranslating ? 'Translating...' : text}
    </h1>
  );
}
```

### Example 2: Dynamic Product Data

```tsx
function ProductCard({ product }) {
  const { text: name } = useAutoTranslate(product.name);
  const { text: description } = useAutoTranslate(product.description);

  return (
    <div>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### Example 3: With Translation Key (Recommended)

```tsx
// This saves the translation to i18n for future use
function Feature({ title, description }) {
  const { text: titleText } = useAutoTranslate(title, {
    translationKey: 'features.title'
  });

  const { text: descText } = useAutoTranslate(description, {
    translationKey: 'features.description'
  });

  return (
    <div>
      <h4>{titleText}</h4>
      <p>{descText}</p>
    </div>
  );
}
```

### Example 4: Batch Translation

```tsx
import { useBatchAutoTranslate } from '@/hooks/useAutoTranslate';

function FeatureList({ features }) {
  const { texts, isTranslating } = useBatchAutoTranslate(
    features.map(f => f.title)
  );

  return (
    <ul>
      {texts.map((text, i) => (
        <li key={i}>{text}</li>
      ))}
    </ul>
  );
}
```

### Example 5: Programmatic Translation

```tsx
import { smartTranslate } from '@/utils/translators/smartTranslate';

async function translateProductData(product) {
  const translatedName = await smartTranslate(product.name);
  const translatedDesc = await smartTranslate(product.description);

  return {
    ...product,
    name: translatedName,
    description: translatedDesc
  };
}
```

### Example 6: With Error Handling

```tsx
function RobustComponent({ content }) {
  const { text, isTranslating, error, retranslate } = useAutoTranslate(content);

  if (error) {
    return (
      <div>
        <p>Translation failed: {error.message}</p>
        <button onClick={retranslate}>Retry</button>
      </div>
    );
  }

  return <p>{isTranslating ? 'Loading...' : text}</p>;
}
```

---

## 📚 API Reference

### `useAutoTranslate(text, options)`

Hook for automatic translation.

**Parameters:**
- `text` (string): Text to translate
- `options` (object, optional):
  - `enabled` (boolean): Enable/disable translation (default: true)
  - `translationKey` (string): Key to save translation in i18n
  - `skipCache` (boolean): Skip cache and force new translation

**Returns:**
- `text` (string): Translated text
- `isTranslating` (boolean): Translation in progress
- `error` (Error | null): Translation error if any
- `retranslate` (function): Retry translation

---

### `smartTranslate(text, options)`

Function for programmatic translation.

**Parameters:**
- `text` (string): Text to translate
- `options` (object, optional):
  - `targetLang` (string): Target language code (default: 'tr')
  - `sourceLang` (string): Source language code (default: 'en')
  - `skipCache` (boolean): Skip cache
  - `preferredService` (string): 'google' | 'mymemory' | 'libre'

**Returns:** Promise<string>

**Example:**
```tsx
const translated = await smartTranslate('Hello World', {
  targetLang: 'tr',
  preferredService: 'google'
});
```

---

### `batchSmartTranslate(texts, options)`

Batch translate multiple texts efficiently.

**Parameters:**
- `texts` (string[]): Array of texts to translate
- `options` (object): Same as smartTranslate

**Returns:** Promise<string[]>

**Example:**
```tsx
const texts = ['Hello', 'World', 'Welcome'];
const translated = await batchSmartTranslate(texts);
// ['Merhaba', 'Dünya', 'Hoş geldiniz']
```

---

### Translation Cache Management

```tsx
import {
  getTranslationStats,
  clearTranslationCache,
  exportTranslations,
  importTranslations
} from '@/utils/translators/smartTranslate';

// Get cache statistics
const stats = getTranslationStats();
console.log(`Cached: ${stats.count} translations, ${stats.sizeKB} KB`);

// Clear cache
clearTranslationCache();

// Export for backup
const backup = exportTranslations();
localStorage.setItem('translation_backup', backup);

// Import from backup
const success = importTranslations(backup);
```

---

## 🎯 Best Practices

### 1. Use Translation Keys for Static Content

```tsx
// ✅ Good - Saves to i18n for reuse
const { text } = useAutoTranslate('Welcome', {
  translationKey: 'home.welcome'
});

// ❌ Less optimal - Translates every time
const { text } = useAutoTranslate('Welcome');
```

### 2. Batch Similar Translations

```tsx
// ✅ Good - One API call for all
const { texts } = useBatchAutoTranslate([title1, title2, title3]);

// ❌ Bad - Three separate API calls
const text1 = useAutoTranslate(title1);
const text2 = useAutoTranslate(title2);
const text3 = useAutoTranslate(title3);
```

### 3. Handle Loading States

```tsx
// ✅ Good - Show loading indicator
const { text, isTranslating } = useAutoTranslate(content);
return isTranslating ? <Spinner /> : <p>{text}</p>;

// ❌ Bad - No loading state
const { text } = useAutoTranslate(content);
return <p>{text}</p>; // Shows English briefly
```

### 4. Use Cache Effectively

```tsx
// Cache is automatic! Same text will only translate once
const { text: name1 } = useAutoTranslate('Premium Product');
const { text: name2 } = useAutoTranslate('Premium Product'); // From cache!
```

### 5. Don't Translate Empty Strings

```tsx
// ✅ Good - Check before translating
const { text } = useAutoTranslate(
  product.description || 'No description available'
);

// ❌ Bad - Wastes API call
const { text } = useAutoTranslate(product.description || '');
```

---

## 🔧 Advanced Configuration

### Custom Translation Service Order

```tsx
// Use LibreTranslate first (free but slower)
const translated = await smartTranslate('Hello', {
  preferredService: 'libre'
});
```

### Disable Caching for Real-time Data

```tsx
// Always fetch fresh translation (not recommended)
const { text } = useAutoTranslate(liveData, {
  skipCache: true
});
```

### Conditional Translation

```tsx
// Only translate in Turkish mode
const { text } = useAutoTranslate(content, {
  enabled: i18n.language === 'tr'
});
```

---

## 🐛 Troubleshooting

### Problem: "Google Translate API error: 403"

**Solution:** Check your API key and make sure Cloud Translation API is enabled.

```env
# Verify your API key is correct
VITE_GOOGLE_TRANSLATE_API_KEY=AIzaSy...
```

### Problem: Translations not working

**Solutions:**
1. Check if language is set to Turkish
2. Check browser console for errors
3. Verify `.env` file exists and has correct key
4. Clear cache: `clearTranslationCache()`

### Problem: Slow translations

**Solutions:**
1. Use batch translation for multiple texts
2. Ensure caching is enabled (default)
3. Check network connection
4. Consider using translation keys for static content

### Problem: API rate limit exceeded

**Solution:** System automatically falls back to alternative services:
- Google Translate (500k chars/month)
- MyMemory (10k words/day)
- LibreTranslate (unlimited)

### Problem: Need to reset cache

```tsx
import { clearTranslationCache } from '@/utils/translators/smartTranslate';

// Clear all cached translations
clearTranslationCache();
```

---

## 📊 Monitoring Translation Usage

### Check Cache Statistics

```tsx
import { getTranslationStats } from '@/utils/translators/smartTranslate';

const stats = getTranslationStats();
console.log(`
  Translations cached: ${stats.count}
  Cache size: ${stats.sizeKB} KB
  Last updated: ${stats.timestamp}
`);
```

### Estimate API Usage

```tsx
// Average: 100 characters per translation
// Your free tier: 500,000 characters/month
// Estimated translations: 5,000/month

// With caching, most requests are free!
```

---

## 🎉 You're Ready!

Start translating your content automatically:

1. ✅ API key configured
2. ✅ `.env` file secured
3. ✅ Import `useAutoTranslate`
4. ✅ Wrap your text
5. ✅ Enjoy automatic translations!

Need help? Check the examples above or create an issue.

---

## 📝 Quick Reference

```tsx
// Basic usage
const { text } = useAutoTranslate('Hello World');

// With options
const { text, isTranslating, error, retranslate } = useAutoTranslate(
  'Hello World',
  { translationKey: 'greeting', enabled: true }
);

// Batch translation
const { texts } = useBatchAutoTranslate(['Hello', 'World']);

// Programmatic
const text = await smartTranslate('Hello');
const texts = await batchSmartTranslate(['Hello', 'World']);

// Cache management
getTranslationStats();
clearTranslationCache();
exportTranslations();
importTranslations(data);
```

Happy translating! 🚀
