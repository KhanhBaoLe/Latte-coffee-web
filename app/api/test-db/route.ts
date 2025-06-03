import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Try to fetch a single product to test the connection
        const testProduct = await prisma.product.findFirst();
        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            product: testProduct
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return NextResponse.json({
            success: false,
            message: 'Database connection failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}