import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Play, Check, Star, Users, Shield, Zap, BarChart3, Target, Globe, Mail, FileText, Lock, Heart, X, MessageCircle, HelpCircle, Phone, Clock, ThumbsUp } from "lucide-react";
import HeroSection from "@/components/landing/HeroSection"
import { DemoSection } from "@/components/landing/DemoSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AuthModal } from "@/components/auth/AuthModal";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { Navbar } from "@/components/ui/navbar";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/lib/currency";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isHelpCenterModalOpen, setIsHelpCenterModalOpen] = useState(false);
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handleGetStarted = (plan?: any) => {
    if (plan) {
      // Navigate to payment page with plan data
      navigate('/payment', { state: { plan } });
    } else {
      // Default behavior for other get started buttons
      setAuthMode('signup');
      setIsAuthModalOpen(true);
    }
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleContactSales = () => {
    navigate('/contact');
  };

  // About section features
  const aboutFeatures = [
    {
      icon: <BarChart3 className="h-10 w-10" />,
      title: t("advancedAnalytics"),
      description: t("advancedAnalyticsDesc")
    },
    {
      icon: <Target className="h-10 w-10" />,
      title: t("precisionTools"),
      description: t("precisionToolsDesc")
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: t("userCentricDesign"),
      description: t("userCentricDesignDesc")
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: t("universalAccess"),
      description: t("universalAccessDesc")
    }
  ];

  // Updated pricing plans according to requirements
  const pricingPlans = [
    {
      name: t("starter"),
      price: formatPrice(40),
      basePrice: 40,
      period: t("month"),
      yearlyPrice: `${formatPrice(400)} ${t("yearly")}`,
      yearlySave: `${t("monthsFree")} (${t("save")} ${formatPrice(80)})`,
      description: t("starterDescription"),
      popular: false,
      cta: t("getStarted"),
      features: [
        `${t("upTo50")} ${t("analysesPerMonth")}`,
        t("titleDescPriceAnalysis"),
        t("basicOptimizationTips"),
        t("emailSupport"),
        t("standardProcessingSpeed"),
        t("bestForNewSellers")
      ]
    },
    {
      name: t("professional"),
      price: formatPrice(100),
      basePrice: 100,
      period: t("month"),
      yearlyPrice: `${formatPrice(1000)} ${t("yearly")}`,
      yearlySave: `${t("monthsFree")} (${t("save")} ${formatPrice(200)})`,
      description: t("professionalDescription"),
      popular: true,
      cta: t("getStarted"),
      features: [
        `${t("upTo500")} ${t("analysesPerMonth")}`,
        t("trendAlertsRisk"),
        t("seasonalRecommendations"),
        t("advancedReporting"),
        t("prioritySupport"),
        t("customIntegrations"),
        t("bestForGrowing")
      ]
    },
    {
      name: t("enterprise"),
      price: t("custom"),
      period: "",
      yearlyPrice: t("tailoredPricing"),
      yearlySave: t("contactUsForDetails"),
      description: t("enterpriseDescription"),
      popular: false,
      cta: t("contactSales"),
      features: [
        t("multiMarketplace"),
        t("unlimitedAnalysis"),
        t("dedicatedManager"),
        t("customAITraining"),
        t("advancedSecurity"),
        t("whiteLabelSolutions"),
        t("bestForLarge")
      ]
    }
  ];

  // Privacy Policy Modal
  const PrivacyPolicyModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{t("yourPrivacyMatters")}</h2>
                <p className="text-gray-400 text-sm">{t("transparentSecureRespectful")}</p>
              </div>
            </div>
            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-full mb-4">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">{t("gdprCompliant")}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {t("protectDataHeading")}
            </h3>
            <p className="text-gray-300 text-lg">
              {t("protectDataDescription")}
            </p>
          </div>

          {/* Security Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">{t("militaryGradeEncryption")}</h4>
              </div>
              <p className="text-gray-300 text-sm">
                {t("militaryGradeEncryptionDesc")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">{t("globalCompliance")}</h4>
              </div>
              <p className="text-gray-300 text-sm">
                {t("globalComplianceDesc")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <X className="w-5 h-5 text-red-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">{t("zeroDataSelling")}</h4>
              </div>
              <p className="text-gray-300 text-sm">
                {t("zeroDataSellingDesc")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-white">{t("youreInControl")}</h4>
              </div>
              <p className="text-gray-300 text-sm">
                {t("youreInControlDesc")}
              </p>
            </div>
          </div>

          {/* Data Usage Promise */}
          <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 rounded-2xl p-8 text-center border border-purple-500/30">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-white mb-3">{t("ourPromiseToYou")}</h4>
            <p className="text-gray-300">
              {t("ourPromiseDescription")}
            </p>
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">100%</div>
              <div className="text-xs text-gray-400">{t("dataEncryption")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">0</div>
              <div className="text-xs text-gray-400">{t("thirdPartySharing")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">24/7</div>
              <div className="text-xs text-gray-400">{t("securityMonitoring")}</div>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 p-6 rounded-b-2xl">
          <div className="flex gap-4">
            <Button 
              onClick={() => setIsPrivacyModalOpen(false)}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {t("iFeelSafeSecure")}
            </Button>
            <Button 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {t("learnMore")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Terms of Service Modal
  const TermsOfServiceModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{t("termsOfServiceTitle")}</h2>
                <p className="text-gray-400 text-sm">{t("clearFairTransparent")}</p>
              </div>
            </div>
            <button
              onClick={() => setIsTermsModalOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full mb-4">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">{t("fairUsagePolicy")}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {t("simpleFairTerms")}
            </h3>
            <p className="text-gray-300 text-lg">
              {t("transparentRelationships")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">{t("yourRights")}</h4>
                </div>
                <ul className="space-y-3 text-gray-300 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    {t("cancelAnytimeNoQuestions")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    {t("transparentPricingNoHidden")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    {t("fullDataOwnershipPortability")}
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">{t("serviceCommitment")}</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  {t("uptimeCommitment")}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">{t("fairUsage")}</h4>
                </div>
                <p className="text-gray-300 text-sm">
                  {t("fairUsageDescription")}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Star className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">{t("paymentTerms")}</h4>
                </div>
                <div className="space-y-2 text-gray-300 text-sm whitespace-pre-line">
                  {t("paymentTermsDetails")}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900/40 to-blue-900/40 rounded-2xl p-8 text-center border border-green-500/30">
            <h4 className="text-xl font-bold text-white mb-3">{t("specialOfferYearlyPlans")}</h4>
            <p className="text-gray-300">
              {t("yearlyPlansBenefit")}
            </p>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 p-6 rounded-b-2xl">
          <Button 
            onClick={() => setIsTermsModalOpen(false)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {t("agreeAcceptTerms")}
          </Button>
        </div>
      </div>
    </div>
  );

  // Help Center Modal
  const HelpCenterModal = () => {
    const [activeCategory, setActiveCategory] = useState('getting-started');

    const helpCategories = {
      'getting-started': {
        title: t('gettingStartedIcon'),
        icon: <Zap className="w-5 h-5" />,
        items: [
          {
            question: t("howCreateFirstAnalysis"),
            answer: t("analysisStepsDescription"),
            steps: [t("clickGetStarted"), t("connectYourStore"), t("uploadProducts"), t("viewInsights")]
          },
          {
            question: t("whatMarketplacesSupport"),
            answer: t("platformsSupportDescription"),
            badge: t("platformsBadge")
          },
          {
            question: t("isThereFreeTrial"),
            answer: t("freeTrialDescription"),
            highlight: t("freeAnalysesBadge")
          }
        ]
      },
      'account': {
        title: t('accountBillingIcon'),
        icon: <Users className="w-5 h-5" />,
        items: [
          {
            question: t("canUpgradeDowngrade"),
            answer: t("upgradeAnswer"),
            note: t("flexiblePlans")
          },
          {
            question: t("howCancelSubscription"),
            answer: t("cancelAnswer"),
            reassurance: t("noHiddenFees")
          },
          {
            question: t("whatPaymentMethods"),
            answer: t("paymentAnswer"),
            methods: ["💳 Cards", "📱 PayPal", "🏦 Bank Transfer"]
          }
        ]
      },
      'features': {
        title: t('featuresAnalyticsIcon'),
        icon: <BarChart3 className="w-5 h-5" />,
        items: [
          {
            question: t("howAccuratePredictions"),
            answer: t("accuracyAnswer"),
            accuracy: t("accuracyBadge")
          },
          {
            question: t("canExportData"),
            answer: t("exportAnswer"),
            exports: ["CSV", "Excel", "PDF", "API"]
          },
          {
            question: t("customReports"),
            answer: t("customReportsAnswer"),
            custom: t("customSolutions")
          }
        ]
      }
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
          <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{t("helpCenterTitle")}</h2>
                  <p className="text-gray-400 text-sm">{t("helpCenterSubtitle")}</p>
                </div>
              </div>
              <button
                onClick={() => setIsHelpCenterModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="p-8">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-3 rounded-full mb-6">
                <MessageCircle className="w-5 h-5 text-purple-400" />
                <span className="text-lg font-semibold text-purple-300">{t("howCanWeHelpToday")}</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">
                {t("letsGetYouSucceedingTitle")}
              </h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                {t("setupToScalingDescription")}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
              <div className="glass-effect p-4 sm:p-6 rounded-2xl text-center border border-green-500/20">
                <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">24/7</div>
                <div className="text-sm text-gray-300">{t("supportAvailable")}</div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mx-auto mt-2"></div>
              </div>
              <div className="glass-effect p-4 sm:p-6 rounded-2xl text-center border border-blue-500/20">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">2.1min</div>
                <div className="text-sm text-gray-300">{t("avgResponseTime")}</div>
              </div>
              <div className="glass-effect p-4 sm:p-6 rounded-2xl text-center border border-purple-500/20">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">98.3%</div>
                <div className="text-sm text-gray-300">{t("satisfactionRate")}</div>
              </div>
              <div className="glass-effect p-4 sm:p-6 rounded-2xl text-center border border-orange-500/20">
                <div className="text-2xl sm:text-3xl font-bold text-orange-400 mb-2">10K+</div>
                <div className="text-sm text-gray-300">{t("questionsSolved")}</div>
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              {Object.entries(helpCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    activeCategory === key
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'glass-effect text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {category.icon}
                  <span className="font-semibold">{category.title}</span>
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-6 mb-12">
              {helpCategories[activeCategory].items.map((item, index) => (
                <div key={index} className="glass-effect p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white flex-1">{item.question}</h4>
                    <div className="flex gap-2 ml-4">
                      {item.badge && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                          {item.badge}
                        </span>
                      )}
                      {item.highlight && (
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs font-medium">
                          {item.highlight}
                        </span>
                      )}
                      {item.accuracy && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                          {item.accuracy}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{item.answer}</p>
                  
                  {item.steps && (
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <div className="text-sm font-semibold text-white mb-2">{t("quickSteps")}</div>
                      <div className="grid gap-2">
                        {item.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center gap-3 text-sm text-gray-300">
                            <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 text-xs font-bold">
                              {stepIndex + 1}
                            </div>
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.methods && (
                    <div className="flex gap-2 mt-3">
                      {item.methods.map((method, methodIndex) => (
                        <span key={methodIndex} className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-300">
                          {method}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.exports && (
                    <div className="flex gap-2 mt-3">
                      {item.exports.map((exportType, exportIndex) => (
                        <span key={exportIndex} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                          {exportType}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-8 text-center border border-purple-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_70%)]"></div>
              <div className="relative z-10">
                <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{t("stillHaveQuestions")}</h3>
                <p className="text-gray-300 mb-6 text-lg">
                  {t("humanExpertsReady")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/contact" className="w-full sm:w-auto">
                    <Button 
                      onClick={() => setIsHelpCenterModalOpen(false)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105"
                      size="lg"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      {t("chatWithSupport")}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-xl"
                    size="lg"
                  >
                    📞 +1 (555) 123-4567
                  </Button>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  {t("averageWaitTime")} <span className="text-green-400 font-semibold">{t("underMinutes")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar onGetStarted={handleGetStarted} onSignIn={handleSignIn} />

      <main>
        <HeroSection onGetStarted={handleGetStarted} />
        <DemoSection />
        <FeaturesSection />
        
        {/* About Section */}
        <section id="about" className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-blue-900/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-6">
                <Star className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">{t("aboutUs")}</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                {t("transformingData")} <span className="text-blue-400">{t("dataIntoDecisions")}</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t("aboutDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {aboutFeatures.map((feature, index) => (
                <Card key={index} className="glass-effect border-white/10 text-center hover-lift">
                  <CardHeader className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-blue-900/30 text-blue-400 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="glass-effect rounded-2xl p-8 md:p-12 border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-6">{t("ourStory")}</h3>
                  <p className="text-lg text-gray-300 mb-4">
                    {t("storyParagraph1")}
                  </p>
                  <p className="text-lg text-gray-300">
                    {t("storyParagraph2")}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="glass-effect p-4 sm:p-6 rounded-xl bg-blue-900/20 text-center border-blue-700/30">
                    <div className="text-2xl sm:text-3xl font-bold text-blue-400">10K+</div>
                    <div className="text-sm text-blue-300">{t("activeUsers")}</div>
                  </div>
                  <div className="glass-effect p-4 sm:p-6 rounded-xl bg-purple-900/20 text-center border-purple-700/30">
                    <div className="text-2xl sm:text-3xl font-bold text-purple-400">5M+</div>
                    <div className="text-sm text-purple-300">{t("analysesRun")}</div>
                  </div>
                  <div className="glass-effect p-4 sm:p-6 rounded-xl bg-green-900/20 text-center border-green-700/30">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">90+</div>
                    <div className="text-sm text-green-300">{t("uptime")}</div>
                  </div>
                  <div className="glass-effect p-4 sm:p-6 rounded-xl bg-orange-900/20 text-center border-orange-700/30">
                    <div className="text-2xl sm:text-3xl font-bold text-orange-400">24/7</div>
                    <div className="text-sm text-orange-300">{t("support")}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 overflow-visible">
            <div className="text-center mb-20">
              <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-6">
                <Star className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">{t("simplePricing")}</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                {t("chooseYourPlan")}
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t("startFree")}
              </p>
            </div>  
            
            <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mt-8">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={plan.name}
                  className={`glass-effect border-white/10 hover:border-white/20 transition-all duration-300 hover-lift relative ${
                    plan.popular ? 'ring-2 ring-purple-500/50 lg:scale-105' : ''
                  }`}
                >
                  {/* Most Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-purple-600 bg-opacity-90 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                        {t("mostPopular")}
                      </div>
                    </div>
                  )}   
                  
                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-400 ml-2">/{plan.period}</span>
                      )}
                    </div>
                    {/* Yearly Pricing Info */}
                    <div className="space-y-1 mb-2">
                      <p className="text-sm text-gray-300">{plan.yearlyPrice}</p>
                      <p className="text-xs text-green-400 font-medium">{plan.yearlySave}</p>
                    </div>
                    <p className="text-gray-300">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={plan.name === t("enterprise") ? handleContactSales : () => handleGetStarted(plan)}
                      className={`w-full py-3 font-semibold transition-all duration-300 hover:scale-105 ${
                        plan.popular
                          ? 'gradient-primary text-white glow-effect'
                          : 'glass-effect border-white/20 text-white hover:bg-white/10'
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Attractive Savings Note */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-green-500/20 to-blue-500/20 px-6 py-3 rounded-full">
                <span className="text-green-400 font-semibold leading-none">{t("getTwoMonthsFree")}</span>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="glass-effect rounded-2xl p-8 max-w-2xl mx-auto border border-purple-500/20">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {t("specialYearlyOffer")}
                </h3>
                <p className="text-gray-300">
                  {t("payForTenGetTwelve")}
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final CTA Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-gray-900 to-indigo-900/20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.2),transparent_70%)]"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                {t("readyToTransform")}
                <br />
                <span className="text-pink-400">{t("marketplaceSuccess")}</span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                {t("joinThousandsSellers")}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <Link to="/demo" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:brightness-110 hover:scale-105 w-full sm:w-auto flex items-center justify-center gap-2"
                  >
                    {t("startFreeAnalysis")}
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="lg"
                  className="glass-effect hover:bg-white/10 text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto group"
                  onClick={() => alert("Video demo coming soon! Add your video URL here.")}
                >
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  {t("watchDemo")}
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span>{t("activeUsersCount")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span>{t("productsAnalyzedCount")}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span>{t("averageRating")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-950 to-purple-900/30 border-t border-white/10 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          {/* Newsletter Section */}
          <div className="glass-effect rounded-2xl p-4 sm:p-6 lg:p-8 mb-12 border border-white/10 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400 flex-shrink-0" />
                  {t("stayUpdated")}
                </h3>
                <p className="text-sm sm:text-base text-gray-300">{t("getLatestInsights")}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder={t("enterYourEmail")}
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                />
                <Button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 sm:hover:scale-105 whitespace-nowrap">
                  {t("subscribe")}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
                <span className="text-2xl font-bold text-white">Salesence</span>
              </div>
              <p className="text-gray-300 mb-8 max-w-md text-lg leading-relaxed">
                {t("footerDescription")}
              </p>

              {/* Social Media */}
              <div className="mb-8">
                <h4 className="text-white font-semibold mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-purple-400" />
                  {t("followUs")}
                </h4>
                <div className="flex space-x-3">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-500/25">
                    <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform">f</span>
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-500/25">
                    <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform">t</span>
                  </a>
                  <a href="https://www.linkedin.com/company/salesence/" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-800 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-blue-700/25">
                    <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform">in</span>
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-gray-700/25">
                    <span className="text-white font-bold text-lg group-hover:scale-110 transition-transform">@</span>
                  </a>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center px-3 py-2 bg-green-900/30 rounded-lg border border-green-500/20">
                  <Shield className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-green-300 text-sm font-medium">{t("sslSecured")}</span>
                </div>
                <div className="flex items-center px-3 py-2 bg-blue-900/30 rounded-lg border border-blue-500/20">
                  <Check className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-blue-300 text-sm font-medium">{t("gdprCompliant")}</span>
                </div>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-white font-bold mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-400" />
                {t("product")}
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t("features")}
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t("pricing")}
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t("about")}
                  </a>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t("careers")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-white font-bold mb-6 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-purple-400" />
                {t("support")}
              </h3>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setIsHelpCenterModalOpen(true)}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group w-full text-left"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t("helpCenter")}
                  </button>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group">
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t("contactUs")}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group w-full text-left"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t("privacyPolicy")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group w-full text-left"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {t("termsOfService")}
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div>
              <h3 className="text-white font-bold mb-6 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-purple-400" />
                {t("quickStats")}
              </h3>
              <div className="space-y-4">
                <div className="glass-effect p-4 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-purple-400">10K+</div>
                  <div className="text-gray-300 text-sm">{t("activeUsers")}</div>
                </div>
                <div className="glass-effect p-4 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-pink-400">500K+</div>
                  <div className="text-gray-300 text-sm">{t("productsAnalyzed")}</div>
                </div>
                <div className="glass-effect p-4 rounded-lg border border-white/10">
                  <div className="text-2xl font-bold text-green-400">99.9%</div>
                  <div className="text-gray-300 text-sm">{t("uptime")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <p className="text-gray-400 text-sm flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-purple-400" />
                  © 2025 Salesence. {t("allRightsReserved")}
                </p>
                <div className="flex items-center gap-4 text-gray-400 text-xs">
                  <span className="flex items-center">
                    <Shield className="w-3 h-3 mr-1 text-green-400" />
                    {t("sslEncryption")}
                  </span>
                  <span className="flex items-center">
                    <Check className="w-3 h-3 mr-1 text-blue-400" />
                    {t("soc2Compliant")}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 text-sm flex items-center">
                {t("madeWithLove")} <Heart className="w-4 h-4 text-red-400 mx-1 animate-pulse" /> {t("forMarketplaceSellers")}
              </p>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      {/* Modals */}
      {isPrivacyModalOpen && <PrivacyPolicyModal />}
      {isTermsModalOpen && <TermsOfServiceModal />}
      {isHelpCenterModalOpen && <HelpCenterModal />}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;