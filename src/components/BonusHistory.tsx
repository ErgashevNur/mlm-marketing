import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  Headset,
  Link,
  PhoneCall,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaTelegram } from "react-icons/fa6";
import { toast } from "sonner";

export default function BonusHistory() {
  const [openBonusModal, setOpenBonusModal] = useState(false);
  const [openReferralModal, setOpenReferralModal] = useState(false);
  const [openProductsModal, setOpenProductsModal] = useState(false);
  const [openTariffsModal, setOpenTariffsModal] = useState(false);

  const [historyUser, setHistoryUser] = useState([]);
  const [historyReferal, setHistoryReferal] = useState([]);
  const [historyProducts, setHistoryProducts] = useState([]);
  const [historyPlans, setHistoryPlans] = useState([]);
  console.log(historyPlans);

  const [socials, setSocials] = useState([]);

  const { t } = useTranslation();

  const getCurrencies = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY}/suport`);

      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }

      const data = await response.json();
      setSocials(data);
    } catch (error: any) {
      console.error("Error fetching currency:", error.message);
      return null;
    }
  };

  useEffect(() => {
    getCurrencies();
  }, []);

  const getBonusUser = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/bonus-history/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ixtiyoriy, lekin tavsiya qilinadi
          },
        }
      );

      if (!response.ok) {
        throw new Error("Serverdan xatolik: " + response.status);
      }

      const data = await response.json();
      // console.log(data);

      setHistoryUser(data);
    } catch (error: any) {
      toast.error(t("AuthCallback.error_occurred"));
      return null;
    }
  };

  const getReferal = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/bonus-history/referal`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ixtiyoriy, lekin tavsiya qilinadi
          },
        }
      );

      if (!response.ok) {
        throw new Error("Serverdan xatolik: " + response.status);
      }

      const data = await response.json();
      setHistoryReferal(data);
    } catch (error: any) {
      toast.error(t("AuthCallback.error_occurred"));
      return null;
    }
  };

  const getProduct = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/product-history/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ixtiyoriy, lekin tavsiya qilinadi
          },
        }
      );

      if (!response.ok) {
        throw new Error("Serverdan xatolik: " + response.status);
      }

      const data = await response.json();
      setHistoryProducts(data);
    } catch (error: any) {
      toast.error(t("AuthCallback.error_occurred"));
      return null;
    }
  };

  const getPlans = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/tariff-history/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // ixtiyoriy, lekin tavsiya qilinadi
          },
        }
      );

      if (!response.ok) {
        throw new Error("Serverdan xatolik: " + response.status);
      }

      const data = await response.json();
      setHistoryPlans(data);
    } catch (error: any) {
      toast.error(t("AuthCallback.error_occurred"));
      return null;
    }
  };

  useEffect(() => {
    getBonusUser();
    getReferal();
    getProduct();
    getPlans();
  }, []);

  const handleToggleBonus = () => {
    setOpenBonusModal(!openBonusModal);
    setOpenReferralModal(false);
    setOpenProductsModal(false);
    setOpenTariffsModal(false);
  };

  const handleToggleReferral = () => {
    setOpenReferralModal(!openReferralModal);
    setOpenBonusModal(false);
    setOpenProductsModal(false);
    setOpenTariffsModal(false);
  };

  const handleToggleProducts = () => {
    setOpenProductsModal(!openProductsModal);
    setOpenBonusModal(false);
    setOpenReferralModal(false);
    setOpenTariffsModal(false);
  };

  const handleToggleTariffs = () => {
    setOpenTariffsModal(!openTariffsModal);
    setOpenBonusModal(false);
    setOpenReferralModal(false);
    setOpenProductsModal(false);
  };

  return (
    <section className="w-full p-4">
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Bonuslar */}
        <div className="relative transition-all duration-500">
          <button
            onClick={handleToggleBonus}
            className="dark:text-white border dark:border-gray-600 rounded-md py-2 px-10 text-lg sm:text-2xl font-normal w-full"
          >
            {t("BonusHistory.bonuses")}
          </button>

          {openBonusModal && (
            <div
              className={`mt-2 w-full z-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg p-4 
              transition-all duration-500 ease-out
              ${
                openBonusModal
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }
              md:absolute md:left-0 md:top-full`}
            >
              <div className="text-sm flex flex-col gap-4 overflow-auto max-h-80 text-gray-700 h-auto py-1 dark:text-white">
                {historyUser.length === 0 ? (
                  <div className="text-center">
                    <p>{t("BonusHistory.notFound")}</p>
                  </div>
                ) : (
                  historyUser.map(({ id, tariff, date, coin }) => (
                    <div key={id} className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <p className="text-lg font-semibold flex items-center gap-3 text-gray-800 dark:text-white">
                          {tariff.translations[0]?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {moment(date).format("YYYY-MM-DD HH:mm")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">
                          {coin} USDT
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {/* Referal bonus */}
        <div
          className={`relative transition-all duration-500 ${
            openBonusModal ? "mt-3 md:mt-0" : "mt-0"
          }`}
        >
          <button
            onClick={handleToggleReferral}
            className="border dark:border-gray-600 dark:text-white rounded-md py-2 px-6 sm:px-10 text-lg sm:text-2xl font-normal w-full"
          >
            {t("BonusHistory.bonusesFromReferrals")}
          </button>

          {openReferralModal && (
            <div
              className={`mt-2 w-full z-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg p-4 
              transition-all duration-500 ease-out
              ${
                openReferralModal
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }
              md:absolute md:left-0 md:top-full`}
            >
              <div className="text-sm text-gray-700 dark:text-white flex flex-col gap-4 overflow-auto max-h-[350px] sm:max-h-[450px] lg:max-h-[500px] py-1">
                {historyReferal.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>{t("BonusHistory.notFound")}</p>
                  </div>
                ) : (
                  historyReferal.map(({ id, coin, date, user }) => (
                    <div
                      key={id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 border-b border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="min-w-[180px]">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(date).toLocaleString("uz-UZ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block lowercase px-2 py-1 text-[10px] rounded-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white">
                          {user.role.toLowerCase()}
                        </span>
                        <div className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                          {coin.toLocaleString()} {t("BonusHistory.coin")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sotib olingan productlar */}
        <div className="relative transition-all duration-500">
          <button
            onClick={handleToggleProducts}
            className="border dark:border-gray-600 dark:text-white rounded-md py-2 px-6 sm:px-10 text-lg sm:text-2xl font-normal w-full"
          >
            {t("BonusHistory.purchasedProducts")}
          </button>

          {openProductsModal && (
            <div
              className={`mt-2 w-full z-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg p-4 
              transition-all duration-500 ease-out
              ${
                openProductsModal
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }
              md:absolute md:left-0 md:top-full`}
            >
              <div className="text-sm flex flex-col gap-5 text-gray-800 dark:text-gray-100 max-h-[500px] overflow-auto">
                {historyProducts.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>{t("BonusHistory.notFound")}</p>
                  </div>
                ) : (
                  historyProducts.map((order) => (
                    <div
                      key={order.id}
                      className="border dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-900 shadow-sm space-y-4 w-full max-w-3xl mx-auto"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {order.user.name}
                          </h2>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.user.email}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                            order.isChecked === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/10 dark:text-yellow-300"
                              : "bg-green-100 text-green-800 dark:bg-green-800/10 dark:text-green-300"
                          }`}
                        >
                          {order.isChecked === "pending"
                            ? t("BonusHistory.pending")
                            : order.isChecked}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("BonusHistory.id")}:
                          </p>
                          <p>{order.main_products.id}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <p>⭐ {order.main_products.rating}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("BonusHistory.quantity")}:
                          </p>
                          <p>{order.main_products.count}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("BonusHistory.reviews")}:
                          </p>
                          <p>{order.main_products.rewiev}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("BonusHistory.amount")}:
                          </p>
                          <p>{order.main_products.coin} 🪙</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <PhoneCall
                            size={16}
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <span>{order.contactNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 break-all">
                          <Link
                            size={16}
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <a
                            href={order.contactLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {order.contactLink}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Clock size={14} />
                          <span>
                            {new Date(order.orderedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sotib olingan tariflar */}
        <div className="relative transition-all duration-500">
          <button
            onClick={handleToggleTariffs}
            className="border dark:border-gray-600 dark:text-white rounded-md py-2 px-6 sm:px-10 text-lg sm:text-2xl font-normal w-full"
          >
            {t("BonusHistory.purchasedTariffs")}
          </button>

          {openTariffsModal && (
            <div
              className={`mt-2 w-full z-10 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg p-4 
              transition-all duration-500 ease-out
              ${
                openTariffsModal
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
              }
              md:absolute md:left-0 md:top-full`}
            >
              <div className="text-sm text-gray-800 dark:text-gray-100 flex flex-col gap-5 max-h-[500px] overflow-auto">
                {historyPlans.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>{t("BonusHistory.notFound")}</p>
                  </div>
                ) : (
                  historyPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <img
                            src={plan.tariff.photo_url}
                            alt="Tarif rasmi"
                            className="w-16 h-16 object-cover rounded-md border dark:border-gray-600"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              Tarif {plan.tariff.translations[0].name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {plan.user.name}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${
                            plan.status === true
                              ? "bg-green-100 text-green-700 dark:bg-green-800/10 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-800/10 dark:text-red-300"
                          }`}
                        >
                          {plan.status === true
                            ? t("BonusHistory.active")
                            : t("BonusHistory.completed")}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm text-gray-800 dark:text-gray-200">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("BonusHistory.term")}
                          </p>
                          <p>
                            {plan.tariff.term} {t("BonusHistory.days")}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("BonusHistory.dailyProfit")}
                          </p>
                          <p>+{plan.tariff.dailyProfit} USDT</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("BonusHistory.referralBonus")}
                          </p>
                          <p>{plan.tariff.referral_bonus} USDT</p>
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400">
                            {t("BonusHistory.amount")}
                          </p>
                          <p>{plan.tariff.coin} USDT</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>
                            {t("BonusHistory.start")}:{" "}
                            {new Date(plan.start_time).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarCheck size={14} />
                          <span>
                            {t("BonusHistory.end")}:{" "}
                            {new Date(plan.end_time).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BadgeCheck size={14} />
                          <span>
                            {t("BonusHistory.lastBonus")}:{" "}
                            {new Date(plan.lastBonusDate).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
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
          {socials.map((social) => {
            const icon =
              social.name === "Instagram" ? (
                <FaInstagram />
              ) : social.name === "Telegram" ? (
                <FaTelegram />
              ) : null;
            const bgColor =
              social.name === "Instagram"
                ? "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500"
                : social.name === "Telegram"
                ? "bg-blue-500"
                : "bg-gray-400";

            return (
              <a
                key={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center ${bgColor} text-white rounded-full shadow cursor-pointer`}
                href={social.link}
              >
                {icon}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
