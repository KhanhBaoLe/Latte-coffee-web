import { PrismaClient } from '@prisma/client'
import { products } from '../app/data/products'
import { isInCategory } from '../app/data/categories'

// Define a Product type based on the used properties
type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  sizes?: string[];
  milkOptions?: string[];
  drinkOptions?: string[];
  toppings?: string[];
  basePrices?: { [key: string]: number | undefined };
};

// Function to get price for Medium size
function getSizeMPrice(product: Product) {
  if (product.basePrices && product.basePrices.M) {
    return product.basePrices.M;
  }
  // If basePrices.M doesn't exist, return the default price
  return product.price;
}

const prisma = new PrismaClient()

async function main() {
  // Xóa dữ liệu cũ
  await prisma.product.deleteMany()

  // Import products
  for (const product of products) {
    // Xác định category dựa vào product ID
    let category = 'coffee' // default category
    
    if (isInCategory(product.id, 'coffee')) {
      category = 'coffee'
    } else if (isInCategory(product.id, 'milk-tea')) {
      category = 'milk-tea'
    } else if (isInCategory(product.id, 'matcha')) {
      category = 'matcha'
    } else if (isInCategory(product.id, 'fruit-tea')) {
      category = 'fruit-tea'
    }

    await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        price: getSizeMPrice(product),
        originalPrice: product.originalPrice || null,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        category: category,
        sizes: product.sizes,
        milkOptions: product.milkOptions,
        drinkOptions: product.drinkOptions,
        toppings: product.toppings || []
      }
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })