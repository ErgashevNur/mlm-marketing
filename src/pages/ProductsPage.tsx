import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Star, Coins, ShoppingCart, Eye } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  // const products = [
  //   {
  //     id: "1",
  //     name: "Digital Marketing Masterclass",
  //     description:
  //       "Complete course on digital marketing strategies and techniques",
  //     price: 99.99,
  //     coinPrice: 2000,
  //     image:
  //       "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400",
  //     category: "courses",
  //     rating: 4.8,
  //     reviews: 156,
  //     featured: true,
  //   },
  //   {
  //     id: "2",
  //     name: "Social Media Templates Pack",
  //     description:
  //       "Professional templates for Instagram, Facebook, and Twitter",
  //     price: 29.99,
  //     coinPrice: 600,
  //     image:
  //       "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400",
  //     category: "templates",
  //     rating: 4.6,
  //     reviews: 89,
  //     featured: false,
  //   },
  //   {
  //     id: "3",
  //     name: "SEO Optimization Tool",
  //     description: "Advanced tool for website SEO analysis and optimization",
  //     price: 149.99,
  //     coinPrice: 3000,
  //     image:
  //       "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=400",
  //     category: "tools",
  //     rating: 4.9,
  //     reviews: 234,
  //     featured: true,
  //   },
  //   {
  //     id: "4",
  //     name: "Email Marketing Guide",
  //     description: "Comprehensive guide to effective email marketing campaigns",
  //     price: 39.99,
  //     coinPrice: 800,
  //     image:
  //       "https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400",
  //     category: "digital",
  //     rating: 4.7,
  //     reviews: 112,
  //     featured: false,
  //   },
  //   {
  //     id: "5",
  //     name: "Brand Identity Package",
  //     description: "Complete brand identity design service for your business",
  //     price: 299.99,
  //     coinPrice: 6000,
  //     image:
  //       "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
  //     category: "services",
  //     rating: 4.9,
  //     reviews: 67,
  //     featured: true,
  //   },
  //   {
  //     id: "6",
  //     name: "Content Creation Toolkit",
  //     description: "Essential tools and resources for content creators",
  //     price: 79.99,
  //     coinPrice: 1600,
  //     image:
  //       "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400",
  //     category: "tools",
  //     rating: 4.5,
  //     reviews: 198,
  //     featured: false,
  //   },
  // ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://mlm-backend.pixl.uz/products");
        const data = await res.json();
        setProducts(data); // Agar data massiv bo'lsa
      } catch (error) {
        console.error("Mahsulotlarni olishda xatolik:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      coinPrice: product.coinPrice,
      image: product.image,
    });
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

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
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
        </div>
      </div>

      {/* All Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          All Products ({filteredProducts.length})
        </h2>

        {filteredProducts.length === 0 ? (
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
                    src={product.image}
                    alt={product.name}
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
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="text-md font-bold text-gray-900 dark:text-white">
                      ${product.price}
                    </div>
                    <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                      <Coins size={14} className="mr-1" />
                      <span className="text-xs">{product.coinPrice} coins</span>
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
