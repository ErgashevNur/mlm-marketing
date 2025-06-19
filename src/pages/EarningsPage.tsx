import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle,
  Clock,
  CreditCard,
  TrendingUp,
  Upload,
  XCircle,
  History,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const EarningsPage: React.FC = () => {
  const { t } = useTranslation();

  const socketRef = useRef(null); // socketni saqlab turish uchun
  const [balance, setBalance] = useState(0);
  const [coinAmount, setCoinAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [coinData, setCoinData] = useState<any>();
  const [data, setData] = useState([]);
  const [isDepositDisabled, setIsDepositDisabled] = useState(false);
  const [depositTimer, setDepositTimer] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const [cardNum, setCardNum] = useState();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentId, setPaymentId] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error(t("earningsPage.tokenNotFound"));
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
          throw new Error(t("earningsPage.errorFetchingData"));
        }
        return res.json();
      })
      .then((responseData) => {
        // Ensure data is always an array
        if (Array.isArray(responseData)) {
          setData(responseData);
        } else if (responseData && Array.isArray(responseData.data)) {
          setData(responseData.data);
        } else if (responseData) {
          setData([responseData]);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error(t("earningsPage.error"), err.message);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io("https://mlm-backend.pixl.uz/", {
      auth: { token },
    });

    // real time
    socketRef.current = socket;
    console.log("Socket: ", socketRef);

    socketRef.current.on("connect", () => {
      console.log(t("earningsPage.connected"), socketRef.current.id);
    });

    socketRef.current.on("roomAssigned", (data) => {
      console.log(t("earningsPage.joinedRoom", { data }));
    });

    socketRef.current.on("card_info", (data) => {
      setModalData(data);
      setIsModalOpen(true);
      setCardNum(data);
      console.log("data: ", data.paymentId);
      setPaymentId(data.paymentId);

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
        console.error(t("earningsPage.errorFetchingCoinData"), error);
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
        how_much: coinAmount,
        currency: currency,
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

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // 1. Upload image to /upload/single
      const uploadRes = await fetch(
        "https://mlm-backend.pixl.uz/upload/single",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const uploadData = await uploadRes.json();
      // Assume the uploaded image URL is in uploadData.url or uploadData.photo_url
      const imageUrl = uploadData.url || uploadData.photo_url;

      console.log(imageUrl);

      if (!imageUrl) {
        toast.error(t("earningsPage.imageUrlNotFound"));
        return;
      }

      // 2. Send image URL to /payments/scrinshot
      const scrinshotRes = await fetch(
        "https://mlm-backend.pixl.uz/payments/scrinshot",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            photoUrl: imageUrl,
            paymentId,
          }),
        }
      );

      if (!scrinshotRes.ok) {
        toast.error(t("earningsPage.errorSendingImage"));
        return;
      }

      toast.success(t("earningsPage.imageSentSuccessfully"));
      setSelectedFile(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(t("earningsPage.imageUploadError"));
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white/10 dark:bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-20 z-10 rounded-3xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <img src="/CoinLogo.png" className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("trading.dashboard")}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Trading Card */}
        <div className="bg-white/10 dark:bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-4 sm:p-6 md:p-8 shadow-2xl w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {t("trading.purchaseCoins")}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-white/70">
                {t("earningsPage.enterAmount")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Input Section */}
            <div className="space-y-4 sm:space-y-6 p-3 sm:p-6 border border-white/20 rounded-2xl">
              <div className="space-y-1.5 sm:space-y-3">
                <label className="block text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                  {t("trading.selectCurrency")}
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-white/10 dark:bg-gray-800 border border-indigo-600 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {coinData?.map((curr: any) => (
                    <option
                      key={curr.id}
                      value={curr.currency}
                      className="bg-gray-800 text-white"
                    >
                      {curr.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:space-y-3">
                <label className="block text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                  {t("earningsPage.coinAmount")}
                </label>
                <input
                  type={
                    ["USDT", "BITCOIN", "TONCOIN"].includes(currency)
                      ? "text"
                      : "number"
                  }
                  value={coinAmount}
                  onChange={(e) => setCoinAmount(e.target.value)}
                  placeholder={t("earningsPage.amountPlaceholder")}
                  className="w-full bg-white/10 dark:bg-gray-800 border border-indigo-600 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <button
                onClick={handleDeposit}
                disabled={isDepositDisabled}
                className={`w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base py-2.5 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 transform ${
                  isDepositDisabled
                    ? "opacity-60 cursor-not-allowed hover:scale-100"
                    : "hover:scale-[1.02] shadow-lg"
                }`}
              >
                {isDepositDisabled ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {depositTimer > 0
                      ? `${t("earningsPage.resend")} (${depositTimer}s)`
                      : t("earningsPage.sendRequest")}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {t("earningsPage.sendRequest")}
                  </>
                )}
              </button>
            </div>

            {/* Calculation Section */}
            <div className="rounded-2xl p-4 sm:p-6 border border-white/20">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t("earningsPage.orderSummary")}
              </h3>
              <div className="space-y-4 flex flex-col pt-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700 dark:text-white/70 text-sm sm:text-base">
                    {t("earningsPage.amount")}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {coinAmount} USDT {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-700 dark:text-white/70 text-sm sm:text-base">
                    {t("earningsPage.currency")}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {currency}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl px-4">
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {t("trading.totalValue")}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {getCalculatedValue()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white/10 dark:bg-gray-800 backdrop-blur-md rounded-3xl border border-white/20 p-4 sm:p-6 md:p-8 shadow-2xl w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {t("earningsPage.historyTitle")}
              </h2>
              <p className="text-sm sm:text-base text-gray-700 dark:text-white/70">
                {t("earningsPage.trackActivity")}
              </p>
            </div>
          </div>

          {!Array.isArray(data) || data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 dark:bg-gray-900 rounded-3xl flex items-center justify-center mb-4 sm:mb-6">
                <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-white/50" />
              </div>
              <p className="text-base sm:text-lg text-gray-700 dark:text-white/70">
                {t("earningsPage.noData")}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white/5 dark:bg-gray-900 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:bg-white/10 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <img
                          src="/CoinLogo.png"
                          className="w-5 h-5 sm:w-6 sm:h-6"
                        />
                      </div>
                      <div>
                        <div className="flex items-center flex-wrap gap-2 sm:gap-3 mb-2">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {item.how_much}
                          </span>
                          <span className="text-gray-700 dark:text-white/70 font-medium">
                            {item.currency}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                              statusStyles[item.status]
                            }`}
                          >
                            {item.status === "SENDING" && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {t("earningsPage.statusSending")}
                              </div>
                            )}
                            {item.status === "SUCCESS" && (
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                {t("earningsPage.statusSuccess")}
                              </div>
                            )}
                            {item.status === "CANCELLED" && (
                              <div className="flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                {t("earningsPage.statusCancelled")}
                              </div>
                            )}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-white/60">
                          <span>
                            <span className="font-medium">
                              {t("earningsPage.requested")}:
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
                          {item.maskedCard && (
                            <span>
                              <span className="font-medium">
                                {t("earningsPage.card")}:
                              </span>{" "}
                              {item.maskedCard}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-left lg:text-right">
                      <div className="text-xs text-gray-400 dark:text-white/40">
                        {t("earningsPage.transactionId")}
                      </div>
                      <div className="text-gray-700 dark:text-white/60 font-mono break-all">
                        {item.id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-xl font-bold"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <h2 className="text-lg font-semibold mb-2">
              {t("earningsPage.dataReceived")}
            </h2>
            {modalData ? (
              <div>
                <p>
                  {t("earningsPage.cardNumber")}:{" "}
                  {cardNum?.cardNumber
                    ? cardNum.cardNumber.replace(/(.{4})/g, "$1 ").trim()
                    : ""}
                </p>
                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedFile(
                      e.target.files && e.target.files[0]
                        ? e.target.files[0]
                        : null
                    )
                  }
                />
                <button
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleFileUpload}
                  disabled={!selectedFile}
                >
                  {t("earningsPage.uploadImage")}
                </button>
              </div>
            ) : (
              <p>{t("earningsPage.loading")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsPage;
