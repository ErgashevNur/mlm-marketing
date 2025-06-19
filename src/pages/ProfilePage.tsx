import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  CreditCard,
  Calendar,
  Hash,
  Settings,
  Key,
  Copy,
  CheckCircle,
  X,
  Send,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { validation } from "../validation";
import { toast } from "sonner";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const tabs = [
    { id: "personal", name: t("profile.personalInfo"), icon: User },
    { id: "settings", name: t("profile.accountSettings"), icon: Settings },
  ];
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [copied, setCopied] = useState(false);

  const handleCopy = (id) => {
    const link = `${import.meta.env.VITE_REFERAL_KEY}/referal/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link nusxalandi!");
    setTimeout(() => setCopied(false), 2000); // 2 soniyadan so‘ng icon qaytadi
  };

  const [isModal, setISModal] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const obj = {
      oldPassword: String(formData.get("oldPassword")),
      newPassword: String(formData.get("newPassword")),
      confirmPassword: String(formData.get("confirmPassword")),
    };

    const result = validation(obj);
    if (result) {
      const { target, message } = result;
      e.target[target]?.focus();
      toast.error(message);
    } else {
      try {
        const res = await fetch(
          "https://mlm-backend.pixl.uz/users/up-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              password: obj.newPassword,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Parolni yangilashda xatolik yuz berdi");
          return;
        }

        toast.success("Parol muvaffaqiyatli yangilandi!");
        setISModal(false);
      } catch (err) {
        toast.error("Tarmoqda xatolik: " + err.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-500 border-gray-100 p-6">
        <h1 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">
          {t("common.profile")}
        </h1>
        <p className="text-gray-600 dark:text-gray-100">
          Manage your account information and settings
        </p>
      </div>

      {/* Profile Content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-500 border-gray-100">
        {/* Tabs */}
        <div className="overflow-x-auto">
          <nav className="flex min-w-max space-x-2 sm:space-x-3 sm:px-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 dark:text-gray-100 hover:border-gray-300"
                  }`}
                >
                  <Icon className="mr-2" size={16} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 ">
          {activeTab === "personal" && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="w-20 h-20 bg-gradient-to-br border-2 from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                  {localStorage.getItem("avatar") ? (
                    <img
                      src={localStorage.getItem("avatar")}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl dark:text-gray-200 font-semibold text-gray-900 capitalize">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-200">
                    {user.email}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium dark:bg-gray-800/65 bg-blue-100 text-blue-400 border-[0.5px]">
                      {user.userTariff?.tariff_id || "Basic"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Name */}
                <div className="flex dark:border-gray-600 border items-start space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <User className="text-gray-400 dark:text-white" size={20} />
                  <div>
                    <p className="text-sm font-medium dark:text-white text-gray-500">
                      {t("profile.name")}
                    </p>
                    <p className="text-gray-900 dark:text-white capitalize">
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex dark:border-gray-600 border items-start space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-400 dark:text-white" size={20} />
                  <div>
                    <p className="text-sm font-medium dark:text-white text-gray-500">
                      {t("profile.email")}
                    </p>
                    <p className="text-gray-900 sm:text-sm text-sm dark:text-white">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Referral */}
                <div className="flex relative dark:border-gray-600 border items-start space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <Hash className="text-gray-400 dark:text-white" size={20} />
                  <div className="flex flex-col w-full">
                    <p className="text-sm mb-2 font-medium dark:text-gray-100 text-gray-500">
                      {t("profile.referralCode")}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="text-gray-900 text-xs dark:text-white font-mono break-all">
                        {`${import.meta.env.VITE_REFERAL_KEY}/referal/${
                          user.id
                        }`}
                      </p>
                      <button
                        onClick={() => handleCopy(user.id)}
                        className="text-blue-600 text-sm hover:underline self-end sm:self-auto"
                      >
                        {copied ? (
                          <CheckCircle className="text-green-700" size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Current Plan */}
                <div className="flex dark:border-gray-600 border items-start space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <CreditCard
                    className="text-gray-400 dark:text-white"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium dark:text-white text-gray-500">
                      {t("profile.currentPlan")}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {user.userTariff?.tariff_id || "Basic"}
                    </p>
                  </div>
                </div>

                {/* Plan Expiry */}
                <div className="flex dark:border-gray-600 border items-start space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <Calendar
                    className="text-gray-400 dark:text-white"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium dark:text-white text-gray-500">
                      {t("profile.planExpiry")}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(user.createdAt).toISOString().split("T")[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Security Settings */}
                <div className="p-6">
                  <h3 className="text-lg dark:text-white font-medium text-gray-900 mb-4">
                    Security
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-3">
                        <Key
                          className="text-gray-400 dark:text-white"
                          size={20}
                        />
                        <div>
                          <p className="font-medium dark:text-white text-gray-900">
                            {t("profile.changePassword")}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setISModal(true);
                        }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Update user password */}
      {isModal && (
        <div className="w-full h-screen fixed top-[-20px] backdrop-blur left-0 flex items-center justify-center bg-white/70 z-50 dark:bg-gray-900/0 dark:text-white">
          <div className="w-[90%] sm:w-[400px] h-auto border dark:border-gray-500 rounded-md bg-white dark:bg-transparent p-4 sm:p-5">
            <h1 className="text-lg sm:text-xl font-semibold w-full flex items-center mb-4 sm:mb-5 justify-between">
              Change your password
              <X onClick={() => setISModal(false)} className="cursor-pointer" />
            </h1>
            <form
              onSubmit={changePassword}
              className="flex w-full flex-col gap-4 items-start"
            >
              <label className="flex w-full flex-col gap-2 items-start">
                <span className="text-sm">Eski parolni kiriting*</span>
                <div className="relative w-full flex items-center gap-2">
                  <input
                    type={showOld ? "text" : "password"}
                    name="oldPassword"
                    className="w-full p-[6px] rounded-[6px] placeholder:text-sm outline-none px-2 bg-transparent dark:text-white text-black border dark:border-gray-500"
                    placeholder="Eski parolni kiritng..."
                  />
                  <span
                    className="absolute right-3 cursor-pointer"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <EyeOff size={14} /> : <Eye size={14} />}
                  </span>
                </div>
              </label>

              <label className="flex w-full flex-col gap-2 items-start">
                <span className="text-sm">Yangi parolni kiriting*</span>
                <div className="relative w-full flex items-center gap-2">
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    className="w-full p-[6px] rounded-[6px] placeholder:text-sm outline-none px-2 bg-transparent dark:text-white text-black border dark:border-gray-500"
                    placeholder="Yangi parolni kiritng..."
                  />
                  <span
                    className="absolute right-3 cursor-pointer"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </span>
                </div>
              </label>

              <label className="flex w-full flex-col gap-2 items-start">
                <span className="text-sm">Yangi parolni tasdiqlang*</span>
                <div className="relative w-full flex items-center gap-2">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    className="w-full p-[6px] rounded-[6px] placeholder:text-sm outline-none px-2 bg-transparent dark:text-white text-black border dark:border-gray-500"
                    placeholder="Yangi parolni tasdiqlang..."
                  />
                  <span
                    className="absolute right-3 cursor-pointer"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </span>
                </div>
              </label>

              <button
                type="submit"
                className="flex items-center gap-2 mx-auto border dark:border-gray-500 px-6 py-2 text-sm rounded-[6px]"
              >
                Send <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
