'use client';
import { products } from '@/app/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex text-amber-400">
      {[...Array(Math.floor(rating))].map((_, i) => (
        <svg key={i} className="w-7 h-7 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {(rating % 1 > 0) && (
        <svg className="w-7 h-7 fill-current" viewBox="0 0 20 20">
          <path d="M10 1L12.39 6.3L18 7.24L14 11.14L15.08 16.02L10 13.3L4.92 16.02L6 11.14L2 7.24L7.61 6.3L10 1Z" />
        </svg>
      )}
      {[...Array(5 - Math.ceil(rating))].map((_, i) => (
        <svg key={i} className="w-7 h-7 text-stone-300" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
  // Lấy size mặc định giống trang detail (size đầu tiên nếu có)
  const defaultSize = currentProduct.sizes?.[0] as 'S' | 'M' | 'L';
  const heroBasePrice =
    defaultSize && currentProduct.basePrices?.[defaultSize]
      ? currentProduct.basePrices[defaultSize]
      : currentProduct.price;
  const discountPercent = currentProduct.originalPrice
    ? Math.round(
      ((currentProduct.originalPrice - heroBasePrice) /
        currentProduct.originalPrice * 100
      )
    ) : 0;

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
      className="bg-gradient-to-br from-[#F9F6F1] to-[#F5F0E9] py-6 sm:py-8 md:py-12 lg:py-20 xl:py-15 px-4 sm:px-6 lg:px-20 xl:px-60 cursor-pointer relative"
      onClick={handleMainClick}
    >
      <div className="max-w-[1920px] mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Product Info - Center on mobile/tablet, left on desktop */}
        <div className="w-full space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <span className="bg-[#E8D5B5] text-[#5D4037] px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium inline-block">
              Bestseller of the Month ✨
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#3E2723] leading-tight">
              {currentProduct.title.split(' ')[0]}
              <span className="text-[#795548]">
                {currentProduct.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>
          </div>

          <div className="flex justify-center lg:justify-start items-center gap-2 sm:gap-3">
            <div className="scale-75 sm:scale-90 lg:scale-100 origin-left">
              <StarRating rating={currentProduct.rating} />
            </div>
            <span className="text-sm sm:text-base lg:text-lg text-[#5D4037] font-medium">
              {currentProduct.rating}/5 ({currentProduct.reviews} reviews)
            </span>
          </div>
          <div className="relative">
            <p className="text-sm sm:text-base lg:text-lg text-[#5D4037] leading-relaxed max-w-xl mx-auto lg:mx-0 mb-32">
              {currentProduct.description}
            </p>

            {/* Price and Order Button - Absolute positioned */}
            <div className="absolute -bottom-90 sm:-bottom-115 md:-bottom-115 lg:-bottom-40 left-0 right-0 lg:right-auto space-y-4 sm:space-y-5">
              <div className="flex items-baseline justify-center lg:justify-start gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723]">
                  ${heroBasePrice.toFixed(2)}
                </span>
                {currentProduct.originalPrice && (
                  <>
                    <span className="text-base sm:text-lg lg:text-xl text-[#795548] line-through">
                      ${currentProduct.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-[#FFCC80] text-[#5D4037] px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="flex justify-center lg:justify-start">
                <Link
                  href={`/detail/${currentProduct.id}`}
                  className="inline-flex items-center bg-[#5D4037] hover:bg-[#4E342E] text-white font-semibold py-2.5 sm:py-3 md:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#A1887F]/40 gap-2 text-sm sm:text-base"
                  onClick={handleButtonClick}
                >
                  <span>Order Now</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Image with Carousel Controls */}
        <div className="relative bottom-40 sm:bottom-40 md:bottom-44 lg:bottom-1 lg:-right-0 xl:-right-27 2xl:right-0 flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
          <div className="relative w-[250px] h-[250px] sm:w-[320px] sm:h-[320px] md:w-[320px] md:h-[320px] lg:w-[450px] lg:h-[450px] xl:w-[450px] xl:h-[450px] 2xl:w-[450px] 2xl:h-[450px]">
            {/* Vòng tròn lớn phía sau */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0E9] to-[#E8D5B5] rounded-full shadow-xl md:shadow-2xl"></div>

            {/* Hình ảnh tròn phía trước */}
            <div className="absolute inset-3 sm:inset-4 md:inset-6 lg:inset-8 rounded-full overflow-hidden shadow-md md:shadow-lg">
              <Image
                src={currentProduct.image}
                alt={currentProduct.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 250px, (max-width: 768px) 320px, (max-width: 1024px) 400px, (max-width: 1280px) 450px, 500px"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 sm:bottom-4 md:bottom-5 lg:bottom-1 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full shadow-md md:shadow-lg border border-[#E8D5B5]">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                pauseAutoPlay();
              }}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 relative ${index === currentIndex
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

      {/* Navigation Buttons */}
      <div className="absolute top-1/2  lg:1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90rem] px-4 flex justify-between z-20 pointer-events-none ">
        <div className="pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
              pauseAutoPlay();
            }}
            className="group relative bg-white/90 hover:bg-[#5D4037] text-[#5D4037] hover:text-white p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-full shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous product"
          >
            <span className="absolute inset-0 rounded-full bg-[#5D4037]/10 group-hover:scale-110 transition-transform duration-300"></span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:scale-110 group-hover:-translate-x-0.5 transition-all duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
              pauseAutoPlay();
            }}
            className="group relative bg-white/90 hover:bg-[#5D4037] text-[#5D4037] hover:text-white p-2 sm:p-2.5 md:p-3 lg:p-4 rounded-full shadow-md md:shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            aria-label="Next product"
          >
            <span className="absolute inset-0 rounded-full bg-[#5D4037]/10 group-hover:scale-110 transition-transform duration-300"></span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 transform group-hover:scale-110 group-hover:translate-x-0.5 transition-all duration-300"
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