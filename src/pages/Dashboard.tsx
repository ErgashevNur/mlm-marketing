import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Users, Coins, Gift } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";
import { toast } from "sonner";
import StatisticsChart from "../components/StatisticsChart";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, claimDailyBonus } = useAuth();
  const [statistika, setStatistika] = useState([]);
  const [allCoin, setAllCoin] = useState([]);
  const [canClaimBonus, setCanClaimBonus] = useState(true);
  // const userData: any = JSON.parse(localStorage.getItem("user-data") || "{}");

  // useEffect(() => {
  //   const sendBackend = async (id) => {
  //     console.log(id);
  //   };
  //   sendBackend();
  // }, []);

  console.log(statistika);

  const getUser = async () => {
    try {
      const req = await fetch("https://mlm-backend.pixl.uz/statistika/user");
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
        "https://mlm-backend.pixl.uz/statistika/statis-web"
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

  useEffect(() => {
    getUser();
    getTotal();
  }, []);

  // const canClaimBonus = user && user.lastBonusDate !== new Date().toISOString().split("T")[0];
  // const handleClaimBonus = () => {
  //   claimDailyBonus();
  // };

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
      const response = await fetch("https://mlm-backend.pixl.uz/bonus/daily", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          t("dashboard.serverError", { status: response.status }) ||
            "Server xatosi: " + response.status
        );
      }

      const data = await response.json();
      setCanClaimBonus(data.status);
      console.log(t("dashboard.bonusReceivedLog"), data);
      toast.warning(t("dashboard.bonusOncePerDay"));
    } catch (error) {
      console.error(t("dashboard.errorLog"), error);
      alert(t("dashboard.bonusError") || "Bonus olishda xatolik yuz berdi.");
    }
  };

  // useEffect(() => {
  //   const checkBonusStatus = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;
  //     try {
  //       const res = await fetch("https://mlm-backend.pixl.uz/bonus/daily", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       const data = await res.json();
  //       console.log(data);

  //       setCanClaimBonus(data.status === true);
  //     } catch {
  //       setCanClaimBonus(false);
  //     }
  //   };
  //   checkBonusStatus();
  // }, []);

  console.log(user);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
              {t("dashboard.welcomeBack")}, {user?.name}! 👋
            </h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {user?.createdAt && formatDate(user.createdAt)}
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
          icon={Coins}
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
            <StatisticsChart />
          </div>
        </div>

        {/* O'ng tomon: Quick Actions + User Statistics */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-6 h-full">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
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
                  href: "/dashboard/referrals",
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
          <div className="scroll-container bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex-1 overflow-auto max-h-[330px]">
            <div className="grid gap-3">
              {statistika.map((data: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition"
                >
                  <span className="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 truncate max-w-[50%]">
                    {data.email}
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
    </div>
  );
};

export default Dashboard;
