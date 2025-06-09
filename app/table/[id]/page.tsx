'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../../components/CartContext';

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    originalPrice: number | null;
    rating: number;
    reviews: number;
    image: string;
    category: {
        name: string;
    };
    sizes: string[];
    milkOptions: string[];
    drinkOptions: string[];
    toppings: string[];
    basePrices: {
        [key: string]: number;
    };
}

export default function TablePage() {
    const params = useParams();
    const [tableList, setTableList] = useState<{ id: string; tableId: number }[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOptions, setSelectedOptions] = useState<{
        [key: string]: {
            size?: string;
            milk?: string;
            drink?: string;
        };
    }>({});
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const { cartItems, removeFromCart, updateQuantity, addToCart, clearCart } = useCart();
    const router = useRouter();
    

    const initializeDefaultOptions = (products: Product[]) => {
        const defaultOptions: { [key: string]: { size?: string; milk?: string; drink?: string; } } = {};
        
        products.forEach(product => {
            defaultOptions[product.id] = {
                size: product.sizes.length > 0 ? (product.sizes.includes('M') ? 'M' : product.sizes[0]) : undefined,
                milk: product.milkOptions.length > 0 && product.milkOptions[0] !== "None" 
                    ? (product.milkOptions.includes('Whole Milk') ? 'Whole Milk' : product.milkOptions[0]) 
                    : undefined,
                drink: product.drinkOptions.length > 0 
                    ? (product.drinkOptions.includes('Hot') ? 'Hot' : product.drinkOptions[0]) 
                    : undefined
            };
        });
        
        setSelectedOptions(defaultOptions);
    };

    const calculatePrice = (product: Product, options?: { size?: string; milk?: string; drink?: string }) => {
        if (!options?.size) return product.price;

        let basePrice = product.price;
        if (options.size && product.basePrices?.[options.size as 'S' | 'M' | 'L']) {
            basePrice = product.basePrices[options.size] ?? product.price;
        }

        const milkPrice = options.milk && options.milk !== 'None' && options.milk !== 'Whole Milk' ? 2 : 0;
        const drinkPrice = options.drink && options.drink !== 'Hot' ? 1.5 : 0;

        return basePrice + milkPrice + drinkPrice;
    };

    const handleOptionChange = (productId: string, optionType: 'size' | 'milk' | 'drink', value: string) => {
        setSelectedOptions(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [optionType]: value
            }
        }));
    };

    useEffect(() => {
        async function fetchTables() {
            try {
                const res = await fetch('/api/tables');
                const data = await res.json();
                setTableList(data);
            } catch {
                setTableList([]);
            }
        }
        fetchTables();

        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                const productsArray = Array.isArray(data) ? data : [];
                setProducts(productsArray);
                
                if (productsArray.length > 0) {
                    initializeDefaultOptions(productsArray);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => 
        selectedCategory === 'all' || product.category?.name === selectedCategory
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const tableId = params.id ? Number(params.id) : null;
    const foundTable = tableList.find(t => t.tableId === tableId);
    const tableNumber = foundTable ? foundTable.tableId : 'Unknown';

    const handleOrder = () => {
        router.push('/table/checkout');
    };

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5F0E9] to-[#E8D5B5] py-8 sm:py-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-8 sm:space-y-16">
                {/* Section: Title & Table ID */}
                <section className="text-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3E2723] mb-3 sm:mb-4">Welcome to Your Table</h1>
                    <p className="text-lg sm:text-xl text-[#5D4037]">
                        You are viewing <span className="font-semibold text-[#5D4037]">Table #{tableNumber}</span>
                    </p>
                </section>

                {/* Section: Cart Table */}
                <section className="bg-white rounded-2xl shadow-lg p-3 sm:p-6 border border-[#D7CCC8]">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#3E2723] mb-4 sm:mb-6">Your Order</h2>

                {/* Mobile Layout */}
                <div className="block sm:hidden">
                    {cartItems.length === 0 ? (
                        <div className="py-8 text-center text-[#8D6E63] italic text-sm">
                            Your cart is empty. Please select items from the menu below!
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {cartItems.map((item) => (
                                <div
                                    key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                    className="bg-[#F5F0E9] rounded-lg p-3 border border-[#E8D5B5]"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0">
                                            <Image
                                                src={item.image || '/images/cup.png'}
                                                alt={item.title}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full border-2 border-[#D7CCC8]"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-sm text-[#3E2723]">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-[#795548] mt-1">
                                                        {item.size} • {item.milk} • {item.drink}
                                                    </p>
                                                    <p className="text-sm font-semibold text-[#5D4037] mt-1">
                                                        ${item.price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <button
                                                    className="text-red-500 hover:text-red-700 font-medium text-lg ml-2"
                                                    onClick={() => removeFromCart(item.uniqueId)}
                                                >
                                                    ✗
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <div className="flex border border-[#D7CCC8] rounded-lg overflow-hidden bg-white">
                                                    <button
                                                        className="px-3 py-1 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-sm"
                                                        onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                                                    >
                                                        −
                                                    </button>
                                                    <div className="px-4 py-1 bg-white text-center font-bold text-[#4E342E] text-sm border-x border-[#D7CCC8]">
                                                        {item.quantity}
                                                    </div>
                                                    <button
                                                        className="px-3 py-1 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-sm"
                                                        onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <div className="font-bold text-[#4E342E] text-sm">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Mobile Total */}
                            <div className="bg-[#5D4037] text-white rounded-lg p-3 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm">Total:</span>
                                    <span className="font-bold text-lg">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left border-collapse">
                        <thead className="bg-[#5D4037] text-white">
                            <tr>
                            <th className="py-3 px-5 rounded-tl-xl text-sm w-2/5">Product</th>
                            <th className="py-3 px-5 text-sm w-1/6">Price</th>
                            <th className="py-3 px-5 text-sm whitespace-nowrap w-1/4 text-center">Quantity</th>
                            <th className="py-3 px-5 text-sm whitespace-nowrap w-1/6">Amount</th>
                            <th className="py-3 px-5 rounded-tr-xl text-sm w-1/12 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-6 text-center text-[#8D6E63] italic text-sm">
                                Your cart is empty. Please select items from the menu below!
                                </td>
                            </tr>
                            ) : (
                            cartItems.map((item) => (
                                <tr
                                key={`${item.id}-${item.size}-${item.milk}-${item.drink}`}
                                className="odd:bg-white even:bg-[#F5F0E9] border-b last:border-none border-[#E8D5B5] hover:bg-[#E8D5B5]/50 transition"
                                >
                                <td className="py-4 px-5">
                                    <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <Image
                                        src={item.image || '/images/cup.png'}
                                        alt={item.title}
                                        width={40}
                                        height={40}
                                        className="w-10 h-10 rounded-full border-2 border-[#D7CCC8]"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="font-medium text-sm text-[#3E2723] truncate">
                                        {item.title}
                                        </div>
                                        <div className="text-xs text-[#795548] truncate">
                                        {item.size} • {item.milk} • {item.drink}
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                <td className="py-4 px-5 text-[#5D4037] text-sm">
                                    ${item.price.toFixed(2)}
                                </td>
                                <td className="py-4 px-5">
                                    <div className="flex items-center justify-center">
                                    <div className="flex border border-[#D7CCC8] rounded-lg overflow-hidden bg-white shadow-sm">
                                        <button
                                        className="px-4 py-2 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-base transition-colors duration-200 min-w-[40px] flex items-center justify-center"
                                        onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                                        >
                                        −
                                        </button>
                                        <div className="px-6 py-2 bg-white text-center min-w-[60px] font-bold text-[#4E342E] text-base flex items-center justify-center border-x border-[#D7CCC8]">
                                        {item.quantity}
                                        </div>
                                        <button
                                        className="px-4 py-2 bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] font-bold text-base transition-colors duration-200 min-w-[40px] flex items-center justify-center"
                                        onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                                        >
                                        +
                                        </button>
                                    </div>
                                    </div>
                                </td>
                                <td className="py-4 px-5 font-semibold text-[#4E342E] text-sm whitespace-nowrap">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </td>
                                <td className="py-4 px-5 text-center">
                                    <button
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 font-medium text-base w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                                    onClick={() => removeFromCart(item.uniqueId)}
                                    title="Remove item"
                                    >
                                    ✗
                                    </button>
                                </td>
                                </tr>
                            ))
                            )}
                        </tbody>
                        <tfoot className="border-t-2 border-[#D7CCC8]">
                            <tr>
                            <td colSpan={2} className="py-3 px-5 font-bold text-right text-[#3E2723] text-sm">
                                Total:
                            </td>
                            <td colSpan={3} className="py-3 px-5 font-bold text-[#4E342E] text-sm">
                                ${totalAmount.toFixed(2)}
                            </td>
                            </tr>
                        </tfoot>
                        </table>
                    </div>
                </div>

                {/* Cart Actions */}
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                    className={`w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                    cartItems.length === 0 
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                        : "bg-[#F5F0E9] hover:bg-[#E8D5B5] text-[#5D4037] shadow-sm"
                    }`}
                >
                    <span className="mr-2">🗑</span> Delete All
                </button>

                <button
                    onClick={handleOrder}
                    disabled={cartItems.length === 0}
                    className={`w-full sm:w-auto px-6 py-2 rounded-lg transition-colors duration-200 font-semibold shadow-md text-sm ${
                    cartItems.length === 0 
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed" 
                        : "bg-[#5D4037] hover:bg-[#4E342E] text-white"
                    }`}
                >
                    Checkout
                </button>
                </div>
                </section>

                {/* Section: Coffee Products */}
                <section>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#3E2723] mb-6 sm:mb-8 text-center">
                        Beverage Menu
                    </h2>
                    <div className="flex justify-center gap-3 mb-6 flex-wrap">
                        {[ 'all', 'coffee', 'milk-tea', 'matcha', 'fruit-tea'].map(category => (
                            <button
                                key={category}
                                onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 
                                    ${selectedCategory === category
                                        ? 'bg-[#5D4037] text-white'
                                        : 'bg-white text-[#5D4037] hover:bg-[#5D4037] hover:text-white'}`}
                            >
                                {category === 'all' ? 'All' :
                                    category === 'milk-tea' ? 'Milk Tea' :
                                        category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#795548]"></div>
                        </div>
                    ) : (
                        <div className="space-y-4 px-2">
                            {currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-lg p-3 flex flex-col items-center space-y-3 border border-[#E8D5B5] sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4 sm:p-4 mx-auto max-w-sm w-full"
                                >
                                    <div className="flex-shrink-0 w-32 h-32 relative rounded-xl overflow-hidden shadow-md sm:w-24 sm:h-24">
                                        <Image
                                            src={product.image || '/images/cup.png'}
                                            alt={product.title}
                                            layout="fill"
                                            objectFit="contain"
                                            className="rounded-xl border-2 border-[#D7CCC8]"
                                        />
                                       {product.originalPrice && (
                                           <span className="absolute top-1 right-1 bg-gradient-to-r from-[#D84315] to-[#BF360C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10">
                                               SALE
                                           </span>
                                       )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left w-full">
                                        <h3 className="text-lg font-bold text-[#3E2723] mb-0.5 line-clamp-1">
                                            {product.title}
                                        </h3>
                                        <p className="text-[#5D4037] text-xs mb-2 line-clamp-2">
                                            {product.description}
                                        </p>
                                        
                                        {/* Options */}
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-xs w-full">
                                            {product.sizes.length > 0 && (
                                                <div className="flex flex-col">
                                                    <label className="block font-medium text-[#5D4037] text-xs mb-0.5">Size:</label>
                                                    <select
                                                        value={selectedOptions[product.id]?.size || ''}
                                                        onChange={(e) => handleOptionChange(product.id, 'size', e.target.value)}
                                                        className="block w-full px-2 py-1 rounded-md border border-[#D7CCC8] focus:ring-[#5D4037] focus:border-[#5D4037] bg-[#F5F0E9] text-[#3E2723] text-xs leading-tight"
                                                    >
                                                        {product.sizes.map((size) => (
                                                            <option key={size} value={size}>{size}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {product.milkOptions.length > 0 && (
                                                <div className="flex flex-col">
                                                    <label className="block font-medium text-[#5D4037] text-xs mb-0.5">Milk:</label>
                                                    <select
                                                        value={selectedOptions[product.id]?.milk || ''}
                                                        onChange={(e) => handleOptionChange(product.id, 'milk', e.target.value)}
                                                        className="block w-full px-2 py-1 rounded-md border border-[#D7CCC8] focus:ring-[#5D4037] focus:border-[#5D4037] bg-[#F5F0E9] text-[#3E2723] text-xs leading-tight"
                                                    >
                                                        {product.milkOptions.map((milk) => (
                                                            <option key={milk} value={milk}>{milk}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            {product.drinkOptions.length > 0 && (
                                                <div className="flex flex-col">
                                                    <label className="block font-medium text-[#5D4037] text-xs mb-0.5">Type:</label>
                                                    <select
                                                        value={selectedOptions[product.id]?.drink || ''}
                                                        onChange={(e) => handleOptionChange(product.id, 'drink', e.target.value)}
                                                        className="block w-full px-2 py-1 rounded-md border border-[#D7CCC8] focus:ring-[#5D4037] focus:border-[#5D4037] bg-[#F5F0E9] text-[#3E2723] text-xs leading-tight"
                                                    >
                                                        {product.drinkOptions.map((drink) => (
                                                            <option key={drink} value={drink}>{drink}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-2 pt-2 border-t border-[#E8D5B5] w-full">
                                            <div className="flex items-center gap-2 flex-shrink-0 w-full xs:w-auto">
                                                {product.originalPrice && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ${product.originalPrice.toFixed(2)}
                                                    </span>
                                                )}
                                                <span className="text-xl font-bold text-[#5D4037]">
                                                    ${calculatePrice(product, selectedOptions[product.id]).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-center xs:justify-end w-full xs:w-auto">
                                                <button
                                                    onClick={() => router.push(`/detail/${product.id}`)}
                                                    className="bg-[#A1887F] hover:bg-[#8D6E63] text-white px-3 py-1.5 rounded-lg font-semibold shadow-md transition-colors duration-200 text-xs flex-shrink-0 flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-1.157.183-2.306.542-3.414.607-1.99 2.046-3.429 4.035-4.035A11.08 11.08 0 0112 4.5c1.157 0 2.306.183 3.414.542 1.99.607 3.429 2.046 4.035 4.035a11.08 11.08 0 01.542 3.414c0 1.157-.183 2.306-.542 3.414-.607 1.99-2.046 3.429-4.035 4.035A11.08 11.08 0 012.25 12z" />
                                                    </svg>
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => addToCart({
                                                        id: product.id,
                                                        title: product.title,
                                                        price: calculatePrice(product, selectedOptions[product.id]),
                                                        quantity: 1,
                                                        image: product.image,
                                                        size: selectedOptions[product.id]?.size || '',
                                                        milk: selectedOptions[product.id]?.milk || '',
                                                        drink: selectedOptions[product.id]?.drink || '',
                                                    })}
                                                    className="bg-[#795548] hover:bg-[#6D4C41] text-white px-3 py-1.5 rounded-lg font-semibold shadow-md transition-colors duration-200 text-xs flex-shrink-0 flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.023.8l2.513 12.924a.75.75 0 00.724.626h10.063a.75.75 0 00.724-.626l2.513-12.924c.068-.457-.365-.8-.849-.8H2.25zM7.5 10.5h6m-6 3h6m-6 3h6" />
                                                    </svg>
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center space-x-1 mt-6">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors duration-200 
                                    ${currentPage === 1 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-[#5D4037] hover:bg-[#4E342E] text-white'}`}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => paginate(index + 1)}
                                    className={`w-8 h-8 rounded-full font-semibold text-xs transition-colors duration-200 
                                        ${currentPage === index + 1 
                                            ? 'bg-[#FF8A00] text-white' 
                                            : 'bg-white text-[#5D4037] hover:bg-[#E8D5B5]'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors duration-200 
                                    ${currentPage === totalPages 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                        : 'bg-[#5D4037] hover:bg-[#4E342E] text-white'}`}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}