import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id } = params;

        const product = await prisma.product.update({
            where: { id },
            data: body,
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = params;

        // First delete related records if necessary (though cascade delete might handle it)
        // Prisma schema doesn't show cascade for StockMovement, so let's check.
        // Usually it's safer to delete related items or rely on DB constraints.
        // For now, let's assume simple delete.

        await prisma.stockMovement.deleteMany({
            where: { productId: id }
        });

        await prisma.cartItem.deleteMany({
            where: { productId: id }
        });

        // OrderItems might prevent deletion if orders exist. 
        // Ideally we soft delete or archive, but for this task we'll try hard delete
        // and catch error if it fails due to foreign key constraints (e.g. existing orders).

        const product = await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
    }
}
