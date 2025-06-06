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
    category: {
        name: string;
        // ...các trường khác nếu cần
    };
    sizes: string[];
    milkOptions: string[];
    drinkOptions: string[];
    toppings: string[];
    basePrices?: { [key in 'S' | 'M' | 'L']?: number };
}

const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'milk-tea', name: 'Milk Tea' },
    { id: 'matcha', name: 'Matcha' },
    { id: 'fruit-tea', name: 'Fruit Tea' },
];

// Products that are eligible for 25% discount when size M is selected
const saleProducts = ['1', '2', '3', '7', '8', '12'];

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
        const mainElement = mainRef.current;
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleScroll = () => {
            if (mainElement) {
                setScrolled(mainElement.scrollTop > 10);
            }
        };

        if (mainElement) {
            mainElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            if (mainElement) {
                mainElement.removeEventListener('scroll', handleScroll);
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
    };

    const calculatePrice = (productId: number) => {
        const product = products.find(p => p.id === productId);
        const options = selectedOptions[productId];

        if (!product || !options?.size) return 0;

        // Calculate base price according to size
        let basePrice = product.price; // Default price
        if (options.size && product.basePrices?.[options.size as 'S' | 'M' | 'L']) {
            basePrice = product.basePrices[options.size as 'S' | 'M' | 'L'] ?? product.price;
        }

        // Apply 25% discount for M size on sale products
        if (options.size === 'M' && saleProducts.includes(String(productId))) {
            basePrice = basePrice * 0.75; // Apply 25% discount
        }

        // Calculate additional costs for milk options
        const milkPrice = options.milk && options.milk !== 'None' && options.milk !== 'Whole Milk' ? 2 : 0;
        // Calculate additional costs for drink type
        const drinkPrice = options.drink && options.drink !== 'Hot' ? 1.5 : 0;
        // Calculate total price
        const totalPrice = basePrice + milkPrice + drinkPrice;
        return totalPrice;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#795548]"></div>
            </div>
        );
    }

    const filteredProducts = products.filter(product =>
        activeCategory === 'all' ? true : product.category?.name === activeCategory
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
                                className="bg-white rounded-xl shadow-md md:shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#E8D5B5] flex flex-col h-full"
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
                                    {saleProducts.includes(product.id.toString()) && (
                                        <div className="absolute top-2 right-2 bg-[#D32F2F] text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                                            SALE 25% OFF for M Size
                                        </div>
                                    )}
                                </div>

                                {/* Sửa phần này: Thêm flex flex-col và flex-grow */}
                                <div className="p-4 md:p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-[#3E2723] hover:text-[#5D4037] transition-colors">
                                                {product.title}
                                            </h3>
                                            <p className="text-[#795548] text-xs md:text-sm mt-1">
                                                {product.rating} ★ ({product.reviews} reviews)
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-[#5D4037] text-xs md:text-sm line-clamp-2 mt-2">{product.description}</p>

                                    {/* Phần options - thêm flex-grow để chiếm không gian còn lại */}
                                    <div className="space-y-3 mt-4 flex-grow">
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

                                    {/* Phần giá và nút - luôn nằm ở dưới cùng */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-3 mt-auto">
                                        <div className="flex flex-col">
                                            <div className="text-xl md:text-2xl font-bold text-[#3E2723]">
                                                Total: ${calculatePrice(product.id).toFixed(2)}
                                            </div>
                                            {selectedOptions[product.id]?.size === 'M' && saleProducts.includes(product.id.toString()) && (
                                                <div className="text-sm text-[#D32F2F] line-through">
                                                    ${(calculatePrice(product.id) * 1.15).toFixed(2)}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const options = selectedOptions[product.id];
                                                if (!options?.size ||
                                                    (product.drinkOptions.length > 0 && !options?.drink) ||
                                                    (product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && !options?.milk)) {
                                                    alert("Please select all required options");
                                                    return;
                                                }

                                                const price = calculatePrice(product.id); const finalPrice = price; // Price already includes any applicable discounts

                                                addToCart({
                                                    id: product.id.toString(),
                                                    name: product.title,
                                                    price: Number(finalPrice.toFixed(2)),
                                                    quantity: 1,
                                                    size: options.size,
                                                    milk: options.milk,
                                                    drink: options.drink,
                                                    image: product.image
                                                });
                                            }}
                                            className="flex-1 px-4 py-2 rounded-lg bg-[#5D4037] text-white font-semibold transition-all duration-300 hover:bg-[#795548] flex items-center justify-center gap-2"                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M3 9h18M3 15h18M3 21h18" />
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
        </div>
    );
}