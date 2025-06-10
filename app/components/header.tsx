'use client';
import { products } from '@/app/data/products';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartContext';

export default function Header() {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [, setIsVisible] = useState(true);

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

  // FIXED SCROLL HANDLER FOR MOBILE
  useEffect(() => {
    const handleScroll = () => {
      // Use document scrolling properties for mobile compatibility
      const currentScrollY = document.documentElement.scrollTop || document.body.scrollTop;

      // Always show header at top of page
      if (currentScrollY <= 0) {
        setIsVisible(true);
        lastScrollY.current = 0;
        return;
      }

      // Handle iOS bounce effect
      if (currentScrollY < 0) return;

      // Calculate scroll delta for better detection
      const scrollDelta = currentScrollY - lastScrollY.current;

      // Sensitivity threshold
      const SCROLL_THRESHOLD = 5;

      if (scrollDelta > SCROLL_THRESHOLD) {
        // Scrolling down
        setIsVisible(false);
      } else if (scrollDelta < -SCROLL_THRESHOLD) {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <header className="bg-[#F9F6F1] shadow-sm sticky top-0 z-50 border-b border-[#E8D5B5] transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/images/cup.png"
                alt="logo-coffee"
                width={40}
                height={40}
                className="w-10 h-10 object-contain hover:scale-105 transition-transform"
              />
              <Link href="/" className="text-xl font-bold text-[#3E2723] hover:text-[#4E342E] transition-colors">
                latteCoffee
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 ml-4 border-l pl-4 border-[#D7CCC8]">
              <Link href="/" className="text-[#5D4037] hover:text-[#3E2723] transition-colors font-medium">
                Home
              </Link>
              <Link href="/menu" className="text-[#5D4037] hover:text-[#3E2723] transition-colors font-medium">
                Menu
              </Link>
              <Link
                href="/about"
                className="text-[#5D4037] hover:text-[#3E2723] transition-colors font-medium"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Search Bar - Centered */}
          <div className="flex items-center justify-center flex-1 max-w-xl mx-auto px-4">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Find your favorite drink..."
                className="w-full pl-12 pr-4 py-2.5 rounded-full border text-[#5D4037] placeholder:text-[#A1887F] border-[#D7CCC8] hover:border-[#8D6E63] focus:outline-none focus:border-[#5D4037] focus:ring-2 focus:ring-[#5D4037]/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-[#A1887F] group-hover:text-[#5D4037] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>


              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E8D5B5] overflow-hidden z-50">
                  <div className="max-h-[50vh] md:max-h-[300px] overflow-y-auto py-2">
                    {products.filter(product =>
                      product.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(product => (
                      <Link
                        key={product.id}
                        href={`/detail/${product.id}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[#F5F0E9] transition-colors"
                        onClick={() => setSearchQuery('')}
                      >
                        <div className="relative w-14 h-14 md:w-10 md:h-10">
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base md:text-sm font-medium text-[#3E2723]">{product.title}</h4>
                          <p className="text-sm md:text-xs text-[#5D4037]">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                    {products.filter(product =>
                      product.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                        <div className="px-4 py-3 text-sm text-[#5D4037] text-center">
                          No matching products found
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Cart and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#E8D5B5]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              <svg className="w-7 h-7 text-[#3E2723]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
              </svg>
            </button>


            {/* Cart */}
            <div
              className="relative"
              ref={cartButtonRef}
              onMouseEnter={handleCartEnter}
              onMouseLeave={handleCartLeave}
            >
              <button className="p-2 relative text-[#5D4037] hover:text-[#3E2723] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-[#5D4037] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
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
                <div className="bg-white rounded-xl shadow-lg border border-[#E8D5B5] overflow-hidden">
                  <div className="p-4 max-h-[300px] overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#D7CCC8] scrollbar-track-[#F5F0E9]">
                    {/* Cart Items */}
                    {cartItems.length > 0 ? (
                      cartItems.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start gap-3 text-sm border-b pb-2 last:border-none last:pb-0 border-[#E8D5B5]"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-[#3E2723]">{item.title}</p>
                            <p className="text-[#8D6E63] text-xs">
                              {item.size} · {item.milk} · {item.drink}
                            </p>
                          </div>                          <div className="flex flex-col items-end text-right whitespace-nowrap">
                            <p className="text-[#5D4037] font-semibold">{item.quantity}x</p>
                            <p className="text-[#5D4037]">${(item.price).toFixed(2)}</p>
                          </div>
                          <button
                            className="text-[#8D6E63] hover:text-[#D84315] transition-colors text-sm"
                            onClick={() => removeFromCart(item.id)}
                            title="Xoá món"
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[#8D6E63] text-center">The shopping cart is empty</p>
                    )}
                  </div>

                  {/* Total */}
                  {cartItems.length > 0 && (
                    <div className="pt-4 px-4 border-t border-[#E8D5B5]">                      <div className="flex justify-between items-center font-medium text-sm">
                      <span className="text-[#3E2723]">Total:</span>
                      <span className="text-[#5D4037] text-base font-semibold">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    </div>
                  )}


                  {/* Buttons */}
                  {cartItems.length > 0 && (
                    <div className="p-4 space-y-2">
                      <button
                        className="w-full py-2 px-4 bg-[#5D4037] text-white rounded-full hover:bg-[#4E342E] transition-colors text-sm font-medium"
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push('/checkout');
                        }}
                      >
                        CHECKOUT
                      </button>
                      <div className="flex justify-center items-center">
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            className="text-gray-700 uppercase text-xs font-medium tracking-wider hover:text-green-800 transition-colors"
                            onClick={() => {
                              setIsCartOpen(false);
                              router.push('/cart');
                            }}
                          >
                            Detail your order
                          </button>
                          <div className="w-12 h-0.5 bg-gray-700" />
                        </div>
                      </div>



                    </div>
                  )}
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 backdrop-blur-sm z-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 w-3/4 max-w-xs h-full bg-[#F5F0E9]/95 shadow-lg p-6 flex flex-col gap-4 border-l border-[#E8D5B5] animate-slide-left"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}            <button
              className="absolute top-7 right-4 p-2 rounded-lg hover:bg-[#E8D5B5]/50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-[#3E2723]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>


            {/* Logo */}
            <div className="flex items-center gap-2 mb-6 mt-2">
              <Image
                src="/images/cup.png"
                alt="logo-coffee"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-bold text-[#3E2723]">
                latteCoffee
              </span>
            </div>


            <Link
              href="/"
              className="text-[#5D4037] font-medium py-2 px-4 rounded hover:bg-[#E8D5B5] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className="text-[#5D4037] font-medium py-2 px-4 rounded hover:bg-[#E8D5B5] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="/about"
              className="text-[#5D4037] font-medium py-2 px-4 rounded hover:bg-[#E8D5B5] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href={`/table/1`}
              className="bg-[#5D4037] text-white px-4 py-2 rounded text-center hover:bg-[#4E342E] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Table
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

