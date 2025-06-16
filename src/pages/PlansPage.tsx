import React, { useEffect, useState } from "react";
import {
  Eye,
  Coins,
  Calendar,
  Sparkles,
  Star,
  Award,
  Users,
  Clock,
} from "lucide-react";
import PlanModal from "../components/PlanModal";

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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  // const mockPlans: Plan[] = [
  //   {
  //     id: 1,
  //     coin: 1000,
  //     dailyProfit: 50,
  //     term: 30,
  //     referral_bonus: 100,
  //     photo_url:
  //       "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=400",
  //     createdAt: "2024-01-15T00:00:00Z",
  //     translations: [
  //       {
  //         id: 1,
  //         language: "ru",
  //         name: "Стартовый план",
  //         description: "Идеальный план для начинающих",
  //         longDescription:
  //           "Этот план предназначен для тех, кто только начинает свой путь в инвестициях",
  //         features: "Базовые функции, поддержка 24/7",
  //         usage: "Подходит для новичков",
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     coin: 5000,
  //     dailyProfit: 300,
  //     term: 45,
  //     referral_bonus: 500,
  //     photo_url:
  //       "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=400",
  //     createdAt: "2024-01-20T00:00:00Z",
  //     translations: [
  //       {
  //         id: 2,
  //         language: "ru",
  //         name: "Профессиональный план",
  //         description: "Для опытных инвесторов",
  //         longDescription:
  //           "Расширенные возможности и увеличенная доходность для профессионалов",
  //         features: "Все функции + аналитика, приоритетная поддержка",
  //         usage: "Для опытных пользователей",
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     coin: 10000,
  //     dailyProfit: 700,
  //     term: 60,
  //     referral_bonus: 1000,
  //     photo_url:
  //       "https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg?auto=compress&cs=tinysrgb&w=400",
  //     createdAt: "2024-01-25T00:00:00Z",
  //     translations: [
  //       {
  //         id: 3,
  //         language: "ru",
  //         name: "Премиум план",
  //         description: "Максимальная доходность",
  //         longDescription:
  //           "Эксклюзивный план с максимальной доходностью и премиум функциями",
  //         features: "Все функции + VIP поддержка, персональный менеджер",
  //         usage: "Для VIP клиентов",
  //       },
  //     ],
  //   },
  // ];

  useEffect(() => {
    const getPlans = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPlans(mockPlans);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlans(mockPlans); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    getPlans();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://mlm-backend.pixl.uz/tariff");
        const data = await res.json();
        console.log(data);
        setPlans(data);
        // setProducts(Array.isArray(data) ? data : []);
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
    const ruTranslation = plan.translations?.find((t) => t.language === "ru");
    return ruTranslation?.name || `Plan ${plan.id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Загрузка планов...</p>
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
            Выберите свой план
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Инвестируйте в будущее с нашими тщательно разработанными планами.
            Каждый план создан для максимизации вашей прибыли.
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
                    <span>Популярный</span>
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
                        Дневная прибыль
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {plan.dailyProfit}
                    </span>
                  </div>

                  {/* Term */}
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">Срок</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {plan.term} дней
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => handleViewPlan(plan)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
                >
                  <Eye className="w-5 h-5" />
                  <span>Подробнее</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Почему выбирают нас?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Надежность
              </h3>
              <p className="text-gray-600">
                Проверенная платформа с многолетним опытом
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Поддержка</h3>
              <p className="text-gray-600">
                Круглосуточная техническая поддержка
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Скорость</h3>
              <p className="text-gray-600">
                Мгновенные выплаты и быстрые транзакции
              </p>
            </div>
          </div>
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
    </div>
  );
};

export default PlansPage;
