'use client'
import { featuredProduct } from '@/app/data/products'
import Image from 'next/image'
import { notFound, useRouter, useParams } from 'next/navigation'
import { useState } from 'react'

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [selectedSize, setSelectedSize] = useState('M')
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])

  if (featuredProduct.id !== id) return notFound()

  const basePrice = featuredProduct.basePrices[selectedSize]
  const totalPrice = basePrice + selectedToppings.length * 0.75
  const discountPercent = featuredProduct.originalPrice
    ? Math.round(((featuredProduct.originalPrice - basePrice) / featuredProduct.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    console.log('Added to cart:', {
      productId: featuredProduct.id,
      size: selectedSize,
      toppings: selectedToppings,
      price: totalPrice
    })
    router.push('/cart')
  }

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
          <span className="text-green-600 font-semibold">{featuredProduct.title}</span>
        </nav>
      </div>

      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-3xl p-8 aspect-square shadow-lg">
            <div className="bg-white/30 backdrop-blur-sm rounded-2xl h-full flex items-center justify-center">
              <Image
                src="/images/matchalate.webp"
                alt={featuredProduct.title}
                width={400}
                height={400}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
              {featuredProduct.title}
            </h1>

            <div className="mb-8">
              <span className="text-3xl font-bold text-gray-800">
                ${totalPrice.toFixed(2)}
              </span>

              {featuredProduct.originalPrice && (
                <span className="text-gray-500 ml-2">
                  <span className="line-through">
                    ${featuredProduct.originalPrice.toFixed(2)}
                  </span>
                  {' '} (Save ${(featuredProduct.originalPrice - basePrice).toFixed(2)})
                  {/* 🔥 Thay đổi tại đây: Hiển thị % giảm */}
                  <span className="text-green-600 ml-2 text-sm font-medium">
                    ({discountPercent}% off)
                  </span>
                </span>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Size</h2>
              <div className="flex gap-4">
                {featuredProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-16 h-16 flex items-center justify-center border-2 rounded-xl transition-all
                      ${
                        selectedSize === size
                          ? 'border-green-500 scale-105 bg-green-50 text-gray-950' 
                          : 'border-gray-200 text-gray-500 hover:border-green-300'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Add Toppings (+$0.75 each)</h3>
              <div className="grid grid-cols-1 gap-3">
                {featuredProduct.toppings.map((topping) => (
                  <label
                    key={topping}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-green-300 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedToppings.includes(topping)}
                      onChange={() => handleToppingChange(topping)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-gray-700">{topping}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-green-600 to-cyan-600 text-white py-4 px-8 rounded-xl
                        text-lg font-semibold hover:shadow-lg transition-all hover:scale-[1.02]
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add to Cart ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
