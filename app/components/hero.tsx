'use client';
// components/Hero.tsx
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()
  const productId = "midnight-matchalotte" // Unique product identifier

  // Handle main content click
  const handleMainClick = () => {
    router.push(`/detail/${productId}`);
  }

  // Prevent button click from bubbling to main content
  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <section 
      className="bg-gradient-to-br from-emerald-50/80 to-stone-50 min-h-screen py-15 px-30 cursor-pointer"
      onClick={handleMainClick}
    >
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
              href={`/detail/${productId}`} // Đã sửa đường dẫn
              className="inline-flex items-center bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-800 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-emerald-300/40 gap-2"
              onClick={handleButtonClick}
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
      </div>
    </section>
  )
}