'use client';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [selectedAll, setSelectedAll] = useState(false);
    const router = useRouter();

    const toggleSelectAll = () => {
        setSelectedAll(!selectedAll);
    }; const handleOrder = () => {
        router.push('/checkout');
    };

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F0E9] to-[#E8D5B5] py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Section: Title */}
                <section className="text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-2">Your Shopping Cart</h1>
                    <p className="text-[#5D4037]">
                        Review and manage your items before checkout
                    </p>
                </section>

                {/* Cart Table */}
                <section className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto border border-[#D7CCC8]">
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-[#5D4037] text-white">
                            <tr>
                                <th className="py-3 px-5 rounded-tl-xl">Product</th>
                                <th className="py-3 px-5">Price</th>
                                <th className="py-3 px-5">Quantity</th>
                                <th className="py-3 px-5">Amount</th>
                                <th className="py-3 px-5 rounded-tr-xl">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr
                                    key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                    className="odd:bg-white even:bg-[#F5F0E9] border-b last:border-none border-[#E8D5B5] hover:bg-[#E8D5B5]/50 transition"
                                >
                                    <td className="py-4 px-5 flex items-center space-x-4">
                                        <Image
                                            src="/images/matchalate.webp"
                                            alt={item.name}
                                            width={50}
                                            height={50}
                                            className="w-12 h-12 rounded-full border-2 border-[#D7CCC8]"
                                        />
                                        <span className="font-medium text-[#3E2723]">{item.name}</span>
                                    </td>
                                    <td className="py-4 px-5 text-[#5D4037]">${item.price.toFixed(2)}</td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center">
                                            <button
                                                className="px-3 py-1 border border-[#D7CCC8] rounded-l-md bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 border-t border-b border-[#D7CCC8] bg-white text-center w-12 font-bold text-[#4E342E]">
                                                {item.quantity}
                                            </span>
                                            <button
                                                className="px-3 py-1 border border-[#D7CCC8] rounded-r-md bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 font-semibold text-[#4E342E]">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                    <td className="py-4 px-5">
                                        <button
                                            className="text-red-500 hover:text-red-700 font-medium"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {cartItems.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[#8D6E63] italic">
                                        Your cart is empty. Start adding some delicious items!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {cartItems.length > 0 && (
                            <tfoot className="border-t-2 border-[#D7CCC8]">
                                <tr>
                                    <td colSpan={3} className="py-4 px-5 font-bold text-right text-[#3E2723]">
                                        Total:
                                    </td>
                                    <td colSpan={2} className="py-4 px-5 font-bold text-[#4E342E]">
                                        ${totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </section>

                {/* Cart Actions */}
                {cartItems.length > 0 && (
                    <div className="flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-6 border border-[#D7CCC8] space-y-4 md:space-y-0">
                        <div className="flex space-x-4 text-[#5D4037] font-medium">
                            <button
                                onClick={toggleSelectAll}
                                className={`flex items-center px-4 py-2 rounded-lg ${selectedAll ? 'bg-[#E8D5B5]' : 'bg-[#F5F0E9] hover:bg-[#E8D5B5]'}`}
                            >
                                {selectedAll ? (
                                    <>
                                        <span className="mr-2">✓</span> Unselect All
                                    </>
                                ) : (
                                    'Select All'
                                )}
                            </button>
                            <button
                                onClick={clearCart}
                                className="flex items-center px-4 py-2 bg-[#F5F0E9] hover:bg-[#E8D5B5] rounded-lg text-[#5D4037]"
                            >
                                <span className="mr-2">🗑</span> Delete All
                            </button>
                        </div>

                        <button
                            onClick={handleOrder}
                            className="px-8 py-3 bg-[#5D4037] text-white rounded-lg hover:bg-[#4E342E] transition-colors font-semibold shadow-md"
                        >
                            Place Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}