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
  Bell,
  Globe,
  Moon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", name: t("profile.personalInfo"), icon: User },
    { id: "settings", name: t("profile.accountSettings"), icon: Settings },
  ];

  // console.log(user?.userTariff);

  const planExpiryDate = new Date(user?.planExpiry || "");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t("common.profile")}
        </h1>
        <p className="text-gray-600">
          Manage your account information and settings
        </p>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
        <div className="p-6">
          {activeTab === "personal" && (
            <div className="space-y-6">
              {/* Profile Info */}
              <div className="flex items-start space-x-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {/* {user?.name?.charAt(0).toUpperCase()} */}
                  </span>
                  <img src={localStorage.getItem("avatar")} alt="" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user?.userTariff}
                      Basic
                    </span>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <User className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t("profile.name")}
                      </p>
                      <p className="text-gray-900 capitalize">{user?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t("profile.email")}
                      </p>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Hash className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t("profile.referralCode")}
                      </p>
                      <p className="text-gray-900 font-mono">
                        {`${import.meta.env.VITE_REFERAL_KEY}/referal/${
                          user.id
                        }`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <CreditCard className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t("profile.currentPlan")}
                      </p>
                      <p className="text-gray-900">{user?.userTariff}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {t("profile.planExpiry")}
                      </p>
                      <p className="text-gray-900">
                        {planExpiryDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Security Settings */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Security
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Key className="text-gray-400" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t("profile.changePassword")}
                          </p>
                          <p className="text-sm text-gray-500">
                            Update your password
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Preferences
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bell className="text-gray-400" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t("profile.notifications")}
                          </p>
                          <p className="text-sm text-gray-500">
                            Manage your notification preferences
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                        Configure
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="text-gray-400" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t("profile.language")}
                          </p>
                          <p className="text-sm text-gray-500">
                            Choose your preferred language
                          </p>
                        </div>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500">
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Moon className="text-gray-400" size={20} />
                        <div>
                          <p className="font-medium text-gray-900">
                            {t("profile.theme")}
                          </p>
                          <p className="text-sm text-gray-500">
                            Switch between light and dark mode
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isDarkMode ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isDarkMode ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
