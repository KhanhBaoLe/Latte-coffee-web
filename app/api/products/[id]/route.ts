import { NextResponse } from 'next/server'
import { products } from '@/app/data/products'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Thêm await trước khi destructure
    const { id } = await params
    const product = products.find(p => p.id === id)

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}