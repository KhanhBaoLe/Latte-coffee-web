'use client';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    const [mode, setMode] = useState<'qr' | 'web'>('web');

    useEffect(() => {
        // Detect mode from domain, URL params, or localStorage
        const detectMode = () => {
            // Check domain first
            const hostname = window.location.hostname;
            
            // Define your domains here
            const QR_DOMAINS = ['qr.lattecoffee.com', 'table.lattecoffee.com', 'order.lattecoffee.com'];
            const WEB_DOMAINS = ['lattecoffee.com', 'www.lattecoffee.com', 'web.lattecoffee.com'];
            
            // Check if current domain is in QR domains
            if (QR_DOMAINS.includes(hostname)) {
                return 'qr';
            }
            
            // Check if current domain is in WEB domains
            if (WEB_DOMAINS.includes(hostname)) {
                return 'web';
            }
            
            // Fallback to URL params or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const modeParam = urlParams.get('mode') as 'qr' | 'web';
            const storedMode = localStorage.getItem('appMode') as 'qr' | 'web';
            
            return modeParam || storedMode || 'web';
        };

        const detectedMode = detectMode();
        setMode(detectedMode);

        // Store mode in localStorage for future reference
        localStorage.setItem('appMode', detectedMode);

        // Check for existing order data when component mounts
        const storedOrder = sessionStorage.getItem('currentOrder');
        if (storedOrder) {
            const orderData = JSON.parse(storedOrder);
            console.log('Stored Order Data:', orderData);
            if (orderData.customerInfo) {
                setCustomerInfo(prev => ({
                    ...prev,
                    ...orderData.customerInfo,
                    tableNumber: orderData.customerInfo.tableNumber || ''
                }));
            }
        }
    }, []);

    useEffect(() => {
        if (cartItems.length === 0 && !isSubmitting) {
            router.push('/cart');
        }
    }, [cartItems.length, isSubmitting, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log('Input Change:', { name, value });
        setCustomerInfo(prev => {
            const newState = {
                ...prev,
                [name]: value
            };
            console.log('New Customer Info:', newState);
            return newState;
        });
    };

    const handleDeliveryMethodChange = (method: DeliveryMethod) => {
        setCustomerInfo(prev => ({
            ...prev,
            deliveryMethod: method,
            ...(method === 'delivery' ? { tableNumber: '' } : {})
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for QR mode - table number is required for pickup
        if (mode === 'qr' && customerInfo.deliveryMethod === 'pickup' && !customerInfo.tableNumber) {
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
                mode, // Include mode in order data
            };

            console.log('Saving Order Data:', orderData);

            // Save to sessionStorage
            sessionStorage.setItem('currentOrder', JSON.stringify(orderData));

            // Navigate to confirmation page
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

    const handleQuantityChange = (id: string, newQuantity: number) => {
        if (newQuantity >= 1) {
            updateQuantity(id, newQuantity);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Responsive Header with Steps */}
            <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    {/* Mobile Header */}
                    <div className="block lg:hidden py-4">
                        <div className="text-center mb-3">
                            <h1 className="text-lg font-semibold text-gray-800">
                                {mode === 'qr' ? 'Table Order' : 'Checkout'}
                            </h1>
                            <p className="text-sm text-gray-600">Step 1 of 3</p>
                        </div>
                        
                        {/* Mobile Progress Bar */}
                        <div className="flex items-center justify-center space-x-2">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    {index > 0 && (
                                        <div className="h-0.5 w-8 bg-gray-300 mx-1" />
                                    )}
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium
                                            ${step.status === 'complete' 
                                                ? 'bg-green-500 text-white' 
                                                : 'border-2 border-gray-300 text-gray-400 bg-white'
                                            }`}
                                        >
                                            {step.status === 'complete' ? '✓' : step.id}
                                        </div>
                                        <span className="text-xs mt-1 text-center max-w-[60px] leading-tight">
                                            {step.name.split(' ').map((word, i) => (
                                                <div key={i}>{word}</div>
                                            ))}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden lg:flex items-center justify-center py-6">
                        <div className="text-center mb-4">
                            <h1 className="text-xl font-semibold text-gray-800 mb-2 pr-20">
                                {mode === 'qr' ? 'Table Order Checkout' : 'Order Checkout'}
                            </h1>
                        </div>
                        
                        <nav className="flex items-center space-x-8">
                            {steps.map((step, index) => (
                                <div key={step.id} className="flex items-center">
                                    {index > 0 && (
                                        <div
                                            className={`h-px w-16 mx-4 ${
                                                step.status === 'upcoming' ? 'bg-gray-300' : 'bg-green-500'
                                            }`}
                                        />
                                    )}
                                    <div className="flex items-center">
                                        <span
                                            className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-medium
                                            ${step.status === 'complete' 
                                                ? 'bg-green-500 text-white' 
                                                : step.status === 'current' 
                                                ? 'border-2 border-gray-400 text-gray-600' 
                                                : 'border-2 border-gray-300 text-gray-400'
                                            }`}
                                        >
                                            {step.status === 'complete' ? '✓' : step.id}
                                        </span>
                                        <span
                                            className={`whitespace-nowrap ${
                                                step.status === 'complete' 
                                                    ? 'text-green-500 font-medium' 
                                                    : step.status === 'current' 
                                                    ? 'text-gray-600 font-medium' 
                                                    : 'text-gray-400'
                                            }`}
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

            <div className="max-w-6xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Order Summary - Mobile First Design */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 h-fit max-h-[calc(100vh-200px)] flex flex-col order-2 lg:order-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Order Overview</h2>
                            {mode === 'qr' && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Table Order
                                </span>
                            )}
                        </div>

                        {/* Scrollable items container */}
                        <div className="flex-1 overflow-y-auto pr-2 mb-4 min-h-0">
                            <div className="space-y-3 sm:space-y-4">
                                {cartItems.map((item) => (
                                    <div key={[
                                        item.id,
                                        item.size,
                                        item.milk,
                                        item.drink,
                                        Array.isArray(item.toppings) ? item.toppings.join('-') : ''
                                    ].join('-')} className="flex items-start py-3 border-b border-[#E8D5B5] last:border-0">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 mr-3">
                                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-[#D7CCC8]">
                                                <Image
                                                    src={item.image || '/images/matchalate.webp'}
                                                    alt={item.name}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                    sizes="(max-width: 640px) 48px, 64px"
                                                />
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-[#3E2723] text-sm mb-1 truncate">{item.name}</p>
                                            
                                            {/* Compact details */}
                                            <div className="text-xs text-[#8D6E63] space-y-0.5 mb-2">
                                                {item.size && <p>Size: {item.size}</p>}
                                                {item.milk && <p>Milk: {item.milk}</p>}
                                                {item.drink && <p>Drink: {item.drink}</p>}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-md"
                                                    >
                                                        <span className="text-sm font-bold">−</span>
                                                    </button>

                                                    <span className="w-8 sm:w-10 text-center font-medium text-sm text-gray-600 bg-gray-50 py-1">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-green-50 hover:bg-green-100 text-green-600 rounded-r-md"
                                                    >
                                                        <span className="text-sm font-bold">+</span>
                                                    </button>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <div className="text-right">
                                                        <p className="font-medium text-[#3E2723] text-sm">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-[#8D6E63]">${item.price.toFixed(2)}/item</p>
                                                    </div>
                                                    
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Fixed Total Section */}
                        <div className="border-t-2 border-[#D7CCC8] pt-4 bg-white">
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
                    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-[#D7CCC8] order-1 lg:order-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-[#3E2723] mb-4">Customer Information</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Delivery Method - Only show if not QR mode */}
                            {mode !== 'qr' && (
                                <div>
                                    <label className="block text-[#5D4037] mb-3 text-sm sm:text-base">Delivery Method *</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleDeliveryMethodChange('pickup')}
                                            className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center transition-colors text-sm sm:text-base
                                                ${customerInfo.deliveryMethod === 'pickup'
                                                    ? 'border-[#5D4037] bg-[#EFEBE9] text-[#3E2723] font-semibold'
                                                    : 'border-[#D7CCC8] text-[#8D6E63] hover:bg-[#F5F0E9]'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-7a1 1 0 00-.293-.707l-4-4A1 1 0 0016 3H3z" />
                                            </svg>
                                            Pickup at Store
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeliveryMethodChange('delivery')}
                                            className={`py-3 px-4 rounded-lg border-2 flex items-center justify-center transition-colors text-sm sm:text-base
                                                ${customerInfo.deliveryMethod === 'delivery'
                                                    ? 'border-[#5D4037] bg-[#EFEBE9] text-[#3E2723] font-semibold'
                                                    : 'border-[#D7CCC8] text-[#8D6E63] hover:bg-[#F5F0E9]'}`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                                <path fillRule="evenodd" d="M16 7H4v2h12V7zm0 4H4v2h12v-2z" clipRule="evenodd" />
                                                <path d="M2 3a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2zm16 2v10H2V5h16z" />
                                            </svg>
                                            Home Delivery
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Table Number - Show only in QR mode or when pickup is selected */}
                            {(mode === 'qr' || customerInfo.deliveryMethod === 'pickup') && (
                                <div>
                                    <label htmlFor="tableNumber" className="block text-[#5D4037] mb-1 text-sm sm:text-base">
                                        Table Number {mode === 'qr' ? '*' : ''}
                                    </label>
                                    <input
                                        type="number"
                                        id="tableNumber"
                                        name="tableNumber"
                                        required={mode === 'qr'}
                                        min="1"
                                        max="8"
                                        value={customerInfo.tableNumber}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-2 rounded-lg border border-[#D7CCC8] focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600 text-sm sm:text-base ${customerInfo.tableNumber ? 'font-medium text-black' : 'font-normal text-gray-600'}`}
                                        placeholder="Enter your table number (1-8)"
                                    />
                                </div>
                            )}

                            {/* Delivery Address - Show only when delivery is selected */}
                            {mode !== 'qr' && customerInfo.deliveryMethod === 'delivery' && (
                                <div>
                                    <label htmlFor="address" className="block text-[#5D4037] mb-1 text-sm sm:text-base">Delivery Address *</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        required
                                        value={customerInfo.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600 text-sm sm:text-base"
                                        placeholder="Enter your delivery address"
                                        rows={3}
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="name" className="block text-[#5D4037] mb-1 text-sm sm:text-base">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={customerInfo.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600 text-sm sm:text-base"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-[#5D4037] mb-1 text-sm sm:text-base">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={customerInfo.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600 text-sm sm:text-base"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-[#5D4037] mb-1 text-sm sm:text-base">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={customerInfo.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600 text-sm sm:text-base"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div>
                                <label htmlFor="note" className="block text-[#5D4037] mb-1 text-sm sm:text-base">Order Notes</label>
                                <textarea
                                    id="note"
                                    name="note"
                                    value={customerInfo.note}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 rounded-lg border border-[#D7CCC8] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5D4037] transition-colors placeholder:text-gray-600 text-sm sm:text-base"
                                    placeholder="Any special instructions for your order?"
                                    rows={3}
                                />
                            </div>

                            {/* Payment Method Section */}
                            <div className="border-t border-[#D7CCC8] pt-4 mt-6">
                                <h3 className="text-base sm:text-lg font-semibold text-[#3E2723] mb-4">Payment Method</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 border border-[#D7CCC8] rounded-lg cursor-pointer hover:bg-[#F5F0E9] transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cash"
                                            defaultChecked
                                            className="mr-3"
                                        />
                                        <span className="text-[#3E2723] text-sm sm:text-base">Cash on Delivery (COD)</span>
                                    </label>
                                    <label className="flex items-center p-3 border border-[#D7CCC8] rounded-lg cursor-pointer hover:bg-[#F5F0E9] transition-colors opacity-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            disabled
                                            className="mr-3"
                                        />
                                        <span className="text-[#3E2723] text-sm sm:text-base">Card Payment (Coming Soon)</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#5D4037] text-white py-3 rounded-lg mt-6 hover:bg-[#4E342E] transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                            >
                                {isSubmitting ? 'Processing...' : `Confirm Order ($${(totalPrice * 1.1).toFixed(2)})`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}