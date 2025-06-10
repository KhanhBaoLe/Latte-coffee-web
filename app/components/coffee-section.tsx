'use client';

import { CartContext } from '@/app/components/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
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
    category: {
        name: string;
        // ...các trường khác nếu cần
    };
    sizes: string[];
    milkOptions: string[];
    drinkOptions: string[];
    toppings: string[];
    basePrices: {
        [key: string]: number;
    };
}

interface CategoryFilter {
    id: string;
    name: string;
    icon?: string;
    color?: string; // Thêm thuộc tính màu (Tailwind gradient class)
}

const categoryFilters: CategoryFilter[] = [
    { id: 'all', name: 'All', icon: '🌟', color: 'from-indigo-400 to-purple-500' },
    { id: 'coffee', name: 'Coffee', icon: '☕', color: 'from-amber-500 to-orange-600' },
    { id: 'milk-tea', name: 'Milk Tea', icon: '🧋', color: 'from-pink-400 to-rose-500' },
    { id: 'matcha', name: 'Matcha', icon: '🍵', color: 'from-green-400 to-emerald-500' },
    { id: 'fruit-tea', name: 'Fruit Tea', icon: '🍓', color: 'from-red-400 to-pink-400' },
];


const CoffeeSection = () => {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const cartContext = useContext(CartContext);

    const [clickedButton, setClickedButton] = useState<string | null>(null);

    if (!cartContext) {
        throw new Error('CartContext is undefined. Please ensure CoffeeSection is wrapped in a CartContext.Provider.');
    }

    const { addToCart } = cartContext;

    const [selectedOptions, setSelectedOptions] = useState<{
        [key: string]: {
            size?: string;
            milk?: string;
            drink?: string;
        };
    }>({});

    const initializeDefaultOptions = (products: Product[]) => {
        const defaultOptions: { [key: string]: { size?: string; milk?: string; drink?: string; } } = {};
        
        products.forEach(product => {
            defaultOptions[product.id] = {
                size: product.sizes.length > 0 ? (product.sizes.includes('M') ? 'M' : product.sizes[0]) : undefined,
                milk: product.milkOptions.length > 0 && product.milkOptions[0] !== "None" 
                    ? (product.milkOptions.includes('Whole Milk') ? 'Whole Milk' : product.milkOptions[0]) 
                    : undefined,
                drink: product.drinkOptions.length > 0 
                    ? (product.drinkOptions.includes('Hot') ? 'Hot' : product.drinkOptions[0]) 
                    : undefined
            };
        });
        
        setSelectedOptions(defaultOptions);
    };

    const calculatePrice = (product: Product, options?: { size?: string; milk?: string; drink?: string }) => {
        if (!options?.size) return product.price;
        let basePrice = product.price;
        if (options.size && product.basePrices?.[options.size as 'S' | 'M' | 'L']) {
            basePrice = product.basePrices[options.size] ?? product.price;
        }
        const milkPrice = options.milk && options.milk !== 'None' && options.milk !== 'Whole Milk' ? 2 : 0;
        const drinkPrice = options.drink && options.drink !== 'Hot' ? 1.5 : 0;
        return basePrice + milkPrice + drinkPrice;
    };

    const handleOptionChange = (productId: string, optionType: 'size' | 'milk' | 'drink', value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [optionType]: value
            }
        }));
    };

    const handleAddToCartClick = (product: Product) => {
        const options = selectedOptions[product.id];
        if (!options?.size ||
            (product.drinkOptions.length > 0 && !options?.drink) ||
            (product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && !options?.milk)) {
            alert("Please select all required options");
            return;
        }
        setClickedButton(product.id);
        const price = calculatePrice(product, options);
        addToCart({
            id: product.id,
            title: product.title,
            price: price,
            quantity: 1,
            size: options.size,
            milk: options.milk,
            drink: options.drink,
            image: product.image
        });
        setTimeout(() => {
            setClickedButton(null);
        }, 200);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                const productsArray = Array.isArray(data) ? data : [];
                setProducts(productsArray);
                if (productsArray.length > 0) {
                    initializeDefaultOptions(productsArray);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category?.name.toLowerCase().replace(/\s+/g, '-') === selectedCategory);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#795548]"></div>
            </div>
        );
    }

    return (
        <section className="bg-gradient-to-b from-[#F9F6F1] to-[#F5F0E9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto relative">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-3">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#795548] to-[#5D4037]">Special Menu</span>
                    </h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#A1887F] to-[#5D4037] mx-auto mb-4 rounded-full"></div>
                    
                    <div className="flex justify-center gap-2 md:gap-3 mb-6 flex-wrap px-2">
                        {categoryFilters.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none
                                    ${selectedCategory === category.id
                                        ? 'bg-white text-[#5D4037] shadow-lg ring-2 ring-[#5D4037]/20' // Giữ nguyên style active cơ bản
                                        : 'bg-white/70 text-[#795548] hover:bg-white hover:text-[#5D4037] shadow-md'
                                    }`}
                            >
                                {/* Lớp phủ màu cho trạng thái active */}
                                {selectedCategory === category.id && category.color && (
                                    <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-20 group-hover:opacity-25 transition-opacity duration-300 rounded-full`}></div>
                                )}
                                <span className="relative z-10">{category.icon}</span>
                                <span className="relative z-10">{category.name}</span>
                            </button>
                        ))}
                    </div>
                    
                    <p className="text-[#5D4037] text-base max-w-2xl mx-auto">
                        Discover our handcrafted selection of premium beverages
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="coffee-swiper-prev absolute left-[-2%] md:left-[-3%] top-1/2 -translate-y-1/2 z-20">
                    <button className="pointer-events-auto group relative bg-white/90 hover:bg-[#5D4037] text-[#5D4037] hover:text-white p-2 md:p-3 rounded-full shadow-md transition-all duration-300">
                        <svg className="w-5 h-5 transform group-hover:scale-110 group-hover:-translate-x-0.5 transition-all duration-300"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>  
                    </button>
                </div>

                <div className="coffee-swiper-next absolute right-[-2%] md:right-[-3%] top-1/2 -translate-y-1/2 z-20">
                    <button className="pointer-events-auto group relative bg-white/90 hover:bg-[#5D4037] text-[#5D4037] hover:text-white p-2 md:p-3 rounded-full shadow-md transition-all duration-300">
                        <svg className="w-5 h-5 transform group-hover:scale-110 group-hover:translate-x-0.5 transition-all duration-300"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    spaceBetween={20}
                    slidesPerView={1}
                    speed={600}
                    grabCursor={true}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 }
                    }}
                    className="coffee-swiper relative"
                    style={{ paddingLeft: '20px', paddingRight: '20px' }}
                >
                    {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
                        <SwiperSlide key={product.id} className="h-auto">
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-[#E8D5B5] p-4">
                                <div className="relative">
                                    {product.originalPrice && (
                                        <span className="absolute top-2 right-2 bg-gradient-to-r from-[#D84315] to-[#BF360C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                                            SALE
                                        </span>
                                    )}

                                    <div className="bg-gradient-to-br from-[#F5F0E9] to-[#E8D5B5] rounded-lg p-3 aspect-square flex items-center justify-center">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                layout="fill"
                                                objectFit="contain"
                                                className="transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    </div>
                                    </div>
                                    <div className="mt-4 flex flex-col flex-grow">
                                        <h2 className="text-lg font-bold text-[#3E2723] line-clamp-1">
                                            {product.title}
                                        </h2>

                                        <p className="text-[#5D4037] text-xs mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="space-y-2 mb-3">
                                            {product.sizes.length > 0 && (
                                                <div>
                                                    <label className="block text-xs font-medium text-[#5D4037] mb-1">Size:</label>
                                                    <div className="flex gap-2">
                                                        {product.sizes.map((size) => (
                                                            <button
                                                                key={size}
                                                                onClick={() => handleOptionChange(product.id, 'size', size)}
                                                                className={`px-3 py-1 text-xs rounded-full border transition-all duration-300 
                                                                    ${selectedOptions[product.id]?.size === size
                                                                        ? 'bg-[#5D4037] text-white border-[#5D4037]'
                                                                        : 'border-[#BCAAA4] text-[#5D4037] hover:border-[#5D4037]'
                                                                    }`}
                                                            >
                                                                {size}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {(product.milkOptions.length > 0 && product.milkOptions[0] !== "None" || product.drinkOptions.length > 0) && (
                                                <div className={`grid ${product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && product.drinkOptions.length > 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                                                    {product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && (
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#5D4037] mb-1">Milk:</label>
                                                            <select
                                                                value={selectedOptions[product.id]?.milk || ''}
                                                                onChange={(e) => handleOptionChange(product.id, 'milk', e.target.value)}
                                                                className="w-full text-xs rounded-lg border border-[#BCAAA4] p-1.5 text-[#5D4037]"
                                                            >
                                                                <option value="">Select</option>
                                                                {product.milkOptions.map((milk) => (
                                                                    <option key={milk} value={milk}>{milk}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {product.drinkOptions.length > 0 && (
                                                        <div>
                                                            <label className="block text-xs font-medium text-[#5D4037] mb-1">Type:</label>
                                                            <select
                                                                value={selectedOptions[product.id]?.drink || ''}
                                                                onChange={(e) => handleOptionChange(product.id, 'drink', e.target.value)}
                                                                className="w-full text-xs rounded-lg border border-[#BCAAA4] p-1.5 text-[#5D4037]"
                                                            >
                                                                <option value="">Select</option>
                                                                {product.drinkOptions.map((drink) => (
                                                                    <option key={drink} value={drink}>{drink}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-2">
                                            <div className="flex items-center">
                                                <span className="text-lg font-bold text-[#3E2723]">
                                                    ${calculatePrice(product, selectedOptions[product.id]).toFixed(2)}
                                                </span>
                                                {product.originalPrice && (
                                                    <span className="text-xs text-[#D84315] line-through ml-1">
                                                        ${product.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => router.push(`/detail/${product.id}`)}
                                                    className="p-2 rounded-full border border-[#BCAAA4] text-[#5D4037] hover:bg-[#5D4037] hover:text-white transition duration-300"
                                                    title="View details"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleAddToCartClick(product)}
                                                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-white transition-all duration-200 shadow-md
                                                        ${clickedButton === product.id 
                                                            ? 'bg-[#4A2C20] scale-95 shadow-inner' 
                                                            : 'bg-[#5D4037] hover:bg-[#6D4C41] active:scale-95 hover:shadow-lg'
                                                        }`}
                                                    title="Add to cart"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7H19a1 1 0 001-1v-1M7 13l-1.5 7M6 6h.01" />
                                                    </svg>
                                                    <span className="text-xs">Add to Cart</span>
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