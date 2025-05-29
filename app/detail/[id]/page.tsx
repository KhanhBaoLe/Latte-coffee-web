'use client'
import { useCart } from '@/app/components/CartContext'
import { products } from '@/app/data/products'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M')
  const [selectedMilk, setSelectedMilk] = useState<string>('Whole Milk')
  const [selectedDrink, setSelectedDrink] = useState<string>('Hot')
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    setShowImage(true)
  }, [])
  const product = products.find(p => p.id === id)
  if (!product) return notFound()

  // Giá cơ bản dựa trên kích thước
  const basePrice = product.basePrices[selectedSize] ?? 0

  // Phụ thu cho loại sữa (miễn phí cho Whole Milk, +1 cho các loại khác)
  const milkPrice = selectedMilk === 'Whole Milk' ? 0 : 1

  // Phụ thu cho đồ uống lạnh/nóng (miễn phí cho Hot, +1 cho Cold)
  const drinkPrice = selectedDrink === 'Hot' ? 0 : 1

  // Phụ thu cho mỗi topping ($1 mỗi topping)
  const toppingPrice = selectedToppings.length * 1

  // Tính tổng tiền
  const totalPrice = basePrice + milkPrice + drinkPrice + toppingPrice

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - basePrice) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addToCart({
      id: Number(product.id),
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

  const handleToppingChange = (topping: string) => {
    setSelectedToppings(prev =>
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    )
  }

  // Hiệu ứng animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Thanh điều hướng */}
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
            onClick={() => router.push('/coffee')}
            className="hover:text-amber-600 transition-colors font-medium"
          >
            Products
          </button>
          <span className="text-gray-300">›</span>
          <span className="text-amber-600 font-semibold truncate max-w-[180px] md:max-w-none">{product.title}</span>
        </motion.nav>
      </div>

      <section className="container mx-auto p-7 md:p-25">
        {/* Giảm margin top của grid container */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 mt-0 md:mt-0">

          {/* Hình ảnh sản phẩm hình tròn */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex items-start justify-center pt-2 -mt-4"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              {/* Khung hình tròn với gradient */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 shadow-lg"
              />

              {/* Hình ảnh sản phẩm */}
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

              {/* Hiệu ứng bong bóng cafe xung quanh */}
              <motion.div
                className="absolute inset-0 rounded-full border-8 border-amber-100 border-opacity-30"
                animate={{
                  scale: [1, 1.02, 1],
                  borderWidth: ['8px', '12px', '8px'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />

              {/* Nhãn giảm giá */}
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

              {/* Hiệu ứng hạt cafe */}
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

          {/* Thông tin chi tiết */}
          <div className="flex flex-col justify-center">
            <motion.div variants={itemVariants} initial="hidden" animate="visible">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-700 to-amber-900 bg-clip-text text-transparent">
                {product.title}
              </h1>
              <p className="text-gray-600 mb-6 max-w-xl">{product.description || "Experience the rich flavor and aromatic essence of our premium coffee blend."}</p>
            </motion.div>

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

            {/* Kích thước */}
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
                    <span className="text-sm mt-1">${(product.basePrices[size as keyof typeof product.basePrices] || 0).toFixed(2)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Loại sữa */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
                Select Milk
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.milkOptions.map(milk => (
                  <motion.button
                    key={milk}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedMilk(milk)}
                    className={`
                      py-2 px-3 rounded-lg transition 
                      ${selectedMilk === milk
                        ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-md'
                        : 'bg-white border border-amber-200 text-gray-700 hover:bg-amber-50'
                      }
                    `}
                  >
                    {milk}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Loại thức uống */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Select Drink Type
              </h2>
              <div className="flex gap-3">
                {product.drinkOptions.map(drink => (
                  <motion.button
                    key={drink}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => setSelectedDrink(drink)}
                    className={`flex-1 py-3 rounded-lg transition 
                      ${selectedDrink === drink
                        ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-md'
                        : 'bg-white border border-amber-200 text-gray-700 hover:bg-amber-50'
                      }`}
                  >
                    {drink}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Toppings */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Add Toppings (+$0.75 each)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.toppings.map(topping => (
                  <motion.label
                    key={topping}
                    whileHover={{ scale: 1.03 }}
                    className={`
                      flex items-center p-3 rounded-lg border transition cursor-pointer
                      ${selectedToppings.includes(topping)
                        ? 'bg-amber-50 border-amber-500'
                        : 'border-amber-200 hover:border-amber-400'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedToppings.includes(topping)}
                      onChange={() => handleToppingChange(topping)}
                      className="mr-2 w-5 h-5 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-gray-800">{topping}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Nút hành động */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex flex-col space-y-4 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-white py-4 px-8 rounded-xl
                          text-lg font-semibold shadow-lg hover:shadow-xl transition-all
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 relative overflow-hidden"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add to Cart - ${totalPrice.toFixed(2)}
                </span>
                <AnimatePresence>
                  {showAddedMessage && (
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-amber-700 to-amber-900 text-white rounded-xl"
                    >
                      ✓ Added to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/cart')}
                className="w-full bg-white text-amber-700 border-2 border-amber-700 py-4 px-8 rounded-xl
                          text-lg font-semibold hover:bg-amber-50 transition-all
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
                          flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View Cart
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto mt-16 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200"
        >
          <h2 className="text-2xl font-bold mb-6 text-amber-900">About This Coffee</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Sourced from the finest coffee beans, carefully roasted to perfection.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Customizable</h3>
              <p className="text-gray-600">Personalize your drink with various options to suit your taste.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-amber-100 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Customer Favorite</h3>
              <p className="text-gray-600">Rated 4.8/5 by our customers for its rich flavor and aroma.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  )
}