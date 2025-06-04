import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Lấy 3 sản phẩm đầu tiên từ database
    const featuredProducts = await prisma.product.findMany({
      take: 3,
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(featuredProducts);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 });
  }
}
