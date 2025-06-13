import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Upload,
} from "lucide-react";
import StatCard from "../components/StatCard";

const EarningsPage: React.FC = () => {
  const { t } = useTranslation();
  const [balance, setBalance] = useState(0); // Balans holati
  const [coinAmount, setCoinAmount] = useState(""); // Coin miqdori
  const [currency, setCurrency] = useState("So'm"); // Valyuta tanlash
  const [withdrawalHistory] = useState([
    {
      id: 1,
      amount: 500,
      currency: "UZS",
      date: "May 1, 2023, 07:30 PM",
      status: "Tasdiqlangan",
      maskedCard: "****4242",
    },
    {
      id: 2,
      amount: 300,
      currency: "UZS",
      date: "May 15, 2023, 02:15 PM",
      status: "Kutilmoqda",
      maskedCard: "****4444",
    },
    {
      id: 3,
      amount: 700,
      currency: "UZS",
      date: "May 20, 2023, 03:45 PM",
      status: "Tasdiqlangan",
      maskedCard: "****4242",
    },
  ]);

  const currencies = ["So'm", "USD", "RUB"]; // Valyuta opsiyalari

  const handleDeposit = () => {
    // Pul tushirish logikasi
    console.log(`Depositing ${coinAmount} ${currency}`);
    setBalance((prev) => prev + parseFloat(coinAmount || "0"));
    setCoinAmount("");
  };

  const handleWithdraw = () => {
    // Pul yechish logikasi
    if (balance >= parseFloat(coinAmount || "0")) {
      console.log(`Withdrawing ${coinAmount} ${currency}`);
      setBalance((prev) => prev - parseFloat(coinAmount || "0"));
      setCoinAmount("");
    } else {
      alert("Insufficient balance");
    }
  };

  return (
    <div className="min-h-screen dark:text-white p-6 space-y-6">
      {/* Header va Balans */}
      <div className="dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Balans:{" "}
              <span className="text-yellow-400">
                {balance} {currency}
              </span>
            </h1>
            <p className="dark:text-gray-400 text-sm">
              Coin'ni to'ldirish yoki yechish uchun quyidagi tugmalardan
              foydalaning
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleDeposit}
              className="bg-green-500 hover:bg-green-600 dark:text-white px-6 py-2 rounded-lg flex items-center"
            >
              <Upload className="mr-2" size={16} /> Pul to'ldirish
            </button>
            {/* <button
              onClick={handleWithdraw}
              className="bg-blue-600 hover:bg-blue-700 dark:text-white px-6 py-2 rounded-lg flex items-center"
            >
              <Download className="mr-2" size={16} /> Pul yechish
            </button> */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="number"
              value={coinAmount}
              onChange={(e) => setCoinAmount(e.target.value)}
              placeholder="Coin miqdorini kiriting"
              className="w-full dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              {currencies.map((curr) => (
                <option
                  key={curr}
                  value={curr}
                  className="dark:bg-gray-800 text-white"
                >
                  {curr}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-red-400 text-sm mt-2">
          Kurslar vaqtincha mavjud emas, litmos, keyinroq yana urinib ko'ring.
          Uzr so'raymiz.
        </p>
      </div>

      {/* Yechish tarixi */}
      <div className="dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Yechish tarixi</h2>
        <div className="space-y-4">
          {withdrawalHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between dark:bg-gray-700 border  p-4 rounded-lg"
            >
              <div>
                <p className="text-lg font-medium">
                  {item.amount} {item.currency}
                </p>
                <p className="text-sm dark:text-gray-400">{item.date}</p>
                <p className="text-sm dark:text-gray-500">{item.maskedCard}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  item.status === "Tasdiqlangan"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                } text-white`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
