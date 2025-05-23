import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';


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
  try {
    // Get the session from cookies
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = payload.id; // Extract userId from session
    const data = await req.json();
    const { productId, quantity } = data;

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    // Get product stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product exists in user's cart
    const existingCartItem = await prisma.cart.findFirst({
      where: {
        userId,
        productId,
      },
    });

    const requestedQty = quantity || 1;
    const newQty = existingCartItem
      ? existingCartItem.quantity + requestedQty
      : requestedQty;

        if (newQty > product.stock) {
      return NextResponse.json(
        { error: `Stok tidak cukup. Maksimal ${product.stock} item dapat ditambahkan ke keranjang. Cek lagi keranjangmu.` },
        { status: 400 }
      );
    }

    if (existingCartItem) {
      // Update quantity if item already exists
      const updatedCartItem = await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: newQty,
        },
        include: {
          user: true,
          product: true,
        },
      });

      return NextResponse.json(updatedCartItem, { status: 200 });
    } else {
      // Create new cart item
      const newCartItem = await prisma.cart.create({
        data: {
          userId,
          productId,
          quantity: requestedQty,
        },
        include: {
          user: true,
          product: true,
        },
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