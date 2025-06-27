import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Gift,
  Headset,
  X,
  Clock,
  AlertTriangle,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";
import { toast } from "sonner";
import { FaInstagram, FaTelegram } from "react-icons/fa6";
import CountdownTimer from "../components/CountdownTimer";

interface StatistikaItem {
  email: string;
  coin: number;
}

interface SocialItem {
  link: string;
  name: string;
}

interface DailyBonusItem {
  tariff_name: Array<{ name: string }>;
  dailyProfit: number;
}

interface DailyBonusData {
  daily: DailyBonusItem[];
}

interface TimeData {
  status: boolean;
  remainingTime: string;
}

// Helper function to convert HMS to seconds
function hmsToSeconds(hms: string): number {
  if (!hms) return 0;
  const parts = hms.split(":");
  const hours = parseInt(parts[0] || "0", 10);
  const minutes = parseInt(parts[1] || "0", 10);
  const seconds = parseInt(parts[2] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [allCoin, setAllCoin] = useState<any[]>([]);
  const [statistika, setStatistika] = useState<StatistikaItem[]>([]);
  const [canClaimBonus, setCanClaimBonus] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [dailyBonus, setDailyBonus] = useState<DailyBonusData | null>(null);
  const [time, setTime] = useState<TimeData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Get user level from localStorage with error handling
  const getUserLevel = () => {
    try {
      const userLevelData = localStorage.getItem("UserLevel");
      return userLevelData ? JSON.parse(userLevelData) : null;
    } catch (error) {
      console.error("Error parsing UserLevel from localStorage:", error);
      return null;
    }
  };

  const userLevel = getUserLevel();

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
        throw new Error(`${req.status} - ${errorText}`);
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast.error(t("AuthCallback.error_occurred"));
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
      console.error("Error fetching total data:", error);
      toast.error(t("AuthCallback.error_occurred"));
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

  const handleClaimBonus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(t("dashboard.loginFirst") || "Avval tizimga kiring.");
      return;
    }

    setIsLoading(true);
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

      const data = await response.json();
      setTime(data);

      if (!Array.isArray(data) || !data[0]) {
        toast.error(t("AuthCallback.error_occurred"));
        return;
      }

      const status = data[0].status;
      const remainingTime = data[0].remainingTime;

      if (status === true) {
        // Bonus received - clear localStorage
        localStorage.removeItem("bonus_start_time");
        localStorage.removeItem("bonus_duration_seconds");
        setCanClaimBonus(false);

        toast.success(
          t("dashboard.bonusReceived") || "Bonusingiz qabul qilindi"
        );
      } else {
        // Bonus not yet available - save time
        localStorage.setItem(
          "bonus_start_time",
          `${Math.floor(Date.now() / 1000)}`
        );
        localStorage.setItem(
          "bonus_duration_seconds",
          `${hmsToSeconds(remainingTime)}`
        );

        toast.message(
          t("AuthCallback.next_bonus_time", { time: remainingTime }) ||
            `Next bonus in: ${remainingTime}`
        );
      }
    } catch (error) {
      console.error("Error claiming bonus:", error);
      toast.error(
        t("dashboard.bonusError") || "Bonusni olishda xatolik yuz berdi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  function maskEmail(email: string): string {
    if (!email || email.length < 3) return email;

    const atIndex = email.indexOf("@");
    if (atIndex === -1) return email;

    const username = email.substring(0, atIndex);
    const domain = email.substring(atIndex);

    const visiblePart = username.substring(0, Math.min(3, username.length));

    return `${visiblePart}*****${domain}`;
  }

  const googleRefSistem = async () => {
    setIsLoading(true);
    try {
      const googleRefId = localStorage.getItem("referral_id");
      const token = localStorage.getItem("token");

      if (googleRefId && token) {
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
    } catch (error: any) {
      console.error("Error in google ref system:", error);
      toast.error(t("AuthCallback.error_occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencies = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY}/suport`);

      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }

      const data = await response.json();
      setSocials(data);
    } catch (error: any) {
      console.error("Error fetching currencies:", error);
    }
  };

  const getDailyBonus = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error(t("dashboard.loginFirst") || "Avval tizimga kiring.");
        return;
      }

      const req = await fetch(`${import.meta.env.VITE_API_KEY}/bonus/view`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (req.status === 200) {
        const res = await req.json();
        setDailyBonus(res);
      } else {
        const errorText = await req.text();
        throw new Error(`${req.status} - ${errorText}`);
      }
    } catch (error: any) {
      console.error("Error fetching daily bonus:", error);
      toast.error(t("AuthCallback.error_occurred"));
    }
  };

  // Check bonus status on component mount
  useEffect(() => {
    const checkBonusStatus = () => {
      const bonusStartTime = localStorage.getItem("bonus_start_time");
      const bonusDuration = localStorage.getItem("bonus_duration_seconds");

      if (bonusStartTime && bonusDuration) {
        const startTime = parseInt(bonusStartTime, 10);
        const duration = parseInt(bonusDuration, 10);
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime >= startTime + duration) {
          setCanClaimBonus(true);
          localStorage.removeItem("bonus_start_time");
          localStorage.removeItem("bonus_duration_seconds");
        } else {
          setCanClaimBonus(false);
        }
      }
    };

    checkBonusStatus();
    const interval = setInterval(checkBonusStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getUser();
    getTotal();
    googleRefSistem();
    getCurrencies();
  }, []);

  const quickActions = [
    {
      name: t("dashboard.browseProducts"),
      href: "/dashboard/products",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: t("common.earnings"),
      href: "/dashboard/earnings",
      color: "bg-green-500 hover:bg-green-600",
      icon: <img src="/CoinLogo.png" alt="coin" className="w-5" />,
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
  ];

  const totalDailyProfit =
    dailyBonus?.daily?.reduce(
      (acc, el) => acc + Number(el.dailyProfit || 0),
      0
    ) || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
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
            <h1>{userLevel?.prize || "N/A"}</h1>
          </div>
        </div>
      </div>

      {/* Daily Bonus Section */}
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
              {time?.[0]?.remainingTime ||
              localStorage.getItem("bonus_start_time") ? (
                <CountdownTimer
                  timeString={time?.[0]?.remainingTime || "00:00:00"}
                />
              ) : (
                <p className="text-white font-bold">Taymer yuklanmoqda...</p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setIsOpen(true);
              getDailyBonus();
            }}
            disabled={isLoading}
            className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
              isLoading
                ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                : "bg-white text-orange-600 hover:bg-gray-100"
            }`}
          >
            {isLoading ? "Loading..." : t("dashboard.claimNow")}
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard
          title={t("dashboard.yourCoin")}
          value={user?.coin || 0}
          img={"/CoinLogo.png"}
          color="blue"
          subtitle="USDT"
        />
        <StatCard
          title={t("dashboard.totalReferrals")}
          value={user?.referalCoin || 0}
          icon={Users}
          color="purple"
          subtitle="USDT"
        />
      </div>

      {/* Statistics Section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 h-full">
            <div className="dark:border-gray-700 lg:p-6 sm:p-3 flex-1 overflow-auto max-h-[330px] p-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {t("dashboard.Statistics")}
              </h2>

              <div className="grid gap-3">
                {statistika.length > 0 ? (
                  statistika.map((data, index) => (
                    <div
                      key={index}
                      className="flex sm:flex-row sm:items-center justify-between dark:bg-gray-900 border dark:border-gray-700 rounded-xl px-3 py-3 sm:px-4 shadow-sm hover:shadow-md transition"
                    >
                      <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 truncate max-w-full sm:max-w-[50%] mb-1 sm:mb-0">
                        {maskEmail(data.email)}
                      </span>
                      <span className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-200">
                        <img
                          src="/CoinLogo.png"
                          alt="coin"
                          className="w-5 h-5 object-contain"
                        />
                        <span className="text-[10px] sm:text-sm">USDT</span>
                        {data.coin}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    {t("dashboard.noStatistics") || "No statistics available"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-6 h-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border lg:pb-36 border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("dashboard.quickActions")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
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
        </div>
      </div>

      {/* Support Button */}
      <div className="fixed bottom-6 right-6 z-50 group w-16 h-16">
        <div className="w-16 h-16 cursor-pointer flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg relative z-20">
          <Headset size={28} />
        </div>

        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300 ease-in-out">
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

      {/* Daily Bonus Modal */}
      {isOpen && (
        <div className="w-full h-screen fixed flex top-0 items-center justify-center bg-black/50 backdrop-blur-sm left-0 z-50">
          <div className="w-[400px] max-w-[90vw] flex flex-col gap-5 border shadow-md h-auto max-h-[80vh] rounded-md p-5 bg-white overflow-y-auto">
            {/* Daily Bonus Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-md mb-4">
              <h2 className="text-xl font-bold">
                🎁 {t("dashboard.dailyBonus")}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            {dailyBonus && dailyBonus.daily && dailyBonus.daily.length > 0 ? (
              <>
                {/* Plans and Rewards */}
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {dailyBonus.daily.map((el, index) => (
                    <div
                      key={index}
                      className="w-full flex shadow-md py-2 px-2 items-center justify-between rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-bold">
                          {el.tariff_name?.[0]?.name || "Unknown Plan"}
                        </h1>
                      </div>
                      <span className="text-yellow-500 font-bold">
                        {el.dailyProfit || 0}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Claim Button and Total Bonus */}
                <div className="w-full flex items-center justify-between border-t pt-3 mt-auto">
                  <button
                    onClick={() => {
                      handleClaimBonus();
                      setIsOpen(false);
                    }}
                    // disabled={isLoading || !canClaimBonus}
                    className="flex items-center gap-2 text-lg font-semibold px-10 py-2 rounded-md transition-colors bg-green-500 text-white hover:bg-green-600"
                  >
                    {t("dashboard.claimNow")}
                  </button>
                  <div className="flex flex-col items-end">
                    <span className="text-green-600 text-xl font-bold">
                      {totalDailyProfit}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="text-center py-8">
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <Gift className="w-16 h-16 text-purple-600" />
                    <div className="absolute -top-2 -right-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-current animate-pulse" />
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {t("dashboard.daily_bonuses_title")}{" "}
                </h2>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700 text-sm mb-3">
                    {t("dashboard.daily_bonuses_description")}
                  </p>

                  <div className="flex items-center justify-center mb-3 bg-orange-100 rounded-lg p-2">
                    <Clock className="w-4 h-4 text-orange-600 mr-2" />
                    <span className="text-orange-800 font-medium text-sm">
                      {t("dashboard.time_limit_text", {
                        time_limit_value: t(
                          "dashboard.time_limit_value_24_hours"
                        ),
                      })}
                    </span>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded">
                    <div className="flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-red-800 font-medium text-xs mb-1">
                          {t("dashboard.warning_title")}
                        </p>
                        <p className="text-red-700 text-xs">
                          {t("dashboard.warning_message")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  {t("dashboard.close_button")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
