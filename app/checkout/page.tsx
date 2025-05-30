// app/checkout/page.tsx
'use client';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type CustomerInfo = {
    name: string;
    email: string;
    phone: string;
    tableNumber: string;
    note: string;
};

export default function CheckoutPage() {
    const { cartItems, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        email: '',
        phone: '',
        tableNumber: '',
        note: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use useEffect for navigation to prevent render-time navigation
    useEffect(() => {
        if (cartItems.length === 0 && !isSubmitting) {
            router.push('/cart');
        }
    }, [cartItems.length, isSubmitting, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.push('/confirm');
        setTimeout(() => {
            clearCart();
        }, 0);
    };

    const steps = [
        { id: 1, name: 'Order Overview', status: 'complete' },
        { id: 2, name: 'Complete Order', status: 'upcoming' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header with Steps */}
            <div className="border-b">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center py-4 px-6">
                        <nav className="flex items-center space-x-8">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    {index > 0 && (
                                        <div
                                            className={`h-px w-16 mx-2 ${step.status === 'upcoming' ? 'bg-gray-300' : 'bg-green-500'
                                                }`}
                                        />
                                    )}
                                    <div className="flex items-center">
                                        <span
                                            className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 
                                            ${step.status === 'complete' ? 'bg-green-500 text-white' :
                                                    step.status === 'current' ? 'border-2 border-gray-400 text-gray-600' :
                                                        'border-2 border-gray-300 text-gray-400'}`}
                                        >
                                            {step.status === 'complete' ? '✓' : step.id}
                                        </span>
                                        <span
                                            className={
                                                step.status === 'complete' ? 'text-green-500' :
                                                    step.status === 'current' ? 'text-gray-600' :
                                                        'text-gray-400'
                                            }
                                        >
                                            {step.name}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto py-8 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 h-fit">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Overview</h2>
                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="flex items-center justify-between py-2 border-b border-[#E8D5B5] last:border-0">
                                    <div className="flex items-center space-x-4">
                                        <Image
                                            src={item.image || '/images/matchalate.webp'}
                                            alt={item.name}
                                            width={40}
                                            height={40}
                                            className="rounded-full border-2 border-[#D7CCC8]"
                                        />
                                        <div>
                                            <p className="font-medium text-[#3E2723]">{item.name}</p>
                                            <p className="text-sm text-[#8D6E63]">
                                                {item.size && `Size: ${item.size}`}
                                                {item.milk && ` • Milk: ${item.milk}`}
                                                {item.drink && ` • ${item.drink}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-[#3E2723]">${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-[#8D6E63]">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t-2 border-[#D7CCC8] pt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[#5D4037]">Subtotal:</span>
                                <span className="font-medium text-[#3E2723]">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[#5D4037]">Tax (10%):</span>
                                <span className="font-medium text-[#3E2723]">${(totalPrice * 0.1).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg mt-4">
                                <span className="text-[#3E2723]">Total:</span>
                                <span className="text-[#3E2723]">${(totalPrice * 1.1).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D7CCC8]">
                        <h2 className="text-xl font-semibold text-[#3E2723] mb-4">Customer Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-[#5D4037] mb-1 ">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={customerInfo.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-[#5D4037] mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={customerInfo.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-[#5D4037] mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={customerInfo.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div>
                                <label htmlFor="tableNumber" className="block text-[#5D4037] mb-1">Table Number *</label>
                                <input
                                    type="number"
                                    id="tableNumber"
                                    name="tableNumber"
                                    required
                                    value={customerInfo.tableNumber}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600 ${customerInfo.tableNumber ? 'font-medium text-black' : 'font-normal text-gray-600'
                                        }`}
                                    placeholder="Enter your table number"

                                />


                            </div>
                            <div>
                                <label htmlFor="note" className="block text-[#5D4037] mb-1">Order Notes</label>
                                <textarea
                                    id="note"
                                    name="note"
                                    value={customerInfo.note}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600"
                                    placeholder="Any special instructions for your order?"
                                    rows={3}
                                />
                            </div>

                            {/* Payment Method Section */}
                            <div className="border-t border-[#D7CCC8] pt-4 mt-6">
                                <h3 className="text-lg font-semibold text-[#3E2723] mb-4">Payment Method</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 border border-[#D7CCC8] rounded-lg cursor-pointer hover:bg-[#F5F0E9] transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cash"
                                            defaultChecked
                                            className="mr-3"
                                        />
                                        <span className="text-[#3E2723]">Cash on Delivery</span>
                                    </label>
                                    <label className="flex items-center p-3 border border-[#D7CCC8] rounded-lg cursor-pointer hover:bg-[#F5F0E9] transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            className="mr-3"
                                        />
                                        <span className="text-[#3E2723]">Card Payment (Coming Soon)</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#5D4037] text-white py-3 rounded-lg mt-6 hover:bg-[#4E342E] transition-colors font-semibold shadow-md"
                            >
                                Place Order (${(totalPrice * 1.1).toFixed(2)})
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
