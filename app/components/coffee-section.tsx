'use client';
import { useState } from 'react';
import { useCart } from './CartContext';
import { products } from '@/app/data/products';
import { useRouter } from 'next/navigation';
const CoffeeSection = () => {
    const { addToCart } = useCart();
    const router = useRouter();
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
    return (
        <section className="bg-[#f8dcc5] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-left text-orange-600 mb-12">
                    Our Special Coffees
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group rounded-2xl shadow-md transition-transform duration-300 transform hover:scale-105 p-6 flex flex-col justify-between bg-[#fd8e3d] text-white"
                        >
                            <div 
                                className="flex justify-center mb-4 cursor-pointer"
                                onClick={() => router.push(`/detail/${product.id}`)}
                            >
                                <img 
                                    src={product.image} 
                                    alt={product.title} 
                                    className="h-24 object-contain"
                                />
                            </div>

                            <h2 className="text-lg font-bold mb-4 leading-snug text-white">
                                {product.title}
                            </h2>

                            <div className="mb-4 space-y-3 text-sm">
                                {/* Size */}
                                <div className="flex items-center gap-2">
                                    <span className="font-bold w-16">Size</span>
                                    <select
                                        className="flex-1 p-2 rounded text-black text-sm"
                                        value={selectedOptions[product.id]?.size || ""}
                                        onChange={(e) => handleOptionChange(product.id, "size", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {product.sizes.map((size, i) => (
                                            <option key={i} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Milk */}
                                <div className="flex items-center gap-2">
                                    <span className="font-bold w-16">Milk</span>
                                    <select
                                        className="flex-1 p-2 rounded text-black text-sm"
                                        value={selectedOptions[product.id]?.milk || ""}
                                        onChange={(e) => handleOptionChange(product.id, "milk", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {product.milkOptions.map((milk, i) => (
                                            <option key={i} value={milk}>{milk}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Drink */}
                                <div className="flex items-center gap-2">
                                    <span className="font-bold w-16">Drink</span>
                                    <select
                                        className="flex-1 p-2 rounded text-black text-sm"
                                        value={selectedOptions[product.id]?.drink || ""}
                                        onChange={(e) => handleOptionChange(product.id, "drink", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {product.drinkOptions.map((drink, i) => (
                                            <option key={i} value={drink}>{drink}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const options = selectedOptions[product.id];
                                    if (!options?.size || !options?.milk || !options?.drink) {
                                        alert("Please select Size, Milk, and Drink");
                                        return;
                                    }

                                    addToCart({
                                        id: Number(product.id),
                                        name: product.title,
                                        price: product.basePrices[options.size as keyof typeof product.basePrices],
                                        quantity: 1,
                                        size: options.size,
                                        milk: options.milk,
                                        drink: options.drink
                                    });
                                }}
                                className="w-full mt-auto bg-white text-black rounded-full py-2 px-4 font-bold tracking-wide hover:bg-gray-100 transition-colors"
                            >
                                ADD TO BASKET
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoffeeSection;
