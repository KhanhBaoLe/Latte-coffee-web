'use client';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Product {
    id: number;
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

const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'milk-tea', name: 'Milk Tea' },
    { id: 'matcha', name: 'Matcha' },
    { id: 'fruit-tea', name: 'Fruit Tea' },
];

export default function MenuPage() {
    const { addToCart } = useCart();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, string>>>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

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
    }, []);
    const [isMobile, setIsMobile] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleScroll = () => {
            if (mainRef.current) {
                setScrolled(mainRef.current.scrollTop > 10);
            }
        };

        if (mainRef.current) {
            mainRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            if (mainRef.current) {
                mainRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleOptionChange = (itemId: string, optionType: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [optionType]: value
            }
        }));
    };    const calculatePrice = (productId: number) => {
        const product = products.find(p => p.id === productId);
        const options = selectedOptions[productId];

        if (!product || !options?.size) return 0;
        
        // Base price is already Medium size price
        let basePrice = product.price;
        switch(options.size) {
            case 'L':
                basePrice *= 1.2; // 20% more for Large
                break;
            case 'S':
                basePrice *= 0.9; // 10% less for Small
                break;
            case 'M':
            default:
                // Medium price is the base price
                break;
                break;
            // Small is base price
        }
        return basePrice;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#795548]"></div>
            </div>
        );
    }

    const filteredProducts = products.filter(product =>
        activeCategory === 'all' ? true : product.category === activeCategory
    );

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Mobile: Sticky category bar */}
            {isMobile && (
                <div
                    className={`sticky top-0 z-[1000] bg-[#E8D5B5] px-4 py-3 border-b border-[#D7CCC8] w-full transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
                >
                    <div className="flex overflow-x-auto space-x-3 hide-scrollbar">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 ${activeCategory === category.id
                                    ? 'bg-[#5D4037] text-white shadow-md'
                                    : 'text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723]'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Desktop: Sidebar */}
            {!isMobile && (
                <aside className="w-64 min-h-screen bg-[#E8D5B5] p-6 space-y-4 sticky top-0 self-start">
                    <h2 className="text-xl font-bold text-[#3E2723] mb-4">Category</h2>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${activeCategory === category.id
                                ? 'bg-[#5D4037] text-white shadow-md'
                                : 'text-[#5D4037] hover:bg-[#D7CCC8] hover:text-[#3E2723]'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </aside>
            )}

            {/* Main Content */}
            <main
                ref={mainRef}
                className={`flex-1 bg-[#F5F0E9] overflow-auto ${isMobile ? 'pt-0' : ''}`}
                style={{ maxHeight: '100vh' }}
            >
                <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
                    <div className="text-center mb-6 md:mb-10">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3E2723] mb-2 md:mb-3">
                            Our <span className="text-[#5D4037]">Menu</span>
                        </h1>
                        <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-[#A1887F] to-[#5D4037] mx-auto mb-4 md:mb-5 rounded-full"></div>
                        <p className="text-[#5D4037] text-base md:text-lg max-w-2xl mx-auto">
                            Discover delicious drinks carefully crafted from premium ingredients
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-md md:shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#E8D5B5]"
                            >
                                <div
                                    className="relative h-40 sm:h-48 cursor-pointer group"
                                    onClick={() => router.push(`/detail/${product.id}`)}
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-[#3E2723] hover:text-[#5D4037] transition-colors">
                                                {product.title}
                                            </h3>
                                            <p className="text-[#795548] text-xs md:text-sm mt-1">
                                                {product.rating} ★ ({product.reviews} reviews)
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg md:text-xl font-bold text-[#3E2723]">
                                                ${product.price.toFixed(2)}
                                            </div>
                                            {product.originalPrice && (
                                                <div className="text-sm text-[#D32F2F] line-through">
                                                    ${product.originalPrice.toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-[#5D4037] text-xs md:text-sm line-clamp-2">{product.description}</p>

                                    <div className="space-y-3 mt-4">
                                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                                            <span className="font-medium text-[#5D4037] w-16">Size</span>
                                            <select
                                                className="flex-1 p-2 rounded-lg border border-[#D7CCC8] text-[#3E2723] bg-white hover:border-[#8D6E63] focus:border-[#5D4037] focus:ring-1 focus:ring-[#5D4037] transition-colors text-sm md:text-base"
                                                value={selectedOptions[product.id]?.size || ""}
                                                onChange={(e) => handleOptionChange(product.id.toString(), "size", e.target.value)}
                                            >
                                                <option value="" disabled>Select size</option>
                                                {product.sizes.map((size) => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && (
                                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                <span className="font-medium text-[#5D4037] w-16">Milk</span>
                                                <select
                                                    className="flex-1 p-2 rounded-lg border border-[#D7CCC8] text-[#3E2723] bg-white hover:border-[#8D6E63] focus:border-[#5D4037] focus:ring-1 focus:ring-[#5D4037] transition-colors text-sm md:text-base"
                                                    value={selectedOptions[product.id]?.milk || ""}
                                                    onChange={(e) => handleOptionChange(product.id.toString(), "milk", e.target.value)}
                                                >
                                                    <option value="" disabled>Choose milk</option>
                                                    {product.milkOptions.map((milk) => (
                                                        <option key={milk} value={milk}>{milk}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {product.drinkOptions.length > 0 && (
                                            <div className="flex flex-col md:flex-row md:items-center gap-2">
                                                <span className="font-medium text-[#5D4037] w-16">Type</span>
                                                <select
                                                    className="flex-1 p-2 rounded-lg border border-[#D7CCC8] text-[#3E2723] bg-white hover:border-[#8D6E63] focus:border-[#5D4037] focus:ring-1 focus:ring-[#5D4037] transition-colors text-sm md:text-base"
                                                    value={selectedOptions[product.id]?.drink || ""}
                                                    onChange={(e) => handleOptionChange(product.id.toString(), "drink", e.target.value)}
                                                >
                                                    <option value="" disabled>Select type</option>
                                                    {product.drinkOptions.map((drink) => (
                                                        <option key={drink} value={drink}>{drink}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-3">
                                        <div className="text-xl md:text-2xl font-bold text-[#3E2723]">
                                            Total: ${calculatePrice(product.id).toFixed(2)}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const options = selectedOptions[product.id];
                                                if (!options?.size || (product.drinkOptions.length > 0 && !options?.drink) || 
                                                    (product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && !options?.milk)) {
                                                    alert("Please select all required options");
                                                    return;
                                                }
                                                const price = calculatePrice(product.id);
                                                if (price === 0) {
                                                    alert("Error calculating price. Please try again.");
                                                    return;
                                                }
                                                addToCart({
                                                    id: product.id,
                                                    name: product.title,
                                                    price: price,
                                                    quantity: 1,
                                                    size: options.size,
                                                    milk: options.milk || "None",
                                                    drink: options.drink || "Regular",
                                                    image: product.image
                                                });
                                                
                                                // Reset options after adding to cart
                                                setSelectedOptions(prev => ({
                                                    ...prev,
                                                    [product.id]: {}
                                                }));
                                                
                                                // Show success toast
                                                alert("Added to cart successfully!");
                                            }}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#5D4037] to-[#3E2723] text-white rounded-full hover:from-[#4E342E] hover:to-[#3E2723] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm md:text-base font-semibold"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                            </svg>
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}