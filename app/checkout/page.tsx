'use client';
import { useCart } from '@/app/components/CartContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';

type DeliveryMethod = 'pickup' | 'delivery';

type CustomerInfo = {
    name: string;
    email: string;
    phone: string;
    tableNumber: string;
    note: string;
    deliveryMethod: DeliveryMethod;
    address: string;
};

export default function CheckoutPage() {
    const { cartItems, totalPrice, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
        name: '',
        email: '',
        phone: '',
        tableNumber: '',
        note: '',
        deliveryMethod: 'pickup',
        address: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleDeliveryMethodChange = (method: DeliveryMethod) => {
        setCustomerInfo(prev => ({
            ...prev,
            deliveryMethod: method,
            ...(method === 'delivery' ? { tableNumber: '' } : {})
        }));
    };    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (customerInfo.deliveryMethod === 'pickup' && !customerInfo.tableNumber) {
            alert('Please enter your table number for pickup');
            return;
        }
        
        if (customerInfo.deliveryMethod === 'delivery' && !customerInfo.address) {
            alert('Please enter your delivery address');
            return;
        }

        try {
            setIsSubmitting(true);

            // Calculate order totals
            const subtotal = totalPrice;
            const tax = totalPrice * 0.1;
            const total = totalPrice * 1.1;

            // Create order data object
            const orderData = {
                customerInfo,
                cartItems,
                subtotal,
                tax,
                total,
            };

            // Lưu vào sessionStorage
            sessionStorage.setItem('currentOrder', JSON.stringify(orderData));

            // Điều hướng đến trang xác nhận
            router.push('/checkout/confirmOrder');
        } catch (error) {
            console.error('Error processing order:', error);
            alert('There was an error processing your order. Please try again.');
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, name: 'Order Overview', status: 'complete' },
        { id: 2, name: 'Confirm Order', status: 'upcoming' },
        { id: 3, name: 'Complete Order', status: 'upcoming' },
    ];

    const handleQuantityChange = (id: number, newQuantity: number) => {
        if (newQuantity >= 1) {
            updateQuantity(id, newQuantity);
        }
    };

    const maxItemsHeight = cartItems.length >= 3 ? 'max-h-[750px]' : '';

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
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 flex flex-col">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Overview</h2>
                        
                        <div className={`${maxItemsHeight} overflow-y-auto pr-2 mb-4 flex-grow`}>
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex items-start py-4 border-b border-[#E8D5B5] last:border-0">
                                        <div className="flex-shrink-0 mr-4">
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[#D7CCC8]">
                                                <Image
                                                    src={item.image || '/images/matchalate.webp'}
                                                    alt={item.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    sizes="(max-width: 640px) 80px, 80px"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 mr-4">
                                            <p className="font-medium text-[#3E2723]">{item.name}</p>
                                            <div className="mt-1 text-sm text-[#8D6E63] space-y-1">
                                                {item.size && <p className="flex items-center"><span className="w-24">Size:</span> {item.size}</p>}
                                                {item.milk && <p className="flex items-center"><span className="w-24">Milk:</span> {item.milk}</p>}
                                                {item.drink && <p className="flex items-center"><span className="w-24">Drink:</span> {item.drink}</p>}
                                            </div>
                                            
                                            <div className="mt-3 flex items-center">
                                                <div className="flex items-center border-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-10 h-10 flex items-center justify-center rounded-l-lg bg-red-100 hover:bg-red-300 text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                    >
                                                        <span className="text-xl font-bold">−</span>
                                                    </button>
                                                    
                                                    <span className="w-12 text-center font-bold text-lg bg-blue-50 text-blue-700 py-1 mx-1 rounded-md">
                                                        {item.quantity}
                                                    </span>
                                                    
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-r-lg bg-green-100 hover:bg-green-300 text-green-700 transition-colors duration-200"
                                                    >
                                                        <span className="text-xl font-bold">+</span>
                                                    </button>
                                                </div>
                                                
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="ml-4 text-red-600 hover:text-red-800 p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors duration-200"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end">
                                            <p className="font-medium text-[#3E2723] text-lg whitespace-nowrap">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-[#8D6E63] mt-1">${item.price.toFixed(2)}/item</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="border-t-2 border-[#D7CCC8] pt-4 mt-auto">
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

                    {/* Customer Information Form (English Version) */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#D7CCC8]">
                        <h2 className="text-xl font-semibold text-[#3E2723] mb-4">Customer Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Delivery Method */}
                            <div>
                                <label className="block text-[#5D4037] mb-3">Delivery Method *</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleDeliveryMethodChange('pickup')}
                                        className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center transition-colors
                                            ${customerInfo.deliveryMethod === 'pickup' 
                                                ? 'border-[#5D4037] bg-[#EFEBE9] text-[#3E2723] font-semibold' 
                                                : 'border-[#D7CCC8] text-[#8D6E63] hover:bg-[#F5F0E9]'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-7a1 1 0 00-.293-.707l-4-4A1 1 0 0016 3H3z" />
                                        </svg>
                                        Pickup at Store
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeliveryMethodChange('delivery')}
                                        className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center transition-colors
                                            ${customerInfo.deliveryMethod === 'delivery' 
                                                ? 'border-[#5D4037] bg-[#EFEBE9] text-[#3E2723] font-semibold' 
                                                : 'border-[#D7CCC8] text-[#8D6E63] hover:bg-[#F5F0E9]'}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            <path fillRule="evenodd" d="M16 7H4v2h12V7zm0 4H4v2h12v-2z" clipRule="evenodd" />
                                            <path d="M2 3a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zm16 2v10H2V5h16z" />
                                        </svg>
                                        Home Delivery
                                    </button>
                                </div>
                            </div>

                            {/* Fields based on delivery method */}
                            {customerInfo.deliveryMethod === 'pickup' ? (
                                <div>
                                    <label htmlFor="tableNumber" className="block text-[#5D4037] mb-1">Table Number *</label>
                                    <input
                                        type="number"
                                        id="tableNumber"
                                        name="tableNumber"
                                        required
                                        value={customerInfo.tableNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600 ${customerInfo.tableNumber ? 'font-medium text-black' : 'font-normal text-gray-600'}`}
                                        placeholder="Enter your table number"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="address" className="block text-[#5D4037] mb-1">Delivery Address *</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        required
                                        value={customerInfo.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600"
                                        placeholder="Enter your delivery address"
                                        rows={3}
                                    />
                                </div>
                            )}

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
                                <label htmlFor="email" className="block text-[#5D4037] mb-1">Email *</label>
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
                                        <span className="text-[#3E2723]">Cash on Delivery (COD)</span>
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
                                Confirm Order (${(totalPrice * 1.1).toFixed(2)})
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}