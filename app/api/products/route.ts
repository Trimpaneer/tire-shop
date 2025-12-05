import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Helper to extract radial size (e.g., "205/55 R16" -> 16)
const getRadialSize = (size: string): number => {
    const match = size.match(/R(\d+)/i);
    return match ? parseInt(match[1], 10) : 0;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const vehicleType = searchParams.get('vehicleType');
    const size = searchParams.get('size');
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort'); // 'radial-asc', 'price-asc', 'price-desc'

    try {
        const where: any = {};
        if (vehicleType && vehicleType !== 'all') where.vehicleType = vehicleType;
        if (size) where.size = size;
        if (brand && brand !== 'all') where.brand = brand;

        let products = await prisma.product.findMany({
            where,
            orderBy: sort === 'price-asc' ? { price: 'asc' } :
                sort === 'price-desc' ? { price: 'desc' } :
                    undefined,
        });

        // Custom sorting for radial size if requested
        if (sort === 'radial-asc') {
            products.sort((a: any, b: any) => {
                const radialA = getRadialSize(a.size);
                const radialB = getRadialSize(b.size);
                if (radialA !== radialB) return radialA - radialB;
                // Tie-breaker: maintain DB order (which is roughly insertion order or ID)
                // Since we fetched from DB, we can use the index in the array as a proxy for "natural" order
                // or just rely on the stable sort.
                // To be safe and match previous logic:
                return 0;
            });
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: {
                ...body,
                stockMovements: {
                    create: {
                        quantity: body.stock || 0,
                        type: 'IN',
                        reason: 'Initial Creation',
                    },
                },
            },
        });
        return NextResponse.json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
    }
}
