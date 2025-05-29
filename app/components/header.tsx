'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartContext';
import { products } from '@/app/data/products';

export default function Header() {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-3 flex-1">            <div className="flex items-center gap-2">
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
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 ml-4 border-l pl-4 border-gray-200">
              <Link href="/" className="text-gray-600 hover:text-amber-800 transition-colors font-medium">
                Home
              </Link>
              <Link href="/menu" className="text-gray-600 hover:text-amber-800 transition-colors font-medium">
                Menu
              </Link>
              <Link href={`/table/1`} className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors">
                Table
              </Link>
            </nav>
          </div>          
          {/* Search Bar */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-xl">
            <div className="relative w-full group">              <input
                type="text"
                placeholder="Tìm kiếm đồ uống yêu thích..."
                className="w-full pl-12 pr-4 py-2.5 rounded-full border text-gray-500 placeholder:text-gray-400 border-gray-200 hover:border-amber-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>  
              
              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="max-h-[300px] overflow-y-auto py-2">                    {products.filter(product => 
                      product.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(product => (
                      <Link
                        key={product.id}
                        href={`/detail/${product.id}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-amber-50 transition-colors"
                      >
                        <div className="relative w-10 h-10">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{product.title}</h4>
                          <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                    {products.filter(product => 
                      product.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        Không tìm thấy sản phẩm phù hợp
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            <svg className="w-7 h-7 text-amber-900" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
            </svg>
          </button>

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
                      {/* <button
                        className="w-full py-2 px-4 border border-amber-600 text-amber-600 rounded-full hover:bg-amber-50 transition-colors text-sm font-medium"
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push('/checkout');
                        }}
                      >
                        THANH TOÁN
                      </button> */}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-30 z-50" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-0 left-0 w-3/4 max-w-xs h-full bg-white shadow-lg p-6 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >            <Link href="/" className="text-gray-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/menu" className="text-gray-700 font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Menu
            </Link>
            <Link href={`/table/1`} className="bg-orange-500 text-white px-4 py-2 rounded text-center" onClick={() => setMobileMenuOpen(false)}>
              Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}