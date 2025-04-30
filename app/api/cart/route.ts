import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Get all cart items or filter by userId
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  
  const whereClause = userId ? { userId: parseInt(userId) } : {};
  
  try {
    const cartItems = await prisma.cart.findMany({
      where: whereClause,
      include: { 
        user: true,
        product: true 
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart items' }, 
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { userId, productId, quantity } = data;

  if (!userId || !productId) {
    return NextResponse.json(
      { error: 'userId and productId are required' }, 
      { status: 400 }
    );
  }

  try {
    // Check if product exists in user's cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existingCartItem) {
      // Update quantity if item already exists
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { 
          quantity: existingCartItem.quantity + (quantity || 1)
        },
        include: {
          user: true,
          product: true
        }
      });
      
      return NextResponse.json(updatedCartItem, { status: 200 });
    } else {
      // Create new cart item
      const newCartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity: quantity || 1
        },
        include: {
          user: true,
          product: true
        }
      });
      
      return NextResponse.json(newCartItem, { status: 201 });
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}