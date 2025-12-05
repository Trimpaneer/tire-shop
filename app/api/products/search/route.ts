import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Product {
    reference: string | null;
    name: string;
    brand: string;
    size: string;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({
                references: [],
                names: [],
                brands: [],
                sizes: []
            });
        }

        const searchTerm = query.trim().toLowerCase();

        // Fetch products matching the search term
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { reference: { contains: searchTerm, mode: 'insensitive' } },
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { brand: { contains: searchTerm, mode: 'insensitive' } },
                    { size: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            select: {
                reference: true,
                name: true,
                brand: true,
                size: true
            },
            take: 50 // Limit results for performance
        });

        // Extract and deduplicate suggestions
        const references = new Set<string>();
        const names = new Set<string>();
        const brands = new Set<string>();
        const sizes = new Set<string>();

        products.forEach((product: Product) => {
            if (product.reference && product.reference.toLowerCase().includes(searchTerm)) {
                references.add(product.reference);
            }
            if (product.name.toLowerCase().includes(searchTerm)) {
                names.add(product.name);
            }
            if (product.brand.toLowerCase().includes(searchTerm)) {
                brands.add(product.brand);
            }
            if (product.size.toLowerCase().includes(searchTerm)) {
                sizes.add(product.size);
            }
        });

        // Convert sets to arrays and limit results
        const response = {
            references: Array.from(references).slice(0, 5),
            names: Array.from(names).slice(0, 5),
            brands: Array.from(brands).slice(0, 5),
            sizes: Array.from(sizes).slice(0, 5).sort((a, b) =>
                a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
            )
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in search API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch search suggestions' },
            { status: 500 }
        );
    }
}
