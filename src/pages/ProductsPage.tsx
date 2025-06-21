import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Coins, ShoppingCart, Eye, Headset } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { FaInstagram, FaTelegram } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [order, setOrder] = useState(null);
  const [orderModal, setOrderModal] = useState(false);
  const [socials, setSocials] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://mlm-backend.pixl.uz/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Mahsulotlarni olishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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

      await req.json();
      toast.success("Buyurtma muvaffaqiyatli yuborildi!");
    } catch (error) {
      toast.error("Buyurtma yuborishda xatolik: " + error.message);
    } finally {
      setOrderModal(false);
    }
  };

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.translations?.[0]?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.translations?.[0]?.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all";
    return matchesSearch && matchesCategory;
  });

  const openOrderModal = (userInfo) => {
    setOrder(userInfo);
    setOrderModal(true);
  };

  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, idx) => (
      <div
        key={idx}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse"
      >
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
          <div className="flex gap-2 mt-4">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          </div>
        </div>
      </div>
    ));
  };

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("productsPage.product")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t("productsPage.discover")}
        </p>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("productsPage.searchPlaceholder")}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* All Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          AllProducts ({filteredProducts.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {renderSkeletons()}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t("productsPage.noProducts")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("productsPage.tryAdjusting")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={
                      product.photo_url?.[0]?.photo_url ||
                      "https://via.placeholder.com/400x200"
                    }
                    alt={product.translations?.[0]?.name}
                    className="w-full h-40 object-cover"
                  />
                  {product.featured && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                        {t("productsPage.featured")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {product.translations?.[0]?.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.translations?.[0]?.description}
                  </p>

                  <div className="mb-3">
                    <div className="flex gap-2c items-center text-yellow-600 dark:text-yellow-400">
                      <img
                        width={15}
                        height={15}
                        src={import.meta.env.VITE_LOGO}
                        alt=""
                      />
                      <span className="text-xs">
                        {product.coin} <span className="text-[9px]">USDT</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/products/${product.id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Eye size={14} className="mr-1" />
                      view
                    </Link>
                    <Link
                      // to="/dashboard/checkout"
                      onClick={() => {
                        openOrderModal(product);
                      }}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      buy
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {orderModal && (
          <div className="w-[420px] h-[350px] border border-gray-200 dark:border-gray-700 absolute inset-0 top-60 left-1/2 -translate-x-1/2 p-6 rounded-2xl shadow-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
            <h1 className="flex items-center gap-3 text-2xl font-semibold mb-6">
              Shaxsingizni tasdiqlang!
            </h1>
            <form onSubmit={ordered} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label className="font-medium">Telefon raqamingiz</label>
                <input
                  type="number"
                  name="contactNumber"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Telefon raqamingizni kiriting..."
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-medium">
                  Ijtimoiy tarmoq manzilingiz
                </label>
                <input
                  type="text"
                  name="contactLink"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Manzilingizni kiriting..."
                  required
                />
              </div>
              <div className="pt-4 flex items-center w-full gap-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-lg shadow-sm"
                >
                  Yuborish
                </button>
                <button
                  type="submit"
                  onClick={() => setOrderModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded-lg shadow-sm"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

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

export default ProductsPage;
