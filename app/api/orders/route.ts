import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, total } = body; // items: { productId, quantity, price }[]

        // Transaction to ensure stock is updated and order is created atomically
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const order = await tx.order.create({
                data: {
                    total,
                    status: 'COMPLETED', // Simplified for now
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });

            // 2. Update Stock and Log Movement for each item
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });

                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        quantity: -item.quantity,
                        type: 'SALE',
                        reason: `Order ${order.id}`,
                    },
                });
            }

            return order;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}
