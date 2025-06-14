import { prisma } from '@/lib/prisma';
import { delivery_method, order_status, payment_method, payment_status } from '@prisma/client';
import { NextResponse } from 'next/server';

interface OrderItem {
    id: string;
    title: string;
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
    tableId?: string;
    items: OrderItem[];
    total: number;
    paymentMethod: payment_method;
    deliveryMethod?: delivery_method; // Optional for QR orders
    address?: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        note: string;
    };
    mode: 'qr' | 'web';
}

export async function POST(request: Request) {
    let body: CheckoutData;
    try {
        body = await request.json();
        
        console.log('Received tableId in backend:', body.tableId);

        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            throw new Error('Order items are required');
        }

        if (!body.total || body.total <= 0) {
            throw new Error('Invalid order total');
        }

        // Only require delivery method for Web orders, not for QR orders
        if (body.mode === 'web' && !body.deliveryMethod) {
            throw new Error('Delivery method is required for web orders');
        }

        if (body.deliveryMethod === delivery_method.DELIVERY && !body.address) {
            throw new Error('Delivery address is required for delivery orders');
        }

        const {
            tableId,
            items,
            total,
            paymentMethod = payment_method.CASH,
            deliveryMethod,
            address,
            customer,
            mode
        } = body;

        console.log('Processing order with items:', items);
        let tableData: TableData | null = null;
        
        // Handle QR orders
        if (mode === 'qr') {
            // For QR orders, table is required but delivery method is not needed
            if (!tableId) {
                return NextResponse.json({
                    success: false,
                    message: 'Table number is required for QR orders'
                }, { status: 400 });
            }
            
            console.log('Table Number:', tableId);
            
            // Find table by tableId (table number) instead of ID
            tableData = await prisma.manager_table.findFirst({
                where: { tableId: parseInt(tableId) }
            });
            
            console.log('Found table data:', tableData);
            if (!tableData) {
                return NextResponse.json({
                    success: false,
                    message: `Table number ${tableId} not found`
                }, { status: 400 });
            }

            // Create QR order without delivery method
            const order = await prisma.order.create({
                data: {
                    table: { connect: { id: tableData.id } },
                    total: total,
                    status: order_status.PENDING,
                    // No deliveryMethod for QR orders since customers are dining in
                    customerName: customer.name,
                    customerEmail: customer.email,
                    customerPhone: customer.phone,
                    note: customer.note,
                    items: {
                        create: items.map(item => ({
                            productId: item.id,
                            title: item.title,
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
                            status: payment_status.PENDING
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

            // Mark table as reserved for QR orders
            await prisma.manager_table.update({
                where: { id: tableData.id },
                data: { status: 'reserved' }
            });

            return NextResponse.json({
                success: true,
                message: 'Order created successfully',
                order: order,
                tableCode: tableData?.tableId
            });
        }
        
        // Handle Web orders
        if (mode === 'web') {
            // Create Web order
            const webOrder = await prisma.web_order.create({
                data: {
                    total: total,
                    status: order_status.PENDING,
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
                            status: payment_status.PENDING
                        }
                    }
                },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    payment: true
                }
            });

            return NextResponse.json({
                success: true,
                message: 'Web order created successfully',
                order: webOrder
            });
        }

    } catch (error) {
        console.error('Error creating order:', error);
        
        let errorMessage = 'Failed to create order';
        if (error instanceof Error) {
            if (error.message.includes('Table ID is required') || error.message.includes('Table number is required for pickup orders in QR mode')) {
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
