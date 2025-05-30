'use client';
import { useCart } from '@/app/components/CartContext';
import { products } from '@/app/data/products';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'milk-tea', name: 'Milk Tea' },
    { id: 'matcha', name: 'MatchaLatte' },
    { id: 'fruit-tea', name: 'Fruit Tea' },
];

export default function MenuPage() {
    const { addToCart } = useCart();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, string>>>({});

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

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen bg-[#E8D5B5] p-6 space-y-4">
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

            {/* Main Content */}
            <main className="flex-1 bg-[#F5F0E9] p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-[#3E2723] mb-3">
                            Our <span className="text-[#5D4037]">Menu</span>
                        </h1>
                        <div className="w-32 h-1 bg-gradient-to-r from-[#A1887F] to-[#5D4037] mx-auto mb-5 rounded-full"></div>
                        <p className="text-[#5D4037] text-lg max-w-2xl mx-auto">
                            Discover delicious drinks carefully crafted from premium ingredients
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-[#E8D5B5]"
                            >
                                <div
                                    className="relative h-48 cursor-pointer group"
                                    onClick={() => router.push(`/detail/${product.id}`)}
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-bold text-[#3E2723]">{product.title}</h3>
                                    <p className="text-[#5D4037] text-sm line-clamp-2">{product.description}</p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium w-16 text-[#5D4037]">Size</span>
                                            <select
                                                className="flex-1 p-2 rounded border border-[#D7CCC8] text-[#3E2723] bg-[#F5F0E9]"
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
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium w-16 text-[#5D4037]">Milk</span>
                                                <select
                                                    className="flex-1 p-2 rounded border border-[#D7CCC8] text-[#3E2723] bg-[#F5F0E9]"
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

                                        <div className="flex items-center gap-2">
                                            <span className="font-medium w-16 text-[#5D4037]">Drink</span>
                                            <select
                                                className="flex-1 p-2 rounded border border-[#D7CCC8] text-[#3E2723] bg-[#F5F0E9]"
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

                                    <div className="flex items-center justify-between pt-4">
                                        <span className="text-2xl font-bold text-[#3E2723]">
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
                                            className="px-6 py-2 bg-[#5D4037] text-white rounded-full hover:bg-[#4E342E] transition-colors shadow-md hover:shadow-lg"
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
        </div>
    );
}