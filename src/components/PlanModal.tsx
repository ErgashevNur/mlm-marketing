import React from "react";
import { X, Coins, Calendar, Gift, FileText, Target, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Translation {
  id: number;
  language: string;
  name: string;
  description: string;
  longDescription: string;
  features: string;
  usage: string;
}

interface Plan {
  id: number;
  coin: number;
  dailyProfit: number;
  term: number;
  referral_bonus: number;
  photo_url: string;
  createdAt: string;
  translations: Translation[];
}

interface PlanModalProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ plan, isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const buyPlan = async () => {
    try {
      // Mock purchase logic
      console.log(`Purchasing plan ${plan.id}`);
      alert("План успешно приобретен!");
      onClose();
    } catch (error) {
      console.error("Error purchasing plan:", error);
      alert("Ошибка при покупке плана");
    }
  };

  const lng = localStorage.getItem("i18nextLng");

  const getPlanName = (): string => {
    const translation = plan.translations?.find((t) => t.language === lng);
    return translation?.name || `Plan ${plan.id}`;
  };

  const getPlanDescription = (): string => {
    const translation = plan.translations?.find((t) => t.language === lng);
    return translation?.longDescription || t("plans.longDescription");
  };

  const getPlanFeatures = (): string => {
    const translation = plan.translations?.find((t) => t.language === lng);
    return translation?.features || t("plans.planFeatures");
  };

  const getPlanUsage = (): string => {
    const translation = plan.translations?.find((t) => t.language === lng);
    return translation?.usage || t("plans.usage");
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative">
          <img
            src={plan.photo_url}
            alt={getPlanName()}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Plan Name Overlay */}
          <div className="absolute bottom-6 left-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {getPlanName()}
            </h2>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white/90">{t("plans.premium")}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <img src="/CoinLogo.png" className="w-5 h-5 text-white" />
                </div>
                <span className="text-green-700 font-semibold">
                  {t("plans.dailyProfit")}
                </span>
              </div>
              <p className="text-3xl font-bold text-green-800">
                {plan.dailyProfit}
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <img src="/CoinLogo.png" className="w-5 h-5 text-white" />
                </div>
                <span className="text-blue-700 font-semibold">
                  {t("plans.coin")}
                </span>
              </div>
              <p className="text-3xl font-bold text-blue-800">{plan.coin}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-purple-700 font-semibold">
                  {t("plans.term")}
                </span>
              </div>
              <p className="text-3xl font-bold text-purple-800">
                {plan.term} {t("plans.days", { count: plan.term })}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <span className="text-orange-700 font-semibold">
                  {t("plans.referralBonus")}
                </span>
              </div>
              <p className="text-3xl font-bold text-orange-800">
                {plan.referral_bonus}
              </p>
            </div>
          </div>

          {/* Plan Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("plans.longDescription")}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {getPlanDescription()}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("plans.usage")}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {getPlanUsage()}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Star className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("plans.planFeatures")}
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {getPlanFeatures()}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Calendar className="w-6 h-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {t("plans.createdAt")}
                  </h3>
                </div>
                <p className="text-gray-700 text-lg font-medium">
                  {new Date(plan.createdAt).toLocaleDateString(lng || "en", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Purchase Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              {t("common.close")}
            </button>
            <button
              onClick={buyPlan}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <img src="/CoinLogo.png" className="w-5 h-5" />
              <span>{t("plans.buyPlan", { coin: plan.coin })}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanModal;
