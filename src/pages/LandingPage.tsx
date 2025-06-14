import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  Globe,
  Coins,
  Gift,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import Navbar from "../components/Navbar";

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();

  const features = [
    {
      icon: Coins,
      title: "Earn Coins Daily",
      description: "Get daily coin bonuses based on your subscription plan",
    },
    {
      icon: Users,
      title: "Referral System",
      description:
        "Invite friends and earn bonuses for each successful referral",
    },
    {
      icon: TrendingUp,
      title: "Track Earnings",
      description:
        "Monitor your daily, monthly, and total earnings in real-time",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Your data and transactions are protected with enterprise-grade security",
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Available in 7 languages to serve users worldwide",
    },
    {
      icon: Gift,
      title: "Premium Products",
      description: "Access exclusive products and services with your coins",
    },
  ];

  const plans = [
    {
      name: "Basic",
      price: 29,
      coinBonus: 50,
      features: ["50 coins daily", "Basic products access", "Email support"],
    },
    {
      name: "Premium",
      price: 59,
      coinBonus: 100,
      features: [
        "100 coins daily",
        "Premium products access",
        "Priority support",
        "Exclusive bonuses",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 99,
      coinBonus: 200,
      features: [
        "200 coins daily",
        "All products access",
        "Dedicated support",
        "Custom features",
      ],
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
                Welcome to <span className="text-yellow-400">MLM PLATFORM</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                The ultimate marketing platform where you earn coins daily,
                refer friends, and access premium products with our custom
                currency system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-colors"
                >
                  Sign In
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
                Why Choose MLM PLATFORM?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover the features that make our platform the best choice for
                earning and growing your income.
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

        {/* Pricing Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Select the perfect plan and start earning coins daily. Upgrade
                anytime to unlock more benefits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                    plan.popular
                      ? "border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        /month
                      </span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-yellow-600 dark:text-yellow-400">
                      <Coins size={20} />
                      <span className="font-semibold">
                        {plan.coinBonus} coins daily
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle
                          className="text-green-500 flex-shrink-0"
                          size={16}
                        />
                        <span className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-center block transition-colors ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already earning coins daily and
              building their income with MLM PLATFORM.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              Start Earning Today
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
                  <span className="text-xl font-bold">MLM PLATFORM</span>
                </div>
                <p className="text-gray-400">
                  The ultimate marketing platform for earning and growing your
                  income.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/products"
                      className="hover:text-white transition-colors"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard/plans"
                      className="hover:text-white transition-colors"
                    >
                      Plans
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 MLM PLATFORM. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
