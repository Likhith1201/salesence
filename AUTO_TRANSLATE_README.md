# 🌍 Auto-Translation System - Simple Guide

## ✨ What You Get

Your app now automatically translates **ALL content to Turkish** when users switch language!

### 🆓 **100% FREE** Translation Services:
1. **Google Translate** (optional, best quality) - 500k chars/month free
2. **MyMemory** (always free) - 10k words/day, no API key needed
3. **LibreTranslate** (always free) - Unlimited, no API key needed

### 🚀 **Smart Features:**
- ✅ Automatic caching (translates once, uses forever)
- ✅ Automatic fallback (if one service fails, tries the next)
- ✅ Works with or without Google API key
- ✅ Zero configuration needed for free services

---

## 📖 How to Use

### Option 1: Use with Google Translate (Best Quality)

1. Get free API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Open `.env` file
3. Add your key:
   ```env
   VITE_GOOGLE_TRANSLATE_API_KEY=your_key_here
   ```

### Option 2: Use 100% Free (No API Key)

Leave `.env` as is! The system automatically uses MyMemory and LibreTranslate.

---

## 💻 Usage in Code

### Basic Usage (Most Common)

```tsx
import { useAutoTranslate } from '@/hooks/useAutoTranslate';

function ProductCard({ product }) {
  const { text: title } = useAutoTranslate(product.name);
  const { text: description } = useAutoTranslate(product.description);

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
```

### With Loading State

```tsx
function ProductCard({ product }) {
  const { text, isTranslating } = useAutoTranslate(product.name);

  if (isTranslating) {
    return <Skeleton />;
  }

  return <h3>{text}</h3>;
}
```

### Translate Object Fields

```tsx
import { smartTranslate } from '@/utils/translators/smartTranslate';

async function translateProduct(product) {
  return {
    ...product,
    name: await smartTranslate(product.name),
    description: await smartTranslate(product.description)
  };
}
```

### Batch Translation (Faster)

```tsx
import { batchSmartTranslate } from '@/utils/translators/smartTranslate';

async function translateProducts(products) {
  const names = products.map(p => p.name);
  const translatedNames = await batchSmartTranslate(names);

  return products.map((product, i) => ({
    ...product,
    name: translatedNames[i]
  }));
}
```

---

## 🎯 Real Examples

### Example 1: Product Page

```tsx
// Before
<h1>{product.name}</h1>
<p>{product.description}</p>

// After - Auto-translates to Turkish!
const { text: name } = useAutoTranslate(product.name);
const { text: desc } = useAutoTranslate(product.description);

<h1>{name}</h1>
<p>{desc}</p>
```

### Example 2: Feature List

```tsx
const features = [
  "Fast Shipping",
  "24/7 Support",
  "Money Back Guarantee"
];

function Features() {
  return features.map((feature, i) => {
    const { text } = useAutoTranslate(feature);
    return <li key={i}>{text}</li>;
  });
}
```

### Example 3: Dynamic API Data

```tsx
function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(async (data) => {
      // Auto-translate all products
      const translated = await Promise.all(
        data.map(product =>
          smartTranslate(product.name).then(name => ({
            ...product,
            name
          }))
        )
      );
      setProducts(translated);
    });
  }, []);

  return products.map(p => <ProductCard key={p.id} product={p} />);
}
```

---

## ⚡ How It Works

1. **User switches to Turkish** 🇹🇷
2. **System checks cache** - Already translated? Use it!
3. **Not in cache?** - Translate with:
   - Google Translate (if API key provided)
   - MyMemory (free fallback)
   - LibreTranslate (free fallback)
4. **Save to cache** - Never translate the same text twice!

---

## 💰 Cost

### With Google API Key:
- **Free Tier**: 500,000 characters/month
- **Your Usage**: ~300,000 chars/month with caching
- **Cost**: $0/month (within free tier!)

### Without Google API Key:
- **MyMemory**: 10,000 words/day FREE
- **LibreTranslate**: Unlimited FREE (rate-limited)
- **Cost**: $0/month forever!

---

## 🔧 Advanced Usage

### Clear Cache

```tsx
import { clearTranslationCache } from '@/utils/translators/smartTranslate';

// Clear all cached translations
clearTranslationCache();
```

### Check Cache Stats

```tsx
import { getTranslationStats } from '@/utils/translators/smartTranslate';

const stats = getTranslationStats();
console.log(`Cached: ${stats.count} translations`);
```

### Force Re-translate

```tsx
const { text, retranslate } = useAutoTranslate(content);

<button onClick={retranslate}>Retry Translation</button>
```

---

## 🐛 Troubleshooting

**Problem: Translations not working**

✅ Check if language is set to Turkish (`tr`)
✅ Check browser console for errors
✅ Try clearing cache: `clearTranslationCache()`

**Problem: Slow translations**

✅ Use batch translation for multiple texts
✅ Ensure caching is working (check localStorage)
✅ Check internet connection

**Problem: Rate limit**

✅ System automatically falls back to other free services
✅ Enable caching (it's enabled by default)
✅ Consider adding Google API key for higher limits

---

## 📊 Quick Reference

```tsx
// Import hook
import { useAutoTranslate } from '@/hooks/useAutoTranslate';

// Use in component
const { text, isTranslating, error, retranslate } = useAutoTranslate('Hello');

// Programmatic translation
import { smartTranslate, batchSmartTranslate } from '@/utils/translators/smartTranslate';

const text = await smartTranslate('Hello');
const texts = await batchSmartTranslate(['Hello', 'World']);

// Cache management
import { getTranslationStats, clearTranslationCache } from '@/utils/translators/smartTranslate';

getTranslationStats();  // View stats
clearTranslationCache(); // Clear cache
```

---

## ✅ Summary

1. **No setup required** - Works out of the box with free services
2. **Optionally add Google API key** for best quality
3. **Use `useAutoTranslate()` hook** in your components
4. **System handles everything else** - caching, fallback, errors

That's it! Your app now auto-translates to Turkish! 🎉

---

## 📝 Need Help?

Check `TRANSLATION_GUIDE.md` for detailed documentation or create an issue.
