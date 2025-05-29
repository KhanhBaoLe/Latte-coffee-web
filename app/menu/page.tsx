'use client';
import { useCart } from '@/app/components/CartContext';
import { products } from '@/app/data/products';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'coffee', name: 'Cà Phê' },
    { id: 'milk-tea', name: 'Trà sữa' },
    { id: 'matcha', name: 'MatchaLatte' },
    { id: 'fruit-tea', name: 'Trà trái cây' },
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
        <div className="flex">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen bg-[#f8dcc5] p-6 space-y-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeCategory === category.id
                                ? 'bg-orange-500 text-white'
                                : 'text-gray-700 hover:bg-orange-100'
                            }`}
                    >
                        {category.name}
                    </button>
                ))}
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-[#fff4e6] p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-orange-600 mb-8">Our Menu</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                <div
                                    className="relative h-48 cursor-pointer"
                                    onClick={() => router.push(`/detail/${product.id}`)}
                                >
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800">{product.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium w-16 text-gray-700">Size</span>
                                            <select
                                                className="flex-1 p-2 rounded border border-gray-200 text-gray-700"
                                                value={selectedOptions[product.id]?.size || ""}
                                                onChange={(e) => handleOptionChange(product.id, "size", e.target.value)}
                                            >
                                                <option value="">Select Size</option>
                                                {product.sizes.map((size) => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium w-16 text-gray-700">Milk</span>
                                                <select
                                                    className="flex-1 p-2 rounded border border-gray-200 text-gray-700"
                                                    value={selectedOptions[product.id]?.milk || ""}
                                                    onChange={(e) => handleOptionChange(product.id, "milk", e.target.value)}
                                                >
                                                    <option value="">Select Milk</option>
                                                    {product.milkOptions.map((milk) => (
                                                        <option key={milk} value={milk}>{milk}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <span className="font-medium w-16 text-gray-700">Drink</span>
                                            <select
                                                className="flex-1 p-2 rounded border border-gray-200 text-gray-700"
                                                value={selectedOptions[product.id]?.drink || ""}
                                                onChange={(e) => handleOptionChange(product.id, "drink", e.target.value)}
                                            >
                                                <option value="">Select Type</option>
                                                {product.drinkOptions.map((drink) => (
                                                    <option key={drink} value={drink}>{drink}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <span className="text-2xl font-bold text-orange-600">
                                            ${calculatePrice(product.id).toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => {
                                                const options = selectedOptions[product.id];
                                                if (!options?.size || !options?.drink || (product.milkOptions.length > 0 && product.milkOptions[0] !== "None" && !options?.milk)) {
                                                    alert("Please select all required options");
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
                                            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                                        >
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
