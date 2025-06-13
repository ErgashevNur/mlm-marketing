import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Star, 
  Coins, 
  ShoppingCart, 
  Heart, 
  Share2,
  CheckCircle,
  Clock,
  Users,
  Award
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedTab, setSelectedTab] = useState('description');
  const [quantity, setQuantity] = useState(1);

  // Mock product data - in real app, fetch based on id
  const product = {
    id: id || '1',
    name: 'Digital Marketing Masterclass',
    description: 'Complete course on digital marketing strategies and techniques that will help you grow your business and increase your online presence.',
    fullDescription: `This comprehensive Digital Marketing Masterclass is designed for entrepreneurs, business owners, and marketing professionals who want to master the art of digital marketing. 

    The course covers everything from the fundamentals of digital marketing to advanced strategies used by industry leaders. You'll learn how to create effective marketing campaigns, optimize your online presence, and drive real results for your business.

    What makes this course special is its practical approach - every lesson includes real-world examples and actionable strategies you can implement immediately.`,
    price: 99.99,
    coinPrice: 2000,
    images: [
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'courses',
    rating: 4.8,
    reviews: 156,
    featured: true,
    instructor: 'Sarah Johnson',
    duration: '12 hours',
    lessons: 45,
    students: 2847,
    features: [
      'Lifetime access to course materials',
      'Certificate of completion',
      'Direct access to instructor',
      '30-day money-back guarantee',
      'Mobile and desktop access',
      'Downloadable resources'
    ],
    whatYouLearn: [
      'Master the fundamentals of digital marketing',
      'Create effective social media campaigns',
      'Understand SEO and content marketing',
      'Build and optimize landing pages',
      'Analyze marketing metrics and ROI',
      'Develop a comprehensive marketing strategy'
    ]
  };

  const [selectedImage, setSelectedImage] = useState(0);

  const reviews = [
    {
      id: 1,
      user: 'John Smith',
      rating: 5,
      comment: 'Excellent course! Very comprehensive and practical. I was able to implement the strategies immediately.',
      date: '2024-01-15'
    },
    {
      id: 2,
      user: 'Maria Garcia',
      rating: 5,
      comment: 'The best digital marketing course I\'ve taken. Sarah explains everything clearly and provides great examples.',
      date: '2024-01-10'
    },
    {
      id: 3,
      user: 'David Chen',
      rating: 4,
      comment: 'Great content and well-structured. Would recommend to anyone starting in digital marketing.',
      date: '2024-01-08'
    }
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        coinPrice: product.coinPrice,
        image: product.images[0]
      });
    }
  };

  const tabs = [
    { id: 'description', name: 'Description' },
    { id: 'features', name: 'Features' },
    { id: 'reviews', name: `Reviews (${product.reviews})` }
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm">
        <Link 
          to="/dashboard/products" 
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex space-x-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-blue-500'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              {product.rating}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="text-blue-600 dark:text-blue-400" size={20} />
              <span className="text-gray-700 dark:text-gray-300">{product.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="text-green-600 dark:text-green-400" size={20} />
              <span className="text-gray-700 dark:text-gray-300">{product.students} students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="text-purple-600 dark:text-purple-400" size={20} />
              <span className="text-gray-700 dark:text-gray-300">{product.lessons} lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-orange-600 dark:text-orange-400" size={20} />
              <span className="text-gray-700 dark:text-gray-300">Certificate included</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </div>
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 mt-1">
                  <Coins size={20} className="mr-2" />
                  <span className="text-lg font-medium">{product.coinPrice} coins</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Heart size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-gray-700 dark:text-gray-300">Quantity:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-gray-900 dark:text-white font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
          </div>

          {/* Instructor */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Instructor
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {product.instructor} - Digital Marketing Expert with 10+ years of experience
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
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'description' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About This Course
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {product.fullDescription}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  What You'll Learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.whatYouLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-gray-600 dark:text-gray-400">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'features' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Course Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Customer Reviews
              </h3>
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {review.user.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {review.user}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;