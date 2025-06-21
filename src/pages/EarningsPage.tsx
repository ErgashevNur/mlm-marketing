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
  X,
  FileText,
  Camera,
  Copy,
  Ban,
  Headset,
} from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import {
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaTwitter,
} from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";

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
  const [warn, setWarn] = useState(false);
  const [socials, setSocials] = useState([]);
  const getCurrencies = async () => {
    try {
      const response = await fetch("https://mlm-backend.pixl.uz/suport");

      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }

      const data = await response.json();
      setSocials(data);
    } catch (error) {
      console.error("Error fetching currency:", error.message);
      return null;
    }
  };
  useEffect(() => {
    getCurrencies();
  }, []);

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

    socketRef.current.on("card_info", (data) => {
      setModalData(data);
      setIsModalOpen(true);
      setWarn(false);
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
      setDepositTimer(240); // 2 daqiqa = 120 sekund
    }

    setWarn(true);
    // "Iltimos sahifadan chiqib ketmang aks holda aperatsiya bekor qilinadi!!!"
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

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setUploadSuccess(false);
    setIsUploading(false);
  };

  const handleFileSelect = (file: File) => {
    if (
      file &&
      (file.type.startsWith("image/") || file.type === "application/pdf")
    ) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsUploading(true); // loading ko‘rsatish

    try {
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
      const imageUrl = uploadData.url || uploadData.photo_url;

      if (!imageUrl) {
        toast.error(t("earningsPage.imageUrlNotFound"));
        setIsUploading(false);
        return;
      }

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
        setIsUploading(false);
        return;
      }

      toast.success(t("earningsPage.imageSentSuccessfully"));

      setSelectedFile(null);
      setUploadSuccess(true); // success bo‘lishi uchun
      setIsUploading(false);

      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(t("earningsPage.imageUploadError"));
      setIsUploading(false);
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  function handleCopyCardNumber(cardNumber: string) {
    if (!cardNumber) return;

    navigator.clipboard
      .writeText(cardNumber)
      .then(() => {
        // Muvaffaqiyatli nusxalandi
        toast.success("Karta raqami nusxalandi!");
      })
      .catch((err) => {
        // Xatolik yuz berdi
        console.error("Nusxalab bo'lmadi:", err);
        toast.error("Nusxalashda xatolik yuz berdi");
      });
  }
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisabled(false);
    }, 240000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
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
                  required
                  onChange={(e) => setCoinAmount(e.target.value)}
                  placeholder={t("earningsPage.amountPlaceholder")}
                  className="w-full bg-white/10 dark:bg-gray-800 border border-indigo-600 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-6 sm:py-4 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
              </div>

              <button
                onClick={handleDeposit}
                disabled={isDepositDisabled || !coinAmount.trim()}
                className={`w-full hidden bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base py-2.5 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl md:flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 transform ${
                  isDepositDisabled
                    ? "opacity-60 cursor-not-allowed hover:scale-100"
                    : "hover:scale-[1.02] shadow-lg"
                }`}
              >
                {isDepositDisabled ? (
                  <>
                    {depositTimer > 0
                      ? `${t("earningsPage.resend")}`
                      : t("earningsPage.sendRequest")}
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    {t("earningsPage.sendRequest")}
                  </>
                )}
              </button>

              <div className="justify-between text-center  md:hidden items-center py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl px-4">
                <span className="text-gray-900  dark:text-white font-semibold">
                  {t("trading.totalValue")}
                  {": "}
                </span>
                <span className="text-xl sm:text-2xl font-bold">
                  {getCalculatedValue()}
                </span>
              </div>
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
                    {/* {coinAmount} {currency} */}
                    USDT
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
                <div className="justify-between hidden md:flex items-center py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl px-4">
                  <span className="text-gray-900  dark:text-white font-semibold">
                    {t("trading.totalValue")}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold">
                    {getCalculatedValue()}
                  </span>
                </div>
                <button
                  onClick={handleDeposit}
                  disabled={isDepositDisabled || !coinAmount.trim()}
                  className={`w-full md:hidden bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base py-2.5 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 transform ${
                    isDepositDisabled
                      ? "opacity-60 cursor-not-allowed hover:scale-100"
                      : "hover:scale-[1.02] shadow-lg"
                  }`}
                >
                  {isDepositDisabled ? (
                    <>
                      {depositTimer > 0
                        ? `${t("earningsPage.resend")}`
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Payment Verification
              </h2>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {modalData ? (
                <div className="space-y-6">
                  {/* Card Information */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
                    <div className="flex items-center space-x-3 mb-2">
                      <CreditCard className="w-5 h-5" />
                      <span className="text-sm font-medium opacity-90">
                        Payment Card
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-lg tracking-wider">
                        {/* {formatCardNumber(modalData.cardNumber)} */}
                        {t("earningsPage.card")} <br />
                        {cardNum?.cardNumber
                          ? cardNum.cardNumber.replace(/(.{4})/g, "$1 ").trim()
                          : ""}
                      </div>

                      <button
                        onClick={() =>
                          handleCopyCardNumber(cardNum?.cardNumber || "")
                        }
                        className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* File Upload Section */}
                  {!uploadSuccess ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">
                        Отправить чек
                      </h3>

                      {/* Drag & Drop Zone */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                          isDragOver
                            ? "border-blue-400 bg-blue-50"
                            : selectedFile
                            ? "border-green-400 bg-green-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {selectedFile ? (
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                              <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {selectedFile.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                            <button
                              onClick={() => setSelectedFile(null)}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                              {isDragOver ? (
                                <Upload className="w-6 h-6 text-blue-600" />
                              ) : (
                                <Camera className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {isDragOver
                                  ? "Drop your file here"
                                  : "Drag & drop your file"}
                              </p>
                              <p className="text-sm text-gray-500">
                                or click to browse (JPG, PNG)
                              </p>
                            </div>
                            <input
                              type="file"
                              accept=".png, .jpg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(file);
                              }}
                              className="absolute top-64 left-28 inset-0 w-full h-[35%] opacity-0 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>

                      {/* Upload Button */}
                      <button
                        onClick={handleFileUpload}
                        disabled={!selectedFile || isUploading}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                          !selectedFile || isUploading
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          "Upload Document"
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Success State */
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload Successful!
                      </h3>
                      <p className="text-gray-600">
                        Your document has been uploaded and is being processed.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Loading State */
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    Loading payment information...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* warning message page, page written by_codenur */}
      {warn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
          <div className="border relative bg-slate-300 p-16 text-center rounded-2xl">
            <button
              disabled={disabled}
              className="absolute right-5 gap-3 top-5 flex items-center text-sm text-gray-700"
              onClick={() => setWarn(false)}
            >
              {depositTimer > 0 && (
                <span className="mt-1 text-xs text-gray-600">
                  {`${Math.floor(depositTimer / 60)}:${(depositTimer % 60)
                    .toString()
                    .padStart(2, "0")}`}
                </span>
              )}
              {disabled ? <Ban /> : <X />}
            </button>
            <h2>
              <strong>{t("earningsPage.warnTitle")}</strong>{" "}
              {t("earningsPage.warnSubtitle")}
            </h2>
            <p>
              <span>{t("earningsPage.warnStay")}</span>
              <br />
              {t("earningsPage.warnAutoMessage")}
            </p>

            <button
              onClick={handleDeposit}
              disabled={isDepositDisabled}
              className={`w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base py-2.5 sm:py-4 px-4 sm:px-8 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 transform mt-8 ${
                isDepositDisabled
                  ? "opacity-60 cursor-not-allowed hover:scale-100"
                  : "hover:scale-[1.02] shadow-lg"
              }`}
            >
              {isDepositDisabled ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {depositTimer > 0
                    ? `${t("earningsPage.resend")}`
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
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 group w-16 h-16">
        <div className="w-16 h-16 cursor-pointer flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg relative z-20">
          <Headset size={28} />
        </div>

        <div
          className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2
                          opacity-0 translate-y-2 scale-95
                          group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                          transition-all duration-300 ease-in-out"
        >
          {socials.map(({ link, name }) => {
            const icon =
              name === "Instagram" ? (
                <FaInstagram />
              ) : name === "Telegram" ? (
                <FaTelegram />
              ) : (
                <IoShareSocial />
              );
            const bgColor =
              name === "Instagram"
                ? "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500"
                : name === "Telegram"
                ? "bg-blue-500"
                : "bg-gray-400";

            return (
              <a
                key={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 flex items-center justify-center ${bgColor} text-white rounded-full shadow cursor-pointer`}
                href={link}
              >
                {icon}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EarningsPage;
