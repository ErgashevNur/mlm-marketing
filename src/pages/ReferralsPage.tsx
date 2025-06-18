import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Copy,
  MessageCircle,
  Phone,
  CheckCircle,
  Clock,
  BarChart2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";
import { toast } from "sonner";

// Define the Friend interface for type safety
interface Friend {
  id: number;
  name: string;
  email: string;
  joinDate: string;
  status: "paid" | "pending";
  bonus: number;
}

const ReferralsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [ref, setRef] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralFriends, setReferralFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referals, setReferals] = useState([]);

  // Check if user is authenticated
  if (!user) {
    return <div className="text-red-500">{t("referralsPage.pleaseLogin")}</div>;
  }

  // Validate environment variable for referral key
  const referralKey = import.meta.env.VITE_REFERAL_KEY;

  if (!referralKey) {
    console.error("VITE_REFERAL_KEY is not defined");
    return (
      <div className="text-red-500">
        {t("referralsPage.referralKeyMissing")}
      </div>
    );
  }
  const referralLink = `${referralKey}/${user.id}`;

  // Fetch referral friends from API
  useEffect(() => {
    const fetchReferralFriends = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }
        const res = await fetch("https://mlm-backend.pixl.uz/referal/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Referral friends:", data);
        setRef(data);

        // Just set the API data directly, do not format/map
        setReferralFriends(data?.data || []);
      } catch (error: any) {
        console.error("Referal do‘stlarni olishda xatolik:", error);
        setError(t("referralsPage.failedToLoad"));
        setReferralFriends([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReferralFriends();
  }, [user.id]);

  // Calculate total bonuses with safety check
  // const totalBonuses = Array.isArray(referralFriends)
  //   ? referralFriends.reduce((sum, friend) => sum + (friend.bonus || 0), 0)
  //   : 0;

  // Calculate paid and pending referrals
  // const paidReferrals = referralFriends.filter(
  //   (friend) => friend.status === "paid"
  // ).length;

  const pendingReferrals = referralFriends.filter(
    (friend) => friend.status === "pending"
  ).length;

  // Copy referral link to clipboard
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Share on Telegram
  const shareOnTelegram = () => {
    const message = encodeURIComponent(
      `Join MLM PLATFORM Marketing Platform using my referral link: ${referralLink}`
    );
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        referralLink
      )}&text=${message}`,
      "_blank"
    );
  };

  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `Join MLM PLATFORM Marketing Platform using my referral link: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  // Get referals

  const getReferals = async () => {
    const token = localStorage.getItem("token");
    await fetch("https://mlm-backend.pixl.uz/referal-level", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setReferals(res);
      })
      .catch(({ message }) => {
        toast.error(message);
      });
  };

  useEffect(() => {
    getReferals();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("common.referrals")}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t("referralsPage.inviteFriendsDesc")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title={t("referrals.totalReferrals")}
          value={ref?.count}
          icon={Users}
          color="blue"
        />
        <StatCard
          title={t("referralsPage.UserLevel")}
          value={pendingReferrals}
          icon={BarChart2}
          color="orange"
          subtitle="Level"
        />
        <StatCard
          title={t("referrals.bonusEarned")}
          value={ref?.count}
          color="purple"
          img="/CoinLogo.png"
          subtitle="USDT"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Referral Link */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("referrals.referralLink")}
          </h2>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
              />
              <button
                onClick={copyReferralLink}
                className="flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <CheckCircle className="mr-1" size={16} />
                    {t("common.copied")}
                  </>
                ) : (
                  <>
                    <Copy className="mr-1" size={16} />
                    {t("common.copy")}
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={shareOnTelegram}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <MessageCircle className="mr-2" size={18} />
                {t("referrals.shareOnTelegram")}
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
              >
                <Phone className="mr-2" size={18} />
                {t("referrals.shareOnWhatsApp")}
              </button>
            </div>
          </div>
        </div>

        {/* Referral Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("referrals.referalevel")}
          </h2>

          <div className="overflow-x-auto">
            <div className="max-h-[360px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("referrals.count")}
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("referrals.prize")}
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t("referrals.level")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {referals.map(({ id, count, prize, level }, index) => (
                    <tr
                      key={id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white">
                          {count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-200 whitespace-nowrap">
                        {prize}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {level}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Friends List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
          {t("referrals.invitedFriends")}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  {t("referrals.friendName")}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  {t("referrals.joinDate")}
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  {t("referrals.paymentStatus")}
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">
                  {t("referrals.bonus")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {referralFriends.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 px-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    {t("referralsPage.noReferralFriends")}
                  </td>
                </tr>
              ) : (
                referralFriends.map((friend: any) => (
                  <tr
                    key={friend.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {friend.user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {friend.user.email}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(friend.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          friend.user?.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                        }`}
                      >
                        {friend.user?.isActive ? (
                          <>
                            <CheckCircle className="mr-1" size={12} />
                            {t("referrals.active")}
                          </>
                        ) : (
                          <>
                            <Clock className="mr-1" size={12} />
                            {t("referrals.inactive")}
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          friend.user?.isActive
                            ? "text-green-600 dark:text-green-400"
                            : "text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {friend.coin || 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
