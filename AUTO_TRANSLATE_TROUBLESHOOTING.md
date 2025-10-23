# Auto-Translation Troubleshooting Guide

## Why Auto-Translation Isn't Working

The auto-translation feature uses external translation APIs. Here's why it might not be working:

### 🔍 **Root Causes Identified:**

1. **No API Keys Configured**
   - OpenAI API key is empty (best quality but requires paid API key)
   - LibreTranslate now requires an API key (used to be free)
   - Only MyMemory API is truly free (10k words/day limit)

2. **CORS (Cross-Origin Resource Sharing) Issues**
   - Browser blocks direct API calls to third-party services
   - MyMemory API might work but has rate limits
   - LibreTranslate requires API key from portal.libretranslate.com

3. **Silent Failures**
   - Translation errors were not visible in console
   - No user feedback when translations fail

## ✅ **Solutions**

### **Option 1: Enable Debug Mode (RECOMMENDED for troubleshooting)**

1. Open `.env` file
2. Set debug mode to true:
   ```env
   VITE_TRANSLATION_DEBUG=true
   ```
3. Open browser console (F12)
4. Change language from EN → TR
5. Check console for detailed translation logs:
   - ✅ = Success
   - ⚠️ = Failed attempt
   - ⏭️ = Skipped (no API key)

### **Option 2: Use Google Translate (FREE - RECOMMENDED)**

Google Translate is now the primary free option:

**Status:** ✅ Currently working (NEW!)
- ✅ No API key needed
- ✅ Unlimited translations
- ✅ Excellent quality (Google's translation engine)
- ✅ Fast and reliable
- ⚠️ Uses unofficial API (might change)

**To verify it's working:**
1. Enable debug mode (see Option 1)
2. Open Console (F12)
3. Change language to Turkish
4. Look for: `✅ Translated with Google Translate`

### **Option 3: Use MyMemory API (FREE Backup)**

MyMemory is available as a backup if Google fails:

**Status:** ✅ Currently working
- No API key needed
- 10,000 words per day limit
- Decent quality translations
- May have CORS issues depending on browser

**To verify it's working:**
1. Enable debug mode (see Option 1)
2. Open Console (F12)
3. Change language to Turkish
4. Look for: `✅ Translated with MyMemory`

### **Option 3: Get OpenAI API Key (BEST QUALITY)**

For production use, OpenAI provides the best translation quality:

1. **Get API Key:**
   - Visit: https://platform.openai.com/api-keys
   - Create account / Sign in
   - Generate new API key
   - Copy the key

2. **Configure:**
   ```env
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

**Cost:** ~$0.002 per translation (very cheap)

### **Option 4: Get LibreTranslate API Key**

LibreTranslate now requires an API key:

1. **Get API Key:**
   - Visit: https://portal.libretranslate.com
   - Register for free tier or paid plan
   - Copy your API key

2. **Configure:**
   ```env
   VITE_LIBRETRANSLATE_API_KEY=your-libre-api-key-here
   ```

### **Option 5: Self-Host LibreTranslate**

For complete control:

1. **Deploy LibreTranslate:**
   ```bash
   docker run -d -p 5000:5000 libretranslate/libretranslate
   ```

2. **Configure:**
   ```env
   VITE_LIBRETRANSLATE_URL=http://localhost:5000
   VITE_LIBRETRANSLATE_API_KEY=  # Not needed for self-hosted
   ```

## 🔧 **Current Fallback Chain**

The system tries translations in this order:

1. **OpenAI** (if API key configured) - Best quality, paid
2. **Google Translate** - FREE, No API key required ✅
3. **MyMemory** - FREE, 10k words/day limit
4. **LibreTranslate** (if API key configured) - Good quality, requires API key

If all fail → Returns original English text

## 🐛 **Common Issues**

### Issue: "No translations happening"
**Solution:**
- Enable debug mode: `VITE_TRANSLATION_DEBUG=true`
- Check browser console for errors
- Verify MyMemory API is working
- Try adding OpenAI API key

### Issue: "Translations work sometimes"
**Solution:**
- MyMemory has rate limits (10k words/day)
- Consider upgrading to OpenAI
- Check browser CORS settings

### Issue: "CORS errors in console"
**Solution:**
- This is expected for browser-based translation
- MyMemory should still work despite CORS
- For production, consider backend translation proxy
- Or use OpenAI which has better CORS support

## 📊 **How to Verify It's Working**

1. **Enable Debug Mode:**
   ```env
   VITE_TRANSLATION_DEBUG=true
   ```

2. **Open Browser Console** (F12)

3. **Change Language:**
   - Click globe icon in navbar
   - Switch from EN → TR

4. **Check Console Logs:**
   ```
   🔄 Trying MyMemory translation...
   ✅ Translated with MyMemory
   ```

5. **Check Product Analysis:**
   - Analyze a product
   - Product name/suggestions should translate to Turkish
   - Check "Analysis Complete" text → "Analiz Tamamlandı"

## 🚀 **Recommended Setup for Production**

```env
# Best quality + reliability
VITE_OPENAI_API_KEY=sk-your-openai-key
VITE_TRANSLATION_DEBUG=false

# Fallback if OpenAI fails
VITE_LIBRETRANSLATE_API_KEY=your-libre-key

# Enable debug logs during development only
VITE_TRANSLATION_DEBUG=true  # Only during dev!
```

## 📝 **Testing Translation**

1. Start dev server with debug enabled
2. Open browser console
3. Navigate to homepage
4. Change language to Turkish (TR)
5. Analyze a product (paste Amazon/eBay URL)
6. Check console for translation logs
7. Verify product details appear in Turkish

## 🔐 **Security Notes**

- Never commit API keys to git
- `.env` file is in `.gitignore`
- Use `.env.example` for template
- Rotate API keys if exposed

## 💡 **Performance Tips**

- Translations are cached in localStorage
- Clear cache: `translationService.clearCache()` in console
- Check cache stats: `translationService.getCacheStats()`
- MyMemory is slower but free
- OpenAI is faster and better quality

## 🆘 **Still Not Working?**

1. Clear browser cache
2. Check browser console for specific errors
3. Verify network tab shows API requests
4. Try different browser (CORS issues vary)
5. Test with OpenAI API key first
6. Contact support with console logs

---

**Last Updated:** 2025-01-22
**Auto-Translation Version:** 2.0
