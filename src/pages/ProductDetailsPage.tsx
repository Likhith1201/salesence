import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAutoTranslate, useBatchAutoTranslate } from "@/hooks/useAutoTranslate";
import { useCurrency } from "@/lib/currency";
import { formatPriceWithCurrency } from "@/lib/currencyHelpers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/ui/navbar";
import {
  CheckCircle,
  Star,
  Heart,
  ArrowLeft,
  Share2,
  Bookmark,
  Package,
  MessageCircle,
  ArrowRight,
  Zap,
  BarChart3,
  User,
  TrendingUp,
  Eye,
  Clock,
  Sparkles,
  Award,
  Target,
  Crown,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to extract numeric value from price string (works with any currency)
const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  // Remove all non-numeric characters except decimal point
  const numericString = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(numericString) || 0;
};

// Mock function to fetch product data based on URL
const fetchProductData = async (url: string) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = {
        product: {
          id: "1",
          name: "Premium Wireless Noise Cancelling Headphones",
          category: "Electronics",
          brand: "AudioPro",
          price: "$299.99",
          originalPrice: "$399.99",
          rating: 4.8,
          reviewCount: 1247,
          description: "Experience immersive sound with our premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort for all-day wear.",
          features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "Quick charge (5 min = 3 hours)",
            "Premium memory foam ear cups",
            "Bluetooth 5.2 with multipoint connection"
          ],
          images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop"
          ],
          specifications: {
            "Battery Life": "30 hours",
            "Charging Time": "2 hours",
            "Weight": "265g",
            "Connection": "Bluetooth 5.2",
            "Warranty": "2 years"
          }
        },
        recommendations: [
          {
            id: "rec1",
            name: "Wireless Earbuds Pro",
            price: "$179.99",
            originalPrice: "$229.99",
            rating: 4.6,
            reviewCount: 892,
            image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=400&h=300&fit=crop",
            badge: "Best Seller",
            features: ["Noise Cancelling", "24h Battery", "Wireless Charging"],
            discount: 22
          },
          {
            id: "rec2",
            name: "Gaming Headset Pro",
            price: "$159.99",
            originalPrice: "$199.99",
            rating: 4.7,
            reviewCount: 456,
            image: "https://images.unsplash.com/photo-1634143050743-60d8ae6c6c16?w=400&h=300&fit=crop",
            badge: "Trending",
            features: ["7.1 Surround", "RGB Lights", "Noise Cancelling Mic"],
            discount: 20
          },
          {
            id: "rec3",
            name: "Portable Speaker",
            price: "$129.99",
            originalPrice: "$169.99",
            rating: 4.5,
            reviewCount: 321,
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
            badge: "New",
            features: ["360° Sound", "Waterproof", "20h Playtime"],
            discount: 24
          },
          {
            id: "rec4",
            name: "Smart Watch Series X",
            price: "$249.99",
            originalPrice: "$299.99",
            rating: 4.9,
            reviewCount: 1204,
            image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop",
            badge: "Editor's Choice",
            features: ["Health Tracking", "GPS", "7-day Battery"],
            discount: 17
          }
        ]
      };
      resolve(mockData);
    }, 1000);
  });
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [product, setProduct] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Get product data from navigation state if available
  const stateData = location.state as {
    productData?: any;
    analysisData?: any;
    recommendations?: any[];
  } | null;

  // Auto-translate product details
  const { text: translatedName } = useAutoTranslate(product?.name || '');
  const { text: translatedDescription } = useAutoTranslate(product?.description || '');
  const { texts: translatedFeatures } = useBatchAutoTranslate(product?.features || []);

  // Auto-translate specification keys
  const specKeys = product?.specifications ? Object.keys(product.specifications) : [];
  const { texts: translatedSpecKeys } = useBatchAutoTranslate(specKeys);

  // Format prices with current currency (updates when language changes)
  const formattedPrice = useMemo(() => {
    if (!product) return "";
    // Use original currency if available, otherwise fall back to language-based formatting
    if (product.priceAmount !== undefined && product.currency) {
      return formatPriceWithCurrency(product.priceAmount, product.currency);
    }
    // Fallback: parse the price string and format with language-based currency
    return product.price ? formatPrice(parsePrice(product.price)) : "";
  }, [product, formatPrice, i18n.language]);
  const formattedOriginalPrice = useMemo(() => {
    if (!product) return "";
    if (product.originalPriceAmount !== undefined && product.currency) {
      return formatPriceWithCurrency(product.originalPriceAmount, product.currency);
    }
    return product.originalPrice ? formatPrice(parsePrice(product.originalPrice)) : "";
  }, [product, formatPrice, i18n.language]);
  const formattedPriceSavings = useMemo(() => {
    if (!product?.originalPrice || !product?.price) return null;
    if (product.originalPriceAmount !== undefined && product.priceAmount !== undefined && product.currency) {
      const savings = product.originalPriceAmount - product.priceAmount;
      return formatPriceWithCurrency(savings, product.currency);
    }
    const savings = parsePrice(product.originalPrice) - parsePrice(product.price);
    return formatPrice(savings);
  }, [product, formatPrice, i18n.language]);

  useEffect(() => {
    const loadProductData = async () => {
      setLoading(true);
      try {
        // Check if we have real product data from analysis
        if (stateData?.productData) {
          // Use real product data from analysis
          const realProduct = {
            id: productId,
            name: stateData.productData.name,
            price: stateData.productData.price,
            originalPrice: stateData.productData.originalPrice,
            rating: stateData.productData.rating || 0,
            reviewCount: stateData.productData.reviewCount || 0,
            category: stateData.productData.category || 'Product Analysis',
            images: stateData.productData.images ||
                   (stateData.productData.imageUrl ? [stateData.productData.imageUrl] : []),
            // Mark as real product (no mock data)
            isRealProduct: true,
            // Real products don't have these fields from the API
            description: null,
            features: null,
            specifications: null,
            brand: null
          };
          setProduct(realProduct);

          // Use real recommendations
          if (stateData.recommendations && stateData.recommendations.length > 0) {
            setRecommendations(stateData.recommendations);
          } else {
            setRecommendations([]);
          }
        } else {
          // Fallback to mock data for demo purposes only
          const data: any = await fetchProductData(`https://example.com/product/${productId}`);
          setProduct({
            ...data.product,
            isRealProduct: false // Mark as mock data
          });
          setRecommendations(data.recommendations);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500/30 border-t-blue-500 mx-auto"></div>
            <Sparkles className="h-8 w-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white text-lg font-medium">{t('productLoadingDetails')}</p>
          <p className="text-gray-400 text-sm mt-2">{t('productPleaseWait')}</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-4"
        >
          <div className="bg-red-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{t('productNotFound')}</h2>
          <p className="text-gray-400 mb-8">{t('productNotFoundDesc')}</p>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('productGoBackHome')}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Add Navbar */}
      <Navbar />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Add padding for navbar */}
      <div className="pt-24"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl relative z-10">
        {/* Main Product Section */}
        <div className="grid gap-8 lg:grid-cols-2 mb-20">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
              <div className="relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={product.images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                  {activeImage + 1} / {product.images.length}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
              {product.images.map((image: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(index)}
                  className={`relative aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === index
                      ? 'border-blue-500 shadow-lg shadow-blue-500/50'
                      : 'border-white/10 hover:border-blue-400/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {activeImage === index && (
                    <div className="absolute inset-0 bg-blue-500/20"></div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-4 py-1.5 text-sm font-medium">
                  {product.category}
                </Badge>
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-4 py-1.5 text-sm font-medium">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {t('productFeatured')}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {translatedName}
              </h1>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                            : 'fill-gray-600 text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white text-lg">{product.rating}</span>
                  <span className="text-gray-300">({product.reviewCount.toLocaleString()} reviews)</span>
                </div>

                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-2.5 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('productInStock')}
                </Badge>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-3xl p-4 sm:p-6 border border-white/10">
              <div className="flex flex-wrap items-end gap-3 sm:gap-4 mb-3">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-mono bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="text-2xl sm:text-3xl text-gray-400 line-through font-mono mb-1 sm:mb-2">{formattedOriginalPrice}</span>
                )}
              </div>
              {product.originalPrice && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-bold">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{t('productSave')} </span>
                    {formattedPriceSavings} (
                    {Math.round(((parsePrice(product.originalPrice) - parsePrice(product.price)) / parsePrice(product.originalPrice)) * 100)}% {t('productOff')})
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-400 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    {t('productLimitedTime')}
                  </Badge>
                </div>
              )}
            </div>

            {/* Description - Only show if available */}
            {product.description && (
              <p className="text-lg text-gray-300 leading-relaxed bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                {translatedDescription}
              </p>
            )}

            {/* Quick Features - Only show if available */}
            {product.features && product.features.length > 0 && (
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg">{t('productPremiumFeatures')}</h3>
                </div>
                <div className="grid gap-3">
                  {translatedFeatures.slice(0, 5).map((feature: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/5 group hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      </div>
                      <span className="text-sm text-gray-200 font-medium group-hover:text-white transition-colors">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Real Product Notice - Show when viewing analyzed products */}
            {product.isRealProduct && (
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-3xl p-5 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">
                    {t('productRealDataNotice')}
                  </p>
                </div>
              </div>
            )}

            {/* Analysis Info Notice */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-3xl p-6 border border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">{t('productAnalysisOnly')}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {t('productAnalysisDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Save to Wishlist */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex-1 h-14 rounded-2xl border-2 transition-all duration-300 ${
                  isWishlisted
                    ? "bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? "fill-red-400" : ""}`} />
                {isWishlisted ? t('productSaved') : t('productSaveForLater')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    });
                  }
                }}
                className="h-14 w-14 rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20 border-2"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Recommended Products Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 sm:gap-4 mb-3">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
                  <TrendingUp className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{t('productRecommendedForYou')}</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">{t('productHandpicked')}</p>
                </div>
              </div>
            </div>
            <Badge className="bg-white/10 text-white border-white/20 px-4 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base font-medium backdrop-blur-md">
              <Award className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              {recommendations.length} {t('productPremiumItems')}
            </Badge>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((recommendation, index) => {
              // Calculate badge and discount based on available data
              const badge = recommendation.badge || (index === 0 ? "Best Seller" : index === 1 ? "Trending" : "Recommended");
              const discount = recommendation.discount || Math.floor(Math.random() * 15) + 10;

              return (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 h-full flex flex-col overflow-hidden">
                    <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                      {/* Image & Badge */}
                      <div className="relative mb-4">
                        <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl overflow-hidden">
                          <img
                            src={recommendation.image}
                            alt={recommendation.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <Badge className={`absolute top-3 left-3 ${
                          badge === "Best Seller" ? "bg-gradient-to-r from-orange-500 to-red-500" :
                          badge === "Trending" ? "bg-gradient-to-r from-pink-500 to-purple-500" :
                          badge === "New" ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                          "bg-gradient-to-r from-blue-500 to-cyan-500"
                        } text-white border-0 px-3 py-1.5 text-xs font-bold shadow-lg`}>
                          {badge}
                        </Badge>
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          -{discount}%
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow space-y-3">
                        <h3 className="font-bold text-white text-base mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors leading-tight">
                          {recommendation.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= Math.floor(recommendation.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-600 text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400 font-medium">{recommendation.rating}</span>
                          <span className="text-xs text-gray-500">({recommendation.reviewCount})</span>
                        </div>

                        {/* Features - only show if available */}
                        {recommendation.features && recommendation.features.length > 0 && (
                          <div className="space-y-2">
                            {recommendation.features.slice(0, 2).map((feature: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                                <Zap className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />
                                <span className="text-xs text-gray-300 font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-auto pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            <span className="text-2xl font-bold text-white font-mono">{recommendation.priceAmount && recommendation.currency ? formatPriceWithCurrency(recommendation.priceAmount, recommendation.currency) : formatPrice(parsePrice(recommendation.price))}</span>
                            {recommendation.originalPrice && (
                              <span className="text-sm text-gray-500 line-through font-mono">{recommendation.originalPriceAmount && recommendation.currency ? formatPriceWithCurrency(recommendation.originalPriceAmount, recommendation.currency) : (recommendation.originalPrice ? formatPrice(parsePrice(recommendation.originalPrice)) : "")}</span>
                            )}
                          </div>
                          {recommendation.originalPrice && (
                            <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                              Save {recommendation.priceAmount && recommendation.originalPriceAmount && recommendation.currency ? formatPriceWithCurrency(recommendation.originalPriceAmount - recommendation.priceAmount, recommendation.currency) : formatPrice(parsePrice(recommendation.originalPrice) - parsePrice(recommendation.price))}
                            </Badge>
                          )}
                        </div>
                        <Button
                          onClick={() => recommendation.productUrl && window.open(recommendation.productUrl, '_blank')}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 rounded-xl h-11"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t('productViewDetails')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Product Details Tabs - Only show if we have detailed data */}
        {!product.isRealProduct && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl p-2 rounded-3xl shadow-2xl border border-white/10">
                <TabsTrigger
                  value="overview"
                  className="rounded-2xl text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 transition-all duration-300 py-4 text-base font-medium"
                >
                  <Package className="h-5 w-5 mr-2" />
                  {t('productOverview')}
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="rounded-2xl text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 transition-all duration-300 py-4 text-base font-medium"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {t('productSpecifications')}
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-2xl text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/50 transition-all duration-300 py-4 text-base font-medium"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {t('productReviews')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <CardContent className="p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                        <Package className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white">{t('productProductOverview')}</h3>
                    </div>
                    <div className="space-y-6">
                      <p className="text-gray-300 leading-relaxed text-lg bg-white/5 rounded-2xl p-6 border border-white/10">
                        {translatedDescription}
                      </p>
                      <div className="grid gap-4">
                        {translatedFeatures.map((feature: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 group hover:bg-white/10 transition-all duration-300"
                          >
                            <div className="p-2 bg-yellow-500/20 rounded-xl">
                              <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                            </div>
                            <span className="text-gray-200 text-base font-medium group-hover:text-white transition-colors">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specifications">
                <Card className="bg-gradient-to-br from-gray-900 to-gray-800 backdrop-blur-xl border border-white/10 shadow-2xl">
                  <CardContent className="p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white">{t('productTechnicalSpecs')}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      {Object.entries(product.specifications || {}).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex justify-between items-center py-5 px-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 group hover:bg-white/10 transition-all duration-300"
                        >
                          <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">{translatedSpecKeys[index] || key}</span>
                          <span className="text-white font-bold text-lg bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{value as string}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;