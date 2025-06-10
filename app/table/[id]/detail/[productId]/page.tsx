'use client'
import { useCart } from '@/app/components/CartContext'
import { Product } from '@/app/types'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params?.productId // Changed from id to productId

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M');
  const [selectedMilk, setSelectedMilk] = useState<string>('Whole Milk');
  const [selectedDrink, setSelectedDrink] = useState<string>('Hot');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`); // Changed from id to productId
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch product');
        }

        const data = await res.json();
        setProduct(data);

        // Set default values from product data
        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0] as 'S' | 'M' | 'L');
        }
        if (data.milkOptions?.length > 0) {
          setSelectedMilk(data.milkOptions[0]);
        }
        if (data.drinkOptions?.length > 0) {
          setSelectedDrink(data.drinkOptions[0]);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (productId) { // Changed from id to productId
      fetchProduct();
    }
  }, [productId]); // Changed from id to productId

  useEffect(() => {
    setShowImage(true);
  }, []);

  const handleToppingChange = (topping: string) => {
    setSelectedToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#795548]"></div>
      </div>
    );
  }
  if (!product) return notFound();

  // Calculate base price according to size
  let basePrice = product.price; // Default price
  if (selectedSize && product.basePrices?.[selectedSize]) {
    basePrice = product.basePrices[selectedSize];
  }

  // Calculate additional costs for milk options
  const milkPrice = selectedMilk && selectedMilk !== 'None' && selectedMilk !== 'Whole Milk' ? 2 : 0;

  // Calculate additional costs for drink type
  const drinkPrice = selectedDrink && selectedDrink !== 'Hot' ? 1.5 : 0;

  // Calculate topping costs ($0.75 per topping)
  const toppingPrice = selectedToppings.length * 0.75;

  // Calculate total price
  const totalPrice = basePrice + milkPrice + drinkPrice + toppingPrice;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - basePrice) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      id: productId as string, // Changed from id to productId
      title: product.title,
      price: totalPrice,
      quantity: 1,
      size: selectedSize,
      milk: selectedMilk,
      drink: selectedDrink,
      toppings: selectedToppings,
      image: product.image
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-3 text-lg text-gray-600"
        >
          <button
            onClick={() => router.push(`/table/${params.id}`)}
            className="flex items-center hover:text-amber-600 transition-colors font-medium group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Table
          </button>
          <span className="text-gray-300">›</span>
          <span className="text-amber-600 font-semibold truncate max-w-[180px] md:max-w-none">{product.title}</span>
        </motion.nav>
      </div>

      <section className="container mx-auto p-7 md:p-25">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 mt-0 md:mt-0">
          {/* Product image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-start justify-center pt-2 -mt-4"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-lg"
              />

              <motion.div
                className="absolute inset-4 rounded-full overflow-hidden bg-white"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  width={500}
                  height={500}
                  className={`object-cover w-full h-full transition-opacity duration-700 ${showImage ? 'opacity-100' : 'opacity-0'}`}
                  priority
                />
              </motion.div>

              {/* Discount label */}
              {discountPercent > 0 && (
                <motion.div
                  className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold py-2 px-4 rounded-full shadow-lg z-10"
                  animate={{
                    rotate: [0, 5, 0, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  Save {discountPercent}%
                </motion.div>
              )}

              {/* Coffee beans effect */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-amber-800 opacity-50"
                  style={{
                    top: `${Math.sin(i * 0.785) * 70 + 50}%`,
                    left: `${Math.cos(i * 0.785) * 70 + 50}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Product details */}
          <div className="flex flex-col justify-center">
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                {product.title}
              </h1>
              <p className="text-gray-600 mb-6 max-w-xl">{product.description || "Experience the rich flavor and aromatic essence of our premium coffee blend."}</p>
            </motion.div>

            {/* Price section */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8 bg-amber-50 p-5 rounded-xl border border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-amber-800">
                    ${totalPrice.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-500 ml-2">
                      <span className="line-through">${product.originalPrice.toFixed(2)}</span>
                    </span>
                  )}
                </div>

                <div className="text-amber-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Prep time: {product.prepTime || '5 min'}
                </div>
              </div>
            </motion.div>

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01.293.707V19a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 2V4h18v2H3zm0 2h18v11a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" />
                  </svg>
                  Select Size
                </h2>
                <div className="grid grid-cols-3 gap-3 max-w-sm">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200
                        ${selectedSize === size
                          ? 'bg-amber-600 text-white shadow-md transform scale-105'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-400'
                        }`}
                      onClick={() => setSelectedSize(size as 'S' | 'M' | 'L')}
                    >
                      {size}
                      <span className="block text-sm mt-1">
                        ${product.basePrices?.[size as 'S' | 'M' | 'L']?.toFixed(2) || product.price.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Milk selection */}
            {product.milkOptions && product.milkOptions.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V7a2 2 0 00-2-2h-2V3a1 1 0 00-1-1H8a1 1 0 00-1 1v2H5a2 2 0 00-2 2v11a2 2 0 002 2h2m4-14v11a1 1 0 001 1h2a1 1 0 001-1V6m-7 0h8" />
                  </svg>
                  Select Milk
                </h2>
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {product.milkOptions.map(milk => (
                    <button
                      key={milk}
                      className={`py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200
                        ${selectedMilk === milk
                          ? 'bg-amber-600 text-white shadow-md transform scale-105'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-400'
                        }`}
                      onClick={() => setSelectedMilk(milk)}
                    >
                      {milk}
                      {milk !== 'Whole Milk' && <span className="block text-sm mt-1">+ $2.00</span>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Drink options */}
            {product.drinkOptions && product.drinkOptions.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Select Type
                </h2>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {product.drinkOptions.map(drink => (
                    <button
                      key={drink}
                      className={`py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200
                        ${selectedDrink === drink
                          ? 'bg-amber-600 text-white shadow-md transform scale-105'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-400'
                        }`}
                      onClick={() => setSelectedDrink(drink)}
                    >
                      {drink}
                      {drink !== 'Hot' && <span className="block text-sm mt-1">+ $1.50</span>}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Toppings selection */}
            {product.toppings && product.toppings.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add-ons
                </h2>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {product.toppings.map(topping => (
                    <button
                      key={topping}
                      className={`py-3 px-4 rounded-xl text-lg font-medium transition-all duration-200 flex justify-between items-center
                        ${selectedToppings.includes(topping)
                          ? 'bg-green-600 text-white shadow-md transform scale-105'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-green-400'
                        }`}
                      onClick={() => handleToppingChange(topping)}
                    >
                      <span>{topping}</span>
                      <span className="block text-sm">+ $0.75</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Add to cart button */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-700 text-white text-xl font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>

              <AnimatePresence>
                {showAddedMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-3 bg-green-500 text-white rounded-lg text-center font-semibold shadow-md"
                  >
                    Product added to cart!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
} 