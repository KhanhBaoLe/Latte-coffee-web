'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    milk?: string;
    drink?: string;
    toppings?: string[];
    image?: string
};

type CartContextType = {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    decreaseQuantity: (id: string) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    updateQuantity: (id: string, quantity: number) => void;
    totalItems: number;
    totalPrice: number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // Đọc từ localStorage khi load
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    // Ghi vào localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm kiểm tra xem hai món có hoàn toàn giống nhau không (cả tên và options)
    const areItemsEqual = (item1: CartItem, item2: CartItem) => {
        return item1.name === item2.name &&
            item1.size === item2.size &&
            item1.milk === item2.milk &&
            item1.drink === item2.drink &&
            JSON.stringify(item1.toppings) === JSON.stringify(item2.toppings);
    };

    const addToCart = (item: CartItem) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((i) => areItemsEqual(i, item));
            if (existingItem) {
                return prevItems.map((i) =>
                    areItemsEqual(i, item) ? { ...i, quantity: i.quantity + 1 } : i
                );
            } else {
                return [...prevItems, { ...item, quantity: 1 }];
            }
        });
    };

    const decreaseQuantity = (id: string) => {
        setCartItems((prevItems) =>
            prevItems
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const updateQuantity = (id: string, quantity: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
            )
        );
    };

    const removeFromCart = (id: string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                decreaseQuantity,
                updateQuantity, // ✅ Thêm vào provider
                removeFromCart,
                clearCart,
                totalItems,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
