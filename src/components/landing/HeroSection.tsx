import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Play, Star, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const [isBgVideoPlaying, setIsBgVideoPlaying] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const particles = useMemo(
    () =>
      [...Array(12)].map(() => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        duration: 5 + Math.random() * 3,
      })),
    []
  );

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-20 overflow-hidden"
      onMouseEnter={() => setIsBgVideoPlaying(true)}
      onMouseLeave={() => setIsBgVideoPlaying(false)}
    >
      {/* Background gradient orbs */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Background video */}
      {isBgVideoPlaying && (
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover -z-10 opacity-30"
        >
          <source src="/assets/hero-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/70 rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              x: [0, p.x],
              y: [0, p.y],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{ top: p.top, left: p.left }}
          />
        ))}
      </div>

      {/* Pre-headline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative mb-6"
      >
        <p className="text-sm sm:text-base text-purple-300 font-semibold uppercase tracking-[0.25em]">
          {t("aiPoweredAnalysis")}
        </p>
        <span className="absolute left-1/2 -bottom-1 w-20 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full animate-pulse -translate-x-1/2"></span>
      </motion.div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight px-4">
        <span className="text-white block">{t("heroTitle1")}</span>
        <span className="text-purple-400 block">{t("heroTitle2")}</span>
      </h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed"
      >
        {t("heroDescription")}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-5"
      >
        <Button
          onClick={onGetStarted ? onGetStarted : () => navigate("/login")}
          size="lg"
          className="px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg shadow-purple-500/30 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 transition-all flex items-center gap-2"
        >
          {t("getStarted")} <ArrowRight className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => alert("Video demo coming soon! Add your video URL here.")}
          className="px-8 py-6 text-lg font-semibold rounded-2xl border-gray-700 text-gray-300 hover:bg-gray-800/60 backdrop-blur-sm transition-all flex items-center gap-2"
        >
          <Play className="h-5 w-5 text-purple-400" /> {t("watchDemo")}
        </Button>
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto"
      >
        {[{ icon: Star, text: t("trustedByUsers"), color: "text-yellow-400" },
          { icon: Zap, text: t("lightningFastInsights"), color: "text-pink-400" },
          { icon: TrendingUp, text: t("boostGrowthFaster"), color: "text-green-400" },
          { icon: Sparkles, text: t("aiDrivenPredictions"), color: "text-purple-400" }]
          .map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-gray-300 bg-white/5 backdrop-blur-md rounded-xl p-5 hover:scale-105 hover:bg-white/10 transition-all duration-300"
          >
            <item.icon className={`h-6 w-6 ${item.color} mb-2`} />
            <p className="text-sm font-medium">{item.text}</p>
          </div>
        ))}
      </motion.div>

    </section>
  );
};

export default HeroSection;
