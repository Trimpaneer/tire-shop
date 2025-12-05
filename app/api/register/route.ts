import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    console.log('API Register called');
    console.log('DATABASE_URL defined:', !!process.env.DATABASE_URL);

    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'USER', // Default role
            },
        });

        // Create empty cart for user
        await prisma.cart.create({
            data: {
                userId: user.id,
            },
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error details:', error);
        return NextResponse.json(
            { error: `Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}` },
            { status: 500 }
        );
    }
}
