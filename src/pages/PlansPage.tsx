import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Crown, Zap, Star, CreditCard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const PlansPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("");

  const plans = [
    {
      id: "basic",
      name: t("plans.basic"),
      price: 29,
      icon: Zap,
      color: "blue",
      features: [
        "Up to 10 referrals per month",
        "Basic earning opportunities",
        "Email support",
        "Basic analytics",
        "Mobile app access",
      ],
    },
    {
      id: "premium",
      name: t("plans.premium"),
      price: 59,
      icon: Crown,
      color: "purple",
      popular: true,
      features: [
        "Unlimited referrals",
        "Premium earning opportunities",
        "Priority support",
        "Advanced analytics",
        "Mobile app access",
        "Exclusive bonuses",
      ],
    },
    {
      id: "enterprise",
      name: t("plans.enterprise"),
      price: 99,
      icon: Star,
      color: "orange",
      features: [
        "Everything in Premium",
        "Team management",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Here you would integrate with InterKassa payment system
    console.log("Selected plan:", planId);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
        };
      case "purple":
        return {
          bg: "bg-purple-50",
          border: "border-purple-200",
          icon: "text-purple-600",
          button: "bg-purple-600 hover:bg-purple-700",
        };
      case "orange":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          icon: "text-orange-600",
          button: "bg-orange-600 hover:bg-orange-700",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: "text-gray-600",
          button: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("plans.choosePlan")}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your marketing needs. All plans include
            our core features with different limits and bonuses.
          </p>
        </div>
      </div>

      {/* Current Plan Info */}
      {user?.currentPlan && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Crown className="text-white" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  {t("plans.currentPlan")}
                </h3>
                <p className="text-blue-700">{user.currentPlan}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Expires on</p>
              <p className="font-semibold text-blue-900">
                {new Date(user.planExpiry).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const colors = getColorClasses(plan.color);
          const isCurrentPlan =
            user?.currentPlan?.toLowerCase() === plan.name.toLowerCase();

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-sm border-2 p-6 transition-all hover:shadow-md ${
                plan.popular
                  ? "border-purple-200 ring-2 ring-purple-100"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {t("plans.popular")}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center mx-auto mb-4`}
                >
                  <Icon className={colors.icon} size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500">/{t("plans.monthly")}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check
                      className="text-green-500 flex-shrink-0 mt-0.5"
                      size={16}
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isCurrentPlan}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
                  isCurrentPlan
                    ? "bg-gray-400 cursor-not-allowed"
                    : colors.button
                }`}
              >
                {isCurrentPlan ? "Current Plan" : t("plans.selectPlan")}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Integration Notice */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start space-x-3">
          <CreditCard className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Secure Payment Processing
            </h3>
            <p className="text-sm text-gray-600">
              All payments are processed securely through InterKassa. We support
              major credit cards, bank transfers, and digital wallets. Your
              payment information is encrypted and never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900">
              Can I change my plan anytime?
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Yes, you can upgrade or downgrade your plan at any time. Changes
              will be reflected in your next billing cycle.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              What happens if I cancel my subscription?
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              You can cancel anytime. You'll continue to have access until the
              end of your current billing period.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              Are there any setup fees?
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              No, there are no setup fees. You only pay the monthly subscription
              fee for your chosen plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
