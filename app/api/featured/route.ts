import { products } from '@/app/data/products';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get first 3 products for the carousel
    const featuredProducts = products.slice(0, 3);
    
    return NextResponse.json(featuredProducts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 });
  }
}
