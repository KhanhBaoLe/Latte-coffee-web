// data/products.ts
export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  sizes: string[]
  toppings: string[]
  basePrices: Record<string, number>
  rating: number
  reviews: number
}

export const featuredProduct: Product = {
  id: "midnight-matchalotte",
  title: "Midnight Matchalotte",
  description: "Experience the ceremonial-grade matcha blended with creamy oat milk and a touch of honey. Crafted to perfection for your midnight cravings.",
  price: 7.50,
  originalPrice: 9.00,
  sizes: ['S', 'M', 'L'],
  toppings: ['Whipped Cream', 'Caramel Drizzle', 'Vanilla Foam', 'Chocolate Shavings'],
  basePrices: { S: 6.50, M: 7.50, L: 8.50 },
  rating: 4.8,
  reviews: 128
}