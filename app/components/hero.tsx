'use client';
import { useState, useEffect, useCallback } from 'react';
import { products } from '@/app/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-amber-400">
      {[...Array(Math.floor(rating))].map((_, i) => (
        <svg key={i} className="w-7 h-7 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      {(rating % 1 > 0) && (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 20 20">
          <path d="M10 1L12.39 6.3L18 7.24L14 11.14L15.08 16.02L10 13.3L4.92 16.02L6 11.14L2 7.24L7.61 6.3L10 1Z"/>
        </svg>
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <svg key={i} className="w-7 h-7 text-stone-300" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
};

export default function HeroCarousel() {
  const router = useRouter();
  const featuredProducts = products.slice(0, 3); // Get first 3 products for the carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentProduct = featuredProducts[currentIndex];

  // Calculate discount percentage
  const discountPercent = currentProduct.originalPrice 
    ? Math.round(
        ((currentProduct.originalPrice - currentProduct.price) / 
        currentProduct.originalPrice * 100
      )
    ): 0;

  const handleMainClick = () => router.push(`/detail/${currentProduct.id}`);
  const handleButtonClick = (e: React.MouseEvent) => e.stopPropagation();

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredProducts.length - 1 ? 0 : prevIndex + 1
    );
  }, [featuredProducts.length]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredProducts.length - 1 : prevIndex - 1
    );
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext]);

  // Pause auto-play when user interacts
  const pauseAutoPlay = () => setIsAutoPlaying(false);

  return (
    <section 
      className="bg-gradient-to-br from-emerald-50/80 to-stone-50 min-h-screen py-20 px-4 sm:px-6 lg:px-60   cursor-pointer relative"
      onClick={handleMainClick}
    >
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-50">
        {/* Product Info */}
        <div className="lg:w-4/5 space-y-6 lg:space-y-8">
          <div className="space-y-4">
            <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium">
              Bestseller of the Month ✨
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-stone-900 leading-tight">
              {currentProduct.title.split(' ')[0]}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {currentProduct.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={currentProduct.rating} />
            <span className="text-stone-600 font-medium">
              {currentProduct.rating}/5 ({currentProduct.reviews} reviews)
            </span>
          </div>

          <p className="text-lg text-stone-600 leading-relaxed max-w-xl">
            {currentProduct.description}
          </p>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              ${currentProduct.price.toFixed(2)}
            </span>
            {currentProduct.originalPrice && (
              <>
                <span className="text-stone-500 line-through">${currentProduct.originalPrice.toFixed(2)}</span>
                <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-sm">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <Link 
              href={`/detail/${currentProduct.id}`}
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

        {/* Image with Carousel Controls */}
        <div className="lg:w-3/3 relative h-[500px] sm:h-[600px] w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-stone-100 rounded-3xl shadow-2xl -rotate-3 scale-95"></div>
          <Image
            src={currentProduct.image}
            alt={currentProduct.title}
            fill
            className="object-contain drop-shadow-2xl scale-110"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  pauseAutoPlay();
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-emerald-700 scale-125' 
                    : 'bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>      
      {/* External Navigation Buttons */}
      <div className="absolute top-1/2 -translate-x-50 -translate-y-1/2 w-full max-w-[100rem] mx-auto px-4 flex justify-between z-10 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToPrev();
            pauseAutoPlay();
          }}
          className="pointer-events-auto group relative bg-white/70 hover:bg-emerald-600 text-emerald-800 hover:text-white p-4 sm:p-5 rounded-full shadow-lg hover:shadow-emerald-300/50 transition-all duration-300 backdrop-blur-sm"
          aria-label="Previous product"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-500/10 group-hover:scale-110 transition-transform duration-300"></span>
          <svg 
            className="w-6 h-6 sm:w-7 sm:h-7 transform group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
            pauseAutoPlay();
          }}
          className="pointer-events-auto group relative bg-white/70 hover:bg-emerald-600 text-emerald-800 hover:text-white p-4 sm:p-5 rounded-full shadow-lg hover:shadow-emerald-300/50 transition-all duration-300 backdrop-blur-sm"
          aria-label="Next product"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-500/10 group-hover:scale-110 transition-transform duration-300"></span>
          <svg 
            className="w-6 h-6 sm:w-7 sm:h-7 transform group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}