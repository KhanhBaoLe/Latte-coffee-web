import { prisma } from '@/lib/prisma';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { NextResponse } from 'next/server';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    size?: string;
    milk?: string;
    drink?: string;
    toppings?: string[];
}

interface CheckoutData {
    tableId?: number; // tableId là số
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
        
        // Validate required fields
        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            throw new Error('Order items are required');
        }

        if (!body.total || body.total <= 0) {
            throw new Error('Invalid order total');
        }

        if (!body.deliveryMethod) {
            throw new Error('Delivery method is required');
        }

        // Validate address for delivery
        if (body.deliveryMethod === 'DELIVERY' && !body.address) {
            throw new Error('Delivery address is required for delivery orders');
        }

        // Validate items data
        if (body.items.some(item => !item.id || item.quantity <= 0 || item.price <= 0)) {
            throw new Error('Invalid item data');
        }

        const {
            tableId,
            items,
            total,
            paymentMethod = PaymentMethod.CASH,
            deliveryMethod,
            address
        } = body;

        // Log the incoming data
        console.log('Received order data:', {
            tableId,
            itemsCount: items?.length,
            total,
            paymentMethod,
            deliveryMethod,
            address
        });

        let tableData = null;
        
        // Tìm bàn dựa trên id_table
        if (deliveryMethod === 'PICKUP') {
            if (!tableId) {
                throw new Error('Table ID is required for pickup orders');
            }
            
            // Tìm bàn bằng tableId (Int, đúng với schema)
            const table = await prisma.table.findFirst({
                where: {
                    tableId: tableId // tableId là Int
                }
            });

            if (!table) {
                throw new Error(`Table with ID ${tableId} not found`);
            }
            
            tableData = table;
        }

        // Tạo đơn hàng
        const order = await prisma.order.create({
            data: {
                table: tableData?.id ? { connect: { id: tableData.id } } : undefined,
                total: total,
                status: OrderStatus.PENDING,
                deliveryMethod: deliveryMethod,
                deliveryAddress: address,
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
                items: true,
                payment: true,
                table: true
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Order created successfully',
            order: order,
            tableCode: tableData?.tableId // Trả về id_table
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
            }
        }

        return NextResponse.json({
            success: false,
            message: errorMessage,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 400 });
    }
}