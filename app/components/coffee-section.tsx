'use client';
import { useState } from 'react';
import { useCart } from './CartContext';

const CoffeeSection = () => {
    const { addToCart } = useCart();

    type CoffeeItem = {
        title: string;
        cta: string;
    };

    const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, string>>>({});

    const coffeeItems: CoffeeItem[] = [
        {
            title: "Midnight Mint Mocha Frappuccino",
            cta: "ADD TO BASKET"
        },
        {
            title: "Midnight Mint Mocha Frappuccino",
            cta: "ADD TO BASKET"
        },
        {
            title: "Midnight Mint Mocha Frappuccino",
            cta: "ADD TO BASKET"
        },
        {
            title: "Midnight Mint Mocha Frappuccino",
            cta: "ADD TO BASKET"
        }
    ];

    const sizeOptions = ["Small", "Medium", "Large"];
    const milkOptions = ["Whole Milk", "Skim Milk", "Almond Milk", "Soy Milk"];
    const drinkOptions = ["Hot", "Iced", "Blended"];

    const handleOptionChange = (itemIndex: number, optionType: string, value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [`item-${itemIndex}`]: {
                ...prev[`item-${itemIndex}`],
                [optionType]: value
            }
        }));
    };

    return (
        <section className="bg-[#f8dcc5] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-left text-orange-600 mb-12">
                    Fruit Juice
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {coffeeItems.map((item, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl shadow-md transition-transform duration-300 transform hover:scale-105 p-6 flex flex-col justify-between bg-[#fd8e3d] text-white"
                        >
                            <div className="flex justify-center mb-4">
                                <img src="/images/cup.png" alt="Coffee Cup" className="h-24" />
                            </div>

                            <h2 className="text-lg font-bold mb-4 leading-snug text-white">
                                {item.title}
                            </h2>

                            <div className="mb-4 space-y-3 text-sm">
                                {/* Size */}
                                <div className="flex items-center gap-2">
                                    <span className="font-bold w-16">Size</span>
                                    <select
                                        className="flex-1 p-2 rounded text-black text-sm"
                                        value={selectedOptions[`item-${index}`]?.size || ""}
                                        onChange={(e) => handleOptionChange(index, "size", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {sizeOptions.map((size, i) => (
                                            <option key={i} value={size}>{size}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Milk */}
                                <div className="flex items-center gap-2">
                                    <span className="font-bold w-16">Milk</span>
                                    <select
                                        className="flex-1 p-2 rounded text-black text-sm"
                                        value={selectedOptions[`item-${index}`]?.milk || ""}
                                        onChange={(e) => handleOptionChange(index, "milk", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {milkOptions.map((milk, i) => (
                                            <option key={i} value={milk}>{milk}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Drink */}
                                <div className="flex items-center gap-2">
                                    <span className="font-bold w-16">Drink</span>
                                    <select
                                        className="flex-1 p-2 rounded text-black text-sm"
                                        value={selectedOptions[`item-${index}`]?.drink || ""}
                                        onChange={(e) => handleOptionChange(index, "drink", e.target.value)}
                                    >
                                        <option value="">Select</option>
                                        {drinkOptions.map((drink, i) => (
                                            <option key={i} value={drink}>{drink}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    addToCart({
                                        id: index + 1,
                                        name: item.title,
                                        price: 4.3,
                                        quantity: 1,
                                    })
                                }
                                className="w-full mt-auto bg-white text-black rounded-full py-2 px-4 font-bold tracking-wide hover:bg-gray-100 transition-colors"
                            >
                                {item.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoffeeSection;
