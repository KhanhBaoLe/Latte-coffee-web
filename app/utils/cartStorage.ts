// app/utils/cartStorage.ts

export type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
};

export const getCartFromLocalStorage = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('cart');
    return data ? JSON.parse(data) : [];
};

export const saveCartToLocalStorage = (cart: CartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cart));
};
