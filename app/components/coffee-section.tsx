'use client';

import { products } from '@/app/data/products';
import { useRouter } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const CoffeeSection = () => {
    const router = useRouter();

    return (
        <section className="bg-gradient-to-b from-[#F9F6F1] to-[#F5F0E9] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-3">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#795548] to-[#5D4037]">Special Coffees</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#A1887F] to-[#5D4037] mx-auto mb-5 rounded-full"></div>
                    <p className="text-[#5D4037] text-lg max-w-2xl mx-auto">
                        Discover our handcrafted selection of premium coffees, expertly prepared to delight your senses
                    </p>
                </div>

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                    }}
                    spaceBetween={24}
                    slidesPerView={1}
                    speed={600}
                    grabCursor={true}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 }
                    }}
                    className="coffee-swiper relative"
                >
                    {products.map((product) => (
                        <SwiperSlide key={product.id} className="h-auto">
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border border-[#E8D5B5]">
                                <div className="relative p-6">
                                    {product.originalPrice && (
                                        <span className="absolute top-4 right-4 bg-gradient-to-r from-[#D84315] to-[#BF360C] text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                                            SALE
                                        </span>
                                    )}

                                    <div className="bg-gradient-to-br from-[#F5F0E9] to-[#E8D5B5] rounded-xl p-5 aspect-square flex items-center justify-center">
                                        <div className="relative w-full h-full group">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex-1 flex flex-col">
                                        <h2 className="text-xl font-bold mb-2 text-[#3E2723] hover:text-[#5D4037] transition-colors cursor-pointer line-clamp-1">
                                            {product.title}
                                        </h2>

                                        <p className="text-[#5D4037] text-sm mb-4 flex-1 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-2xl font-bold text-[#3E2723] flex items-center">
                                                    {product.price.toLocaleString()}đ
                                                    {product.originalPrice && (
                                                        <span className="text-sm text-[#D84315] font-semibold ml-2 bg-[#FFCCBC] px-2 py-1 rounded-full">
                                                            -{Math.round(100 - (product.price / product.originalPrice * 100))}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => router.push(`/detail/${product.id}`)}
                                                className="w-full py-3.5 bg-gradient-to-r from-[#5D4037] to-[#3E2723] text-white rounded-xl font-bold hover:from-[#4E342E] hover:to-[#3E2723] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    
                    {/* Custom Navigation Buttons */}
                    <div className="swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#F5F0E9] transition-colors">
                        <svg className="w-6 h-6 text-[#5D4037]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </div>
                    <div className="swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12  rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-[#F5F0E9] transition-colors">
                        <svg className="w-6 h-6 text-[#5D4037]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Swiper>
            </div>
        </section>
    );
};

export default CoffeeSection;