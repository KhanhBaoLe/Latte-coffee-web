'use client';

import CoffeeSection from '@/app/components/coffee-section';
import { useCart } from '../../components/CartContext';
import { table as tableList } from '@/app/data/id_table';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TablePage() {
    const params = useParams();
    const tableId = params.id ? `table${params.id}` : null;
    const foundTable = tableList.find(t => t.id_table === tableId);
    const tableNumber = foundTable ? foundTable.id_table.replace('table', '') : 'Unknown';
    const { cartItems, totalPrice } = useCart();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F0E9] to-[#E8D5B5] py-12 px-6">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Section: Title & Table ID */}
                <section className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">Welcome to Your Table</h1>
                    <p className="text-xl text-[#5D4037]">
                        You are viewing <span className="font-semibold text-[#5D4037]">Table #{tableNumber}</span>
                    </p>
                </section>

                {/* Section: Cart Table */}
                <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-[#D7CCC8]">
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#3E2723] mb-4 sm:mb-6">Your Order</h2>
                    
                    {cartItems.length === 0 ? (
                        <div className="py-8 text-center text-[#8D6E63] italic">
                        Your cart is empty. Please select items from the menu below!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            {/* Table Head */}
                            <thead className="bg-[#5D4037] text-white">
                            <tr>
                                <th className="py-3 px-4 rounded-tl-xl sm:rounded-tl-2xl">Item</th>
                                <th className="py-3 px-4 hidden xs:table-cell">Size</th>
                                <th className="py-3 px-4 hidden sm:table-cell">Milk</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Qty</th>
                                <th className="py-3 px-4 rounded-tr-xl sm:rounded-tr-2xl">Price</th>
                            </tr>
                            </thead>
                            
                            {/* Table Body */}
                            <tbody>
                            {cartItems.map((item) => (
                                <tr 
                                key={`${item.id}-${item.size}-${item.milk}-${item.drink}`} 
                                className="border-b border-[#E8D5B5] last:border-0"
                                >
                                {/* Item Name (Always visible) */}
                                <td className="py-3 px-4 font-medium text-[#3E2723]">
                                    <div className="flex flex-col">
                                    <span className="font-medium">{item.name}</span>
                                    {/* Additional info for mobile */}
                                    <div className="xs:hidden text-xs text-[#795548] mt-1">
                                        {item.size} • {item.milk}
                                    </div>
                                    </div>
                                </td>
                                
                                {/* Size (Visible on xs+ screens) */}
                                <td className="py-3 px-4 text-[#5D4037] hidden xs:table-cell">
                                    {item.size}
                                </td>
                                
                                {/* Milk (Visible on sm+ screens) */}
                                <td className="py-3 px-4 text-[#5D4037] hidden sm:table-cell">
                                    {item.milk}
                                </td>
                                
                                {/* Type (Always visible) */}
                                <td className="py-3 px-4 text-[#5D4037]">
                                    {item.drink}
                                </td>
                                
                                {/* Quantity (Always visible) */}
                                <td className="py-3 px-4 font-bold text-[#5D4037]">
                                    {item.quantity}
                                </td>
                                
                                {/* Price (Always visible) */}
                                <td className="py-3 px-4 font-semibold text-[#4E342E]">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </td>
                                </tr>
                            ))}
                            </tbody>
                            
                            {/* Table Footer */}
                            <tfoot className="border-t-2 border-[#D7CCC8]">
                            <tr>
                                <td 
                                colSpan={4} 
                                className="py-3 px-4 font-bold text-right text-[#3E2723] hidden sm:table-cell"
                                >
                                Total:
                                </td>
                                <td 
                                className="py-3 px-4 font-bold text-right text-[#3E2723] sm:hidden"
                                colSpan={3}
                                >
                                Total:
                                </td>
                                <td className="py-3 px-4 font-bold text-[#4E342E]">
                                ${totalPrice.toFixed(2)}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                              {/* View Cart Button */}
                            {cartItems.length > 0 && (
                                <div className="mt-6 flex justify-center">
                                    <Link
                                        href="/cart"
                                        className="inline-flex items-center bg-[#5D4037] hover:bg-[#4E342E] text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#A1887F]/40 gap-2 text-sm sm:text-base"
                                    >
                                        <span>View Cart</span>
                                        <svg 
                                            className="w-4 h-4 sm:w-5 sm:h-5" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24" 
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth="2" 
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                    </section>

                {/* Section: Coffee Products */}
                <section>
                    <h2 className="text-3xl font-bold text-[#3E2723] mb-8 text-center">
                        Beverage Menu
                    </h2>
                    <CoffeeSection />
                </section>
            </div>
        </div>
    );
}