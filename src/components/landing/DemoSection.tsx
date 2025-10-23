import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, ExternalLink, AlertCircle, Sparkles, TrendingUp, ArrowLeft } from "lucide-react";
import { validateProductUrl, extractProductInfo } from "@/utils/urlValidation";
import { generateMockAnalysis, MockAnalysisResult } from "@/utils/mockDataGenerator";
import { AnalysisResults }  from "@/components/analysis/AnalysisResults";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { apiService } from "@/services/api.service";
import { transformApiResponseToMockFormat } from "@/utils/apiTransformer";
import { toast } from "sonner";

export const DemoSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [analysisResult, setAnalysisResult] = useState<MockAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setValidationError("");

    const validation = validateProductUrl(url);
    if (!validation.isValid) {
      setValidationError(t(validation.errorKey || 'enterValidUrl'));
      return;
    }

    setIsAnalyzing(true);

    try {
      // Try to use the real backend API
      const apiResponse = await apiService.analyzeProduct(url);

      // Transform API response to match existing UI format
      const transformedAnalysis = transformApiResponseToMockFormat(apiResponse, url);
      setAnalysisResult(transformedAnalysis);

      toast.success(t("analysisCompletedSuccess"), {
        description: t("foundRecommendations", { count: apiResponse.recommendations.length }),
      });

    } catch (error: any) {
      console.error("API Error:", error);

      // Fallback to mock data if API fails
      const productInfo = extractProductInfo(url);
      const mockAnalysis = generateMockAnalysis(url, productInfo.marketplace, productInfo.platform);
      setAnalysisResult(mockAnalysis);

      // Show warning that mock data is being used
      toast.warning(t("usingDemoMode"), {
        description: error.message || t("backendUnavailable"),
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (validationError) {
      setValidationError("");
    }
  };

  const handleReset = () => {
    setUrl("");
    setAnalysisResult(null);
    setValidationError("");
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button - Only show on dedicated demo page */}
        {location.pathname === "/demo" && (
          <div className="mb-8">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("backToHomepage")}
            </Button>
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center glass-effect rounded-full px-6 py-3 mb-6">
              <Sparkles className="w-5 h-5 text-purple-400 mr-2 animate-pulse" />
              <span className="text-sm font-medium text-gray-300">{t("tryItFree")}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t("seeTheMagic")}
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {t("pasteAnyProductUrl")}
            </p>
          </div>

          {/* Demo Input */}
          <Card className="glass-effect border-white/10 shadow-2xl mb-12">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <Input
                    type="url"
                    placeholder={t("urlPlaceholder")}
                    value={url}
                    onChange={handleInputChange}
                    className={`h-16 pl-12 pr-4 text-lg bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 ${
                      validationError ? 'border-red-400 animate-pulse' : ''
                    }`}
                    disabled={isAnalyzing}
                  />
                  
                  {validationError && (
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!url.trim() || isAnalyzing}
                  className="w-full h-16 text-lg font-semibold gradient-primary hover:opacity-90 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                      {t("analyzingYourProduct")}
                    </>
                  ) : (
                    <>
                      <Search className="mr-3 h-6 w-6" />
                      {t("analyzeFree")}
                    </>
                  )}
                </Button>

                {validationError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg p-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {validationError}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>{t("freeAnalysis")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span>{t("noSignupRequired")}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>{t("instantResults")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results or Empty State */}
          {analysisResult ? (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('analysisComplete')}</h3>
                  <p className="text-gray-300">{t('analysisAIDiscovered')}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="glass-effect border-white/20 text-white hover:bg-white/10"
                >
                  {t('analyzeAnotherProduct')}
                </Button>
              </div>
              <AnalysisResults analysis={analysisResult} />
            </div>
          ) : !isAnalyzing && (
            <div className="text-center py-16">
              <div className="glass-effect rounded-2xl p-12 max-w-md mx-auto">
                <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t("readyToAnalyze")}
                </h3>
                <p className="text-gray-300 mb-6">
                  {t("pasteProductUrl")}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t("boostSales")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};