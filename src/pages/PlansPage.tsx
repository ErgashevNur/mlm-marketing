import React, { useEffect, useState } from "react";
import { Eye, Calendar, Sparkles, Star, Headset } from "lucide-react";
import { useTranslation } from "react-i18next";
import PlanModal from "../components/PlanModal";
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa6";

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

const PlansPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://mlm-backend.pixl.uz/tariff");
        const data = await res.json();
        setPlans(data);
      } catch (error) {
        console.error("Mahsulotlarni olishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleViewPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const getPlanName = (plan: Plan): string => {
    const translation = plan.translations?.find(
      (t) => t.language === i18n.language
    );
    return translation?.name || `Plan ${plan.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t("plans.choosePlan")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("plans.choosePlanDesc")}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                index === 1 ? "ring-2 ring-blue-500 scale-105" : ""
              }`}
            >
              {/* Popular Badge */}
              {index === 1 && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{t("plans.popular")}</span>
                  </div>
                </div>
              )}

              {/* Plan Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={plan.photo_url}
                  alt={getPlanName(plan)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Plan Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {getPlanName(plan)}
                </h3>

                <div className="space-y-4 mb-6">
                  {/* Daily Profit */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <img
                          src="/CoinLogo.png"
                          className="w-4 h-4 text-green-600"
                        />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {t("plans.dailyProfit")}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {plan.dailyProfit}{" "}
                      <span className="text-[13px]">USDT</span>
                    </span>
                  </div>

                  {/* Term */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {t("plans.term")}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {plan.term} {t("plans.days", { count: plan.term })}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => handleViewPlan(plan)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  <span>{t("common.view")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPlan && (
        <PlanModal
          plan={selectedPlan}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 group w-16 h-16">
        {/* Asosiy icon */}
        <div className="w-16 h-16 cursor-pointer flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg relative z-20">
          <Headset size={28} />
        </div>

        {/* Hoverda tepaga chiqadigan iconlar */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                opacity-0 translate-y-2 scale-95
                group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                transition-all duration-300 ease-in-out"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-full shadow cursor-pointer">
            <FaTelegram />
          </div>
          <div className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white rounded-full shadow cursor-pointer">
            <FaInstagram />
          </div>
          <div className="w-10 h-10 flex items-center justify-center bg-blue-700 text-white rounded-full shadow cursor-pointer">
            <FaFacebook />
          </div>
          <div className="w-10 h-10 mb-3 flex items-center justify-center bg-blue-400 text-white rounded-full shadow cursor-pointer">
            <FaTwitter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;
