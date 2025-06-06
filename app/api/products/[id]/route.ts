import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest
) {
  try {
    // Workaround: Extract id directly from the URL path to bypass complex type validation
    const pathname = request.nextUrl.pathname;
    // Assuming the id is the last segment in the path /api/products/[id]
    const segments = pathname.split('/');
    const id = segments[segments.length - 1];

    // Validate if id was successfully extracted (basic check)
    if (!id) {
        return NextResponse.json({ error: 'Product ID not found in URL' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
