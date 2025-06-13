import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Coins, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.translations?.[0]?.name || "Unnamed Product",
      price: product.coin,
      coinPrice: product.coin,
      image: product.photo_url?.[0] || null,
    });
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t("common.products")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover premium products and services to boost your marketing success
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
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* All Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          All Products ({filteredProducts.length})
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
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
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
                        Featured
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
                    <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                      <Coins size={14} className="mr-1" />
                      <span className="text-xs">{product.coin} coins</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/products/${product.id}`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
