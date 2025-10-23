import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, Bot, User, Sparkles, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotKnowledge {
  [key: string]: {
    response: string;
    suggestions?: string[];
  };
}

export const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chatbot knowledge base with website information
  const knowledge: ChatbotKnowledge = {
    // Greetings (English and Turkish)
    'hello|hi|hey|greetings|merhaba|selam|naber': {
      response: t('chatbotGreeting') || "👋 Hello! Welcome to Salesence AI! I'm here to help you dominate your marketplace with AI-powered insights. Whether you're selling on Amazon, eBay, or any other platform, I can show you how to optimize your listings, boost sales, and outsmart the competition. What would you like to know?",
      suggestions: [t('chatbotWhatIsSalesence'), t('chatbotPricingInfo'), t('chatbotHowToStart')]
    },

    // About Salesence (English and Turkish)
    'what is salesence|about salesence|what does salesence do|salesence nedir|salesence hakkında|salesence ne yapar': {
      response: t('chatbotAboutSalesence') || "🚀 Salesence is your AI-powered marketplace optimization platform! We help e-commerce sellers like you:\n\n✨ Analyze products with advanced AI\n📊 Get real-time competitor insights\n💰 Optimize pricing strategies\n🎯 Improve product titles & descriptions\n📈 Track performance metrics\n🌍 Support for 90+ marketplaces\n\nThink of us as your personal data scientist for e-commerce, working 24/7 to give you the edge you need!",
      suggestions: [t('chatbotFeatures'), t('chatbotPricing'), t('chatbotDemo')]
    },

    // Pricing (English and Turkish)
    'pricing|price|cost|plans|how much|fiyat|fiyatlandırma|plan|ne kadar|ücret': {
      response: t('chatbotPricingResponse') || "💎 We offer flexible pricing plans for sellers at every stage:\n\n🌱 **Starter Plan** - $29/month\nPerfect for beginners managing 10-50 products\n\n🚀 **Professional Plan** - $79/month (Most Popular!)\nIdeal for growing businesses with up to 500 products\n\n🏢 **Enterprise Plan** - Custom pricing\nTailored solutions for large-scale operations\n\n✨ All plans include:\n• AI-powered analysis\n• Real-time competitor tracking\n• Performance analytics\n• Multi-marketplace support\n\n💰 Get 2 FREE months when you choose yearly billing!",
      suggestions: [t('chatbotStarterPlan'), t('chatbotProfessionalPlan'), t('chatbotEnterprisePlan')]
    },

    // Features (English and Turkish)
    'features|what can it do|capabilities|functionality|özellik|neler yapabilir|işlevsellik': {
      response: t('chatbotFeaturesResponse') || "⚡ Salesence comes packed with powerful features:\n\n🤖 **AI Analysis** - Deep learning algorithms analyze your products and competitors\n\n🎯 **Smart Optimization** - Get instant recommendations for titles, descriptions, and pricing\n\n📊 **Performance Tracking** - Monitor sales, views, and conversion rates in real-time\n\n🔍 **Competitor Intelligence** - Track pricing, trends, and strategies of your competition\n\n🌐 **Multi-Platform Support** - Works with Amazon, eBay, Shopify, and 90+ marketplaces\n\n⚡ **Lightning Fast** - Get insights in under 2 minutes\n\nWhich feature interests you most?",
      suggestions: [t('chatbotAIAnalysis'), t('chatbotOptimization'), t('chatbotTracking')]
    },

    // Getting Started (English and Turkish)
    'how to start|get started|begin|setup|nasıl başlar|başlangıç|kurulum|başla': {
      response: t('chatbotGetStartedResponse') || "🎯 Getting started with Salesence is super easy! Here's how:\n\n1️⃣ **Sign Up** (2 minutes)\nCreate your free account - no credit card required for the trial\n\n2️⃣ **Connect Your Store** (1 minute)\nLink your marketplace accounts (Amazon, eBay, etc.)\n\n3️⃣ **First Analysis** (instant)\nPaste any product URL and get AI-powered insights immediately\n\n4️⃣ **Optimize & Grow** (ongoing)\nApply recommendations and watch your sales soar!\n\n🎁 Start with our free trial - analyze up to 10 products for free!\n\nReady to begin your journey?",
      suggestions: [t('chatbotSignUp'), t('chatbotDemo'), t('chatbotContact')]
    },

    // Marketplaces (English and Turkish)
    'marketplaces|platforms|amazon|ebay|shopify|pazaryeri|platform': {
      response: t('chatbotMarketplacesResponse') || "🌐 We support 90+ marketplaces worldwide! Here are the most popular:\n\n🛒 **E-commerce Giants:**\n• Amazon (all regions)\n• eBay\n• Shopify\n• Walmart\n\n📦 **Specialized Platforms:**\n• Etsy (handmade & vintage)\n• AliExpress\n• Rakuten\n• Allegro\n\n🌍 **Regional Leaders:**\n• Mercado Libre (Latin America)\n• Cdiscount (France)\n• Bol.com (Netherlands)\n\nAnd many more! If you're selling it, we probably support it. Need help with integration?",
      suggestions: [t('chatbotSupportedPlatforms'), t('chatbotIntegration'), t('chatbotDemo')]
    },

    // General Support
    'help|support|contact|assistance|yardım|destek|iletişim': {
      response: t('chatbotSupportResponse') || "🤝 We're here to help you succeed! Our support team is ready to assist:\n\n📧 **Email Support** - support@salesence.com\nResponse time: Under 2 hours\n\n💬 **Live Chat** - Available 24/7\nGet instant answers right here!\n\n📚 **Help Center** - Comprehensive guides and tutorials\n\n🎥 **Video Tutorials** - Step-by-step walkthroughs\n\n💡 **Community Forum** - Connect with other sellers\n\n🏆 98.3% customer satisfaction rate!\n\nHow can I help you today?",
      suggestions: [t('chatbotHelpCenter'), t('chatbotContactUs'), t('chatbotLiveChat')]
    },

    // Specific Support Actions
    'open help center|help center|yardım merkezi|yardım merkezini aç': {
      response: t('chatbotHelpCenterResponse'),
      suggestions: [t('chatbotContactUs'), t('chatbotLiveChat'), t('chatbotFeatures')]
    },

    'contact us directly|contact directly|doğrudan iletişim|direkt iletişim': {
      response: t('chatbotContactDirectResponse'),
      suggestions: [t('chatbotHelpCenter'), t('chatbotLiveChat'), t('chatbotDemo')]
    },

    'live chat support|live chat|canlı sohbet|canlı destek': {
      response: t('chatbotLiveChatResponse'),
      suggestions: [t('chatbotContactUs'), t('chatbotHelpCenter'), t('chatbotDemo')]
    },

    // Free Trial (English and Turkish)
    'free trial|free|trial|demo|ücretsiz|deneme|demo': {
      response: t('chatbotFreeTrialResponse') || "🎁 Yes! Try Salesence completely FREE - no credit card required!\n\n✨ **Free Trial Includes:**\n• 10 free product analyses\n• Full access to all features\n• Real-time competitor tracking\n• AI-powered recommendations\n• Performance analytics\n• 24/7 customer support\n\n⏰ **No time limit** on your trial - take all the time you need!\n\n💳 **No credit card** required to start\n\n🚀 **Upgrade anytime** to analyze unlimited products\n\nOver 10,000 sellers have started with our free trial. Join them today and see why 98% upgrade to paid plans!",
      suggestions: [t('chatbotStartFree'), t('chatbotDemo'), t('chatbotFeatures')]
    },

    // Optimization
    'optimization|optimize|improve|titles|descriptions|prices': {
      response: t('chatbotOptimizationResponse') || "🎯 Our AI-powered optimization helps you maximize every listing!\n\n📝 **Title Optimization:**\n• Keyword-rich titles that rank higher\n• Perfect length for each platform\n• A/B testing recommendations\n\n📄 **Description Enhancement:**\n• Compelling copy that converts\n• SEO-optimized bullet points\n• Feature highlighting\n\n💰 **Dynamic Pricing:**\n• Real-time competitor pricing analysis\n• Profit margin optimization\n• Seasonal adjustment suggestions\n\n📸 **Image Analysis:**\n• Quality scoring\n• Competitor comparison\n• Improvement recommendations\n\n⚡ Average improvement: 35% increase in conversion rates!\n\nWant to see it in action?",
      suggestions: [t('chatbotAIAnalysis'), t('chatbotFeatures'), t('chatbotDemo')]
    },

    // Cross-selling and trends
    'trends|competitor|cross selling|insights|opportunities': {
      response: t('chatbotTrendsResponse') || "📈 Stay ahead with real-time market intelligence!\n\n🔍 **Competitor Tracking:**\n• Monitor pricing changes instantly\n• Track new product launches\n• Analyze competitor strategies\n• Get alerts on market shifts\n\n📊 **Trend Analysis:**\n• Identify rising product categories\n• Seasonal demand forecasting\n• Consumer behavior insights\n• Market gap opportunities\n\n💡 **Cross-Selling Opportunities:**\n• Bundle recommendations\n• Complementary product suggestions\n• Customer purchase patterns\n• Revenue optimization strategies\n\n🎯 Our AI scans millions of data points daily to give you actionable insights!\n\nReady to discover your next opportunity?",
      suggestions: [t('chatbotFeatures'), t('chatbotAIAnalysis'), t('chatbotDemo')]
    },

    // Early users
    'early users|onboarding|join|beta|early access': {
      response: t('chatbotEarlyUsersResponse'),
      suggestions: [t('chatbotSignUp'), t('chatbotStartFree'), t('chatbotContact')]
    },

    // Scale
    'scale|scaling|10 products|10000 products|manage products': {
      response: t('chatbotScaleResponse'),
      suggestions: [t('chatbotFeatures'), t('chatbotPricing'), t('chatbotDemo')]
    },

    // Careers and Jobs (English and Turkish)
    'careers|jobs|job openings|hiring|work|employment|kariyer|iş|iş ilanları|çalışma|istihdam': {
      response: t('chatbotCareersResponse'),
      suggestions: [t('chatbotViewJobs'), t('chatbotWorkCulture'), t('chatbotContact')]
    },

    // Company Culture
    'culture|work environment|team|benefits|office|kültür|çalışma ortamı|takım|yan haklar|ofis': {
      response: t('chatbotCultureResponse'),
      suggestions: [t('chatbotCareers'), t('chatbotViewJobs'), t('chatbotContact')]
    },

    // Remote Work
    'remote|remote work|work from home|uzaktan|uzaktan çalışma|evden çalışma': {
      response: t('chatbotRemoteWorkResponse'),
      suggestions: [t('chatbotCareers'), t('chatbotViewJobs'), t('chatbotWorkCulture')]
    },

    // Company Name and Details
    'company name|business name|organization|şirket adı|işletme adı|organizasyon': {
      response: t('chatbotCompanyNameResponse'),
      suggestions: [t('chatbotAboutCompany'), t('chatbotContact'), t('chatbotLocation')]
    },

    // Company Details and Information
    'details|company details|business details|information|info|detaylar|şirket detayları|bilgi': {
      response: t('chatbotCompanyDetailsResponse'),
      suggestions: [t('chatbotFeatures'), t('chatbotAboutCompany'), t('chatbotContact')]
    },

    // Contact Information
    'contact number|phone|phone number|telephone|call|telefon|telefon numarası|ara': {
      response: t('chatbotContactNumberResponse'),
      suggestions: [t('chatbotContactUs'), t('chatbotLocation'), t('chatbotLiveChat')]
    },

    // Location and Address
    'location|address|where|office|headquarters|konum|adres|nerede|ofis|merkez': {
      response: t('chatbotLocationResponse'),
      suggestions: [t('chatbotContact'), t('chatbotRemoteWork'), t('chatbotCareers')]
    },

    // Offers and Services
    'offers|services|what do you offer|solutions|products|teklifler|hizmetler|ne sunuyorsunuz|çözümler|ürünler': {
      response: t('chatbotOffersResponse'),
      suggestions: [t('chatbotFeatures'), t('chatbotPricing'), t('chatbotDemo')]
    },

    // Social Media and LinkedIn
    'linkedin|social media|social|facebook|twitter|sosyal medya|sosyal': {
      response: t('chatbotSocialMediaResponse'),
      suggestions: [t('chatbotContact'), t('chatbotAboutCompany'), t('chatbotCareers')]
    },

    // Founded and History
    'founded|when started|history|established|kuruldu|ne zaman başladı|tarihçe|kuruluş': {
      response: t('chatbotFoundedResponse'),
      suggestions: [t('chatbotAboutCompany'), t('chatbotCareers'), t('chatbotContact')]
    },

    // Team Size
    'team size|employees|staff|how many people|ekip büyüklüğü|çalışan|personel|kaç kişi': {
      response: t('chatbotTeamSizeResponse'),
      suggestions: [t('chatbotCareers'), t('chatbotWorkCulture'), t('chatbotAboutCompany')]
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message when chatbot opens
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: t('chatbotWelcome') || "👋 **Welcome to Salesence AI!**\n\nI'm your intelligent e-commerce assistant, here to help you 24/7!\n\n**🤖 What I Can Help You With:**\n\n💡 **Product Information**\n• Learn about our AI-powered platform\n• Understand how we optimize listings\n• Discover our features and capabilities\n\n💰 **Pricing & Plans**\n• Compare pricing tiers ($29 - Custom)\n• Free trial information (10 free analyses)\n• Special offers and discounts\n\n🚀 **Getting Started**\n• Sign up process and setup\n• Marketplace integration (Amazon, eBay, etc.)\n• First analysis walkthrough\n\n📊 **Features & Tools**\n• AI analysis and optimization\n• Competitor tracking\n• Performance analytics\n• 90+ marketplace support\n\n🤝 **Support & Help**\n• Technical assistance\n• Account questions\n• Contact information\n\n**💬 Example Questions:**\n• \"How much does it cost?\"\n• \"What marketplaces do you support?\"\n• \"How do I start my free trial?\"\n• \"What features are included?\"\n• \"How does the AI analysis work?\"\n\nGo ahead and ask me anything! 😊",
        isBot: true,
        timestamp: new Date(),
        suggestions: [t('chatbotWhatIsSalesence') || 'What is Salesence?', t('chatbotPricingInfo') || 'Show me pricing', t('chatbotHowToStart') || 'How to get started?', 'What features do you have?']
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, t]);

  const findBestMatch = (userInput: string): string | null => {
    const input = userInput.toLowerCase().trim();

    // Direct exact matches first
    for (const pattern in knowledge) {
      const keywords = pattern.split('|');
      if (keywords.some(keyword => input === keyword || input.includes(keyword))) {
        return pattern;
      }
    }

    // Fuzzy matching for Turkish characters and variations
    const normalizedInput = input
      .replace(/[çćč]/g, 'c')
      .replace(/[ğĝ]/g, 'g')
      .replace(/[ıîï]/g, 'i')
      .replace(/[öôõ]/g, 'o')
      .replace(/[şśŝ]/g, 's')
      .replace(/[üûú]/g, 'u');

    for (const pattern in knowledge) {
      const keywords = pattern.split('|');
      if (keywords.some(keyword => {
        const normalizedKeyword = keyword
          .replace(/[çćč]/g, 'c')
          .replace(/[ğĝ]/g, 'g')
          .replace(/[ıîï]/g, 'i')
          .replace(/[öôõ]/g, 'o')
          .replace(/[şśŝ]/g, 's')
          .replace(/[üûú]/g, 'u');
        return normalizedInput.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedInput);
      })) {
        return pattern;
      }
    }

    return null;
  };

  const generateResponse = (userInput: string): { response: string; suggestions?: string[] } => {
    const match = findBestMatch(userInput);

    if (match) {
      return knowledge[match];
    }

    // Default response for unmatched queries
    return {
      response: t('chatbotDefaultResponse') || "🤔 I'm not quite sure about that, but I'm here to help!\n\nI can assist you with:\n\n💡 **Product Information:**\n• Features and capabilities\n• Pricing and plans\n• Supported marketplaces\n\n🚀 **Getting Started:**\n• Free trial details\n• Setup process\n• Integration help\n\n📊 **Advanced Features:**\n• AI analysis\n• Optimization tools\n• Performance tracking\n\n💬 **Support:**\n• Contact information\n• Help resources\n• Technical assistance\n\nTry asking about pricing, features, or how to get started!",
      suggestions: [t('chatbotContact'), t('chatbotHelpCenter'), t('chatbotTryAgain')]
    };
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const { response, suggestions } = generateResponse(text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date(),
        suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
      // Reset textarea height after sending
      const target = e.target as HTMLTextAreaElement;
      setTimeout(() => {
        target.style.height = 'auto';
        target.style.height = '44px';
      }, 0);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Handle suggestions with specific responses to avoid generic answers
    const suggestionMappings: { [key: string]: string } = {
      // English suggestions
      'Open Help Center': 'open help center',
      'Contact us directly': 'contact us directly',
      'Live chat support': 'live chat support',
      'What is Salesence?': 'what is salesence',
      'Tell me about pricing': 'pricing',
      'How do I get started?': 'how to start',

      // Turkish suggestions
      'Yardım Merkezini aç': 'yardım merkezi',
      'Doğrudan iletişim': 'doğrudan iletişim',
      'Canlı sohbet desteği': 'canlı sohbet',
      'Salesence nedir?': 'salesence nedir',
      'Fiyatlandırma hakkında bilgi ver': 'fiyat',
      'Nasıl başlarım?': 'nasıl başlar',
      'İş ilanlarını görüntüle': 'careers',
      'Çalışma kültürü hakkında bilgi ver': 'culture',
      'Kariyer fırsatları': 'careers',

      // Additional English career suggestions
      'View job openings': 'careers',
      'Tell me about work culture': 'culture',
      'Career opportunities': 'careers',

      // Company information suggestions
      'About the company': 'what is salesence',
      'Location & address': 'location',
      'Şirket hakkında': 'salesence nedir',
      'Konum ve adres': 'location'
    };

    const mappedInput = suggestionMappings[suggestion] || suggestion;
    handleSendMessage(mappedInput);
  };

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-screen h-screen sm:w-[440px] sm:h-[600px] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-gray-900 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 sm:rounded-t-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30 shadow-md">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div>
                  <h3 className="font-bold text-base">Salesence AI</h3>
                  <p className="text-xs text-white/90">{t('chatbotSubtitle')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full hover:bg-white/20 transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`flex items-end space-x-2 max-w-[85%] sm:max-w-[75%] ${message.isBot ? '' : 'flex-row-reverse space-x-reverse'}`}>
                    {message.isBot && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-md">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 shadow-lg ${
                      message.isBot
                        ? 'bg-gray-800 text-gray-100 border border-gray-700'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Suggestions */}
              {messages.length > 0 && messages[messages.length - 1].isBot && messages[messages.length - 1].suggestions && (
                <div className="flex flex-wrap gap-2 mt-2 animate-in fade-in duration-500">
                  {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-gray-800 text-purple-400 border border-purple-700 hover:bg-purple-900/30 hover:border-purple-500 transition-all duration-200 shadow-sm hover:shadow"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-end space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-gray-700 bg-gray-800 p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatbotPlaceholder')}
                  disabled={isTyping}
                  rows={1}
                  className="w-full resize-none rounded-2xl border border-gray-600 bg-gray-800/50 px-4 py-3 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed max-h-32"
                  style={{
                    height: 'auto',
                    minHeight: '44px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="flex-shrink-0 w-11 h-11 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 flex items-center justify-center group z-50"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="absolute -top-12 right-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
            Chat with us!
            <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
          </div>
        </button>
      )}
    </div>
  );
};