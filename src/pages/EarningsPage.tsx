import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";
import { io } from "socket.io-client";

const EarningsPage: React.FC = () => {
  const { t } = useTranslation();

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
    console.log("Socket: ", socketRef);

    socketRef.current.on("connect", () => {
      console.log("🔌 Ulandi:", socketRef.current.id);
    });

    socketRef.current.on("roomAssigned", (data) => {
      console.log(`✅ Siz ${data.roomName} roomga qo‘shildingiz`);
    });

    socketRef.current.on("card_info", (data) => {
      setData(data);
      console.log("data: ", data);

      if (Notification.permission === "granted") {
        const notification = new Notification(data.paymentId, {
          body: data.message,
        });
      }
    });

    return () => {
      socketRef.current.disconnect(); // komponent unmount bo‘lganda socketni uzish
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

  // Withdrawal History section
  const renderWithdrawalHistory = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 flex items-center gap-2">
        <span role="img" aria-label="card">
          💳
        </span>
        {t("earningsPage.historyTitle")}
      </h2>

      {!data || data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg
            className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M3 10h18" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {t("earningsPage.noData")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data?.map((item: any) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow transition hover:shadow-lg"
            >
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {item.how_much}
                  </span>
                  <span className="text-base text-gray-500 dark:text-gray-400 font-medium">
                    {item.currency || t("earningsPage.coin")}
                  </span>
                  <span
                    className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      statusStyles[item.status]
                    }`}
                  >
                    {item.status === "SENDING"
                      ? t("earningsPage.statusSending")
                      : item.status === "SUCCESS"
                      ? t("earningsPage.statusSuccess")
                      : t("earningsPage.statusCancelled")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>
                    <span className="font-medium">
                      {t("earningsPage.historyTitle")}:
                    </span>{" "}
                    {item.to_send_date
                      ? new Date(item.to_send_date).toLocaleString()
                      : "-"}
                  </span>
                  <span>
                    <span className="font-medium">
                      {t("earningsPage.processed")}:
                    </span>{" "}
                    {item.to_checked_date
                      ? new Date(item.to_checked_date).toLocaleString()
                      : "-"}
                  </span>
                  <span>
                    <span className="font-medium">
                      {t("earningsPage.statusSending")}:
                    </span>{" "}
                    {item.status}
                  </span>
                  {item.maskedCard && (
                    <span>
                      <span className="font-medium">Card:</span>{" "}
                      {item.maskedCard}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">ID: {item.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen dark:text-white p-6 space-y-6">
      {/* Balans */}
      <div className="dark:bg-gray-800 rounded-xl shadow-md p-6 border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              {t("earningsPage.title")}:{" "}
              <span className="text-yellow-400">{getCalculatedValue()}</span>
            </h1>
            <p className="dark:text-gray-400 text-sm">
              {t("earningsPage.enterAmount")}
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
                    ? `${t("earningsPage.resend")} (${depositTimer}s)`
                    : t("earningsPage.sendRequest")}
                </>
              ) : (
                t("earningsPage.sendRequest")
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            placeholder={t("earningsPage.amountPlaceholder")}
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
              ? t("earningsPage.calculated", {
                  coinAmount,
                  currency,
                  calculatedValue: getCalculatedValue(),
                })
              : ""}
          </span>
        </div>
      </div>

      {/* Tarix */}
      {renderWithdrawalHistory()}
    </div>
  );
};

export default EarningsPage;
