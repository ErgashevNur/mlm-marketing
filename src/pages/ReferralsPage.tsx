import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Copy,
  MessageCircle,
  Phone,
  CheckCircle,
  Clock,
  DollarSign,
  Loader,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";

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
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralFriends, setReferralFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  if (!user) {
    return <div className="text-red-500">Please log in to view referrals.</div>;
  }

  // Validate environment variable for referral key
  const referralKey = "http://localhost:5173";
  // import.meta.env.VITE_REFERAL_KEY;
  if (!referralKey) {
    console.error("VITE_REFERAL_KEY is not defined");
    return <div className="text-red-500">Error: Referral key is missing.</div>;
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
        // Normalize API response to ensure it's an array of Friend objects
        setReferralFriends(
          Array.isArray(data)
            ? data.map(
                (item: any): Friend => ({
                  id: item.id,
                  name: item.name || "Unknown",
                  email: item.email || "N/A",
                  joinDate: item.joinDate || new Date().toISOString(),
                  status: item.status || "pending",
                  bonus: Number(item.bonus) || 0,
                })
              )
            : data.friends && Array.isArray(data.friends)
            ? data.friends.map(
                (item: any): Friend => ({
                  id: item.id,
                  name: item.name || "Unknown",
                  email: item.email || "N/A",
                  joinDate: item.joinDate || new Date().toISOString(),
                  status: item.status || "pending",
                  bonus: Number(item.bonus) || 0,
                })
              )
            : []
        );
      } catch (error: any) {
        console.error("Referal do‘stlarni olishda xatolik:", error);
        setError("Failed to load referral friends. Please try again later.");
        setReferralFriends([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReferralFriends();
  }, [user.id]);

  // Calculate total bonuses with safety check
  const totalBonuses = Array.isArray(referralFriends)
    ? referralFriends.reduce((sum, friend) => sum + (friend.bonus || 0), 0)
    : 0;

  // Calculate paid and pending referrals
  const paidReferrals = referralFriends.filter(
    (friend) => friend.status === "paid"
  ).length;
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

  // Render loading state
  if (isLoading) {
    return (
      <div className="text-gray-500 dark:text-gray-400 max-w-[1200px] flex items-center justify-center h-screen ">
        <h1 className="mx-auto flex gap-2 text-[25px] items-center">
          Loading <Loader className="w-8 animate-spin" />
        </h1>
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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("common.referrals")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Invite friends and earn bonuses for each successful referral
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("referrals.totalReferrals")}
          value={user?.totalReferrals || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title={t("referrals.paidReferrals")}
          value={paidReferrals}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title={t("referrals.pendingPayments")}
          value={pendingReferrals}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title={t("referrals.bonusEarned")}
          value={`${totalBonuses} coin`}
          icon={DollarSign}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Link */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("referrals.referralLink")}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:outline-none"
              />
              <button
                onClick={copyReferralLink}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
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

            <div className="flex space-x-3">
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
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Referral Performance
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Paid Referrals
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {paidReferrals} friends
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">
                ${(paidReferrals * 50).toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="text-white" size={16} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Pending Referrals
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {pendingReferrals} friends
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                ${(pendingReferrals * 50).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Friends List */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {t("referrals.invitedFriends")}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
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
                    No referral friends found.
                  </td>
                </tr>
              ) : (
                referralFriends.map((friend) => (
                  <tr
                    key={friend.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {friend.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {friend.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {new Date(friend.joinDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          friend.status === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                        }`}
                      >
                        {friend.status === "paid" ? (
                          <>
                            <CheckCircle className="mr-1" size={12} />
                            {t("referrals.paid")}
                          </>
                        ) : (
                          <>
                            <Clock className="mr-1" size={12} />
                            {t("referrals.pending")}
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          friend.status === "paid"
                            ? "text-green-600 dark:text-green-400"
                            : "text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        ${(friend.bonus || 0).toFixed(2)}
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
