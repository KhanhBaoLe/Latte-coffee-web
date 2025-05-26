export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  sizes: string[]
  milkOptions: string[]
  drinkOptions: string[]
  toppings: string[]
  basePrices: Record<string, number>
  rating: number
  reviews: number
  image: string
}

export const products = [
  {
    id: "1",
    title: "Midnight Matchalotte",
    description: "Experience the ceremonial-grade matcha blended with creamy oat milk and a touch of honey.",
    price: 7.50,
    originalPrice: 9.00,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Whole Milk", "Skim Milk", "Almond Milk", "Soy Milk"],
    drinkOptions: ["Hot", "Iced", "Blended"],
    toppings: ['Whipped Cream', 'Caramel Drizzle', 'Vanilla Foam', 'Chocolate Shavings'],
    basePrices: { S: 6.50, M: 7.50, L: 8.50 },
    rating: 4.8,
    reviews: 128,
    image: "/images/matchalate.webp"
  },
  {
    id: "2",
    title: "Midnight Mint Mocha Frappuccino",
    description: "Rich coffee blended with cool mint and chocolatey chips.",
    price: 4.3,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Whole Milk", "Skim Milk", "Almond Milk", "Soy Milk"],
    drinkOptions: ["Hot", "Iced", "Blended"],
    toppings: ["Whipped Cream", "Chocolate Drizzle", "Mint Syrup"],
    basePrices:{ S: 3.8, M: 4.3, L: 4.8 },
    rating: 4.7,
    reviews: 95,
    image: "/images/matchalate.webp"
  },
  {
    id: "3",
    title: "Midnight Matchalotte",
    description: "Experience the ceremonial-grade matcha blended with creamy oat milk and a touch of honey.",
    price: 7.50,
    originalPrice: 9.00,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Whole Milk", "Skim Milk", "Almond Milk", "Soy Milk"],
    drinkOptions: ["Hot", "Iced", "Blended"],
    toppings: ['Whipped Cream', 'Caramel Drizzle', 'Vanilla Foam', 'Chocolate Shavings'],
    basePrices: { S: 6.50, M: 7.50, L: 8.50 },
    rating: 4.8,
    reviews: 128,
    image: "/images/matchalate.webp"
  },
  {
    id: "4",
    title: "Midnight Matchalotte",
    description: "Experience the ceremonial-grade matcha blended with creamy oat milk and a touch of honey.",
    price: 7.50,
    originalPrice: 9.00,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Whole Milk", "Skim Milk", "Almond Milk", "Soy Milk"],
    drinkOptions: ["Hot", "Iced", "Blended"],
    toppings: ['Whipped Cream', 'Caramel Drizzle', 'Vanilla Foam', 'Chocolate Shavings'],
    basePrices: { S: 6.50, M: 7.50, L: 8.50 },
    rating: 4.8,
    reviews: 128,
    image: "/images/matchalate.webp"
  },
  
];

// Sản phẩm chính cho Hero section
export const mainFeaturedProduct = products[0];