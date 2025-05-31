'use client';
import { useCart } from '@/app/components/CartContext';
import { isInCategory } from '@/app/data/categories';
import { products } from '@/app/data/products';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'milkTea', name: 'Milk Tea' },
    { id: 'matchaLatte', name: 'MatchaLatte' },
    { id: 'fruitTea', name: 'Fruit Tea' },
];

export default function MenuPage() {
    const { addToCart } = useCart();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, string>>>({});
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
    };

    const calculatePrice = (productId: string) => {
        const product = products.find(p => p.id === productId);
        const options = selectedOptions[productId];

        if (!product || !options?.size) return 0;
        const basePrice = product.basePrices[options.size as keyof typeof product.basePrices] || 0;
        return basePrice;
    };

    const filteredProducts = products.filter(product =>
        activeCategory === 'all' ? true : isInCategory(product.id, activeCategory)
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
                                    <h3 className="text-lg md:text-xl font-bold text-[#3E2723]">{product.title}</h3>
                                    <p className="text-[#5D4037] text-xs md:text-sm line-clamp-2">{product.description}</p>

                                    <div className="space-y-2 md:space-y-3">
                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                            <span className="font-medium text-[#5D4037] w-16">Size</span>
                                            <select
                                                className="flex-1 p-1 md:p-2 rounded border border-[#D7CCC8] text-[#3E2723] bg-[#F5F0E9] text-sm md:text-base"
                                                value={selectedOptions[product.id]?.size || ""}
                                                onChange={(e) => handleOptionChange(product.id, "size", e.target.value)}
                                            >
                                                <option value="" className="text-[#A1887F]">Select size</option>
                                                {product.sizes.map((size) => (
                                                    <option key={size} value={size} className="text-[#3E2723]">{size}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && (
                                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                                <span className="font-medium text-[#5D4037] w-16">Milk</span>
                                                <select
                                                    className="flex-1 p-1 md:p-2 rounded border border-[#D7CCC8] text-[#3E2723] bg-[#F5F0E9] text-sm md:text-base"
                                                    value={selectedOptions[product.id]?.milk || ""}
                                                    onChange={(e) => handleOptionChange(product.id, "milk", e.target.value)}
                                                >
                                                    <option value="" className="text-[#A1887F]">Choose milk</option>
                                                    {product.milkOptions.map((milk) => (
                                                        <option key={milk} value={milk} className="text-[#3E2723]">{milk}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                            <span className="font-medium text-[#5D4037] w-16">Drink</span>
                                            <select
                                                className="flex-1 p-1 md:p-2 rounded border border-[#D7CCC8] text-[#3E2723] bg-[#F5F0E9] text-sm md:text-base"
                                                value={selectedOptions[product.id]?.drink || ""}
                                                onChange={(e) => handleOptionChange(product.id, "drink", e.target.value)}
                                            >
                                                <option value="" className="text-[#A1887F]">Select type</option>
                                                {product.drinkOptions.map((drink) => (
                                                    <option key={drink} value={drink} className="text-[#3E2723]">{drink}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 md:pt-4 gap-3">
                                        <span className="text-xl md:text-2xl font-bold text-[#3E2723]">
                                            ${calculatePrice(product.id).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => {
                                                const options = selectedOptions[product.id];
                                                if (!options?.size || !options?.drink || (product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && !options?.milk)) {
                                                    alert("Please select all options");
                                                    return;
                                                }
                                                addToCart({
                                                    id: Number(product.id),
                                                    name: product.title,
                                                    price: calculatePrice(product.id),
                                                    quantity: 1,
                                                    size: options.size,
                                                    milk: options.milk,
                                                    drink: options.drink,
                                                    image: product.image
                                                });
                                            }}
                                            className="px-4 py-1.5 md:px-6 md:py-2 bg-[#5D4037] text-white rounded-full hover:bg-[#4E342E] transition-colors shadow-md hover:shadow-lg text-sm md:text-base"
                                        >
                                            Add to cart
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