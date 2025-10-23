import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Brain,
  Target,
  Rocket,
  Home,
  BarChart3,
  Users,
  Briefcase,
  Zap,
  Lightbulb,
  TrendingUp,
  Star,
  Mail,
  Lock,
  Key,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [forgotStep, setForgotStep] = useState<0 | 1 | 2 | 3>(0);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentThought, setCurrentThought] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get redirect information from location state
  const applyingFor = location.state?.applyingFor || '';
  const redirectTo = location.state?.redirectTo || '/';

  // Inspirational thoughts that will rotate
  const inspirationalThoughts = [
    {
      text: t("careerJourneySteps"),
      icon: TrendingUp,
      color: "text-blue-400"
    },
    {
      text: t("greatInsights"),
      icon: Lightbulb,
      color: "text-yellow-400"
    },
    {
      text: t("dataDrivenDecisions"),
      icon: BarChart3,
      color: "text-green-400"
    },
    {
      text: t("rightAnalysis"),
      icon: Star,
      color: "text-purple-400"
    },
    {
      text: t("professionalJourney"),
      icon: Brain,
      color: "text-pink-400"
    }
  ];

  const features = [
    {
      title: t("aiAnalysis"),
      description: t("aiAnalysisDesc"),
      icon: Brain,
      link: "/#ai-analysis"
    },
    {
      title: t("performance"),
      description: t("performanceDesc"),
      icon: BarChart3,
      link: "/#performance"
    }
  ];

  const quickLinks = [
    { name: t("home"), path: "/", icon: Home },
    { name: t("features"), path: "/#features", icon: Zap },
    { name: t("about"), path: "/#about", icon: Users },
  ];

  // Rotate through inspirational thoughts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentThought((prev) => (prev + 1) % inspirationalThoughts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (u: any) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      setStatus("success");
      
      // Store login state and user info
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', user.name || formData.email.split('@')[0]);
      
      // Redirect to the appropriate page
      setTimeout(() => {
        navigate(redirectTo, { 
          state: { applyingFor } 
        });
      }, 1500);
    } else {
      setStatus("error");
    }
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail.trim()) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      alert(`Mock email sent with code: ${code}`);
      setForgotStep(2);
    }
  };

  const handleForgotCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetCode === generatedCode) {
      setForgotStep(3);
    } else {
      alert("Invalid code. Try again.");
    }
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((u: any) =>
      u.email === resetEmail ? { ...u, password: newPassword } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setStatus("success");
    setTimeout(() => {
      setForgotStep(0);
      setStatus("idle");
    }, 2000);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const CurrentThoughtIcon = inspirationalThoughts[currentThought].icon;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* 🌟 Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              y: Math.random() * 100,
              x: Math.random() * 100,
              rotate: 0,
              opacity: 0
            }}
            animate={{ 
              y: [null, Math.random() * 50 - 25],
              x: [null, Math.random() * 50 - 25],
              rotate: Math.random() * 20 - 10,
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: i * 0.5
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {i % 3 === 0 && <Sparkles className="h-5 w-5 text-purple-400/60" />}
            {i % 3 === 1 && <Target className="h-5 w-5 text-pink-400/60" />}
            {i % 3 === 2 && <Rocket className="h-5 w-5 text-blue-400/60" />}
          </motion.div>
        ))}

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/50 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0, 0.7, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              repeatType: "loop",
              delay: i * 0.3
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* 💭 Inspirational Thought Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4 z-20"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentThought}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
            className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-center"
          >
            <CurrentThoughtIcon className={`h-4 w-4 mr-2 ${inspirationalThoughts[currentThought].color}`} />
            <p className="text-sm text-gray-200 text-center">
              {applyingFor ? `Apply for: ${applyingFor}` : inspirationalThoughts[currentThought].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 💳 Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full relative z-10 mt-12"
      >
        {/* Go Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-4"
        >
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {t("backToHome") || "Back to Home"}
          </Button>
        </motion.div>

        <Card className="border border-gray-800 bg-gray-950/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden">
          {/* Card Header Gradient */}
          <div className="bg-gradient-to-r from-purple-900/30 via-indigo-900/30 to-pink-900/30 p-1">
            <div className="bg-gray-950/90 rounded-t-2xl">
              <CardHeader className="text-center pb-4">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                    {applyingFor ? t("applyNow") :
                     forgotStep === 1
                      ? t("resetPassword")
                      : forgotStep === 2
                      ? t("verifyCode")
                      : forgotStep === 3
                      ? t("newPassword")
                      : status === "success"
                      ? t("welcomeLogin")
                      : t("welcomeBack")}
                  </CardTitle>
                </motion.div>
                <CardDescription className="text-gray-400 mt-2">
                  {applyingFor ? t("loginToApply") :
                   forgotStep === 1
                    ? t("wellSendResetCode")
                    : forgotStep === 2
                    ? t("checkEmailForCode")
                    : forgotStep === 3
                    ? t("createNewPassword")
                    : status === "success"
                    ? t("redirectingYou")
                    : t("signInToContinue")}
                </CardDescription>
              </CardHeader>
            </div>
          </div>

          <CardContent className="pt-6">
            {status === "success" && forgotStep === 0 ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-8 space-y-4"
              >
                <CheckCircle2 className="h-16 w-16 text-green-400 animate-bounce" />
                <p className="text-gray-300">{t("loginSuccessful")}</p>
                {applyingFor && (
                  <p className="text-blue-300 text-sm">{t("preparingApplication")} {applyingFor}</p>
                )}
              </motion.div>
            ) : forgotStep === 1 ? (
              // Step 1: Enter Email
              <form onSubmit={handleForgotEmailSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-gray-300 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {t("email")}
                  </Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="bg-gray-900/70 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold rounded-xl py-5 transition-all duration-300 transform hover:scale-[1.02]">
                  {t("sendCode")}
                </Button>
                <p
                  className="text-sm text-gray-400 text-center cursor-pointer hover:text-purple-400 transition-colors flex items-center justify-center"
                  onClick={() => setForgotStep(0)}
                >
                  <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                  {t("backToLogin")}
                </p>
              </form>
            ) : forgotStep === 2 ? (
              // Step 2: Enter Code
              <form onSubmit={handleForgotCodeSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="resetCode" className="text-gray-300 flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    {t("verificationCode")}
                  </Label>
                  <Input
                    id="resetCode"
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    required
                    placeholder={t("enterSixDigitCode")}
                    className="bg-gray-900/70 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 text-center tracking-widest text-lg"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white font-semibold rounded-xl py-5 transition-all duration-300 transform hover:scale-[1.02]">
                  {t("verifyCodeButton")}
                </Button>
                <p
                  className="text-sm text-gray-400 text-center cursor-pointer hover:text-purple-400 transition-colors flex items-center justify-center"
                  onClick={() => setForgotStep(0)}
                >
                  <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                  {t("backToLogin")}
                </p>
              </form>
            ) : forgotStep === 3 ? (
              // Step 3: Set New Password
              <form onSubmit={handleResetPasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-gray-300 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    {t("password")}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="bg-gray-900/70 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-semibold rounded-xl py-5 transition-all duration-300 transform hover:scale-[1.02]">
                  {t("saveAndLogin")}
                </Button>
                <p
                  className="text-sm text-gray-400 text-center cursor-pointer hover:text-purple-400 transition-colors flex items-center justify-center"
                  onClick={() => setForgotStep(0)}
                >
                  <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                  {t("backToLogin")}
                </p>
              </form>
            ) : (
              // Normal Login
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {t("email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className={`bg-gray-900/70 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 ${
                      status === "error" ? "border-red-500" : ""
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    {t("password")}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className={`bg-gray-900/70 border-gray-700 text-white placeholder-gray-500 pr-10 focus:ring-2 focus:ring-purple-500 ${
                        status === "error" ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {status === "error" && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded-lg border border-red-800/50"
                  >
                    {t("invalidCredentials")}
                  </motion.p>
                )}

                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold rounded-xl py-5 transition-all duration-300 transform hover:scale-[1.02]">
                  {applyingFor ? t("loginAndApply") : t("login")}
                </Button>
              </form>
            )}

            {/* Footer Links */}
            {forgotStep === 0 && status !== "success" && (
              <div className="mt-6 text-center space-y-3">
                <p
                  onClick={() => setForgotStep(1)}
                  className="cursor-pointer text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center justify-center"
                >
                  {t("forgotPassword")}
                </p>
                <p className="text-gray-500 text-sm">
                  {t("dontHaveAccount")}{" "}
                  <Link
                    to="/signup"
                    state={{ applyingFor, redirectTo }}
                    className="text-purple-400 hover:text-purple-300 underline transition-colors"
                  >
                    {t("signup")}
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 🚀 Right Sidebar - Explore Features */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="hidden lg:block absolute right-8 top-1/2 transform -translate-y-1/2 w-72"
      >
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center">
            <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
            {t("exploreFeatures")}
          </h3>
          
          <div className="space-y-3 mb-5">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="group flex items-start p-3 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                  onClick={() => handleNavigation(feature.link)}
                >
                  <div className="bg-purple-500/10 p-2 rounded-lg mr-3 group-hover:bg-purple-500/20 transition-colors">
                    <IconComponent className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <h4 className="font-semibold text-white mb-3 text-sm">{t("quickNavigation")}</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <Button 
                    key={index}
                    variant="outline" 
                    className="text-xs h-8 bg-white/5 border-white/10 text-gray-300 hover:bg-purple-500/20 hover:text-white hover:border-purple-500/30"
                    onClick={() => handleNavigation(link.path)}
                  >
                    <IconComponent className="h-3 w-3 mr-1" /> {link.name}
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="mt-5 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/20">
            <p className="text-xs text-purple-300 font-medium">{t("newToSalesence")}</p>
            <p className="text-xs text-gray-400 mt-1">{t("createAccountToUnlock")}</p>
            <Button
              className="w-full mt-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs py-1 h-8"
              onClick={() => handleNavigation("/signup")}
            >
              {t("createAccount")}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}