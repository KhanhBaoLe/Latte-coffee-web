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
      className="bg-gradient-to-br from-[#F9F6F1] to-[#F5F0E9] min-h-screen py-30 px-4 sm:px-6 lg:px-60 cursor-pointer relative"
      onClick={handleMainClick}
    >      <div className="max-w-8xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Info */}
        <div className="space-y-6 lg:space-y-8 lg:max-w-xl">
          <div className="space-y-4">
            <span className="bg-[#E8D5B5] text-[#5D4037] px-4 py-1.5 rounded-full text-sm font-medium inline-block">
              Bestseller of the Month ✨
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#3E2723] leading-tight">
              {currentProduct.title.split(' ')[0]}
              <span className="text-[#795548]">
                {currentProduct.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={currentProduct.rating} />
            <span className="text-[#5D4037] font-medium">
              {currentProduct.rating}/5 ({currentProduct.reviews} reviews)
            </span>
          </div>

          <p className="text-lg text-[#5D4037] leading-relaxed max-w-xl">
            {currentProduct.description}
          </p>

          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-bold text-[#3E2723]">
              ${currentProduct.price.toFixed(2)}
            </span>
            {currentProduct.originalPrice && (
              <>
                <span className="text-[#795548] line-through">${currentProduct.originalPrice.toFixed(2)}</span>
                <span className="bg-[#FFCC80] text-[#5D4037] px-3 py-1 rounded-full text-sm">
                  {discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <Link 
              href={`/detail/${currentProduct.id}`}
              className="inline-flex items-center bg-[#5D4037] hover:bg-[#4E342E] text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#A1887F]/40 gap-2"
              onClick={handleButtonClick}
            >
              <span>Order Now</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>        {/* Image with Carousel Controls */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
            {/* Vòng tròn lớn phía sau */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E9] to-[#E8D5B5] rounded-full shadow-2xl"></div>

            {/* Hình ảnh tròn phía trước */}
            <div className="absolute inset-4 sm:inset-6 lg:inset-8 rounded-full overflow-hidden shadow-lg">
              <Image
                src={currentProduct.image}
                alt={currentProduct.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 320px, (max-width: 1024px) 400px, 500px"
              />            
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-9 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-[#E8D5B5]">
            <div className="flex items-center gap-6">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(index);
                    pauseAutoPlay();
                  }}
                  className={`w-4 h-4 rounded-full transition-all duration-300 relative ${
                    index === currentIndex 
                      ? 'bg-[#5D4037]' 
                      : 'bg-[#D7CCC8] hover:bg-[#BCAAA4]'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {index === currentIndex && (
                    <span className="absolute inset-0 rounded-full bg-[#5D4037]/30 animate-ping"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>        
      {/*  Navigation Buttons */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-30 w-full max-w-[80rem] px-4 flex justify-between z-20">
        <div className="relative left-[-5%] md:left-[-10%]">
          <button
            onClick={(e) => {
              e.stopPropagation();  
              goToPrev();
              pauseAutoPlay();
            }}
            className="pointer-events-auto group relative bg-white/90 hover:bg-[#5D4037] text-[#5D4037] hover:text-white p-4 sm:p-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous product"
          >
            <span className="absolute inset-0 rounded-full bg-[#5D4037]/10 group-hover:scale-110 transition-transform duration-300"></span>
            <svg 
              className="w-6 h-6 sm:w-7 sm:h-7 transform group-hover:scale-110 group-hover:-translate-x-1 transition-all duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="relative right-[-5%] md:right-[-10%]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
              pauseAutoPlay();
            }}
            className="pointer-events-auto group relative bg-white/90 hover:bg-[#5D4037] text-[#5D4037] hover:text-white p-4 sm:p-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
            aria-label="Next product"
          >
            <span className="absolute inset-0 rounded-full bg-[#5D4037]/10 group-hover:scale-110 transition-transform duration-300"></span>
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
      </div>
    </section>
  );
}