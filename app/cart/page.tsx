'use client';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [selectedAll, setSelectedAll] = useState(false);
    const router = useRouter(); // Khởi tạo router

    const toggleSelectAll = () => {
        setSelectedAll(!selectedAll);
    };

    const handleOrder = () => {
        clearCart(); // (Tùy chọn) Xóa giỏ hàng sau khi đặt
        router.push('/confirm'); // Chuyển hướng đến trang xác nhận
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
                    </thead><tbody>
                        {cartItems.map((item) => (
                            <tr
                                key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                className="border-b border-gray-300"
                            >
                                <td className="py-4 px-6 text-[#f58220] flex items-center space-x-4">
                                    <Image
                                        src="/images/matchalate.webp"
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <span>{item.name}</span>
                                </td>
                                <td className="py-4 px-6 text-gray-700">${item.price.toFixed(2)}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded-l-md bg-white font-bold text-2xl text-black hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 border-t border-b border-gray-300 bg-white text-center w-12 font-bold text-gray-800 text-xl">
                                            {item.quantity}
                                        </span>
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded-r-md bg-white font-bold text-2xl text-black hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-800">
                                    {(item.price * item.quantity * 11628).toLocaleString()}đ
                                </td>
                                <td className="py-4 px-6">
                                    <button
                                        className="text-red-500 hover:text-red-700 font-medium"
                                        onClick={() => removeFromCart(item.id)}
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
                    <button onClick={clearCart}>
                        🗑 Delete all
                    </button>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="text-xl font-bold text-[#f58220]">
                        Total: ${totalAmount.toFixed(2)}
                    </div>
                    <button
                        onClick={handleOrder} // Gắn sự kiện chuyển trang
                        className="px-6 py-3 bg-[#f58220] text-white rounded-md hover:bg-[#e46b00] transition-colors font-semibold"
                    >
                        Order
                    </button>
                </div>
            </div>
        </div>
    );
}
