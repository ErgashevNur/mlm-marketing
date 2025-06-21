import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Gift, Headset } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";
import { toast } from "sonner";
import StatisticsChart from "../components/StatisticsChart";
import { FaInstagram, FaTelegram, FaTwitter } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, claimDailyBonus } = useAuth();
  const [allCoin, setAllCoin] = useState([]);
  const [statistika, setStatistika] = useState([]);
  const [canClaimBonus, setCanClaimBonus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socials, setSocials] = useState([]);

  const userLevel = JSON.parse(localStorage.getItem("UserLevel"));

  const getUser = async () => {
    try {
      const req = await fetch(
        `${import.meta.env.VITE_API_KEY}/statistika/user`
      );
      if (req.status === 200) {
        const res = await req.json();
        setStatistika(res);
      } else {
        const errorText = await req.text();
        throw new Error(`Xatolik: ${req.status} - ${errorText}`);
      }
    } catch (error: any) {
      toast.error("So'rovda xatolik: " + error.message);
    }
  };

  const getTotal = async () => {
    try {
      const req = await fetch(
        `${import.meta.env.VITE_API_KEY}/statistika/statis-web`
      );
      if (req.status === 200) {
        const res = await req.json();
        setAllCoin(res);
      } else {
        const errorText = await req.text();
        throw new Error(`Xatolik: ${req.status} - ${errorText}`);
      }
    } catch (error: any) {
      toast.error("So'rovda xatolik: " + error.message);
    }
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("ru-RU", options).format(date);
  }

  const handleClaimBonuss = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert(t("dashboard.loginFirst") || "Avval tizimga kiring.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/bonus/daily`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          t("dashboard.serverError", { status: response.status }) ||
            "Server xatosi: " + response.status
        );
      }

      const data = await response.json();
      console.log(data.map((item: any) => item.nextTimeHours));

      setCanClaimBonus(data.nextTimeHours);

      // console.log(t("dashboard.bonusReceivedLog"), data);
      toast.warning(data.map((item: any) => item.nextTimeHours).join(", "), {
        description: "Hour",
      });
    } catch (error) {
      // console.error(t("dashboard.errorLog"), error);
      alert(t("dashboard.bonusError") || "Bonus olishda xatolik yuz berdi.");
    }

    // claimDailyBonus();
  };

  function maskEmail(email: any) {
    if (!email || email.length < 3) return email;

    const atIndex = email.indexOf("@");
    if (atIndex === -1) return email;

    const username = email.substring(0, atIndex);
    const domain = email.substring(atIndex);

    if (username.length <= 3) {
      return email; // Agar username 3 ta yoki kamroq harf bo'lsa, o'zgartirmaslik
    }

    const visiblePart = username.substring(0, 3);
    const hiddenPart = "*".repeat(username.length - 3);

    return visiblePart + hiddenPart + domain;
  }

  const googleRefSistem = async () => {
    try {
      const googleRefId = await localStorage.getItem("referral_id");
      const token = localStorage.getItem("token");

      if (googleRefId) {
        await fetch(
          `${import.meta.env.VITE_API_KEY}/referal/google/${googleRefId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // localStorage.removeItem("referral_id");
    } catch (error: any) {
      toast.error(error.message || "Kutilmagan xatolik");
    } finally {
      setIsLoading(false);
    }
  };

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
    getUser();
    getTotal();
    googleRefSistem();
    getCurrencies();
  }, []);
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
              <div className="flex flex-col gap-2">
                {t("dashboard.welcomeBack")}, {user?.name}!
              </div>
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <h1>{userLevel?.prize} </h1>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Gift className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {t("dashboard.dailyBonusAvailable")}
              </h3>
              <p className="text-yellow-100">
                {t("dashboard.claimYour")} {user?.dailyBonus ?? 0}{" "}
                {t("dashboard.coinsToday")}
              </p>
            </div>
          </div>
          <button
            onClick={handleClaimBonuss}
            disabled={!canClaimBonus}
            className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
              canClaimBonus
                ? "bg-white text-orange-600 hover:bg-gray-100"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
            }`}
            title={
              canClaimBonus
                ? ""
                : t("dashboard.bonusNotAvailable") ||
                  t("dashboard.bonusNotAvailableFallback")
            }
          >
            {t("dashboard.claimNow")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard
          title={t("dashboard.yourCoin")}
          value={user?.coin || 0}
          img={"/CoinLogo.png"}
          color="blue"
          subtitle={`+${user?.coin || 0} ${t("dashboard.dailyBonus")}`}
        />
        <StatCard
          title={t("dashboard.totalReferrals")}
          value={user?.referrals?.length}
          icon={Users}
          color="purple"
        />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chap tomon: Statistics Chart */}
        <div className="lg:col-span-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 h-full">
            {/* <StatisticsChart /> */}
            <div className="scroll-container bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex-1 overflow-auto max-h-[330px]">
              <div className="grid gap-3">
                {statistika.map((data: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 truncate max-w-[50%]">
                      {maskEmail(data.email)}
                    </span>
                    <span className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                      {data.coin}
                      <img
                        src="/CoinLogo.png"
                        alt="coin"
                        className="w-5 h-5 object-contain"
                      />
                      <span className="hidden sm:inline">USDT</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* O'ng tomon: Quick Actions + User Statistics */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-6 h-full">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border lg:pb-36 border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("dashboard.quickActions")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  name: t("dashboard.browseProducts"),
                  href: "/dashboard/products",
                  color: "bg-blue-500 hover:bg-blue-600",
                },
                {
                  name: t("common.earnings"),
                  href: "/dashboard/earnings",
                  color: "bg-green-500 hover:bg-green-600",
                  icon: <img src="/CoinLogo.png" alt="" className="w-5" />,
                },
                {
                  name: t("dashboard.withdrawFunds"),
                  href: "/dashboard/withdraw",
                  color: "bg-purple-500 hover:bg-purple-600",
                },
                {
                  name: t("dashboard.upgradePlan"),
                  href: "/dashboard/plans",
                  color: "bg-orange-500 hover:bg-orange-600",
                },
              ].map((action, index) => (
                <a
                  key={index}
                  href={action.href}
                  className={`flex items-center justify-center gap-2 rounded-lg text-white font-semibold p-4 transition-all ${action.color} hover:scale-[1.02]`}
                >
                  {action.icon}
                  <span className="text-sm sm:text-base">{action.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Statistika */}
          {/* <div className="scroll-container bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex-1 overflow-auto max-h-[330px]">
            <div className="grid gap-3">
              {statistika.map((data: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 truncate max-w-[50%]">
                    {maskEmail(data.email)}
                  </span>
                  <span className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                    {data.coin}
                    <img
                      src="/CoinLogo.png"
                      alt="coin"
                      className="w-5 h-5 object-contain"
                    />
                    <span className="hidden sm:inline">USDT</span>
                  </span>
                </div>
              ))}
            </div>
          </div> */}
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
          {socials.map(({ link, name }) => {
            const icon =
              name === "Instagram" ? (
                <FaInstagram />
              ) : name === "Telegram" ? (
                <FaTelegram />
              ) : null;
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

export default Dashboard;
