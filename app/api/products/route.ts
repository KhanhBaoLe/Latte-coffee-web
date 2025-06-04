import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all products từ database
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
