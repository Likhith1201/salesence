import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Zap, 
  TrendingUp, 
  Star, 
  ExternalLink,
  Image as ImageIcon,
  DollarSign,
  Target,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  Clock,
  BarChart3,
  Heart,
  Copy,
  Share2,
  X,
  ChevronDown,
  ChevronUp,
  Crown,
  Shield,
  Zap as ZapIcon,
  Check,
  CreditCard,
  Building,
  Coins,
  ArrowLeft
} from "lucide-react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AnalysisAnimations.css";

export const ProfessionalAnalysis = () => {
  const {
    state,
    startAnalysis,
    toggleSuggestion,
    toggleSuggestionExpansion,
    setShowPaywall,
    resetAnalysis,
    formatTimeRemaining,
    setState
  } = useAnalysis();

  const { t } = useTranslation();

  const {
    url,
    isAnalyzing,
    currentStage,
    analysisResult,
    suggestions,
    showPaywall,
    expandedSuggestions,
    analysisCount,
    timeRemaining
  } = state;

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    await startAnalysis(url);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'border-purple-500/50 bg-purple-500/10 text-purple-300';
      case 'medium': return 'border-blue-500/50 bg-blue-500/10 text-blue-300';
      case 'low': return 'border-gray-500/50 bg-gray-500/10 text-gray-300';
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'title': return <MessageSquare className="h-4 w-4" />;
      case 'price': return <DollarSign className="h-4 w-4" />;
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'description': return <MessageSquare className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 85) return "text-green-400";
    if (score >= 70) return "text-orange-400";
    return "text-red-400";
  };

  const getQualityBadgeColor = (score: number) => {
    if (score >= 85) return "bg-green-500/20 text-green-300 border-green-500/30";
    if (score >= 70) return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    return "bg-red-500/20 text-red-300 border-red-500/30";
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">Salesence</span>
            </Link>
            
            <div className="text-sm text-gray-400">
              AI Product Analysis
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Stage 1: Initial Input State */}
        {!isAnalyzing && !analysisResult && (
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-6">
                <Zap className="w-5 h-5 text-purple-400 mr-2 animate-pulse" />
                <span className="text-sm font-medium text-gray-300">AI-Powered Analysis</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                Unlock AI insights for
                <br />
                <span className="text-gradient">any product</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get instant optimization suggestions for any marketplace product. 
                Your first analysis is completely free.
              </p>
            </div>

            <Card className="glass-effect border-white/10 shadow-2xl max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <Input
                      type="url"
                      placeholder="https://amazon.com/product... or any marketplace URL"
                      value={url}
                      onChange={(e) => setState(prev => ({ ...prev, url: e.target.value }))}
                      className="h-16 pl-12 pr-4 text-lg bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>
                  
                  <Button
                    onClick={handleAnalyze}
                    disabled={!url.trim()}
                    className="w-full h-16 text-lg font-semibold gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                  >
                    <Search className="mr-3 h-6 w-6" />
                    Analyze Free
                  </Button>
                  
                  <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span>Free analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span>No signup required</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                      <span>Instant results</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empty State Illustration */}
            <div className="mt-16">
              <div className="glass-effect rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Ready to optimize your listings?
                </h3>
                <p className="text-gray-300">
                  Paste any product URL above to get started with your free AI analysis.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Analysis Loading State */}
        {isAnalyzing && (
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                {t("analyzingYourProductTitle")}
              </h2>
              <p className="text-lg text-gray-300">
                {t("aiExaminingDetails")}
              </p>
            </div>

            <Card className="glass-effect border-white/10 shadow-2xl">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Progress Bar */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>Progress</span>
                      <span>{currentStage?.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${currentStage?.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="text-center">
                    <p className="text-lg font-medium text-white animate-pulse">
                      {currentStage?.message ? t(currentStage.message) : t("initializing")}
                    </p>
                  </div>

                  {/* Loading Animation */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skeleton Loader */}
            <div className="space-y-6">
              <div className="glass-effect rounded-2xl p-6 animate-pulse">
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="aspect-[4/3] bg-gray-700/50 rounded-xl"></div>
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-700/50 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-700/50 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3 & 4: Results and AI Suggestions */}
        {analysisResult && !isAnalyzing && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center glass-effect rounded-full px-6 py-3">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm font-medium text-gray-300">{t('analysisComplete')}</span>
              </div>

              <h2 className="text-3xl font-bold text-white">
                {t('analysisAIDiscovered')}
              </h2>

              <p className="text-lg text-gray-300">
                {t('analysisActionableInsights')}
              </p>
            </div>

            {/* Product Overview Card */}
            <Card className="glass-effect border-white/10 shadow-2xl overflow-hidden animate-slide-in-bottom">
              <CardContent className="p-0">
                <div className="grid gap-0 lg:grid-cols-2">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-800 to-gray-700">
                      <img 
                        src={analysisResult.product.imageUrl} 
                        alt={analysisResult.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Badge 
                      className={`absolute top-4 right-4 text-xs ${getQualityBadgeColor(analysisResult.product.imageQuality)}`}
                    >
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Image Quality: {analysisResult.product.imageQuality}%
                    </Badge>
                  </div>

                  {/* Product Details */}
                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                          {analysisResult.product.name}
                        </h3>
                        <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                          {analysisResult.marketplace}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-white">{analysisResult.product.rating}</span>
                        </div>
                        <span className="text-gray-400 text-sm">({analysisResult.product.reviewCount.toLocaleString()} reviews)</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-white font-mono">
                          {analysisResult.product.price}
                        </span>
                        {analysisResult.product.originalPrice && (
                          <span className="text-xl text-gray-400 line-through font-mono">
                            {analysisResult.product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full glass-effect border-white/20 text-white hover:bg-white/10">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Original Listing
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-6 w-6 text-yellow-400" />
                  AI-Powered Optimization Suggestions
                </h3>
                <p className="text-gray-300">
                  Based on analysis of 50,000+ similar products
                </p>
              </div>

              <div className="grid gap-6">
                {suggestions.map((suggestion) => (
                  <Card 
                    key={suggestion.id}
                    className={`suggestion-card glass-effect border-white/10 hover:border-white/20 transition-all duration-200 hover-lift ${
                      suggestion.applied ? 'ring-2 ring-green-500/50' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className={`p-3 rounded-lg flex-shrink-0 ${getImpactColor(suggestion.impact)}`}>
                            {getTypeIcon(suggestion.type)}
                          </div>
                          
                          <div className="flex-1 space-y-3 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs font-medium w-fit ${
                                  suggestion.impact === 'high' ? 'border-purple-500/50 text-purple-300' :
                                  suggestion.impact === 'medium' ? 'border-blue-500/50 text-blue-300' :
                                  'border-gray-500/50 text-gray-300'
                                }`}
                              >
                                {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                              </Badge>
                              <span className="text-sm text-gray-400">
                                {suggestion.improvement}
                              </span>
                            </div>
                            
                            <p className="text-white font-medium">
                              {suggestion.text}
                            </p>

                            {expandedSuggestions.has(suggestion.id) && (
                              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                                <p className="text-sm text-gray-300">
                                  This suggestion is based on our analysis of similar products in your category. 
                                  Implementing this change has shown consistent improvements in conversion rates 
                                  and click-through performance.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 ml-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSuggestionExpansion(suggestion.id)}
                            className="text-gray-400 hover:text-white p-2"
                          >
                            {expandedSuggestions.has(suggestion.id) ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                            }
                          </Button>
                           
                          <Button
                            variant={suggestion.applied ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSuggestion(suggestion.id)}
                            className={`text-xs px-3 ${suggestion.applied ? 
                              "bg-green-600 hover:bg-green-700 text-white" : 
                              "glass-effect border-white/20 text-white hover:bg-white/10"
                            }`}
                          >
                            {suggestion.applied ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Applied
                              </>
                            ) : (
                              "Apply"
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stage 5: Engagement Hooks */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="glass-effect border-white/10 text-center p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">97% Analysis Confidence</h4>
                <p className="text-sm text-gray-400">Based on 50,000+ similar products</p>
              </Card>

              <Card className="glass-effect border-white/10 text-center p-6">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">{t("analysisCompletedTime", { time: "2.3" })}</h4>
                <p className="text-sm text-gray-400">{t("lightningFastProcessing")}</p>
              </Card>

              <Card className="glass-effect border-white/10 text-center p-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Potential revenue increase: +$1,247/month</h4>
                <p className="text-sm text-gray-400">Based on similar optimizations</p>
              </Card>

              <Card className="glass-effect border-white/10 text-center p-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Join 2,847 sellers already optimizing</h4>
                <p className="text-sm text-gray-400">Proven results</p>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="gradient-primary hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl w-full sm:w-auto glow-effect"
                  onClick={() => setShowPaywall(true)}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get More Analyses
                </Button>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="outline" size="sm" className="glass-effect border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                    <Heart className="h-4 w-4 mr-2" />
                    Save Analysis
                  </Button>
                  <Button variant="outline" size="sm" className="glass-effect border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </div>

              <div className="text-sm text-gray-400">
                Free analysis expires in {formatTimeRemaining(timeRemaining)} • {analysisCount} of 3 free analyses used
              </div>
            </div>
          </div>
        )}

        {/* Stage 6: Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="glass-effect border-white/10 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPaywall(false)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white">
                      Unlock unlimited product insights
                    </h2>
                    <p className="text-lg text-gray-300">
                      Get unlimited analyses, advanced AI recommendations, and performance tracking
                    </p>
                  </div>

                  {/* Pricing Options */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="glass-effect border-white/20 hover:border-purple-500/50 transition-colors cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Monthly</h3>
                        <div className="text-3xl font-bold text-white mb-2">$29</div>
                        <p className="text-gray-400 text-sm">per month</p>
                      </CardContent>
                    </Card>

                    <Card className="glass-effect border-purple-500/50 bg-purple-500/10 relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-600 text-white px-3 py-1 text-xs">
                          Save 40%
                        </Badge>
                      </div>
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Annual</h3>
                        <div className="text-3xl font-bold text-white mb-2">$199</div>
                        <p className="text-gray-400 text-sm">per year</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Everything included:</h4>
                    <div className="grid gap-3 text-left max-w-md mx-auto">
                      {[
                        "Unlimited product analyses",
                        "Advanced AI recommendations",
                        "Performance tracking & analytics",
                        "Priority customer support",
                        "Export reports & insights",
                        "Team collaboration tools"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-4">
                    <Button className="w-full gradient-primary hover:opacity-90 text-white py-3 rounded-xl font-semibold">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Start Free Trial
                    </Button>
                    
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Card</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>Bank Transfer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        <span>Crypto</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    14-day free trial • Cancel anytime • No setup fees
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};