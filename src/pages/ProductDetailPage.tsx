import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Star, CheckCircle, Headset } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { FaInstagram, FaTelegram } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedTab, setSelectedTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [socials, setSocials] = useState([]);
  const [apiProduct, setApiProduct] = useState<any>(null);

  const product = apiProduct || {};

  const images =
    (apiProduct && Array.isArray(apiProduct.photo_url)
      ? apiProduct.photo_url.map((p: any) => p.photo_url)
      : []) || [];

  const [selectedImage, setSelectedImage] = useState(0);

  const lgn = localStorage.getItem("i18nextLng");

  const translation =
    apiProduct && apiProduct.translations
      ? apiProduct.translations.find((tr: any) => tr.language === lgn) ||
        apiProduct.translations[0] ||
        {}
      : {};

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: apiProduct?.id || product.id,
        name: translation?.name || product.name,
        price: apiProduct?.count || product.price,
        coinPrice: apiProduct?.coin || product.coinPrice,
        image: images[0],
      });
    }
  };

  const tabs = [
    { id: "description", name: t("productsPage.description") },
    { id: "features", name: t("productsPage.features") },
  ];

  // Fetch product from API
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`https://mlm-backend.pixl.uz/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setApiProduct(data);
        }
      } catch (e) {
        toast.error(e.message);
      }
    };
    fetchProduct();
  }, [id]);

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
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link
          to="/dashboard/products"
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <ArrowLeft size={16} className="mr-1" />
          {t("productsPage.backToProducts")}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={translation?.name || product.name || ""}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {t("productsPage.noImage")}
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {translation?.name || product.name || ""}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {translation?.description || product.description || ""}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(apiProduct?.rating ?? product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {apiProduct?.rating}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ({apiProduct?.rewiev ?? product.reviews}{" "}
              {t("productsPage.reviews")})
            </span>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CheckCircle
                className="text-orange-600 dark:text-orange-400"
                size={20}
              />
              <span className="text-gray-700 dark:text-gray-300">
                {t("productsPage.productCount")}: {apiProduct?.count ?? ""}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 mt-1">
                  <img src="/CoinLogo.png" className="w-5 mr-2" />
                  <span className="text-lg font-medium">
                    {apiProduct?.coin ?? product.coinPrice} USDT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("productsPage.instructor")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {translation.usage}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedTab === tab.id
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === "description" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t("productsPage.aboutThisProduct")}
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-100 leading-relaxed">
                    {translation?.description}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t("productsPage.details")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
                  <p className="dark:text-gray-100">
                    {translation.longDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === "features" && (
            <div className="flex flex-col gap-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t("productsPage.features")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p className="dark:text-gray-100">{translation.features}</p>
              </div>

              <div className="pt-5 border-t-2 border-gray-200 dark:border-gray-700 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t("productsPage.usage")}
                </h3>
                <p className="dark:text-gray-100">{translation.usage}</p>
              </div>
            </div>
          )}
        </div>
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

export default ProductDetailPage;
