import React, { useEffect, useRef, useState } from "react";
// import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";
import { io } from "socket.io-client";
// import StatCard from "../components/StatCard";

const EarningsPage: React.FC = () => {
  // const { t } = useTranslation();

  const socketRef = useRef(null); // socketni saqlab turish uchun
  const [balance, setBalance] = useState(0);
  const [coinAmount, setCoinAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [coinData, setCoinData] = useState<any>();
  const [data, setData] = useState(null);
  const [isDepositDisabled, setIsDepositDisabled] = useState(false);
  const [depositTimer, setDepositTimer] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token topilmadi.");
      return;
    }

    fetch("https://mlm-backend.pixl.uz/payments/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // tokenni headerga qo‘shamiz
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ma'lumotlarni olishda xatolik yuz berdi");
        }
        return res.json();
      })
      .then((responseData) => {
        setData(responseData);
      })
      .catch((err) => {
        console.error("Xatolik:", err.message);
      });
  }, []);

  // const [withdrawalHistory] = useState([
  //   {
  //     id: 1,
  //     amount: 500,
  //     currency: "UZS",
  //     date: "May 1, 2023, 07:30 PM",
  //     status: "Tasdiqlangan",
  //     maskedCard: "****4242",
  //   },
  //   {
  //     id: 2,
  //     amount: 300,
  //     currency: "UZS",
  //     date: "May 15, 2023, 02:15 PM",
  //     status: "Kutilmoqda",
  //     maskedCard: "****4444",
  //   },
  //   {
  //     id: 3,
  //     amount: 700,
  //     currency: "UZS",
  //     date: "May 20, 2023, 03:45 PM",
  //     status: "Tasdiqlangan",
  //     maskedCard: "****4242",
  //   },
  // ]);

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
      } catch (error) {
        console.error("Coin ma'lumotlarini olishda xatolik:", error);
      }
    };
    fetchCoinData();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isDepositDisabled && depositTimer > 0) {
      timer = setInterval(() => {
        setDepositTimer((prev) => {
          if (prev <= 1) {
            setIsDepositDisabled(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isDepositDisabled, depositTimer]);

  const handleDeposit = () => {
    if (isDepositDisabled) return;
    const amount = parseFloat(coinAmount || "0");

    if (amount > 0 && socketRef.current) {
      socketRef.current.emit("paymentRequest", {
        currency,
        how_much: amount,
      });

      setBalance((prev) => prev + amount);
      setCoinAmount("");
      setIsDepositDisabled(true);
      setDepositTimer(120); // 2 daqiqa = 120 sekund
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

  const statusStyles = {
    SENDING:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
    SUCCESS:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
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
              className={`bg-green-500 hover:bg-green-600 dark:text-white px-6 py-2 rounded-lg flex items-center transition-opacity ${
                isDepositDisabled ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={isDepositDisabled}
            >
              <Upload className="mr-2" size={16} />
              {isDepositDisabled ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  {depositTimer > 0
                    ? `Qayta yuborish (${depositTimer}s)`
                    : "So'rov yuborish"}
                </>
              ) : (
                "So'rov yuborish"
              )}
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700 max-w-full mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          💳 Yechish Tarixi
        </h2>

        {data?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Ma’lumotlar hozircha yo‘q yoki yuklanmoqda...
          </p>
        ) : (
          <div className="space-y-4 max-w-full mx-auto mt-8">
            {data?.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">
                    {item.how_much} Coin
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.to_send_date || "").toLocaleDateString(
                      "en-US"
                    )}
                  </p>
                  {item.to_checked_date && (
                    <p className="text-sm text-gray-400 mt-1">
                      Processed:{" "}
                      {new Date(item.to_checked_date).toLocaleDateString(
                        "en-US"
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full h-fit ${
                      statusStyles[item.status]
                    }`}
                  >
                    {item.status === "SENDING"
                      ? "Sending"
                      : item.status === "CANCELLED"
                      ? "Success"
                      : "CANCELLED"}
                  </span>
                  <p>{item.to_checked_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;
