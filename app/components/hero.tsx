// components/Hero.tsx
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-emerald-50/80 to-stone-50 min-h-screen py-15 px-30 ">
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="lg:w-4/5 space-y-8 space-x-20">
          <div className="space-y-4">
            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Bestseller of the Month ✨
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-stone-900 leading-tight">
              Midnight 
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Matchalatte
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex text-amber-400">
              {[...Array(4)].map((_, i) => (
                <svg key={i} className="w-7 h-7 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              <svg className="w-7 h-7 text-stone-300" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span className="text-stone-600 font-medium">4.8/5 (128 reviews)</span>
          </div>

          <p className="text-lg text-stone-600 leading-relaxed max-w-xl">
            Experience the ceremonial-grade matcha blended with creamy oat milk and a touch of honey. 
            Crafted to perfection for your midnight cravings.
          </p>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              $7.50
            </span>
            <span className="text-stone-500 line-through">$9.00</span>
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm">
              17% OFF
            </span>
          </div>

          <div className="flex gap-4">
            <Link 
              href="/shop/matchalatte" 
              className="inline-flex items-center bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-emerald-300/40 gap-2"
            >
              <span>Order Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Center Image */}
        <div className="lg:w-3/3 relative h-[600px] w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-stone-100 rounded-3xl shadow-2xl -rotate-3 scale-95"></div>
          <Image
            src="/images/matchalate.webp"
            alt="Midnight Matchalatte"
            fill
            className="object-contain drop-shadow-2xl scale-110"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Right Content */}
        {/* <div className="lg:w-3/4 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
            <h3 className="text-2xl font-bold text-stone-900 mb-6">Customization</h3>
            
            <div className="space-y-8"> */}
              {/* Size Selection */}
              {/* <div>
                <h4 className="text-sm font-semibold text-stone-500 mb-4">SELECT SIZE</h4>
                <div className="grid grid-cols-2 gap-3">
                  {['S (12oz)', 'M (16oz)', 'L (20oz)', 'XL (24oz)'].map((size) => (
                    <button
                      key={size}
                      className={`p-4 text-center rounded-xl border-2 transition-all ${
                        size.includes('M') 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold shadow-md' 
                        : 'border-stone-200 hover:border-emerald-400 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div> */}

              {/* Toppings Selection */}
              {/* <div>
                <h4 className="text-sm font-semibold text-stone-500 mb-4">ADD TOPPINGS (+$0.75)</h4>
                <div className="grid grid-cols-1 gap-3">
                  {['Whipped Cream', 'Caramel Drizzle', 'Vanilla Foam', 'Chocolate Shavings'].map((topping) => (
                    <label 
                      key={topping}
                      className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-emerald-400 transition-colors cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500" 
                      />
                      <span className="text-stone-700">{topping}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          {/* Special Offer */}
          {/* <div className="bg-gradient-to-br from-emerald-700 to-teal-600 p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-white">Limited Offer!</h4>
                <p className="text-sm text-white/90">Free premium topping with XL size orders</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}