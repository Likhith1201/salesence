import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translationService } from '@/utils/translationService';
import { Button } from '@/components/ui/button';

export default function TestTranslation() {
  const { i18n } = useTranslation();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testTranslation = async () => {
    setLoading(true);
    console.log('🔍 Testing translation...');
    console.log('Current language:', i18n.language);
    console.log('VITE_OPENAI_API_KEY exists?', !!import.meta.env.VITE_OPENAI_API_KEY);
    console.log('API Key (first 20 chars):', import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 20));

    try {
      const translated = await translationService.translate('Hello World', 'tr');
      console.log('✅ Translation result:', translated);
      setResult(translated);
    } catch (error) {
      console.error('❌ Translation error:', error);
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Translation Service Test</h1>

      <div className="space-y-4 bg-slate-800 p-6 rounded-lg">
        <div>
          <p><strong>Current Language:</strong> {i18n.language}</p>
          <p><strong>API Key Loaded:</strong> {import.meta.env.VITE_OPENAI_API_KEY ? 'Yes ✅' : 'No ❌'}</p>
          <p><strong>API Key Preview:</strong> {import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 30)}...</p>
        </div>

        <Button
          onClick={testTranslation}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {loading ? 'Translating...' : 'Test Translation: "Hello World" → Turkish'}
        </Button>

        {result && (
          <div className="mt-4 p-4 bg-slate-700 rounded">
            <p><strong>Result:</strong></p>
            <p className="text-lg">{result}</p>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-500 rounded">
        <p className="font-bold text-yellow-400">⚠️ Important:</p>
        <p className="text-sm text-yellow-200">
          If the API key shows "No ❌", you need to restart the dev server after adding the .env file:
        </p>
        <code className="block mt-2 p-2 bg-black/50 rounded text-xs">
          npm run dev
        </code>
      </div>
    </div>
  );
}
