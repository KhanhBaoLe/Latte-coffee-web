import { NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

import { products } from '@/app/data/products'

// GET all products
export async function GET() {
  try {
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
