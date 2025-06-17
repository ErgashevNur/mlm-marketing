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
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner";
import { validation } from "../validation";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  // const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("personal");

  // const [showOld, setShowOld] = useState(false);
  // const [showNew, setShowNew] = useState(false);
  // const [showConfirm, setShowConfirm] = useState(false);

  const [copied, setCopied] = useState(false);
  const [isModal, setISModal] = useState(false);

  const handleCopy = (id: any) => {
    const link = `${import.meta.env.VITE_REFERAL_KEY}/referal/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link nusxalandi!");
    setTimeout(() => setCopied(false), 2000);
  };

  const changePassword = async (e: any) => {
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
      console.log(obj);
    }
  };

  const tabs = [
    { id: "personal", name: t("profile.personalInfo"), icon: User },
    { id: "settings", name: t("profile.accountSettings"), icon: Settings },
  ];

  return (
    <div className="space-y-6 px-4 md:px-8">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-500 border-gray-100 p-6">
        <h1 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">
          {t("common.profile")}
        </h1>
        <p className="text-gray-600 dark:text-gray-100">
          Manage your account information and settings
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border dark:border-gray-500 border-gray-100">
        <nav className="flex flex-wrap sm:space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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

        <div className="p-6">
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br border-2 from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                  <img src={localStorage.getItem("avatar")} alt="" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl dark:text-gray-200 font-semibold text-gray-900 capitalize">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 text-sm dark:text-gray-200">
                    {user?.email}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium dark:bg-gray-800/65 bg-blue-100 text-blue-400 border-[0.5px]">
                      {user?.userTariff?.name || "Basic"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col sm:flex-row border border-gray-600 items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <User className="text-gray-400 dark:text-white" size={20} />
                  <div>
                    <p className="text-sm font-medium dark:text-white text-gray-500">
                      {t("profile.name")}
                    </p>
                    <p className="text-gray-900 dark:text-white capitalize">
                      {user?.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row border border-gray-600 items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <Mail className="text-gray-400 dark:text-white" size={20} />
                  <div>
                    <p className="text-sm font-medium dark:text-white text-gray-500">
                      {t("profile.email")}
                    </p>
                    <p className="text-gray-900 dark:text-white break-all">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="relative flex flex-col sm:flex-row border border-gray-600 items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <Hash className="text-gray-400 dark:text-white" size={20} />
                  <div className="flex flex-col w-full">
                    <p className="text-[15px] font-medium dark:text-gray-100 text-gray-500 mb-1 sm:mb-0">
                      {t("profile.referralCode")}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                      <p className="text-gray-900 text-xs dark:text-white font-mono break-all">
                        {`${import.meta.env.VITE_REFERAL_KEY}/referal/${
                          user?.id
                        }`}
                      </p>
                      <button
                        onClick={() => handleCopy(user.id)}
                        className="text-blue-600 text-sm hover:underline flex items-center gap-1"
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
                <div className="flex flex-col sm:flex-row border border-gray-600 items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <CreditCard
                    className="text-gray-400 dark:text-white"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium dark:text-white text-gray-500">
                      {t("profile.currentPlan")}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {user?.userTariff?.name || "Basic"}
                    </p>
                  </div>
                </div>

                {/* Plan Expiry */}
                <div className="flex flex-col sm:flex-row border border-gray-600 items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-4 dark:bg-gray-800/65 bg-gray-50 rounded-lg">
                  <Calendar
                    className="text-gray-400 dark:text-white"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-medium dark:text-white text-gray-500">
                      {t("profile.planExpiry")}
                    </p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(user?.createdAt).toISOString().split("T")[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
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
                        onClick={() => setISModal(true)}
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

      {/* Change Password Modal */}
      {isModal && (
        <div className="w-full h-screen fixed top-0 backdrop-blur left-0 flex items-center justify-center bg-white/70 z-50 dark:bg-gray-900/0 dark:text-white px-4">
          <div className="w-full max-w-md border dark:border-gray-500 rounded-md bg-white dark:bg-gray-800 p-5">
            <h1 className="text-xl font-semibold flex items-center justify-between mb-5">
              Change your password
              <X onClick={() => setISModal(false)} className="cursor-pointer" />
            </h1>
            <form
              onSubmit={changePassword}
              className="flex flex-col gap-4 items-start"
            >
              {/* password inputs (o'zingiz joylashtirasiz) */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
