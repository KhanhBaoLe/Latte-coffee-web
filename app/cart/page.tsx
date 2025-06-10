'use client';
import { useCart } from '@/app/components/CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const router = useRouter();

    // Tạo unique key cho mỗi cart item
    const getItemKey = (item: {
        id: string;
        size?: string;
        milk?: string;
        drink?: string;
        toppings?: string[];
    }) => {
        return `${item.id}-${item.size || ''}-${item.milk || ''}-${item.drink || ''}-${item.toppings ? item.toppings.sort().join(',') : ''}`;
    };

    const toggleSelectItem = (itemKey: string) => {
        setSelectedItems(prev => 
            prev.includes(itemKey) 
                ? prev.filter(key => key !== itemKey)
                : [...prev, itemKey]
        );
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => getItemKey(item)));
        }
    };

    const handleRemoveSelected = () => {
        selectedItems.forEach(itemKey => {
            removeFromCart(itemKey);
        });
        setSelectedItems([]);
    };

    const handleOrder = () => {
        if (selectedItems.length === 0) {
            alert("Please select at least one item to proceed to checkout.");
            return;
        }
        router.push('/checkout');
    };

    // Tính toán total dựa trên items được chọn
    const selectedTotal = cartItems
        .filter(item => selectedItems.includes(getItemKey(item)))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);

    const hasSelectedItems = selectedItems.length > 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F9F6F1] via-[#F5F0E9] to-[#F0EBE3]">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#5D4037]/10 to-[#8D6E63]/5 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-[#5D4037] to-[#8D6E63] bg-clip-text text-transparent">
                            Your Shopping Cart
                        </span>
                    </h1>
                    <p className="text-lg text-[#795548] max-w-2xl mx-auto">
                        Review your delicious selections and prepare for an amazing coffee experience
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {cartItems.length === 0 ? (
                    // Empty Cart State
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="text-8xl mb-6 opacity-50">☕</div>
                            <h2 className="text-2xl font-bold text-[#5D4037] mb-4">Your cart is empty</h2>
                            <p className="text-[#795548] mb-8">
                                Looks like you have not added any delicious drinks yet. 
                                Let's change that!
                            </p>
                            <button
                                onClick={() => router.push('/menu')}
                                className="bg-gradient-to-r from-[#5D4037] to-[#6D4C41] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                Explore Our Menu
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Header */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5B5]/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={toggleSelectAll}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                            selectedItems.length === cartItems.length && cartItems.length > 0
                                                ? 'bg-[#5D4037] text-white shadow-md'
                                                : 'bg-[#F5F0E9] text-[#5D4037] hover:bg-[#E8D5B5]'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                            selectedItems.length === cartItems.length && cartItems.length > 0
                                                ? 'bg-white border-white' 
                                                : 'border-[#5D4037]'
                                        }`}>
                                            {selectedItems.length === cartItems.length && cartItems.length > 0 && (
                                                <svg className="w-3 h-3 text-[#5D4037]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        Select All ({cartItems.length} items)
                                    </button>
                                    
                                    {selectedItems.length > 0 && (
                                        <button
                                            onClick={handleRemoveSelected}
                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-all duration-300"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Remove Selected ({selectedItems.length})
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={clearCart}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium transition-all duration-300"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Clear Cart
                                </button>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map((item) => {
                                const itemKey = getItemKey(item);
                                const isSelected = selectedItems.includes(itemKey);
                                
                                return (
                                    <div
                                        key={itemKey}
                                        className={`bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
                                            isSelected 
                                                ? 'border-[#5D4037] ring-2 ring-[#5D4037]/20' 
                                                : 'border-[#E8D5B5]/50'
                                        }`}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center gap-6">
                                                {/* Checkbox */}
                                                <button
                                                    onClick={() => toggleSelectItem(itemKey)}
                                                    className="flex-shrink-0"
                                                >
                                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                                        isSelected 
                                                            ? 'bg-[#5D4037] border-[#5D4037]' 
                                                            : 'border-gray-300 hover:border-[#5D4037]'
                                                    }`}>
                                                        {isSelected && (
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#F5F0E9] to-[#E8D5B5] p-2">
                                                        <div className="relative w-full h-full">
                                                            <Image
                                                                src={item.image || "/images/cup.png"}
                                                                alt={item.title}
                                                                fill
                                                                sizes="(max-width: 640px) 80px, 96px"
                                                                className="object-cover"
                                                                priority
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-[#3E2723] mb-1 truncate">
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 text-xs text-[#795548] mb-2">
                                                        {item.size && (
                                                            <span className="bg-[#F5F0E9] px-2 py-1 rounded-full">
                                                                Size: {item.size}
                                                            </span>
                                                        )}
                                                        {item.milk && (
                                                            <span className="bg-[#F5F0E9] px-2 py-1 rounded-full">
                                                                {item.milk}
                                                            </span>
                                                        )}
                                                        {item.drink && (
                                                            <span className="bg-[#F5F0E9] px-2 py-1 rounded-full">
                                                                {item.drink}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xl font-bold text-[#5D4037]">
                                                        ${item.price.toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border border-[#E8D5B5] rounded-lg overflow-hidden">
                                                        <button
                                                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                                            className="px-3 py-2 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold transition-colors duration-200"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            −
                                                        </button>
                                                        <span className="px-4 py-2 bg-white text-center min-w-[3rem] font-bold text-[#3E2723]">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                                            className="px-3 py-2 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold transition-colors duration-200"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Item Total */}
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-[#3E2723]">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeFromCart(itemKey)}
                                                    className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200"
                                                    title="Remove item"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cart Summary */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E8D5B5]/50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-2">
                                    {/* Chỉ hiển thị subtotal khi có items được chọn */}
                                    {hasSelectedItems && (
                                        <div className="flex justify-between text-[#795548]">
                                            <span>Subtotal ({selectedItems.length} items):</span>
                                            <span className="font-semibold">${selectedTotal.toFixed(2)}</span>
                                        </div>
                                    )}
                                    
                                    {/* Total luôn hiển thị, nhưng = 0 khi không có gì được chọn */}
                                    <div className="flex justify-between text-xl font-bold text-[#3E2723] border-t pt-2">
                                        <span>Total:</span>
                                        <span>${hasSelectedItems ? selectedTotal.toFixed(2) : '0.00'}</span>
                                    </div>
                                    
                                    {/* Thông báo khi chưa chọn gì */}
                                    {!hasSelectedItems && (
                                        <p className="text-sm text-[#795548] italic">
                                            Please select items to see the total amount
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => router.push('/menu')}
                                        className="px-6 py-3 border-2 border-[#5D4037] text-[#5D4037] rounded-lg hover:bg-[#5D4037] hover:text-white font-semibold transition-all duration-300"
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        onClick={handleOrder}
                                        disabled={!hasSelectedItems}
                                        className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                                            hasSelectedItems
                                                ? 'bg-gradient-to-r from-[#5D4037] to-[#6D4C41] text-white hover:shadow-lg transform hover:scale-105'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}