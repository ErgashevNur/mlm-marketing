import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";

const WithdrawPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const withdrawHistory = [
    {
      id: 1,
      amount: 100.0,
      status: "completed",
      requestDate: "2024-01-10",
      processedDate: "2024-01-11",
    },
    {
      id: 2,
      amount: 250.0,
      status: "processing",
      requestDate: "2024-01-08",
      processedDate: null,
    },
    {
      id: 3,
      amount: 150.75,
      status: "completed",
      requestDate: "2024-01-05",
      processedDate: "2024-01-06",
    },
    {
      id: 4,
      amount: 75.5,
      status: "rejected",
      requestDate: "2024-01-03",
      processedDate: "2024-01-04",
    },
    {
      id: 5,
      amount: 200.0,
      status: "completed",
      requestDate: "2024-01-01",
      processedDate: "2024-01-02",
    },
  ];

  const totalWithdrawn = withdrawHistory
    .filter((w) => w.status === "completed")
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingWithdrawals = withdrawHistory
    .filter((w) => w.status === "processing")
    .reduce((sum, w) => sum + w.amount, 0);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset form
    setWithdrawAmount("");
    setCardNumber("");
    setCardHolder("");
    setIsSubmitting(false);

    alert("Withdrawal request submitted successfully!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={16} />;
      case "processing":
        return <Clock className="text-orange-500" size={16} />;
      case "rejected":
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-orange-100 text-orange-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("withdraw.withdrawFunds")}
        </h1>
        <p className="text-gray-600">
          Request withdrawals and track your payment history
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("withdraw.availableBalance")}
          value={`$${user?.balance?.toFixed(2)}`}
          icon={Wallet}
          color="blue"
        />
        <StatCard
          title="Total Withdrawn"
          value={`$${totalWithdrawn.toFixed(2)}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Pending Withdrawals"
          value={`$${pendingWithdrawals.toFixed(2)}`}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="This Month"
          value={`$${(totalWithdrawn * 0.3).toFixed(2)}`}
          icon={Calendar}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Request Withdrawal
          </h2>

          <form onSubmit={handleWithdrawSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("withdraw.withdrawAmount")}
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="10"
                  max={user?.balance}
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum withdrawal: $10.00 | Available: $
                {user?.balance?.toFixed(2)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("withdraw.cardNumber")}
              </label>
              <div className="relative">
                <CreditCard
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("withdraw.cardHolder")}
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting || !withdrawAmount || !cardNumber || !cardHolder
              }
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting
                ? t("common.loading")
                : t("withdraw.requestWithdraw")}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {t("withdraw.withdrawHistory")}
          </h2>

          <div className="space-y-4">
            {withdrawHistory.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(withdrawal.status)}
                  <div>
                    <p className="font-medium text-gray-900">
                      ${withdrawal.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(withdrawal.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      withdrawal.status
                    )}`}
                  >
                    {withdrawal.status === "completed" &&
                      t("withdraw.completed")}
                    {withdrawal.status === "processing" &&
                      t("withdraw.processing")}
                    {withdrawal.status === "rejected" && t("withdraw.rejected")}
                  </span>
                  {withdrawal.processedDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Processed:{" "}
                      {new Date(withdrawal.processedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
