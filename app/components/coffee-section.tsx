'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isInCategory } from '@/app/data/categories';
// import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    sizes: string[];
    milkOptions: string[];
    drinkOptions: string[];
    toppings: string[];
}

const CoffeeSection = () => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => isInCategory(product.id, selectedCategory));

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#795548]"></div>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-b from-[#F9F6F1] to-[#F5F0E9] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto relative">                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-3">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#795548] to-[#5D4037]">Special Menu</span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#A1887F] to-[#5D4037] mx-auto mb-5 rounded-full"></div>
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 
                                ${selectedCategory === 'all' 
                                    ? 'bg-[#5D4037] text-white' 
                                    : 'bg-white text-[#5D4037] hover:bg-[#5D4037] hover:text-white'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setSelectedCategory('coffee')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 
                                ${selectedCategory === 'coffee' 
                                    ? 'bg-[#5D4037] text-white' 
                                    : 'bg-white text-[#5D4037] hover:bg-[#5D4037] hover:text-white'}`}
                        >
                            Coffee
                        </button>
                        <button
                            onClick={() => setSelectedCategory('milk-tea')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 
                                ${selectedCategory === 'milk-tea' 
                                    ? 'bg-[#5D4037] text-white' 
                                    : 'bg-white text-[#5D4037] hover:bg-[#5D4037] hover:text-white'}`}
                        >
                            Milk Tea
                        </button>
                        <button
                            onClick={() => setSelectedCategory('matcha')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 
                                ${selectedCategory === 'matcha' 
                                    ? 'bg-[#5D4037] text-white' 
                                    : 'bg-white text-[#5D4037] hover:bg-[#5D4037] hover:text-white'}`}
                        >
                            Matcha
                        </button>
                        <button
                            onClick={() => setSelectedCategory('fruit-tea')}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 
                                ${selectedCategory === 'fruit-tea' 
                                    ? 'bg-[#5D4037] text-white' 
                                    : 'bg-white text-[#5D4037] hover:bg-[#5D4037] hover:text-white'}`}
                        >
                            Fruit Tea
                        </button>
                    </div>
                    <p className="text-[#5D4037] text-lg max-w-2xl mx-auto">
                        Discover our handcrafted selection of premium coffees, expertly prepared to delight your senses
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="coffee-swiper-prev absolute left-[-3%] sm:left-[-3%] md:left-[-3%] lg:left-[-3%] xl:left-[-3%] 2xl:left-[-6%] top-[55%] translate-y-2/8 z-20">
                    <button
                        className="pointer-events-auto group relative bg-white/90 hover:bg-[#5D4037] text-[#5D4037] hover:text-white p-4 sm:p-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                        aria-label="Previous slide"
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
                
                <div className="coffee-swiper-next absolute right-[-3%] sm:right-[-3%] md:right-[-3%] lg:right-[-3%] xl:right-[-3%] 2xl:right-[-6%] top-[55%] translate-y-2/8 z-20">
                    <button
                        className="pointer-events-auto group relative bg-white/90 hover:bg-[#5D4037] text-[#5D4037] hover:text-white p-4 sm:p-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
                        aria-label="Next slide"
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

                <Swiper
                    modules={[Navigation]}
                    navigation={{
                        prevEl: '.coffee-swiper-prev',
                        nextEl: '.coffee-swiper-next',
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
                    {filteredProducts.map((product) => (
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
                                                    ${product.price.toLocaleString()}
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
                </Swiper>
            </div>
        </section>
    );
};

export default CoffeeSection;