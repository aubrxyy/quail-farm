// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { sendOrderCreatedEmail } from '@/lib/email';
import { checkInventoryAvailability, updateInventoryForOrder } from '@/lib/inventory';

// Define schema for order creation
const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerAddress: z.string().min(1),
  orderDate: z.string().transform(str => new Date(str)),
  orderType: z.string().min(1),
  orderAmount: z.number().int().positive(),
  totalPrice: z.number().positive(),
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  productId: z.number().int().positive(),
});

// Get all orders
export async function GET() {
  try {
    // Get the session from cookies
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if admin or user
    const isAdmin = payload.role === 'ADMIN';
    
    // If admin, return all orders; if user, return only their orders
    const orders = await prisma.order.findMany({
      where: isAdmin ? {} : { userId: payload.id },
      include: {
        product: true,
        user: {  // FIXED: Changed from customerName to user (the actual relation name)
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// Create a new order
export async function POST(request: Request) {
  try {
    // Get the session from cookies
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
const body = await request.json();
const parsed = createOrderSchema.safeParse(body);

if (!parsed.success) {
  return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
}

// Get user from database
const user = await prisma.user.findUnique({
  where: { id: payload.id }
});

if (!user) {
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

// Check inventory before creating order
    
    // Check inventory before creating order
    const inventoryCheck = await checkInventoryAvailability(
      parsed.data.productId, 
      parsed.data.orderAmount
    );
    
    if (!inventoryCheck.available) {
      return NextResponse.json({ 
        error: `Insufficient stock. Only ${inventoryCheck.currentStock} available.` 
      }, { status: 400 });
    }
      // Create order
    const order = await prisma.order.create({
      data: {
        ...parsed.data,
        userId: payload.id,
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // Update inventory after creating order
    await updateInventoryForOrder(order.id);

    // Send order confirmation email if user has email
    if (user.email) {
      await sendOrderCreatedEmail(user.email, order);
    }
    
    // Notify admins about new order
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    
    for (const admin of adminUsers) {
      if (admin.email) {
        await sendOrderCreatedEmail(admin.email, {
          ...order,
          isAdminNotification: true
        });
      }
    }
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}