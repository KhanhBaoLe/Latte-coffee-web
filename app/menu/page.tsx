'use client';
/// <reference types="react" />
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviews: number;
    image: string;
    category: {
        name: string;
    };
    sizes: string[];
    milkOptions: string[];
    drinkOptions: string[];
    toppings: string[];
    basePrices?: { [key in 'S' | 'M' | 'L']?: number };
}

interface Category {
    id:string;
    name: string;
    icon: string;
    color: string;
}

const categories: Category[] = [
    { id: 'all', name: 'All', icon: '🌟', color: 'from-purple-500 to-pink-500' },
    { id: 'coffee', name: 'Coffee', icon: '☕', color: 'from-amber-600 to-orange-600' },
    { id: 'milk-tea', name: 'Milk Tea', icon: '🧋', color: 'from-emerald-500 to-teal-500' },
    { id: 'matcha', name: 'Matcha', icon: '🍵', color: 'from-green-500 to-emerald-500' },
    { id: 'fruit-tea', name: 'Fruit Tea', icon: '🍓', color: 'from-pink-500 to-rose-500' },
];

const saleProducts = ['1', '2', '3', '7', '8', '12'];

export default function MenuPage() {
    const { addToCart } = useCart();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, string>>>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [clickedButton, setClickedButton] = useState<string | null>(null);

    const initializeDefaultOptions = (productsToInitialize: Product[]) => {
        const defaultOptions: Record<string, Record<string, string>> = {};
        productsToInitialize.forEach(product => {
            const currentProductOptions: Record<string, string> = {};

            if (product.sizes && product.sizes.length > 0) {
                currentProductOptions.size = product.sizes.includes('M') ? 'M' : product.sizes[0];
            }

            if (product.milkOptions && product.milkOptions.length > 0) {
                if (product.milkOptions.includes('Whole Milk')) {
                    currentProductOptions.milk = 'Whole Milk';
                } else if (product.milkOptions[0] !== "None") {
                    currentProductOptions.milk = product.milkOptions[0];
                }
            }

            if (product.drinkOptions && product.drinkOptions.length > 0) {
                currentProductOptions.drink = product.drinkOptions.includes('Hot') ? 'Hot' : product.drinkOptions[0];
            }
            
            if (Object.keys(currentProductOptions).length > 0) {
                defaultOptions[product.id.toString()] = currentProductOptions;
            }
        });
        setSelectedOptions(prevOptions => ({ ...prevOptions, ...defaultOptions }));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data: Product[] = await response.json();
                setProducts(data);
                if (data && data.length > 0) {
                    initializeDefaultOptions(data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOptionChange = (itemId: string, optionType: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [optionType]: value
            }
        }));
    };

    const calculatePrice = (productId: number) => {
        const product = products.find(p => p.id === productId);
        const options = selectedOptions[productId.toString()];

        if (!product) return 0; 
        if (!options?.size && !(product.sizes && product.sizes.length > 0)) return product.price;
        if (!options?.size) return product.price;


        let basePrice = product.price;
        if (options.size && product.basePrices?.[options.size as 'S' | 'M' | 'L']) {
            basePrice = product.basePrices[options.size as 'S' | 'M' | 'L'] ?? product.price;
        }

        if (options.size === 'M' && saleProducts.includes(String(productId))) {
            basePrice = basePrice * 0.75;
        }

        const milkPrice = options.milk && options.milk !== 'None' && options.milk !== 'Whole Milk' ? 2 : 0;
        const drinkPrice = options.drink && options.drink !== 'Hot' ? 1.5 : 0;
        
        return basePrice + milkPrice + drinkPrice;
    };

    const handleAddToCartClick = (product: Product) => {
        const currentProductOptions = selectedOptions[product.id.toString()];
        if (!currentProductOptions?.size ||
            (product.drinkOptions.length > 0 && !currentProductOptions?.drink) ||
            (product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && !currentProductOptions?.milk)) {
            alert("Please select all required options");
            return;
        }

        setClickedButton(product.id.toString());
        
        const price = calculatePrice(product.id);
        addToCart({
            id: product.id.toString(),
            title: product.title,
            price: Number(price.toFixed(2)),
            quantity: 1,
            size: currentProductOptions.size,
            milk: currentProductOptions.milk,
            drink: currentProductOptions.drink,
            image: product.image
        });

        setTimeout(() => {
            setClickedButton(null);
        }, 200);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#F9F6F1] to-[#F0EBE3]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#D7CCC8] border-t-[#5D4037] mx-auto mb-4"></div>
                    <p className="text-[#5D4037] font-medium">Loading delicious drinks...</p>
                </div>
            </div>
        );
    }

    const filteredProducts = products.filter(product =>
        activeCategory === 'all' ? true : product.category?.name === activeCategory
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F9F6F1] via-[#F5F0E9] to-[#F0EBE3]">
            {/* Sticky Header Section */}
            <div className="sticky top-0 z-40 bg-[#F9F6F1]/90 backdrop-blur-lg shadow-md">
                <div className="relative max-w-7xl mx-auto px-4 py-5 md:py-6 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-[#5D4037] to-[#8D6E63] bg-clip-text text-transparent">
                            Our Premium Menu
                        </span>
                    </h1>
                    <p className="text-sm md:text-base text-[#795548] max-w-lg mx-auto mb-5">
                        Discover handcrafted beverages made with love
                    </p>
                    
                    <div className="flex justify-center overflow-x-auto pb-1 hide-scrollbar">
                        <div className="flex flex-nowrap gap-2.5 md:gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`group whitespace-nowrap relative overflow-hidden px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none ${
                                        activeCategory === category.id
                                            ? 'bg-white shadow-lg text-[#5D4037] ring-2 ring-[#5D4037]/30'
                                            : 'bg-white/60 hover:bg-white text-[#795548] shadow-sm'
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <span className="text-sm md:text-base">{category.icon}</span>
                                        <span className="font-medium text-xs md:text-sm">{category.name}</span>
                                    </div>
                                    {activeCategory === category.id && (
                                        // OPTIMIZED: Increased opacity for better visibility
                                        <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-20 rounded-full`}></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                    {filteredProducts.map((product) => {
                        const currentProductSelections = selectedOptions[product.id.toString()] || {};
                        return (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-[#E8D5B5]/40 flex flex-col"
                            >
                                <div 
                                    className="relative h-52 sm:h-56 overflow-hidden cursor-pointer"
                                    onClick={() => router.push(`/detail/${product.id}`)}
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    {saleProducts.includes(product.id.toString()) && (
                                        <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                                            SALE 25%
                                        </div>
                                    )}

                                    <div className="absolute top-2.5 left-2.5 bg-white/80 backdrop-blur-sm text-[#5D4037] text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <span>⭐</span>
                                        <span>{product.rating}</span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-[#3E2723] mb-1.5 group-hover:text-[#5D4037] transition-colors truncate">
                                        {product.title}
                                    </h3>
                                    <p className="text-[#795548] text-xs mb-3 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="space-y-2.5 mb-3 flex-grow">
                                        {product.sizes && product.sizes.length > 0 && (
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#5D4037] mb-1 uppercase tracking-wider">Size</label>
                                                <div className="flex gap-1.5">
                                                    {product.sizes.map((size) => (
                                                        <button
                                                            key={size}
                                                            onClick={() => handleOptionChange(product.id.toString(), "size", size)}
                                                            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200 focus:outline-none ${
                                                                currentProductSelections.size === size
                                                                    ? 'bg-[#5D4037] text-white shadow-sm ring-1 ring-[#5D4037]'
                                                                    : 'bg-[#F5F0E9] text-[#5D4037] hover:bg-[#E8D5B5]'
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
                                                        <label className="block text-[11px] font-semibold text-[#5D4037] mb-1 uppercase tracking-wider">Milk</label>
                                                        <select
                                                            className="w-full p-1.5 rounded-md border border-[#E8D5B5] text-xs text-[#5D4037] bg-white focus:border-[#5D4037] focus:ring-1 focus:ring-[#5D4037] transition-colors"
                                                            value={currentProductSelections.milk || ""}
                                                            onChange={(e) => handleOptionChange(product.id.toString(), "milk", e.target.value)}
                                                        >
                                                            <option value="" disabled>Select</option>
                                                            {product.milkOptions.map((milk) => (
                                                                <option key={milk} value={milk}>{milk}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                {product.drinkOptions.length > 0 && (
                                                    <div>
                                                        <label className="block text-[11px] font-semibold text-[#5D4037] mb-1 uppercase tracking-wider">Type</label>
                                                        <select
                                                            className="w-full p-1.5 rounded-md border border-[#E8D5B5] text-xs text-[#5D4037] bg-white focus:border-[#5D4037] focus:ring-1 focus:ring-[#5D4037] transition-colors"
                                                            value={currentProductSelections.drink || ""}
                                                            onChange={(e) => handleOptionChange(product.id.toString(), "drink", e.target.value)}
                                                        >
                                                            <option value="" disabled>Select</option>
                                                            {product.drinkOptions.map((drink) => (
                                                                <option key={drink} value={drink}>{drink}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-[#E8D5B5]/70 mt-auto">
                                        <div>
                                            <div className="text-xl font-bold text-[#3E2723]">
                                                ${calculatePrice(product.id).toFixed(2)}
                                            </div>
                                            {currentProductSelections.size === 'M' && saleProducts.includes(product.id.toString()) && (
                                                <div className="text-xs text-red-500 line-through">
                                                    ${(calculatePrice(product.id) / 0.75).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <button
                                            onClick={() => handleAddToCartClick(product)}
                                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all duration-200 text-xs focus:outline-none ${
                                                clickedButton === product.id.toString()
                                                    ? 'bg-[#4A2C20] scale-95 shadow-inner text-white'
                                                    : 'bg-gradient-to-r from-[#5D4037] to-[#6D4C41] hover:from-[#6D4C41] hover:to-[#795548] text-white shadow-md hover:shadow-lg hover:scale-105'
                                            }`}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <span>Add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 md:py-16">
                        <div className="text-5xl md:text-6xl mb-3 opacity-70">☕️</div>
                        <h3 className="text-xl md:text-2xl font-semibold text-[#5D4037] mb-1.5">No drinks found in this category</h3>
                        <p className="text-[#795548] text-sm md:text-base">Try exploring other delightful options!</p>
                    </div>
                )}
            </div>
        </div>
    );
}