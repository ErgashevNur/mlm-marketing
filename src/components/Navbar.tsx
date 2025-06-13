import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Globe,
  User,
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  Coins,
  LayoutDashboard,
  Package,
  DollarSign,
  Users,
  CreditCard,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useCart } from "../contexts/CartContext";
import LanguageSelector from "./LanguageSelector";

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { getItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { name: t("common.dashboard"), href: "/dashboard", icon: LayoutDashboard },
    { name: t("common.products"), href: "/dashboard/products", icon: Package },
    { name: t("common.referrals"), href: "/dashboard/referrals", icon: Users },
    { name: t("common.plans"), href: "/dashboard/plans", icon: CreditCard },
    {
      name: t("common.earnings"),
      href: "/dashboard/earnings",
      icon: DollarSign,
    },
    { name: t("common.withdraw"), href: "/dashboard/withdraw", icon: Wallet },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={user ? "/dashboard" : "/"}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Globe className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                MLM PLATFORM
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="mr-2" size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language selector */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {user ? (
              <>
                {/* Coins display */}
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Coins
                    className="text-yellow-600 dark:text-yellow-400"
                    size={16}
                  />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    {user?.coin?.toLocaleString()}
                  </span>
                </div>

                {/* Cart */}
                <Link
                  to="/dashboard/checkout"
                  className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ShoppingCart className="dark:text-slate-200" size={20} />
                  {getItemCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getItemCount()}
                    </span>
                  )}
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {/* <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span> */}
                    <ChevronDown
                      className={`transform transition-transform dark:text-slate-200 ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                      size={16}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="mr-2" size={16} />
                        {t("common.profile")}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="mr-2" size={16} />
                        {t("common.logout")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {t("common.login")}
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {t("auth.signUp")}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user &&
              navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="mr-3" size={20} />
                    {item.name}
                  </Link>
                );
              })}

            {/* Mobile language selector */}
            <div className="px-3 py-2">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
