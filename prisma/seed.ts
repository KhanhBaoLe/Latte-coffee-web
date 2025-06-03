import { PrismaClient } from '@prisma/client'
import { categoryIds } from '../app/data/categories'
import { products } from '../app/data/products'
import { table as tables } from '../app/data/id_table'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning up old data...')
  try {
    await prisma.payment.deleteMany({})
    await prisma.orderItem.deleteMany({})
    await prisma.order.deleteMany({})
    await prisma.product.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.table.deleteMany({})
  } catch (error) {
    console.error('EError during cleanup:', error)
  }

  console.log('Creating categories...')
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

  const categoryMap = new Map<string, string>() // name -> UUID
  for (const c of categories) {
    categoryMap.set(c.name, c.id)
  }

  console.log(' Creating products...')
  for (const product of products) {
    const productId = Number(product.id)

    let categoryName: string | undefined = undefined

    if (productId >= Number(categoryIds.coffee.start) && productId <= Number(categoryIds.coffee.end)) {
      categoryName = 'coffee'
    } else if (productId >= Number(categoryIds.milkTea.start) && productId <= Number(categoryIds.milkTea.end)) {
      categoryName = 'milk-tea'
    } else if (productId >= Number(categoryIds.matchaLatte.start) && productId <= Number(categoryIds.matchaLatte.end)) {
      categoryName = 'matcha'
    } else if (productId >= Number(categoryIds.fruitTea.start) && productId <= Number(categoryIds.fruitTea.end)) {
      categoryName = 'fruit-tea'
    }

    if (!categoryName) {
      console.warn(` Không xác định được category cho sản phẩm ID ${product.id} - ${product.title}`)
      continue
    }

    const categoryId = categoryMap.get(categoryName)
    if (!categoryId) {
      console.warn(` Không tìm thấy categoryId cho ${categoryName}`)
      continue
    }

    await prisma.product.create({
      data: {
        id: uuidv4(),
        title: product.title,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || null,
        rating: product.rating,
        reviews: product.reviews,
        image: product.image,
        categoryId: categoryId,
        sizes: product.sizes || [],
        milkOptions: product.milkOptions || [],
        drinkOptions: product.drinkOptions || [],
        toppings: product.toppings || [],
        basePrices: product.basePrices
      }
    })
  }

  console.log('🪑 Creating tables...')
  for (const table of tables) {
    await prisma.table.create({
      data: {
        id: uuidv4(),
        tableId: Number(table.id_table.replace('table', ''))
      }
    })
  }

  console.log(' Seeding completed!')
}

main()
  .catch((e) => {
    console.error(' Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
