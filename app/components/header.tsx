'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from './CartContext';
import { Product } from '@/app/types';

export default function Header() {
  const { cartItems, removeFromCart } = useCart();
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (searchQuery.trim() === '') return;
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const clearTimeoutRef = () => {
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  };

  // Desktop hover handlers
  const handleCartEnter = () => {
    if (isMobile) return; // Skip hover on mobile
    clearTimeoutRef();
    setIsCartOpen(true);
  };

  const handleCartLeave = () => {
    if (isMobile) return; // Skip hover on mobile
    clearTimeoutRef();
    timeoutId.current = setTimeout(() => {
      if (!dropdownRef.current?.matches(':hover')) {
        setIsCartOpen(false);
      }
    }, 300);
  };

  const handleDropdownEnter = () => {
    if (isMobile) return; // Skip hover on mobile
    clearTimeoutRef();
    setIsCartOpen(true);
  };

  const handleDropdownLeave = () => {
    if (isMobile) return; // Skip hover on mobile
    clearTimeoutRef();
    timeoutId.current = setTimeout(() => {
      if (!cartButtonRef.current?.matches(':hover')) {
        setIsCartOpen(false);
      }
    }, 300);
  };

  // Mobile click handler for cart toggle
  const handleCartClick = () => {
    if (isMobile) {
      setIsCartOpen(!isCartOpen);
    }
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
      clearTimeoutRef();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsVisible(true);
        lastScrollY.current = 0;
        return;
      }
      if (currentScrollY < 0) return;

      const scrollDelta = currentScrollY - lastScrollY.current;
      const SCROLL_THRESHOLD = 10;

      if (scrollDelta > SCROLL_THRESHOLD) {
        setIsVisible(false);
      } else if (scrollDelta < -SCROLL_THRESHOLD) {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🔒 PREVENT BODY SCROLL WHEN MOBILE MENU IS OPEN
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <header className={`bg-[#F9F6F1] shadow-sm sticky top-0 z-50 border-b border-[#E8D5B5] transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
              <Image
                src="/images/cup.png"
                alt="logo-coffee"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain hover:scale-105 transition-transform"
              />
              <Link href="/" className="text-base sm:text-lg md:text-xl font-bold text-[#3E2723] hover:text-[#4E342E] transition-colors whitespace-nowrap">
                latteCoffee
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-6 ml-2 md:ml-3 lg:ml-4 border-l pl-2 md:pl-3 lg:pl-4 border-[#D7CCC8]">
              <Link href="/" className="text-sm lg:text-base text-[#5D4037] hover:text-[#3E2723] transition-colors font-medium">
                Home
              </Link>
              <Link href="/menu" className="text-sm lg:text-base text-[#5D4037] hover:text-[#3E2723] transition-colors font-medium">
                Menu
              </Link>
              <Link
                href="/about"
                className="text-sm lg:text-base text-[#5D4037] hover:text-[#3E2723] transition-colors font-medium"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Search Bar - Centered */}
          <div className="flex items-center justify-center flex-1 min-w-0 md:px-2 lg:px-4">
            <div className="relative w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl group">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 sm:pl-10 sm:pr-4 sm:py-2.5 md:pl-12 rounded-full border text-sm text-[#5D4037] placeholder:text-xs placeholder:sm:text-sm placeholder:text-[#A1887F] sm:placeholder:text-opacity-70 border-[#D7CCC8] hover:border-[#8D6E63] focus:outline-none focus:border-[#5D4037] focus:ring-2 focus:ring-[#5D4037]/30 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={(e) => e.target.placeholder = "Find your favorite drink..."}
                onBlur={(e) => e.target.placeholder = "Search..."}
              />
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#A1887F] group-hover:text-[#5D4037] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-1.5 sm:mt-2 bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl border border-[#E8D5B5] overflow-hidden z-50">
                  <div className="max-h-[40vh] sm:max-h-[250px] md:max-h-[300px] lg:max-h-[350px] overflow-y-auto py-1 sm:py-2 scrollbar-thin scrollbar-thumb-[#D7CCC8] scrollbar-track-[#F5F0E9]">
                    {loading ? (
                      <div className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#5D4037] text-center">
                        Loading...
                      </div>
                    ) : products.filter(product =>
                      product.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(product => (
                      <Link
                        key={product.id}
                        href={`/detail/${product.id}`}
                        className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 hover:bg-[#F5F0E9] transition-colors"
                        onClick={() => setSearchQuery('')}
                      >
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 flex-shrink-0">
                          <Image
                            src={product.image || "/images/cup.png"}
                            alt={product.title}
                            fill
                            className="object-cover rounded-md sm:rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm sm:text-base md:text-sm font-medium text-[#3E2723] truncate">{product.title}</h4>
                          <p className="text-xs sm:text-sm md:text-xs text-[#5D4037]">${product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                    {!loading && products.filter(product =>
                      product.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 && (
                        <div className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#5D4037] text-center">
                          No matching products found
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <button
              className="md:hidden p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-[#E8D5B5]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5D4037]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              <svg className="w-6 h-6 text-[#3E2723]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"} />
              </svg>
            </button>

            <div
              className="relative"
              ref={cartButtonRef}
              onMouseEnter={handleCartEnter}
              onMouseLeave={handleCartLeave}
            >
              <button 
                className="p-1.5 sm:p-2 relative text-[#5D4037] hover:text-[#3E2723] transition-colors"
                onClick={handleCartClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-[#5D4037] text-white text-[10px] leading-tight pt-px sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <div
                ref={dropdownRef}
                className={`absolute top-full right-0 w-[calc(100vw-2rem)] min-[400px]:w-72 sm:w-80 md:w-[22rem] lg:w-96 mt-1.5 sm:mt-2 z-50 transition-all duration-200 ${isCartOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'}`}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-[#E8D5B5] overflow-hidden">
                  <div className="p-3 sm:p-4 max-h-[40vh] sm:max-h-[250px] md:max-h-[300px] overflow-y-auto space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-[#D7CCC8] scrollbar-track-[#F5F0E9]">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.size}-${item.milk}-${item.drink}-${item.toppings ? item.toppings.sort().join(',') : ''}`}
                          className="flex justify-between items-start gap-2 sm:gap-3 text-xs sm:text-sm border-b pb-2 sm:pb-3 last:border-none last:pb-0 border-[#E8D5B5]"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                              <Image
                                src={item.image || "/images/cup.png"}
                                alt={item.title}
                                fill
                                sizes="(max-width: 640px) 48px, 56px"
                                priority={true}
                                className="rounded-md object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-[#3E2723] truncate">{item.title}</p>
                              <p className="text-[#8D6E63] text-[10px] sm:text-xs truncate">
                                {item.size && `${item.size} · `}{item.milk && `${item.milk} · `}{item.drink}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end text-right whitespace-nowrap">
                            <p className="text-xs sm:text-sm text-[#5D4037] font-semibold">{item.quantity}x</p>
                            <p className="text-xs sm:text-sm text-[#5D4037]">${(item.price).toFixed(2)}</p>
                          </div>
                          <button
                            className="text-sm sm:text-base text-[#8D6E63] hover:text-[#D84315] transition-colors px-1 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromCart(`${item.id}-${item.size || ''}-${item.milk || ''}-${item.drink || ''}-${item.toppings ? item.toppings.sort().join(',') : ''}`);
                            }}
                            title="Xoá món"
                            aria-label={`Remove ${item.title} from cart`}
                          >
                            🗑️
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs sm:text-sm text-[#8D6E63] text-center py-4">The shopping cart is empty</p>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className="pt-3 sm:pt-4 px-3 sm:px-4 border-t border-[#E8D5B5]">
                      <div className="flex justify-between items-center font-medium text-xs sm:text-sm">
                        <span className="text-[#3E2723]">Total:</span>
                        <span className="text-[#5D4037] text-sm sm:text-base font-semibold">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {cartItems.length > 0 && (
                    <div className="p-3 sm:p-4 space-y-2">
                      <button
                        className="w-full py-2 sm:py-2.5 px-4 bg-[#5D4037] text-white rounded-full hover:bg-[#4E342E] transition-colors text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5D4037]/50"
                        onClick={() => {
                          setIsCartOpen(false);
                          router.push('/checkout');
                        }}
                      >
                        CHECKOUT
                      </button>
                      <div className="flex justify-center items-center pt-1">
                        <div className="flex flex-col items-center space-y-0.5">
                          <button
                            className="text-gray-700 uppercase text-[10px] sm:text-xs font-medium tracking-wider hover:text-green-800 transition-colors focus:outline-none"
                            onClick={() => {
                              setIsCartOpen(false);
                              router.push('/cart');
                            }}
                          >
                            Detail your order
                          </button>
                          <div className="w-10 sm:w-12 h-[1px] bg-gray-500 group-hover:bg-green-800" />
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

      {/* 🔧 FIXED MOBILE MENU - Full Screen Backdrop Blur */}
      {mobileMenuOpen && (
        <>
          {/* 🎭 FULL SCREEN BACKDROP WITH BLUR - Kéo dài toàn màn hình */}
          <div
            className="md:hidden fixed inset-0 w-full h-full min-h-screen bg-black/40 backdrop-blur-sm z-40"
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              minHeight: '100vh'
            }}
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* 📱 MOBILE MENU PANEL */}
          <div
            className="md:hidden fixed top-0 right-0 w-3/4 max-w-[280px] sm:max-w-xs h-full min-h-screen bg-[#F5F0E9] shadow-xl border-l border-[#E8D5B5] z-50 transform transition-transform duration-300 ease-out"
            style={{
              position: 'fixed',
              height: '100vh',
              minHeight: '100vh'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Menu Content Container */}
            <div className="h-full flex flex-col">
              {/* Header Section */}
              <div className="relative p-4 sm:p-6 border-b border-[#E8D5B5]/30 bg-[#F5F0E9]">
                <button
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-md sm:rounded-lg hover:bg-[#E8D5B5]/60 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5D4037]"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#3E2723]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Logo */}
                <div className="flex items-center gap-2 pr-12">
                  <Image
                    src="/images/cup.png"
                    alt="logo-coffee"
                    width={32}
                    height={32}
                    className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                  />
                  <span className="text-base sm:text-lg font-bold text-[#3E2723]">
                    latteCoffee
                  </span>
                </div>
              </div>

              {/* Navigation Section */}
              <div className="flex-1 p-4 sm:p-6 space-y-2 bg-[#F5F0E9]">
                {[
                  { href: "/", label: "Home" },
                  { href: "/menu", label: "Menu" },
                  { href: "/about", label: "About" },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm sm:text-base text-[#5D4037] font-medium py-3 px-4 rounded-lg hover:bg-[#E8D5B5]/70 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Footer Section */}
              <div className="p-4 sm:p-6 border-t border-[#E8D5B5]/30 bg-[#F5F0E9]">
                <p className="text-xs text-[#8D6E63] text-center">
                  © 2025 latteCoffee
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}