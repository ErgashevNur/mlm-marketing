import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Coins,
  CheckCircle,
  ArrowRight,
  Smile,
  Check,
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const { items, removeFromCart } = useCart();
  const { user } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [order, setOrder] = useState(null);
  const [orderModal, setOrderModal] = useState(false);

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const openOrderModal = (userInfo) => {
    setOrder(userInfo);
    setOrderModal(true);
  };

  const ordered = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const obj = {
      productId: order.id,
      contactNumber: formData.get("contactNumber"),
      contactLink: formData.get("contactLink"),
    };

    const token = localStorage.getItem("token");

    try {
      const req = await fetch("https://mlm-backend.pixl.uz/orders-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(obj),
      });

      if (!req.ok) {
        const errorText = await req.text();
        throw new Error(`Xatolik: ${req.status} - ${errorText}`);
      }

      const res = await req.json();
      console.log("Buyurtma muvaffaqiyatli:", res);
      // toast.success("Buyurtma muvaffaqiyatli yuborildi!");
    } catch (error) {
      console.error("Buyurtma xatosi:", error.message);
      // toast.error("Buyurtma yuborishda xatolik: " + error.message);
    } finally {
      setOrderModal(false);
    }
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Cart Items ({items.length})
          </h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white w-full dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6"
              >
                <div className="flex w-full flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full sm:w-20 sm:h-20 h-40 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        ${item.price}
                      </span>
                      <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                        <Coins size={16} className="mr-1" />
                        <span>{item.coinPrice} coins</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-3 text-red-600 border dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() => openOrderModal(item)}
                      className="p-2 text-green-600 flex items-center gap-2 border  dark:text-green-400 hover:bg-green-200 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        <CheckCircle />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {orderModal && (
        <div className="w-[500px] max-h-80 border absolute inset-0 top-60 left-[30%] p-5 rounded-lg dark:bg-slate-800 dark:text-white bg-white">
          <h1 className="flex items-center gap-3 text-2xl mb-5">
            Shaxsingizni tasdiqlang !
          </h1>
          <form onSubmit={ordered}>
            <label className="flex flex-col gap-3 mb-4">
              <span className="font-bold">Contact</span>
              <input
                type="number"
                name="contactNumber"
                className="outline-none px-2 py-2 border rounded-md text-gray-950 dark:bg-transparent dark:text-white"
                placeholder="Telefon raqamingizni kiritng...."
              />
            </label>
            <label className="flex flex-col gap-3">
              <span className="font-bold">Ijtimoiy tarmoq manzilingiz</span>
              <input
                type="text"
                name="contactLink"
                className="outline-none px-2 py-2 border rounded-md text-gray-950 dark:bg-transparent dark:text-white"
                text-black
                placeholder="Ijtimoiy tarmoq manzilingiz...."
              />
            </label>
            <button
              type="submit"
              className="mt-5 flex mx-auto border dark:border-white px-10 py-2 rounded-md"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
