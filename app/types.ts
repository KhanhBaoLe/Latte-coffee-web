export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  sizes?: ('S' | 'M' | 'L')[];
  basePrices?: {
    [key in 'S' | 'M' | 'L']?: number;
  };
  milkOptions?: string[];
  drinkOptions?: string[];
  toppingOptions?: string[];
  category?: string;
  rating: number;
  reviews: number;
  prepTime?: string;
  toppings?: string[];
}

export interface CartItem {
  id: string;
  title: string;
  name: string;
  price: number;
  quantity: number;
  size?: 'S' | 'M' | 'L';
  milk?: string;
  drink?: string;
  toppings?: string[];
  image?: string;
}
