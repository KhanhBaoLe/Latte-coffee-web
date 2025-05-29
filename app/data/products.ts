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
    title: "Caramel Macchiato",
    description: "Delight in our signature espresso layered with vanilla and topped with caramel drizzle.",
    price: 5.90,
    originalPrice: 6.50,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Whole Milk", "Oat Milk", "Almond Milk", "Soy Milk"],
    drinkOptions: ["Hot", "Iced"],
    toppings: ["Caramel Drizzle", "Whipped Cream"],
    basePrices: { S: 4.90, M: 5.90, L: 6.90 },
    rating: 4.7,
    reviews: 214,
    image: "/images/Caramel-macchiato-4.jpg"
  },
  {
    id: "2",
    title: "Hazelnut Latte",
    description: "Smooth espresso blended with hazelnut syrup and steamed milk, topped with foam.",
    price: 5.50,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Whole Milk", "Skim Milk", "Almond Milk"],
    drinkOptions: ["Hot", "Iced"],
    toppings: ["Whipped Cream", "Nutmeg Powder"],
    basePrices: { S: 4.50, M: 5.50, L: 6.50 },
    rating: 4.6,
    reviews: 185,
    image: "/images/Hazelnut latte.jpg"
  },
  {
    id: "3",
    title: "Mocha Delight",
    description: "Rich mocha espresso with chocolate syrup and creamy steamed milk.",
    price: 6.00,
    originalPrice: 6.80,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Whole Milk", "Skim Milk", "Soy Milk"],
    drinkOptions: ["Hot", "Iced", "Blended"],
    toppings: ["Chocolate Shavings", "Whipped Cream"],
    basePrices: { S: 5.00, M: 6.00, L: 7.00 },
    rating: 4.8,
    reviews: 240,
    image: "/images/Mocha-Delight-1-800x800.jpg"
  },
  {
    id: "4",
    title: "Iced Americano",
    description: "Bold espresso poured over cold water and ice for a refreshing hit.",
    price: 3.50,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["None"],
    drinkOptions: ["Iced"],
    toppings: [],
    basePrices: { S: 2.90, M: 3.50, L: 3.90 },
    rating: 4.5,
    reviews: 130,
    image: "/images/Iced-Americano-7.webp"
  },
  {
    id: "5",
    title: "Coconut Cold Brew",
    description: "Smooth cold brew coffee fused with coconut milk and a touch of vanilla.",
    price: 5.80,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Coconut Milk"],
    drinkOptions: ["Iced"],
    toppings: ["Vanilla Foam"],
    basePrices: { S: 4.80, M: 5.80, L: 6.80 },
    rating: 4.9,
    reviews: 105,
    image: "/images/coconut-cream-cold-brew-1.jpg"
  },
  {
    id: "6",
    title: "Pumpkin Spice Latte",
    description: "Classic fall favorite with pumpkin spice, espresso, and steamed milk.",
    price: 6.20,
    sizes: ['S', 'M', 'L'],
    milkOptions: ["Whole Milk", "Oat Milk", "Soy Milk"],
    drinkOptions: ["Hot"],
    toppings: ["Pumpkin Spice", "Whipped Cream"],
    basePrices: { S: 5.20, M: 6.20, L: 7.20 },
    rating: 4.7,
    reviews: 178,
    image: "/images/Pumpkin-Spice-Latte-4.webp"
  },
  {
    id: "7",
    title: "Espresso Con Panna",
    description: "A rich espresso shot topped with a dollop of whipped cream.",
    price: 3.00,
    sizes: ['Single', 'Double'],
    milkOptions: ["None"],
    drinkOptions: ["Hot"],
    toppings: ["Whipped Cream"],
    basePrices: { Single: 2.50, Double: 3.00 },
    rating: 4.4,
    reviews: 98,
    image: "/images/Espresso Con Panna.jpg"
  }
];

// Sản phẩm chính cho Hero section
export const mainFeaturedProduct = products[0];