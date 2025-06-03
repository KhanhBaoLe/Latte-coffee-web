import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    let body;
    try {
        body = await request.json();
        const {
            tableId,
            items,
            total, // Changed from totalAmount to match frontend data
            paymentMethod = PaymentMethod.CASH // Default to CASH if not specified
        } = body;

        // Log the incoming data
        console.log('Received order data:', {
            tableId,
            itemsCount: items?.length,
            total,
            paymentMethod
        });

        // First, find the table by its tableId
        const table = await prisma.table.findFirst({
            where: {
                tableId: tableId.toString()
            }
        });

        if (!table) {
            throw new Error(`Table with ID ${tableId} not found`);
        }

        // Create the order with its items and payment
        const order = await prisma.order.create({
            data: {
                tableId: table.id, // Use the table's id, not tableId
                total: total,
                status: OrderStatus.PENDING,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                        milk: item.milk,
                        drink: item.drink,
                        toppings: item.toppings || []
                    }))
                },
                payment: {
                    create: {
                        amount: total,
                        paymentMethod: paymentMethod,
                        status: PaymentStatus.PENDING
                    }
                }
            },
            include: {
                items: true,
                payment: true,
                table: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            order: order
        });

    } catch (error) {
        // Log detailed error information
        console.error('Error creating order:', {
            error: error,
            stack: error instanceof Error ? error.stack : 'No stack trace',
            body: body // Log the request body for debugging
        });

        // Add more specific error messages based on the error type
        let errorMessage = 'Failed to create order';
        if (error instanceof Error) {
            if (error.message.includes('Foreign key constraint')) {
                errorMessage = 'Invalid table ID or product ID';
            } else if (error.message.includes('Required')) {
                errorMessage = 'Missing required fields';
            }
        }

        return NextResponse.json({
            success: false,
            message: errorMessage,
            error: error instanceof Error ? error.message : 'Unknown error',
            details: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}