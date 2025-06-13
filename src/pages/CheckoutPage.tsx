import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Coins,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalCoinPrice,
  } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "coins">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  const totalPrice = getTotalPrice();
  const totalCoinPrice = getTotalCoinPrice();
  const canPayWithCoins = user && user.coins >= totalCoinPrice;

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle
              className="text-green-600 dark:text-green-400"
              size={32}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Order Complete!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your purchase. You'll receive an email confirmation
            shortly.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard/products")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Continue Shopping
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some products to your cart to get started.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard/products")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Browse Products
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Checkout
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review your items and complete your purchase
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cart Items ({items.length})
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${item.price}
                      </span>
                      <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                        <Coins size={16} className="mr-1" />
                        <span>{item.coinPrice} coins</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center text-gray-900 dark:text-white font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  ${(totalPrice * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${(totalPrice * 1.1).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Or pay with coins:
                  </span>
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <Coins size={16} className="mr-1" />
                    <span className="font-medium">{totalCoinPrice} coins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Coins Display */}
          {user && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-4">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                  Your Coins
                </span>
                <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                  <Coins size={20} className="mr-2" />
                  <span className="text-lg font-bold">
                    {user.coins.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="w-full flex items-center justify-center px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                Complete Purchase
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
