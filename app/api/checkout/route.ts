import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    size?: string;
    milk?: string;
    drink?: string;
    toppings?: string[];
}

interface TableData {
    id: string;
    tableId: number;
    createdAt: Date;
    updatedAt: Date;
}

interface CheckoutData {
    tableId?: string; // Thay đổi từ String sang string
    items: OrderItem[];
    total: number;
    paymentMethod: PaymentMethod;
    deliveryMethod: "PICKUP" | "DELIVERY";
    address?: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        note: string;
    };
}

export async function POST(request: Request) {
    let body: CheckoutData;
    try {
        body = await request.json();
        
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            throw new Error('Order items are required');
        }

        if (!body.total || body.total <= 0) {
            throw new Error('Invalid order total');
        }

        if (!body.deliveryMethod) {
            throw new Error('Delivery method is required');
        }

        if (body.deliveryMethod === 'DELIVERY' && !body.address) {
            throw new Error('Delivery address is required for delivery orders');
        }

        const {
            tableId,
            items,
            total,
            paymentMethod = PaymentMethod.CASH,
            deliveryMethod,
            address,
            customer
        } = body;

        console.log('Processing order with items:', items);
        let tableData: TableData | null = null;
        // Xử lý table cho pickup orders        let tableData: TableData | null = null;
        if (deliveryMethod === 'PICKUP') {
            if (!tableId) {
                return NextResponse.json({
                    success: false,
                    message: 'Table number is required for pickup orders'
                }, { status: 400 });
            }
            
            // The tableId is now already in the correct format "tableX"
            console.log('Table ID:', tableId);
            
            tableData = await prisma.table.findFirst({
                where: { id: tableId }
            });
            
            console.log('Found table data:', tableData);
            if (!tableData) {
                return NextResponse.json({
                    success: false,
                    message: `Table with ID ${tableId} not found`
                }, { status: 400 });
            }
        }

        // Validate product IDs
        const productIds = items.map(item => item.id);
        const existingProducts = await prisma.product.findMany({
            where: {
                id: { in: productIds }
            },
            select: { id: true }
        });

        const existingProductIds = new Set(existingProducts.map(product => product.id));
        const invalidProductIds = productIds.filter(id => !existingProductIds.has(id));

        if (invalidProductIds.length > 0) {
            return NextResponse.json({
                success: false,
                message: 'One or more product IDs are invalid',
                invalidProductIds
            }, { status: 400 });
        }

        // Create order with original product IDs
        const order = await prisma.order.create({
            data: {
                table: tableData ? { connect: { id: tableData.id } } : undefined,
                total: total,
                status: OrderStatus.PENDING,
                deliveryMethod: deliveryMethod,
                deliveryAddress: address,
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                note: customer.note,
                items: {
                    create: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size || null,
                        milk: item.milk || null,
                        drink: item.drink || null,
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
                items: {
                    include: {
                        product: true
                    }
                },
                payment: true,
                table: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            order: order,
            tableCode: tableData?.tableId
        });

    } catch (error) {
        console.error('Error creating order:', error);
        
        let errorMessage = 'Failed to create order';
        if (error instanceof Error) {
            if (error.message.includes('Table ID is required')) {
                errorMessage = 'Table number is required for pickup orders';
            } else if (error.message.includes('Table with ID')) {
                errorMessage = 'Invalid table number';
            } else if (error.message.includes('Required')) {
                errorMessage = 'Missing required fields';
            } else if (error.message.includes('Invalid item data')) {
                errorMessage = 'Invalid item data in order';
            } else if (error.message.includes('Delivery address')) {
                errorMessage = 'Delivery address is required for delivery orders';
            } else if (error.message.includes('Foreign key constraint failed')) {
                errorMessage = 'One or more products are not available. Please check your cart.';
            }
        }

        return NextResponse.json({
            success: false,
            message: errorMessage,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 400 });
    }
}
