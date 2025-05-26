'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartContext';

export default function Header() {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLDivElement>(null);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  const clearTimeout = () => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };

  const handleCartEnter = () => {
    clearTimeout();
    setIsCartOpen(true);
  };

  const handleCartLeave = () => {
    clearTimeout();
    timeoutId.current = setTimeout(() => {
      if (!dropdownRef.current?.matches(':hover')) {
        setIsCartOpen(false);
      }
    }, 300);
  };

  const handleDropdownEnter = () => {
    clearTimeout();
    setIsCartOpen(true);
  };

  const handleDropdownLeave = () => {
    clearTimeout();
    timeoutId.current = setTimeout(() => {
      if (!cartButtonRef.current?.matches(':hover')) {
        setIsCartOpen(false);
      }
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        cartButtonRef.current &&
        !cartButtonRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout();
    };
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Image
                src="/images/cup.png"
                alt="logo-coffee"
                width={40}
                height={40}
                className="w-10 h-10 object-contain hover:scale-105 transition-transform"
              />
              <Link href="/" className="text-xl font-bold text-amber-900 hover:text-amber-700 transition-colors">
                latteCoffee
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-4 ml-4 border-l pl-4 border-gray-200">
              <Link href="/" className="text-gray-600 hover:text-amber-800 transition-colors font-medium">
                Home
              </Link>
              <Link href="/menu" className="text-gray-600 hover:text-amber-800 transition-colors font-medium">
                Menu
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search drinks..."
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-amber-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cart */}
          <div className="flex-1 flex justify-end">
            <div
              className="relative"
              ref={cartButtonRef}
              onMouseEnter={handleCartEnter}
              onMouseLeave={handleCartLeave}
            >
              <button className="p-2 relative text-gray-600 hover:text-amber-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </button>

              {/* Cart Dropdown */}
              <div
                ref={dropdownRef}
                className={`absolute top-full right-0 w-80 mt-2 z-50 transition-all duration-200 ${isCartOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'}`}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-4 max-h-[300px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-gray-100">
                    {/* Cart Items */}
                    {cartItems.length > 0 ? (
                      cartItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start gap-3 text-sm border-b pb-2 last:border-none last:pb-0"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-gray-500 text-xs">
                              {item.size} · {item.milk} · {item.drink}
                            </p>
                          </div>
                          <div className="flex flex-col items-end text-right whitespace-nowrap">
                            <p className="text-amber-900 font-semibold">{item.quantity}x</p>
                            <p className="text-amber-900">₫{item.price.toLocaleString()}</p>
                          </div>
                          <button
                            className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                            onClick={() => removeFromCart(item.id)}
                            title="Xoá món"
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 text-center">Giỏ hàng đang trống</p>
                    )}

                  </div>

                  {/* Total */}
                  {cartItems.length > 0 && (
                    <div className="pt-4 px-4 border-t border-gray-100">
                      <div className="flex justify-between items-center font-medium text-sm">
                        <span className="text-gray-800">Tổng:</span>
                        <span className="text-amber-900 text-base font-semibold">₫{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  {cartItems.length > 0 && (
                    <div className="p-4 space-y-2">
                      <button
                        className="w-full py-2 px-4 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-colors text-sm font-medium"
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push('/cart');
                        }}
                      >
                        XEM GIỎ HÀNG
                      </button>
                      <button
                        className="w-full py-2 px-4 border border-amber-600 text-amber-600 rounded-full hover:bg-amber-50 transition-colors text-sm font-medium"
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push('/checkout');
                        }}
                      >
                        THANH TOÁN
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}