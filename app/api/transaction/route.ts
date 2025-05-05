import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, orderId, amount, paymentMethod, description } = body;

        // Create a new transaction with 'PENDING' status by default
        const transaction = await prisma.transaction.create({
            data: {
                userId,
                orderId,
                amount,
                paymentMethod,
                description,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ 
            success: true, 
            data: transaction 
        }, { status: 201 });
    } catch (error) {
        console.error('Transaction creation error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to create transaction' 
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const transactions = await prisma.transaction.findMany({
            include: {
                user: true,
                order: true,
            },
        });

        return NextResponse.json({ 
            success: true, 
            data: transactions 
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch transactions' 
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status } = body;

        const transaction = await prisma.transaction.update({
            where: { id },
            data: { 
                status,
                updatedAt: new Date()
            },
        });

        return NextResponse.json({ 
            success: true, 
            data: transaction 
        });
    } catch (error) {
        console.error('Transaction update error:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to update transaction' 
        }, { status: 500 });
    }
}