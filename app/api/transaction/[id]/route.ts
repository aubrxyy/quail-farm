import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET transaction by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid transaction ID'
      }, { status: 400 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
        order: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch transaction'
    }, { status: 500 });
  }
}

// UPDATE transaction by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid transaction ID'
      }, { status: 400 });
    }

    const body = await request.json();
    
    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!existingTransaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date()
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update transaction'
    }, { status: 500 });
  }
}

// DELETE transaction by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid transaction ID'
      }, { status: 400 });
    }

    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!existingTransaction) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    // Delete transaction
    await prisma.transaction.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete transaction'
    }, { status: 500 });
  }
}