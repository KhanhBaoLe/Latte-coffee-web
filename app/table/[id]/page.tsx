'use client';

import CoffeeSection from '@/app/components/coffee-section';
// import { table as tableList } from '@/app/data/id_table';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCart } from '../../components/CartContext';

export default function TablePage() {
    const params = useParams();
    const [tableList, setTableList] = useState<{ id: string; tableId: number }[]>([]);
    useEffect(() => {
        async function fetchTables() {
            try {
                const res = await fetch('/api/tables');
                const data = await res.json();
                setTableList(data);
            } catch {
                setTableList([]);
            }
        }
        fetchTables();
    }, []);
    const tableId = params.id ? Number(params.id) : null;
    const foundTable = tableList.find(t => t.tableId === tableId);
    const tableNumber = foundTable ? foundTable.tableId : 'Unknown';
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const router = useRouter();
    

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
                <section className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 border border-[#D7CCC8]">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3E2723] mb-4 sm:mb-6">Your Order</h2>

                {/* Mobile Layout */}
                <div className="block sm:hidden">
                    {cartItems.length === 0 ? (
                        <div className="py-8 text-center text-[#8D6E63] italic text-sm">
                            Your cart is empty. Please select items from the menu below!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cartItems.map((item) => (
                                <div
                                    key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                    className="bg-[#F5F0E9] rounded-lg p-3 border border-[#E8D5B5]"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={item.image || '/images/cup.png'}
                                                alt={item.name}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full border-2 border-[#D7CCC8]"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm text-[#3E2723]">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-xs text-[#795548] mt-1">
                                                        {item.size} • {item.milk} • {item.drink}
                                                    </p>
                                                    <p className="text-sm font-semibold text-[#5D4037] mt-1">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <button
                                                    className="text-red-500 hover:text-red-700 font-medium text-lg ml-2"
                                                    onClick={() => removeFromCart(item.uniqueId)}
                                                >
                                                    ✗
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <div className="flex border border-[#D7CCC8] rounded-lg overflow-hidden bg-white">
                                                    <button
                                                        className="px-3 py-1 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-sm"
                                                        onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                                                    >
                                                        −
                                                    </button>
                                                    <div className="px-4 py-1 bg-white text-center font-bold text-[#4E342E] text-sm border-x border-[#D7CCC8]">
                                                        {item.quantity}
                                                    </div>
                                                    <button
                                                        className="px-3 py-1 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-sm"
                                                        onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="font-bold text-[#4E342E] text-sm">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Mobile Total */}
                            <div className="bg-[#5D4037] text-white rounded-lg p-3 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm">Total:</span>
                                    <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                        <thead className="bg-[#5D4037] text-white">
                            <tr>
                            <th className="py-3 px-5 rounded-tl-xl text-sm w-2/5">Product</th>
                            <th className="py-3 px-5 text-sm w-1/6">Price</th>
                            <th className="py-3 px-5 text-sm whitespace-nowrap w-1/4 text-center">Quantity</th>
                            <th className="py-3 px-5 text-sm whitespace-nowrap w-1/6">Amount</th>
                            <th className="py-3 px-5 rounded-tr-xl text-sm w-1/12 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-[#8D6E63] italic text-sm">
                                Your cart is empty. Please select items from the menu below!
                                </td>
                            </tr>
                            ) : (
                            cartItems.map((item) => (
                                <tr
                                key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                className="odd:bg-white even:bg-[#F5F0E9] border-b last:border-none border-[#E8D5B5] hover:bg-[#E8D5B5]/50 transition"
                                >
                                <td className="py-4 px-5">
                                    <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <Image
                                        src={item.image || '/images/cup.png'}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full border-2 border-[#D7CCC8]"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-medium text-sm text-[#3E2723] truncate">
                                        {item.name}
                                        </div>
                                        <div className="text-xs text-[#795548] truncate">
                                        {item.size} • {item.milk} • {item.drink}
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                <td className="py-4 px-5 text-[#5D4037] text-sm">
                                    ${item.price.toFixed(2)}
                                </td>
                                <td className="py-4 px-5">
                                    <div className="flex items-center justify-center">
                                    <div className="flex border border-[#D7CCC8] rounded-lg overflow-hidden bg-white shadow-sm">
                                        <button
                                        className="px-4 py-2 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-base transition-colors duration-200 min-w-[40px] flex items-center justify-center"
                                        onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                                        >
                                        −
                                        </button>
                                        <div className="px-6 py-2 bg-white text-center min-w-[60px] font-bold text-[#4E342E] text-base flex items-center justify-center border-x border-[#D7CCC8]">
                                        {item.quantity}
                                        </div>
                                        <button
                                        className="px-4 py-2 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-base transition-colors duration-200 min-w-[40px] flex items-center justify-center"
                                        onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                                        >
                                        +
                                        </button>
                                    </div>
                                    </div>
                                </td>
                                <td className="py-4 px-5 font-semibold text-[#4E342E] text-sm whitespace-nowrap">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </td>
                                <td className="py-4 px-5 text-center">
                                    <button
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 font-medium text-base w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                                    onClick={() => removeFromCart(item.uniqueId)}
                                    title="Remove item"
                                    >
                                    ✗
                                    </button>
                                </td>
                                </tr>
                            ))
                            )}
                        </tbody>
                        <tfoot className="border-t-2 border-[#D7CCC8]">
                            <tr>
                            <td colSpan={2} className="py-3 px-5 font-bold text-right text-[#3E2723] text-sm">
                                Total:
                            </td>
                            <td colSpan={3} className="py-3 px-5 font-bold text-[#4E342E] text-sm">
                                ${totalAmount.toFixed(2)}
                            </td>
                            </tr>
                        </tfoot>
                        </table>
                    </div>
                </div>

                {/* Cart Actions */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                    className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    cartItems.length === 0 
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                        : "bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] shadow-sm"
                    }`}
                >
                    <span className="mr-2">🗑</span> Delete All
                </button>

                <button
                    onClick={handleOrder}
                    disabled={cartItems.length === 0}
                    className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors duration-200 font-semibold shadow-md text-sm ${
                    cartItems.length === 0 
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                        : "bg-[#5D4037] hover:bg-[#4E342E] text-white"
                    }`}
                >
                    Checkout
                </button>
                </div>
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