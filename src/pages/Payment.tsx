import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Shield, Check, Lock, Calendar, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/lib/currency";

interface PlanData {
  name: string;
  price: string;
  period: string;
  yearlyPrice: string;
  features: string[];
  basePrice?: number; // Add base USD price for calculations
}

const Payment = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { formatPrice } = useCurrency();

  // Get plan data from navigation state
  const planData = location.state?.plan as PlanData;

  const [isProcessing, setIsProcessing] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Default plan if no data provided
  const defaultPlan: PlanData = {
    name: t("professional"),
    price: formatPrice(100),
    basePrice: 100,
    period: t("month"),
    yearlyPrice: formatPrice(1000),
    features: [
      `${t("upTo500")} ${t("analysesPerMonth")}`,
      t("trendAlertsRisk"),
      t("seasonalRecommendations"),
      t("advancedReporting"),
      t("prioritySupport")
    ]
  };

  const currentPlan = planData || defaultPlan;

  const getDisplayPrice = () => {
    if (billingCycle === 'yearly') {
      return currentPlan.yearlyPrice;
    }
    return `${currentPlan.price}/${currentPlan.period}`;
  };

  const getSavings = () => {
    if (billingCycle === 'yearly') {
      // Use base price if available, otherwise parse the price string
      let basePrice: number;
      
      if (currentPlan.basePrice !== undefined) {
        // Use the base USD price
        basePrice = currentPlan.basePrice;
      } else {
        // Fallback: parse from formatted price (assumes it's in the display currency)
        // This works but may have rounding issues
        const priceString = currentPlan.price;
        const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
        
        // If Turkish and price is high, assume it's already in TRY, convert back to USD
        if (numericPrice > 1000) {
          basePrice = numericPrice / 32.5; // Rough conversion back
        } else {
          basePrice = numericPrice;
        }
      }
      
      // Savings = 2 months free (yearly is 10 months, full year would be 12)
      const savingsInBase = basePrice * 2;
      
      return t("save") + " " + formatPrice(savingsInBase);
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page or show success message
      alert(t("paymentSuccessMessage"));
      navigate("/");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Back Button */}
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

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t("secureCheckout")}
          </h1>
          <p className="text-gray-300 text-lg">
            {t("completePaymentSecurely")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Payment Form */}
          <div className="space-y-8">
            {/* Billing Cycle Selection */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  {t("billingCycle")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                    onClick={() => setBillingCycle('monthly')}
                    className={billingCycle === 'monthly' ? 'bg-purple-600 hover:bg-purple-700' : 'border-white/20 text-white hover:bg-white/10'}
                  >
                    {t("monthly")}
                  </Button>
                  <Button
                    variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                    onClick={() => setBillingCycle('yearly')}
                    className={billingCycle === 'yearly' ? 'bg-purple-600 hover:bg-purple-700' : 'border-white/20 text-white hover:bg-white/10'}
                  >
                    {t("yearly")} <span className="ml-2 text-green-400 text-sm">({t("save")} 20%)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    {t("personalInformation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t("emailAddress")}
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t("fullName")}
                    </label>
                    <Input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                    {t("paymentInformation")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t("cardNumber")}
                    </label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t("expiryDate")}
                      </label>
                      <Input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t("cvv")}
                      </label>
                      <Input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card className="glass-effect border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">
                    {t("billingAddress")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t("address")}
                    </label>
                    <Input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t("city")}
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {t("postalCode")}
                      </label>
                      <Input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t("country")}
                    </label>
                    <Input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="United States"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg rounded-xl"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("processingPayment")}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    {t("completePayment")} {getDisplayPrice()}
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="glass-effect border-white/10 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">
                  {t("orderSummary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Details */}
                <div className="p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {currentPlan.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {billingCycle === 'yearly' ? t("yearlyBilling") : t("monthlyBilling")}
                  </p>
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className="text-white">{t("total")}:</span>
                    <span className="text-purple-400">{getDisplayPrice()}</span>
                  </div>
                  {getSavings() && (
                    <p className="text-green-400 text-sm mt-2">
                      {getSavings()}
                    </p>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-white font-semibold mb-3">
                    {t("whatsIncluded")}
                  </h4>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Security Notice */}
                <div className="p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">
                      {t("securePayment")}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {t("securePaymentDescription")}
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;