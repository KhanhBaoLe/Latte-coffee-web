'use client';

import CoffeeSection from '@/app/components/coffee-section';
import { table as tableList } from '@/app/data/id_table';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '../../components/CartContext';

export default function TablePage() {
    const params = useParams();
    const tableId = params.id ? `table${params.id}` : null;
    const foundTable = tableList.find(t => t.id_table === tableId);
    const tableNumber = foundTable ? foundTable.id_table.replace('table', '') : 'Unknown';
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [selectedAll, setSelectedAll] = useState(false);

    const router = useRouter();
    const toggleSelectAll = () => {
        setSelectedAll(!selectedAll);
    };

    const handleOrder = () => {
        router.push('/checkout');
    };

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F0E9] to-[#E8D5B5] py-8 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8 sm:space-y-16">
                {/* Section: Title & Table ID */}
                <section className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3E2723] mb-3 sm:mb-4">Welcome to Your Table</h1>
                    <p className="text-lg sm:text-xl text-[#5D4037]">
                        You are viewing <span className="font-semibold text-[#5D4037]">Table #{tableNumber}</span>
                    </p>
                </section>

                {/* Section: Cart Table */}
                <section className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 overflow-x-auto border border-[#D7CCC8]">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3E2723] mb-4 sm:mb-6">Your Order</h2>

                    {cartItems.length === 0 ? (
                        <div className="py-6 sm:py-8 text-center text-[#8D6E63] italic text-sm sm:text-base">
                            Your cart is empty. Please select items from the menu below!
                        </div>
                    ) : (
                        <div className="overflow-x-auto -mx-3 sm:mx-0">
                            <table className="min-w-full text-left border-collapse">
                                <thead className="bg-[#5D4037] text-white">
                                    <tr>
                                        <th className="py-3 px-3 sm:px-5 rounded-tl-xl text-sm sm:text-base">Product</th>
                                        <th className="py-3 px-3 sm:px-5 hidden sm:table-cell text-sm sm:text-base">Price</th>
                                        <th className="py-3 px-3 sm:px-5 text-sm sm:text-base">Qty</th>
                                        <th className="py-3 px-3 sm:px-5 text-sm sm:text-base">Amount</th>
                                        <th className="py-3 px-3 sm:px-5 rounded-tr-xl text-sm sm:text-base">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr
                                            key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                            className="odd:bg-white even:bg-[#F5F0E9] border-b last:border-none border-[#E8D5B5] hover:bg-[#E8D5B5]/50 transition"
                                        >
                                            <td className="py-3 sm:py-4 px-3 sm:px-5">
                                                <div className="flex items-center space-x-2 sm:space-x-4">
                                                    <Image
                                                        src={item.image || '/images/cup.png'}
                                                        alt={item.name}
                                                        width={50}
                                                        height={50}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#D7CCC8]"
                                                    />
                                                    <div>
                                                        <span className="font-medium text-sm sm:text-base text-[#3E2723]">{item.name}</span>
                                                        <div className="text-xs text-[#795548] mt-0.5 sm:mt-1">
                                                            {item.size} • {item.milk} • {item.drink}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-5 text-[#5D4037] hidden sm:table-cell text-sm sm:text-base">
                                                ${item.price.toFixed(2)}
                                            </td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-5">
                                                <div className="flex items-center">
                                                    <button
                                                        className="px-2 sm:px-3 py-1 border border-[#D7CCC8] rounded-l-md bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-sm sm:text-base"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 sm:px-4 py-1 border-t border-b border-[#D7CCC8] bg-white text-center w-8 sm:w-12 font-bold text-[#4E342E] text-sm sm:text-base">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        className="px-2 sm:px-3 py-1 border border-[#D7CCC8] rounded-r-md bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-sm sm:text-base"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-5 font-semibold text-[#4E342E] text-sm sm:text-base">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </td>
                                            <td className="py-3 sm:py-4 px-3 sm:px-5">
                                                <button
                                                    className="text-red-500 hover:text-red-700 font-medium text-sm sm:text-base"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    ❌
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                {cartItems.length > 0 && (
                                    <tfoot className="border-t-2 border-[#D7CCC8]">
                                        <tr>
                                            <td colSpan={3} className="py-3 sm:py-4 px-3 sm:px-5 font-bold text-right text-[#3E2723] text-sm sm:text-base">
                                                Total:
                                            </td>
                                            <td colSpan={2} className="py-3 sm:py-4 px-3 sm:px-5 font-bold text-[#4E342E] text-sm sm:text-base">
                                                ${totalAmount.toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>

                            {/* Cart Actions */}
                            {cartItems.length > 0 && (
                                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                    <button
                                        onClick={clearCart}
                                        className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-[#F5F0E9] hover:bg-[#E8D5B5] rounded-lg text-[#5D4037] text-sm sm:text-base"
                                    >
                                        <span className="mr-2">🗑</span> Delete All
                                    </button>

                                    <button
                                        onClick={handleOrder}
                                        className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#5D4037] text-white rounded-lg hover:bg-[#4E342E] transition-colors font-semibold shadow-md text-sm sm:text-base"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Section: Coffee Products */}
                <section>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#3E2723] mb-6 sm:mb-8 text-center">
                        Beverage Menu
                    </h2>
                    <CoffeeSection />
                </section>
            </div>
        </div>
    );
}