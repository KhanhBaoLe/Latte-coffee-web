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
    image: "/coffee-images/Caramel-macchiato-4.jpg"
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
    image: "/coffee-images/Hazelnut latte.jpg"
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
    image: "/coffee-images/Mocha-Delight-1-800x800.jpg"
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
    image: "/coffee-images/Iced-Americano-7.webp"
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
    image: "/coffee-images/coconut-cream-cold-brew-1.jpg"
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
    image: "/coffee-images/Pumpkin-Spice-Latte-4.webp"
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
    image: "/coffee-images/Espresso Con Panna.jpg"
  },
  {
    id: "8",
    title: "Vanilla Latte",
    description: "A delightful coffee beverage crafted with premium ingredients.",
    price: 6.01,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Whipped Cream",
      "Cinnamon"
    ],
    basePrices: {
      "S": 4.15,
      "M": 4.61,
      "L": 4.89
    },
    rating: 4.3,
    reviews: 213,
    image: "/coffee-images/Vanilla-Latte.png"
  },
  {
    id: "9",
    title: "Flat White",
    description: "A delightful coffee beverage crafted with premium ingredients.",
    price: 6.49,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Whipped Cream",
      "Cinnamon"
    ],
    basePrices: {
      "S": 2.7,
      "M": 4.88,
      "L": 5.16
    },
    rating: 4.8,
    reviews: 133,
    image: "/coffee-images/Flat-White.png"
  },
  {
    id: "10",
    title: "Irish Coffee",
    description: "A delightful coffee beverage crafted with premium ingredients.",
    price: 4.22,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Whipped Cream",
      "Cinnamon"
    ],
    basePrices: {
      "S": 3.42,
      "M": 4.62,
      "L": 4.78
    },
    rating: 4.7,
    reviews: 75,
    image: "/coffee-images/Irish-Coffee.png"
  },
  {
    id: "11",
    title: "Brown Sugar Milk Tea",
    description: "A delightful milk tea beverage crafted with premium ingredients.",
    price: 5.63,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    basePrices: {
      "S": 2.59,
      "M": 3.08,
      "L": 6.17
    },
    rating: 4.5,
    reviews: 86,
    image: "/milk-tea-images/Brown-Sugar-milk-tea.png"
  },
  {
    id: "12",
    title: "Taro Milk Tea",
    description: "A delightful milk tea beverage crafted with premium ingredients.",
    price: 5.93,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    basePrices: {
      "S": 2.79,
      "M": 4.03,
      "L": 5.68
    },
    rating: 4.8,
    reviews: 219,
    image: "/milk-tea-images/Taro-milk-tea.png"
  },
  {
    id: "13",
    title: "Honeydew Milk Tea",
    description: "A delightful milk tea beverage crafted with premium ingredients.",
    price: 5.53,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    basePrices: {
      "S": 2.51,
      "M": 5.23,
      "L": 6.41
    },
    rating: 4.6,
    reviews: 74,
    image: "/milk-tea-images/Honeydew-milk-tea.png"
  },
  {
    id: "14",
    title: "Thai Milk Tea",
    description: "A delightful milk tea beverage crafted with premium ingredients.",
    price: 5.44,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    basePrices: {
      "S": 2.75,
      "M": 3.37,
      "L": 5.85
    },
    rating: 4.8,
    reviews: 211,
    image: "/milk-tea-images/Thai-milk-tea.png"
  },
  {
    id: "15",
    title: "Wintermelon Milk Tea",
    description: "A delightful milk tea beverage crafted with premium ingredients.",
    price: 5.9,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    basePrices: {
      "S": 3.48,
      "M": 4.3,
      "L": 5.36
    },
    rating: 4.9,
    reviews: 229,
    image: "/milk-tea-images/Wintermelon-milk-tea.png"
  },
  {
    id: "16",
    title: "Chocolate Milk Tea",
    description: "A delightful milk tea beverage crafted with premium ingredients.",
    price: 6.21,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    basePrices: {
      "S": 3.54,
      "M": 4.73,
      "L": 5.21
    },
    rating: 4.8,
    reviews: 217,
    image: "/milk-tea-images/Chocolate-milk-tea.png"
  },
  {
    id: "17",
    title: "Hokkaido Milk Tea",
    description: "A delightful milk tea beverage crafted with premium ingredients.",
    price: 5.25,
    sizes: [
      "S",
      "M",
      "L"
    ],
    milkOptions: [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    drinkOptions: [
      "Hot",
      "Iced"
    ],
    toppings: [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    basePrices: {
      "S": 3.01,
      "M": 3.92,
      "L": 5.84
    },
    rating: 4.7,
    reviews: 213,
    image: "/milk-tea-images/Hokkaido-milk-tea.png"
  },
  {
    "id": "18",
    "title": "Matcha Latte",
    "description": "A delightful matchalatte beverage crafted with premium ingredients.",
    "price": 4.44,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    "drinkOptions": [
      "Hot",
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 3.35,
      "M": 3.37,
      "L": 5.35
    },
    "rating": 4.7,
    "reviews": 82,
    "image": "/matchalatte-images/Matchalatte.png"
  },
  {
    "id": "19",
    "title": "Vanilla Matcha",
    "description": "A delightful matchalatte beverage crafted with premium ingredients.",
    "price": 4.15,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    "drinkOptions": [
      "Hot",
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 2.5,
      "M": 5.83,
      "L": 6.43
    },
    "rating": 4.5,
    "reviews": 135,
    "image": "/matchalatte-images/Vanilla-Matcha.png"
  },
  {
    "id": "20",
    "title": "Honey Matcha",
    "description": "A delightful matchalatte beverage crafted with premium ingredients.",
    "price": 3.93,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    "drinkOptions": [
      "Hot",
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 3.67,
      "M": 5.81,
      "L": 6.14
    },
    "rating": 4.4,
    "reviews": 188,
    "image": "/matchalatte-images/Honey-Matcha.png"
  },
  {
    "id": "21",
    "title": "Creamy Matcha",
    "description": "A delightful matchalatte beverage crafted with premium ingredients.",
    "price": 6.46,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    "drinkOptions": [
      "Hot",
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 2.5,
      "M": 6.0,
      "L": 6.22
    },
    "rating": 4.5,
    "reviews": 108,
    "image": "/matchalatte-images/Creamy-Matcha.png"
  },

  {
    "id": "22",
    "title": "Mint Matcha",
    "description": "A delightful matchalatte beverage crafted with premium ingredients.",
    "price": 4.94,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "Whole Milk",
      "Oat Milk",
      "Almond Milk",
      "Soy Milk"
    ],
    "drinkOptions": [
      "Hot",
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 3.95,
      "M": 5.45,
      "L": 6.08
    },
    "rating": 4.8,
    "reviews": 107,
    "image": "/matchalatte-images/Mint-Matcha.png"
  },
  {
    "id": "23",
    "title": "Peach Tea",
    "description": "A delightful fruit tea beverage crafted with premium ingredients.",
    "price": 4.22,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "None"
    ],
    "drinkOptions": [
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 2.66,
      "M": 3.63,
      "L": 4.92
    },
    "rating": 4.5,
    "reviews": 229,
    "image": "/fruit-tea-images/Peach-tea.png"
  },
  {
    "id": "24",
    "title": "Lemon Tea",
    "description": "A delightful fruit tea beverage crafted with premium ingredients.",
    "price": 5.35,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "None"
    ],
    "drinkOptions": [
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 3.55,
      "M": 4.98,
      "L": 4.24
    },
    "rating": 4.5,
    "reviews": 87,
    "image": "/fruit-tea-images/Lemon-tea.png"
  },

  {
    "id": "25",
    "title": "Passion Fruit Tea",
    "description": "A delightful fruit tea beverage crafted with premium ingredients.",
    "price": 3.57,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "None"
    ],
    "drinkOptions": [
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 4.37,
      "M": 4.72,
      "L": 5.86
    },
    "rating": 4.3,
    "reviews": 100,
    "image": "/fruit-tea-images/Passion-fruit-tea.png"
  },
  {
    "id": "26",
    "title": "Mango Tea",
    "description": "A delightful fruit tea beverage crafted with premium ingredients.",
    "price": 4.37,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "None"
    ],
    "drinkOptions": [
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 3.62,
      "M": 4.93,
      "L": 5.15
    },
    "rating": 4.6,
    "reviews": 201,
    "image": "/fruit-tea-images/Mango-tea.png"
  },
  {
    "id": "27",
    "title": "Lychee Tea",
    "description": "A delightful fruit tea beverage crafted with premium ingredients.",
    "price": 6.41,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "None"
    ],
    "drinkOptions": [
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 3.35,
      "M": 3.37,
      "L": 3.89
    },
    "rating": 4.9,
    "reviews": 116,
    "image": "/fruit-tea-images/Lychee-tea.png"
  },
  {
    "id": "28",
    "title": "Strawberry Tea",
    "description": "A delightful fruit tea beverage crafted with premium ingredients.",
    "price": 3.93,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "None"
    ],
    "drinkOptions": [
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 2.82,
      "M": 3.24,
      "L": 3.68
    },
    "rating": 4.9,
    "reviews": 231,
    "image": "/fruit-tea-images/Strawberry-tea.png"
  },
  {
    "id": "29",
    "title": "Grapefruit Tea",
    "description": "A delightful fruit tea beverage crafted with premium ingredients.",
    "price": 3.75,
    "sizes": [
      "S",
      "M",
      "L"
    ],
    "milkOptions": [
      "None"
    ],
    "drinkOptions": [
      "Iced"
    ],
    "toppings": [
      "Boba",
      "Pudding",
      "Grass Jelly",
      "Red Bean"
    ],
    "basePrices": {
      "S": 2.63,
      "M": 2.85,
      "L": 5.17
    },
    "rating": 4.9,
    "reviews": 236,
    "image": "/fruit-tea-images/Grapefruit-tea.png"
  }
];

// Sản phẩm chính cho Hero section
export const mainFeaturedProduct = products[0];