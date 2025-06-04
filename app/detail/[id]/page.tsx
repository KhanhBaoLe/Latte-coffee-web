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
  const id = params?.id

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
        const res = await fetch(`/api/products/${id}`);
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

    if (id) {
      fetchProduct();
    }
  }, [id]);

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
      id: id as string,
      name: product.title,
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
            onClick={() => router.push('/')}
            className="flex items-center hover:text-amber-600 transition-colors font-medium group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Home
          </button>
          <span className="text-gray-300">›</span>
          <button
            onClick={() => router.push('/menu')}
            className="hover:text-amber-600 transition-colors font-medium"
          >
            Menu
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
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600">Prep time: 5 min</span>
                </div>
              </div>
            </motion.div>

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                  Select Size
                </h2>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size as 'S' | 'M' | 'L')}
                      className={`flex-1 py-3 flex flex-col items-center justify-center rounded-xl transition-all
                        ${selectedSize === size
                          ? 'bg-amber-100 border-2 border-amber-500 text-amber-800 font-bold shadow-md'
                          : 'bg-white border border-amber-200 text-gray-600 hover:bg-amber-50'
                        }`}
                    >
                      <span className="text-lg">{size}</span>
                      <span className="text-sm mt-1">
                        ${(product.basePrices?.[size as 'S' | 'M' | 'L'] || product.price).toFixed(2)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Milk options */}
            {product.milkOptions && product.milkOptions.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                  </svg>
                  Select Milk
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.milkOptions.map(milk => (
                    <motion.button
                      key={milk}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMilk(milk)}
                      className={`py-3 px-4 rounded-xl text-left transition-all
                        ${selectedMilk === milk
                          ? 'bg-amber-100 border-2 border-amber-500 text-amber-800 font-bold shadow-md'
                          : 'bg-white border border-amber-200 text-gray-600 hover:bg-amber-50'
                        }`}
                    >
                      {milk}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Drink options */}
            {product.drinkOptions && product.drinkOptions.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Drink Type
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.drinkOptions.map(drink => (
                    <motion.button
                      key={drink}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDrink(drink)}
                      className={`py-3 px-4 rounded-xl text-left transition-all
                        ${selectedDrink === drink
                          ? 'bg-amber-100 border-2 border-amber-500 text-amber-800 font-bold shadow-md'
                          : 'bg-white border border-amber-200 text-gray-600 hover:bg-amber-50'
                        }`}
                    >
                      {drink}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Toppings */}
            {product.toppingOptions && product.toppingOptions.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Toppings
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.toppingOptions.map(topping => (
                    <motion.button
                      key={topping}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleToppingChange(topping)}
                      className={`py-3 px-4 rounded-xl text-left transition-all
                        ${selectedToppings.includes(topping)
                          ? 'bg-amber-100 border-2 border-amber-500 text-amber-800 font-bold shadow-md'
                          : 'bg-white border border-amber-200 text-gray-600 hover:bg-amber-50'
                        }`}
                    >
                      {topping}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Add to cart button */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-700 text-white font-bold rounded-xl shadow-lg 
                  hover:from-amber-600 hover:to-amber-800 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Add to Cart</span>
              </motion.button>
            </motion.div>

            {/* Added to cart message */}
            <AnimatePresence>
              {showAddedMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-4 p-4 bg-green-100 text-green-800 rounded-xl text-center font-semibold"
                >
                  Added to cart successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}