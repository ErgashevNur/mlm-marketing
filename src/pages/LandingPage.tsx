import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Gift,
  Zap,
  Headset,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";
import { FaInstagram, FaTelegram } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [socials, setSocials] = useState([]);
  const getCurrencies = async () => {
    try {
      const response = await fetch("https://mlm-backend.pixl.uz/suport");

      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }

      const data = await response.json();
      setSocials(data);
    } catch (error) {
      console.error("Error fetching currency:", error.message);
      return null;
    }
  };
  useEffect(() => {
    getCurrencies();
  }, []);

  const features = [
    {
      icon: () => <img src="/CoinLogo.png" alt="USDT" className="w-5 h-5" />,
      title: t("landing.earnCoinsDaily"),
      description: t("landing.earnCoinsDailyDesc"),
    },
    {
      icon: Users,
      title: t("landing.referralSystem"),
      description: t("landing.referralSystemDesc"),
    },
    {
      icon: TrendingUp,
      title: t("landing.trackEarnings"),
      description: t("landing.trackEarningsDesc"),
    },
    {
      icon: Shield,
      title: t("landing.securePlatform"),
      description: t("landing.securePlatformDesc"),
    },
    {
      icon: Globe,
      title: t("landing.multiLanguage"),
      description: t("landing.multiLanguageDesc"),
    },
    {
      icon: Gift,
      title: t("landing.premiumProducts"),
      description: t("landing.premiumProductsDesc"),
    },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Navbar />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                {t("landing.welcome")} {import.meta.env.VITE_KEY_IMG}
                <span className="text-yellow-400">{t("landing.platform")}</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                {t("landing.heroDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  {t("landing.getStarted")}
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-colors"
                >
                  {t("landing.signIn")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("landing.whyChoose")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {t("landing.whyDesc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon
                        className="text-blue-600 dark:text-blue-400"
                        size={24}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("landing.readyToStart")}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t("landing.ctaDesc")}
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              {t("landing.startEarningToday")}
              <Zap className="ml-2" size={20} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-black text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Globe className="text-white" size={20} />
                  </div>
                  <span className="text-xl font-bold">
                    {t("landing.platform")}
                  </span>
                </div>
                <p className="text-gray-400">{t("landing.heroDesc")}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">{t("landing.platform")}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-white transition-colors"
                    >
                      {t("landing.dashboard")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/products"
                      className="hover:text-white transition-colors"
                    >
                      {t("landing.products")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/plans"
                      className="hover:text-white transition-colors"
                    >
                      {t("landing.plans")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">{t("landing.support")}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      {t("landing.helpCenter")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      {t("landing.contactUs")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      {t("landing.faq")}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">{t("landing.legal")}</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      {t("landing.privacyPolicy")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      {t("landing.termsOfService")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      {t("landing.cookiePolicy")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 MLM PLATFORM. {t("landing.copyright")}</p>
            </div>
          </div>
        </footer>
      </div>
      <div className="fixed bottom-6 right-6 z-50 group w-16 h-16">
        <div className="w-16 h-16 cursor-pointer flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg relative z-20">
          <Headset size={28} />
        </div>

        <div
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                          opacity-0 translate-y-2 scale-95
                          group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                          transition-all duration-300 ease-in-out"
        >
          {socials.map(({ link, name }) => {
            const icon =
              name === "Instagram" ? (
                <FaInstagram />
              ) : name === "Telegram" ? (
                <FaTelegram />
              ) : (
                <IoShareSocial />
              );
            const bgColor =
              name === "Instagram"
                ? "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500"
                : name === "Telegram"
                ? "bg-blue-500"
                : "bg-gray-400";

            return (
              <a
                key={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center ${bgColor} text-white rounded-full shadow cursor-pointer`}
                href={link}
              >
                {icon}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
