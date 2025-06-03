import { PrismaClient } from '@prisma/client'
import { categoryIds } from '../app/data/categories'
import { table as tables } from '../app/data/id_table'
import { products } from '../app/data/products'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating categories...')
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'coffee',
        startId: categoryIds.coffee.start,
        endId: categoryIds.coffee.end,
      }
    }),
    prisma.category.create({
      data: {
        name: 'milk-tea',
        startId: categoryIds.milkTea.start,
        endId: categoryIds.milkTea.end,
      }
    }),
    prisma.category.create({
      data: {
        name: 'matcha',
        startId: categoryIds.matchaLatte.start,
        endId: categoryIds.matchaLatte.end,
      }
    }),
    prisma.category.create({
      data: {
        name: 'fruit-tea',
        startId: categoryIds.fruitTea.start,
        endId: categoryIds.fruitTea.end,
      }
    })
  ])

  const categoryMap = new Map(categories.map(c => [c.name, c]))

  console.log('Creating products...')
  // Import products
  for (const product of products) {
    // Determine category based on product ID
    const categoryName =
      Number(product.id) >= Number(categoryIds.coffee.start) && Number(product.id) <= Number(categoryIds.coffee.end) ? 'coffee' :
        Number(product.id) >= Number(categoryIds.milkTea.start) && Number(product.id) <= Number(categoryIds.milkTea.end) ? 'milk-tea' :
          Number(product.id) >= Number(categoryIds.matchaLatte.start) && Number(product.id) <= Number(categoryIds.matchaLatte.end) ? 'matcha' :
            'fruit-tea'

    const category = categoryMap.get(categoryName)
    if (!category) {
      throw new Error(`Category ${categoryName} not found`)
    }

    await prisma.product.create({
      data: {
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || null,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        categoryId: category.id,
        sizes: product.sizes || [],
        milkOptions: product.milkOptions || [],
        drinkOptions: product.drinkOptions || [],
        toppings: product.toppings || [],
        basePrices: product.basePrices || {}
      }
    })
  }

  console.log('Creating tables...')
  // Create tables
  for (const table of tables) {
    await prisma.table.create({
      data: {
        tableId: table.id_table
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