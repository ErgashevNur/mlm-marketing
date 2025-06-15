import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Wallet, CreditCard, Calendar, Coins } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";
import { toast } from "sonner";
import CardInfo from "../components/CardInfo";

const WithdrawPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [withdrawHistory, setWithdrawHistory] = useState([]);

  const totalWithdrawn = withdrawHistory
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0);

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obj = {
      how_much: Number(formData.get("how_much")),
      cardNumber: formData.get("cardNumber"),
      fullName: formData.get("fullname"),
    };

    const token = localStorage.getItem("token");

    try {
      const req = await fetch("https://mlm-backend.pixl.uz/take-off", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      if (!req.ok) {
        const errorText = await req.text();
        throw new Error(`Xatolik: ${req.status} - ${errorText}`);
      }
      await req.json();
      e.target.reset();

      toast.success("So'rov muvaffaqiyatli yuborildi!");
      setWithdrawHistory((prev) => [...prev, obj]);
      console.log(withdrawHistory);
    } catch (error) {
      toast.error("So'rov yuborishda xatolik: " + error.message);
    }
  };

  useEffect(() => {}, [withdrawHistory]);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const req = await fetch("https://mlm-backend.pixl.uz/take-off/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await req.json();
        console.log(data);
        setWithdrawHistory(data);
      } catch (error) {
        toast.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("withdraw.withdrawFunds")}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Request withdrawals and track your payment history
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard
          title={t("withdraw.availableBalance")}
          icon={Wallet}
          color="blue"
        />
        <StatCard title="This Month" icon={Calendar} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Request Withdrawal
          </h2>

          <form onSubmit={handleWithdrawSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("withdraw.withdrawAmount")}
              </label>
              <div className="relative">
                <Coins
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <input
                  name="how_much"
                  type="number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="10"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum withdrawal: $10.00
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("withdraw.cardNumber")}
              </label>
              <div className="relative">
                <CreditCard
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <input
                  name="cardNumber"
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("withdraw.cardHolder")}
              </label>
              <input
                name="fullname"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting
                ? t("common.loading")
                : t("withdraw.requestWithdraw")}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
              Important Notes:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Withdrawals are processed within 1-3 business days</li>
              <li>• Minimum withdrawal amount is $10.00</li>
              <li>
                • Processing fees may apply depending on your payment method
              </li>
              <li>• Ensure your card details are correct to avoid delays</li>
            </ul>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t("withdraw.withdrawHistory")}
          </h2>

          <div className="space-y-4">
            {withdrawHistory.map(
              ({
                cardNumber,
                fullName,
                how_much,
                id,
                requestDate,
                status,
                commend,
              }) => (
                <div key={id}>
                  <CardInfo
                    cardNumber={cardNumber}
                    fullName={fullName}
                    how_much={how_much}
                    requestDate={requestDate}
                    status={status}
                    commend={commend}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
