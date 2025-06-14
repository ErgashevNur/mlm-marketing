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
  const userData: any = localStorage.getItem("user-data");
  const [statistika, setStatistika] = useState([]);
  const [allCoin, setAllCoin] = useState([]);

  // get user statistika
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
    } catch (error) {
      toast.error("So'rovda xatolik:", error.message);
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
    } catch (error) {
      toast.error("So'rovda xatolik:", error.message);
    }
  };

  useEffect(() => {
    getUser();
    getTotal();
  }, []);

  console.log(statistika);
  console.log(allCoin);

  const recentActivities = [
    {
      id: 1,
      type: "referral",
      amount: `+10 ${t("dashboard.coin")}`,
      time: "2 hours ago",
      data: "11.06.2025",
    },
    {
      id: 2,
      type: "earning",
      amount: `+10 ${t("dashboard.coin")}`,
      time: "at 12:50 AM",
      data: "10.06.2025",
    },
    {
      id: 3,
      type: "withdrawal",
      amount: `+10 ${t("dashboard.coin")}`,
      time: "at 08:20 AM",
      data: "09.06.2025",
    },
    {
      id: 4,
      type: "purchase",
      amount: `+10 ${t("dashboard.coin")}`,
      time: "at 08:18 PM",
      data: "08.06.2025",
    },
  ];

  const quickActions = [
    {
      name: t("dashboard.browseProducts"),
      href: "/dashboard/products",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: t("dashboard.inviteFriends"),
      href: "/dashboard/referrals",
      color: "bg-green-500 hover:bg-green-600",
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

  // const planExpiryDate = new Date(user?.planExpiry || "");
  // const daysRemaining = Math.ceil(
  // (planExpiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  // );

  const canClaimBonus =
    user && user.lastBonusDate !== new Date().toISOString().split("T")[0];

  const handleClaimBonus = () => {
    claimDailyBonus();
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // hour12: false,
      // timeZone: "Asia/Tashkent", // O'zbekiston vaqti
    };
    // return new Intl.DateTimeFormat("ru-RU", options);
    // .format(date)
    // .replace(",", "")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
              {t("dashboard.welcomeBack")}, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("dashboard.currentPlan")}:{" "}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {user.userTariff}
              </span>
              {/* {daysRemaining > 0 && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({daysRemaining} {t("dashboard.daysRemaining")})
                </span>
              )} */}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {formatDate(user.createdAt)}
          </div>
        </div>
      </div>

      {/* Daily Bonus */}
      {canClaimBonus && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Gift className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {/* Daily Bonus Available! */}
                  {t("dashboard.dailyBonusAvailable")}
                </h3>

                <p className="text-yellow-100">
                  {t("dashboard.claimYour")}
                  {userData?.dailyBonus} {t("dashboard.coinsToday")}
                </p>
              </div>
            </div>
            <button
              onClick={handleClaimBonus}
              className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Claim Now */}
              {t("dashboard.claimNow")}
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard
          title={t("dashboard.yourCoin")}
          value={user?.coin}
          icon={Coins}
          color="blue"
          subtitle={`+${user?.coin} ${t("dashboard.dailyBonus")}`}
        />
        {/* <StatCard
          title={t("dashboard.totalEarnings")}
          value={`$${user?.totalEarnings?.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        /> */}
        <StatCard
          title={t("dashboard.totalReferrals")}
          value={userData?.totalReferrals || 0}
          icon={Users}
          color="purple"
        />
        {/* <StatCard
          title={t("dashboard.currentBalance")}
          value={`$${user?.balance?.toFixed(2)}`}
          icon={Wallet}
          color="orange"
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("dashboard.recentActivity")}
          </h2>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t("dashboard.bonusHistory")} {activity.data}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity?.time}
                  </p>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    activity.amount.startsWith("+")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {activity.amount}
                </span>
              </div>
            ))}
          </div>
        </div> */}

        <StatisticsChart />

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("dashboard.quickActions")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`${action.color} text-white p-4 rounded-lg text-center font-medium transition-colors`}
              >
                {action.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
