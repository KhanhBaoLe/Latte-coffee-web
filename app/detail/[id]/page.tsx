'use client'
import { useCart } from '@/app/components/CartContext'
import { products } from '@/app/data/products'
import Image from 'next/image'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

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

  const product = products.find(p => p.id === id)
  if (!product) return notFound()

  const basePrice = product.basePrices[selectedSize] ?? 0
  // Ví dụ: mỗi loại milk +0.5, drink +0.5
  const milkPrice = 0.5
  const drinkPrice = 0.5
  const totalPrice =
    basePrice + milkPrice + drinkPrice + selectedToppings.length * 0.75
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

    // Show added message
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-3 text-lg text-gray-600">
          <button
            onClick={() => router.push('/')}
            className="hover:text-green-600 transition-colors font-medium"
          >
            Home
          </button>
          <span className="text-gray-300">›</span>
          <button
            onClick={() => router.push('/coffee')}
            className="hover:text-green-600 transition-colors font-medium"
          >
            Products
          </button>
          <span className="text-gray-300">›</span>
          <span className="text-green-600 font-semibold">{product.title}</span>
        </nav>
      </div>

      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-3xl p-8 aspect-square shadow-lg">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl h-full flex items-center justify-center">
              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
              {product.title}
            </h1>

            <div className="mb-8">
              <span className="text-3xl font-bold text-gray-800">
                ${totalPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-gray-500 ml-2">
                  <span className="line-through">${product.originalPrice.toFixed(2)}</span>
                  {' '}(Save ${(product.originalPrice - basePrice).toFixed(2)})
                  <span className="text-green-600 ml-2 text-sm font-medium">
                    ({discountPercent}% off)
                  </span>
                </span>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Size</h2>
              <div className="flex gap-4">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size as 'S' | 'M' | 'L')}
                    className={`w-16 h-16 flex items-center justify-center border-2 rounded-xl transition-all
                      ${selectedSize === size
                        ? 'border-green-500 scale-105 bg-green-50 text-gray-950'
                        : 'border-gray-200 text-gray-500 hover:border-green-300'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            {/* Milk Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Milk</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.milkOptions.map(milk => (
                  <button
                    key={milk}
                    onClick={() => setSelectedMilk(milk)}
                    className={`
                      flex items-center justify-center p-2 rounded-lg transition 
                      ${selectedMilk === milk
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-green-50'
                      }
                    `}
                  >
                    {milk}
                  </button>
                ))}
              </div>
            </div>


            {/* Drink Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Drink</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {product.drinkOptions.map(drink => (
                  <button
                    key={drink}
                    onClick={() => setSelectedDrink(drink)}
                    className={`
                      flex items-center justify-center p-2 rounded-lg transition 
                      ${selectedDrink === drink
                        ? 'bg-cyan-600 text-white shadow-lg'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-cyan-50'
                      }
                    `}
                  >
                    {drink}
                  </button>
                ))}
              </div>
            </div>


            {/* Toppings Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Add Toppings (+$0.75 each)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.toppings.map(topping => (
                  <label
                    key={topping}
                    className={`
                      flex items-center p-2 rounded-lg border transition 
                      ${selectedToppings.includes(topping)
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-green-500'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedToppings.includes(topping)}
                      onChange={() => handleToppingChange(topping)}
                      className="mr-2 w-4 h-4 text-green-600"
                    />
                    <span className="text-gray-800">{topping}</span>
                  </label>
                ))}
              </div>
            </div>


            <div className="flex flex-col space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-green-600 to-cyan-600 text-white py-4 px-8 rounded-xl
                          text-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02]
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  Add to Cart - ${totalPrice.toFixed(2)}
                </span>
                {showAddedMessage && (
                  <span className="absolute inset-0 flex items-center justify-center bg-green-600 text-white rounded-xl">
                    ✓ Added to Cart
                  </span>
                )}
              </button>

              <button
                onClick={() => router.push('/cart')}
                className="w-full bg-white text-cyan-600 border-2 border-cyan-600 py-4 px-8 rounded-xl
                          text-lg font-semibold hover:bg-cyan-50 transition-all
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
                          flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                View Cart
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}