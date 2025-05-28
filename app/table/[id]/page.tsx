'use client';

import CoffeeSection from '@/app/components/coffee-section';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '../../components/CartContext';

export default function TablePage() {
    const searchParams = useSearchParams();
    const tableId = searchParams.get('id');
    const router = useRouter();
    const { cartItems, totalPrice } = useCart();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#fff4e6] to-[#f8dcc5] py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Section: Title & Table ID */}
                <section className="text-center">
                    <h1 className="text-5xl font-black text-orange-600 mb-4">Welcome to Your Table</h1>
                    <p className="text-xl text-gray-700">
                        You are viewing <span className="font-semibold text-orange-500">Table #{tableId}</span>
                    </p>
                </section>

                {/* Section: Cart Table */}
                <section className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto border border-orange-200">
                    <h2 className="text-3xl font-bold text-orange-600 mb-6">Your Cart Items</h2>
                    <table className="min-w-full text-left text-sm border-collapse">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="py-3 px-5 rounded-tl-xl">Name</th>
                                <th className="py-3 px-5">Size</th>
                                <th className="py-3 px-5">Milk</th>
                                <th className="py-3 px-5">Drink</th>
                                <th className="py-3 px-5">Quantity</th>
                                <th className="py-3 px-5 rounded-tr-xl">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr
                                    key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                    className="odd:bg-white even:bg-orange-50 border-b last:border-none hover:bg-orange-100 transition"
                                >
                                    <td className="py-3 px-5 font-semibold text-gray-900">{item.name}</td>
                                    <td className="py-3 px-5 text-gray-700">{item.size}</td>
                                    <td className="py-3 px-5 text-gray-700">{item.milk}</td>
                                    <td className="py-3 px-5 text-gray-700">{item.drink}</td>
                                    <td className="py-3 px-5 font-bold text-orange-700">{item.quantity}</td>
                                    <td className="py-3 px-5 font-semibold text-green-700">{(item.price * item.quantity).toLocaleString()} VND</td>
                                </tr>
                            ))}
                            {cartItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                                        Your cart is empty. Add some items from below!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {cartItems.length > 0 && (
                            <tfoot className="border-t-2 border-orange-200">
                                <tr>
                                    <td colSpan={5} className="py-4 px-5 font-bold text-right text-gray-900">Total:</td>
                                    <td className="py-4 px-5 font-bold text-green-700">{totalPrice.toLocaleString()} VND</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </section>

                {/* Section: Coffee Products */}
                <section>
                    <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center">
                        Browse Our Coffee Selection
                    </h2>
                    <CoffeeSection />
                </section>
            </div>
        </div>
    );
}
