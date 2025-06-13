import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";
import { io } from "socket.io-client";
// import StatCard from "../components/StatCard";

const EarningsPage: React.FC = () => {
  const { t } = useTranslation();

  const socketRef = useRef(null); // socketni saqlab turish uchun
  const [balance, setBalance] = useState(0);
  const [coinAmount, setCoinAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [coinData, setCoinData] = useState<any>();

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

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io("https://mlm-backend.pixl.uz/", {
      auth: { token },
    });

    // real time
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🔌 Ulandi:", socket.id);
    });

    socket.on("roomAssigned", (data) => {
      console.log(`✅ Siz ${data.roomName} roomga qo‘shildingiz`);
    });

    return () => {
      socket.disconnect(); // komponent unmount bo‘lganda socketni uzish
    };
  }, []);

  useEffect(() => {
    // API'dan coin ma'lumotlarini olish
    const fetchCoinData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://mlm-backend.pixl.uz/coin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setCoinData(data);
        console.log("Coin API:", data);
      } catch (error) {
        console.error("Coin ma'lumotlarini olishda xatolik:", error);
      }
    };
    fetchCoinData();
  }, []);

  const handleDeposit = () => {
    const amount = parseFloat(coinAmount || "0");

    if (amount > 0 && socketRef.current) {
      socketRef.current.emit("paymentRequest", {
        currency,
        how_much: amount,
      });

      console.log(`📤 So‘rov yuborildi: ${amount} ${currency}`);
      setBalance((prev) => prev + amount);
      setCoinAmount("");
    }
  };

  // Hisoblangan qiymatni olish uchun funksiya
  const getCalculatedValue = () => {
    if (!coinData || !Array.isArray(coinData)) return "";
    const selected = coinData.find((c: any) => c.currency === currency);
    if (!selected) return "";
    const amount = parseFloat(coinAmount || "0");
    if (isNaN(amount)) return "";
    return (amount * selected.count).toLocaleString();
  };

  return (
    <div className="min-h-screen dark:text-white p-6 space-y-6">
      {/* Balans */}
      <div className="dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Narxi:{" "}
              <span className="text-yellow-400">{getCalculatedValue()}</span>
            </h1>
            <p className="dark:text-gray-400 text-sm">
              Coin'ni to‘ldirish uchun quyidagi ma'lumotlarni kiriting!
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleDeposit}
              className="bg-green-500 hover:bg-green-600 dark:text-white px-6 py-2 rounded-lg flex items-center"
            >
              <Upload className="mr-2" size={16} /> So'rov yuborish
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            placeholder="Coin miqdorini kiriting"
            className="w-full dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg px-4 py-2"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full dark:bg-gray-700 dark:text-white border dark:border-gray-600 rounded-lg px-4 py-2"
          >
            {coinData &&
              Array.isArray(coinData) &&
              coinData.map((curr: any) => (
                <option key={curr.id} value={curr.currency}>
                  {curr.currency}
                </option>
              ))}
          </select>
        </div>
        {/* Hisoblangan natija */}
        <div className="mt-4">
          <span className="font-semibold">
            {coinAmount && currency && getCalculatedValue()
              ? `${coinAmount} × ${currency} = ${getCalculatedValue()}`
              : ""}
          </span>
        </div>
      </div>

      {/* Tarix */}
      <div className="dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Yechish tarixi</h2>
        <div className="space-y-4">
          {withdrawalHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between dark:bg-gray-700 border p-4 rounded-lg"
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
