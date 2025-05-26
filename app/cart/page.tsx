'use client';
import { useState } from 'react';

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: 1, name: 'Midnight Matchalotte', price: 4.3, quantity: 1 },
        { id: 2, name: 'Midnight Matchalotte', price: 4.3, quantity: 1 },
        { id: 3, name: 'Midnight Matchalotte', price: 4.3, quantity: 1 },
        { id: 4, name: 'Midnight Matchalotte', price: 4.3, quantity: 1 },
    ]);

    const [selectedAll, setSelectedAll] = useState(false);

    const updateQuantity = (id: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const removeAll = () => {
        setCartItems([]);
    };

    const toggleSelectAll = () => {
        setSelectedAll(!selectedAll);
    };

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="bg-[#fddbb0] min-h-screen p-6">

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

            <div className="bg-[#f2f2f2] rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-[#d3c9c0]">
                        <tr className="text-[#f58220]">
                            <th className="py-4 px-6 text-left font-semibold">Product</th>
                            <th className="py-4 px-6 text-left font-semibold">Price</th>
                            <th className="py-4 px-6 text-left font-semibold">Quantity</th>
                            <th className="py-4 px-6 text-left font-semibold">Amount</th>
                            <th className="py-4 px-6 text-left font-semibold">Operation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id} className="border-b border-gray-300">
                                <td className="py-4 px-6 text-[#f58220] flex items-center space-x-4">
                                    <img src="/images/matcha.png" alt="matcha" className="w-10 h-10 rounded-full" />
                                    <span>{item.name}</span>
                                </td>
                                <td className="py-4 px-6 text-gray-700">{item.price}$</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded-l-md bg-white font-bold text-2xl text-black text-center leading-none hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 border-t border-b border-gray-300 bg-white text-center w-12 font-bold text-gray-800 text-xl">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded-r-md bg-white font-bold text-2xl text-black text-center leading-none hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                </td>
                                <td className="py-4 px-6 text-gray-800">{(item.price * item.quantity * 11628).toLocaleString()}đ</td>
                                <td className="py-4 px-6">
                                    <button
                                        className="text-red-500 hover:text-red-700 font-medium"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        ❌
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cart Actions */}
            <div className="mt-6 flex justify-between items-center bg-[#f2f2f2] px-6 py-4 rounded-md">
                <div className="flex space-x-4 text-[#f58220] font-medium">
                    <button onClick={toggleSelectAll}>
                        {selectedAll ? 'Unselect All' : '✅ Choose all'}
                    </button>
                    <button onClick={removeAll}>
                        🗑 Delete all
                    </button>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-xl font-bold text-[#f58220]">
                        Total: {totalAmount.toFixed(1)}$
                    </div>
                    <button className="px-6 py-3 bg-[#f58220] text-white rounded-md hover:bg-[#e46b00] transition-colors font-semibold">
                        Order
                    </button>
                </div>
            </div>
        </div>
    );
}
