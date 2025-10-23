import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Star,
  ExternalLink,
  Image as ImageIcon,
  DollarSign,
  Target,
  MessageSquare,
  Zap,
  Lightbulb,
  Crown,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Shield,
  Users,
  Clock,
  BarChart3,
  Rocket,
  Award,
  ThumbsUp,
  Eye,
  ShoppingCart
} from "lucide-react";
import { MockAnalysisResult } from "@/utils/mockDataGenerator";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAutoTranslate, useBatchAutoTranslate } from "@/hooks/useAutoTranslate";
import { formatPriceWithCurrency } from "@/lib/currencyHelpers";

interface AnalysisResultsProps {
  analysis: MockAnalysisResult;
}

export const AnalysisResults = ({ analysis }: AnalysisResultsProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { product, analysis: analysisData } = analysis;

  // Auto-translate dynamic content
  const { text: translatedProductName } = useAutoTranslate(product.name);
  const { texts: translatedTitleSuggestions } = useBatchAutoTranslate(analysisData.titleSuggestions);
  const { texts: translatedDescriptionSuggestions } = useBatchAutoTranslate(analysisData.descriptionSuggestions);
  const { texts: translatedPricingSuggestions } = useBatchAutoTranslate(analysisData.pricingSuggestions);
  const { texts: translatedImageSuggestions } = useBatchAutoTranslate(analysisData.imageSuggestions);

  // Use original currency from product data, or display price as-is
  const formattedPrice = product.priceAmount && product.currency
    ? formatPriceWithCurrency(product.priceAmount, product.currency)
    : product.price;

  const formattedOriginalPrice = product.originalPriceAmount && product.currency
    ? formatPriceWithCurrency(product.originalPriceAmount, product.currency)
    : product.originalPrice;

  const formattedAveragePrice = analysisData.competitorAnalysis.averagePriceAmount && analysisData.competitorAnalysis.currency
    ? formatPriceWithCurrency(analysisData.competitorAnalysis.averagePriceAmount, analysisData.competitorAnalysis.currency)
    : analysisData.competitorAnalysis.averagePrice;
  
  const getQualityColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 75) return "text-blue-500";
    return "text-amber-500";
  };

  const getQualityGradient = (score: number) => {
    if (score >= 90) return "from-emerald-500 to-green-400";
    if (score >= 75) return "from-blue-500 to-cyan-400";
    return "from-amber-500 to-orange-400";
  };

  const getQualityBadgeColor = (score: number) => {
    if (score >= 90) return "bg-gradient-to-r from-emerald-500 to-green-400 text-white border-0";
    if (score >= 75) return "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-0";
    return "bg-gradient-to-r from-amber-500 to-orange-400 text-white border-0";
  };

  const getPriceIcon = (position: string) => {
    switch (position) {
      case 'above': 
        return <TrendingUp className="h-5 w-5 text-red-400" />;
      case 'below': 
        return <TrendingDown className="h-5 w-5 text-emerald-400" />;
      default: 
        return <Target className="h-5 w-5 text-blue-400" />;
    }
  };

  const getPricePositionColor = (position: string) => {
    switch (position) {
      case 'above': return "text-red-400";
      case 'below': return "text-emerald-400";
      default: return "text-blue-400";
    }
  };

  const getPricePositionText = (position: string) => {
    switch (position) {
      case 'above': return t('analysisPricePositionAbove');
      case 'below': return t('analysisPricePositionBelow');
      default: return t('analysisPricePositionCompetitive');
    }
  };

  const handleViewProduct = () => {
    // Navigate to product details page with product ID
    navigate(`/product/${analysis.product.id || analysis.id}`, {
      state: {
        productData: analysis.product,
        analysisData: analysisData,
        recommendations: analysis.recommendations || []
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Main Product Overview - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-0 shadow-2xl overflow-hidden relative">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
          
          <CardContent className="p-0 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 p-8">
              {/* Product Image with Enhanced Effects */}
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge className={`${getQualityBadgeColor(product.imageQuality)} backdrop-blur-md shadow-lg`}>
                    <ImageIcon className="h-3 w-3 mr-1" />
                    {product.imageQuality}% {t('analysisQuality')}
                  </Badge>
                  {product.originalPrice && (
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 backdrop-blur-md shadow-lg">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      {t('analysisHotDeal')}
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    onClick={handleViewProduct}
                    className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('analysisQuickView')}
                  </Button>
                </div>
              </motion.div>

              {/* Product Details */}
              <motion.div 
                className="space-y-6"
                variants={itemVariants}
              >
                <div>
                  <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-md">
                    <Rocket className="h-3 w-3 mr-1" />
                    {analysis.marketplace}
                  </Badge>
                  
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {translatedProductName}
                  </h2>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                                : 'fill-gray-500 text-gray-500'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-bold text-white">{product.rating}</span>
                      <span className="text-gray-300">({product.reviewCount.toLocaleString()})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-white font-mono bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      {formattedPrice}
                    </span>
                    {formattedOriginalPrice && (
                      <span className="text-2xl text-gray-400 line-through font-mono">{formattedOriginalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Optimization Score */}
                <motion.div
                  className="space-y-4 bg-white/10 backdrop-blur-md rounded-2xl p-6"
                  variants={itemVariants}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-semibold text-white">{t('analysisAIOptimizationScore')}</span>
                    </div>
                    <span className={`text-3xl font-bold ${getQualityColor(analysisData.overallScore)} drop-shadow-lg`}>
                      {analysisData.overallScore}%
                    </span>
                  </div>
                  <Progress
                    value={analysisData.overallScore}
                    className={`h-3 bg-gray-700 ${analysisData.overallScore >= 90 ? 'animate-pulse' : ''}`}
                  >
                    <div
                      className={`h-full bg-gradient-to-r ${getQualityGradient(analysisData.overallScore)} transition-all duration-1000 ease-out rounded-full`}
                      style={{ width: `${analysisData.overallScore}%` }}
                    />
                  </Progress>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{t('analysisNeedsWork')}</span>
                    <span className="text-gray-400">{t('analysisPerfect')}</span>
                  </div>
                </motion.div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleViewProduct}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    {t('analysisViewFullDetails')}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/20 backdrop-blur-md"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Competitive Analysis - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-4 text-2xl">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-white">{t('analysisMarketIntelligence')}</div>
                <div className="text-sm font-normal text-orange-200">{t('analysisRealTimeCompetitive')}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-0">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
              {[
                {
                  icon: getPriceIcon(analysisData.competitorAnalysis.pricePosition),
                  title: t('analysisPricePosition'),
                  value: getPricePositionText(analysisData.competitorAnalysis.pricePosition),
                  description: t('analysisVsMarketAverage'),
                  color: getPricePositionColor(analysisData.competitorAnalysis.pricePosition)
                },
                {
                  icon: <DollarSign className="h-6 w-6 text-emerald-400" />,
                  title: t('analysisMarketAverage'),
                  value: formattedAveragePrice,
                  description: t('analysisCompetitorPricing'),
                  color: "text-emerald-400"
                },
                {
                  icon: <Target className="h-6 w-6 text-purple-400" />,
                  title: t('analysisMarketShare'),
                  value: `${analysisData.competitorAnalysis.marketShare}%`,
                  description: t('analysisCategoryDominance'),
                  color: "text-purple-400"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg"
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {item.icon}
                    <span className="font-semibold text-white">{item.title}</span>
                  </div>
                  <p className={`text-2xl font-bold ${item.color} mb-2 capitalize drop-shadow-lg`}>
                    {item.value}
                  </p>
                  <p className="text-sm text-orange-200">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Optimization Suggestions - Enhanced */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            {
              title: t('analysisTitleOptimization'),
              description: t('analysisBoostVisibility'),
              icon: <Zap className="h-5 w-5 text-yellow-400" />,
              gradient: "from-yellow-500/10 to-amber-500/10",
              iconBg: "bg-gradient-to-r from-yellow-400 to-amber-400",
              suggestions: translatedTitleSuggestions
            },
            {
              title: t('analysisDescriptionMagic'),
              description: t('analysisEnhanceStorytelling'),
              icon: <Lightbulb className="h-5 w-5 text-blue-400" />,
              gradient: "from-blue-500/10 to-cyan-500/10",
              iconBg: "bg-gradient-to-r from-blue-400 to-cyan-400",
              suggestions: translatedDescriptionSuggestions
            },
            {
              title: t('analysisPricingStrategy'),
              description: t('analysisOptimizeForProfit'),
              icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
              gradient: "from-emerald-500/10 to-green-500/10",
              iconBg: "bg-gradient-to-r from-emerald-400 to-green-400",
              suggestions: translatedPricingSuggestions
            },
            {
              title: t('analysisVisualAppeal'),
              description: t('analysisImproveImage'),
              icon: <ImageIcon className="h-5 w-5 text-purple-400" />,
              gradient: "from-purple-500/10 to-pink-500/10",
              iconBg: "bg-gradient-to-r from-purple-400 to-pink-400",
              suggestions: translatedImageSuggestions
            }
          ].map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`bg-gradient-to-br ${section.gradient} border-0 shadow-xl backdrop-blur-sm h-full`}>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 ${section.iconBg} rounded-xl shadow-lg`}>
                      {section.icon}
                    </div>
                    <div>
                      <div className="text-white">{section.title}</div>
                      <div className="text-sm font-normal text-gray-300">{section.description}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {section.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sectionIndex * 0.1 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"
                    >
                      <div className="p-1 bg-white/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm text-white leading-relaxed flex-1">{suggestion}</span>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Performance Metrics - Enhanced */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-0 shadow-2xl backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-4 text-2xl">
              <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-white">{t('analysisPerformanceDashboard')}</div>
                <div className="text-sm font-normal text-gray-400">{t('analysisKeySuccessMetrics')}</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-4">
              {[
                {
                  icon: <Users className="h-8 w-8 text-blue-400" />,
                  value: product.reviewCount.toLocaleString(),
                  label: t('analysisCustomerReviews'),
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Star className="h-8 w-8 text-yellow-400" />,
                  value: product.rating,
                  label: t('analysisAverageRating'),
                  gradient: "from-yellow-500 to-amber-500"
                },
                {
                  icon: <Award className="h-8 w-8 text-emerald-400" />,
                  value: `${product.imageQuality}%`,
                  label: t('analysisImageQuality'),
                  gradient: "from-emerald-500 to-green-500"
                },
                {
                  icon: <Rocket className="h-8 w-8 text-purple-400" />,
                  value: `${analysisData.overallScore}%`,
                  label: t('analysisOptimizationScore'),
                  gradient: "from-purple-500 to-pink-500"
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-4 sm:p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg"
                >
                  <div className={`p-2 sm:p-3 bg-gradient-to-r ${metric.gradient} rounded-2xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}>
                    {metric.icon}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-300">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 shadow-2xl text-center">
          <CardContent className="p-8">
            <Sparkles className="h-12 w-12 text-white mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">{t('analysisReadyToOptimize')}</h3>
            <p className="text-blue-100 mb-6">{t('analysisGetDetailedInsights')}</p>
            <Button
              onClick={handleViewProduct}
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <ThumbsUp className="h-5 w-5 mr-2" />
              {t('analysisViewFullAnalysis')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};