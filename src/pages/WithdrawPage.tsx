import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Wallet, CreditCard, Calendar, Copy, CheckCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/StatCard";
import { toast } from "sonner";
import CardInfo from "../components/CardInfo";
import logo from "../../public/logo.svg";
const WithdrawPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("USDT");
  const [coinData, setCoinData] = useState<any[]>([]);
  const [calculatedValue, setCalculatedValue] = useState("");

  const [minimumValue, setMinimumValue] = useState(null);

  const isEnoughCoin = user.coin < (minimumValue?.minValue ?? 0);

  const minimum = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://mlm-backend.pixl.uz/min-take-off", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Minimum qiymatni olishda xatolik yuz berdi");
      }

      const data = await response.json();
      setMinimumValue(data);
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  useEffect(() => {
    minimum();
  }, []);

  const handleWithdrawSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const how_much = Number(formData.get("how_much"));
    const cardNumber = String(formData.get("cardNumber") || "");
    const fullName = String(formData.get("fullname") || "");
    const currency = selectedCurrency;

    // Validation
    if (!how_much || how_much < 1) {
      toast.error(t("withdraw.minWithdraw", { amount: 1 }));
      return;
    }
    if (!cardNumber || cardNumber.length < 12) {
      toast.error(t("withdraw.cardNumber") + " " + t("common.required"));
      return;
    }
    if (!fullName || fullName.length < 3) {
      toast.error(t("withdraw.cardHolder") + " " + t("common.required"));
      return;
    }

    const obj = {
      how_much,
      cardNumber,
      fullName,
      currency, // add currency to request
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
    } catch (error: any) {
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
        setWithdrawHistory(data);
      } catch (error) {
        toast.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://mlm-backend.pixl.uz/coin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCoinData(Array.isArray(data) ? data : []);
      } catch (error) {
        // handle error
      }
    };
    fetchCoinData();
  }, []);

  useEffect(() => {
    const selected = coinData.find((c) => c.currency === selectedCurrency);
    const how_much = Number(
      (document.querySelector('input[name="how_much"]') as HTMLInputElement)
        ?.value || 0
    );
    if (selected && how_much > 0) {
      setCalculatedValue((how_much * selected.count).toLocaleString());
    } else {
      setCalculatedValue("");
    }
  }, [selectedCurrency, coinData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {t("withdraw.withdrawFunds")}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t("withdraw.requestWithdrawDesc")}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard
          title={t("withdraw.availableBalance")}
          icon={Wallet}
          color="blue"
          value={user?.coin}
          subtitle="USTD"
        />
        <StatCard
          title={t("withdraw.thisMonth")}
          icon={Calendar}
          color="purple"
          value={withdrawHistory.length}
          subtitle={t("withdraw.withdrawHistory")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Withdrawal Form */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t("withdraw.requestWithdraw")}
          </h2>

          <form onSubmit={handleWithdrawSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("withdraw.withdrawAmount")}
              </label>
              <div className="relative flex items-center gap-2">
                <img
                  src="/CoinLogo.png"
                  className="absolute w-5 left-3 top-1/2 transform -translate-y-1/2"
                  alt={t("withdraw.coinAlt")}
                />
                <input
                  name="how_much"
                  type="number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  onChange={() => {
                    // recalculate on amount change
                    const selected = coinData.find(
                      (c) => c.currency === selectedCurrency
                    );
                    const how_much = Number(
                      (
                        document.querySelector(
                          'input[name="how_much"]'
                        ) as HTMLInputElement
                      )?.value || 0
                    );
                    if (selected && how_much > 0) {
                      setCalculatedValue(
                        (how_much * selected.count).toLocaleString()
                      );
                    } else {
                      setCalculatedValue("");
                    }
                  }}
                />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="ml-2 px-3 py-[15px] w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  style={{ minWidth: 80 }}
                >
                  {coinData.map((c) => (
                    <option key={c.currency} value={c.currency}>
                      {c.currency}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {calculatedValue} {selectedCurrency}
              </p>
            </div>

            <div>
              <label className="block flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("withdraw.cardNumber")}
              </label>
              <div className="relative flex items-center">
                <CreditCard
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <input
                  name="cardNumber"
                  type={
                    ["USDT", "BITCOIN", "TONCOIN"].includes(selectedCurrency)
                      ? "text"
                      : "number"
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t("withdraw.cardNumber")}
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    const maxLen = 16;

                    if (
                      !["USDT", "BITCOIN", "TONCOIN"].includes(
                        selectedCurrency
                      ) &&
                      input.value.length > maxLen
                    ) {
                      input.value = input.value.slice(0, maxLen);
                    }
                  }}
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
                placeholder={t("withdraw.cardHolder")}
              />
            </div>

            <button
              disabled={isEnoughCoin}
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
              {t("withdraw.importantNotes")}
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• {t("withdraw.noteProcessingTime")}</li>
              <li className="flex items-center gap-1">
                •
                {t("withdraw.noteMinAmount", {
                  amount: minimumValue?.minValue,
                })}
                <img width={15} height={15} src={logo} alt="" />
              </li>
              <li>• {t("withdraw.noteFees")}</li>
              <li>• {t("withdraw.noteCardDetails")}</li>
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
