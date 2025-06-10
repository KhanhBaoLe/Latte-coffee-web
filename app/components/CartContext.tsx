'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Tạo hàm tạo uniqueId dựa trên tất cả thuộc tính phân biệt
const generateUniqueId = (item: {
  id: string;
  size?: string;
  milk?: string;
  drink?: string;
  toppings?: string[];
}) => {
  const toppingsKey = item.toppings ? item.toppings.sort().join(',') : '';
  return `${item.id}-${item.size || ''}-${item.milk || ''}-${item.drink || ''}-${toppingsKey}`;
};

type CartItem = {
  id: string;
  uniqueId: string; // Thêm trường uniqueId
  title: string; // Changed from name to title
  price: number;
  quantity: number;
  size?: string;
  milk?: string;
  drink?: string;
  toppings?: string[];
  image?: string;
};

// Type pour les items stockés dans localStorage (sans uniqueId)
type StoredCartItem = Omit<CartItem, 'uniqueId'> & {
  uniqueId?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'uniqueId'>) => void; // Cập nhật hàm addToCart
  decreaseQuantity: (uniqueId: string) => void; // Sử dụng uniqueId
  removeFromCart: (uniqueId: string) => void; // Sử dụng uniqueId
  clearCart: () => void;
  updateQuantity: (uniqueId: string, quantity: number) => void; // Sử dụng uniqueId
  totalItems: number;
  totalPrice: number;
  showToast: boolean;
  setShowToast: (show: boolean) => void;
  toastMessage: string;
  setToastMessage: (message: string) => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Đọc từ localStorage khi load (với migration)
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedItems: StoredCartItem[] = JSON.parse(storedCart);
      
      // Migration: Nếu item cũ không có uniqueId, tạo mới
      const migratedItems: CartItem[] = parsedItems.map((item: StoredCartItem) => {
        if (!item.uniqueId) {
          return {
            ...item,
            uniqueId: generateUniqueId(item)
          };
        }
        return item as CartItem;
      });
      
      setCartItems(migratedItems);
    }
  }, []);

  // Ghi vào localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'uniqueId'>) => {
    const uniqueId = generateUniqueId(item);
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(i => i.uniqueId === uniqueId);
      
      if (existingItem) {
        return prevItems.map(i => 
          i.uniqueId === uniqueId 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) } 
            : i
        );
      } else {
        return [...prevItems, { ...item, uniqueId, quantity: item.quantity || 1 }];
      }
    });
    setToastMessage(`${item.title} added to cart!`);
    setShowToast(true);
  };

  const decreaseQuantity = (uniqueId: string) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.uniqueId === uniqueId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateQuantity = (uniqueId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.uniqueId === uniqueId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeFromCart = (uniqueId: string) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => item.uniqueId !== uniqueId)
    );
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
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        showToast,
        setShowToast,
        toastMessage,
        setToastMessage
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