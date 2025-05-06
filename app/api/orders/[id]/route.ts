import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { sendOrderStatusUpdateEmail } from '@/lib/email';

// Define schema for order updates - only include fields that should be updatable
const updateOrderSchema = z.object({
  customerName: z.string().min(1).optional(),
  customerAddress: z.string().min(1).optional(),
  orderType: z.string().min(1).optional(),
  orderAmount: z.number().int().positive().optional(),
  totalPrice: z.number().positive().optional(),
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get session for authentication
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Regular users can only view their own orders
    const isAdmin = payload.role === 'ADMIN';
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        product: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if user has permission to view this order
    if (!isAdmin && order.userId !== payload.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get session for authentication
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Get existing order to check permissions
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check permissions - admin can do anything, users can only cancel their own orders
    const isAdmin = payload.role === 'ADMIN';
    const isOwner = existingOrder.userId === payload.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    // Non-admin users can only change status to CANCELLED
    if (!isAdmin && isOwner && 
        parsed.data.status && 
        parsed.data.status !== 'CANCELLED') {
      return NextResponse.json({ 
        error: 'Regular users can only cancel orders' 
      }, { status: 403 });
    }

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: parsed.data,
      include: { 
        product: true,
        user: true
      },
    });

    // Send email notification if status changed
    if (parsed.data.status && existingOrder.status !== parsed.data.status) {
      // Send email to customer if they have an email
      if (existingOrder.user?.email) {
        await sendOrderStatusUpdateEmail(
          existingOrder.user.email, 
          updatedOrder
        );
      }
      
      // If a user (not admin) cancelled the order, notify admins
      if (!isAdmin && parsed.data.status === 'CANCELLED') {
        const adminUsers = await prisma.user.findMany({
          where: { role: 'ADMIN' }
        });
        
        for (const admin of adminUsers) {
          if (admin.email) {
            await sendOrderStatusUpdateEmail(admin.email, {
              ...updatedOrder,
              isAdminNotification: true,
              cancelledByUser: true
            });
          }
        }
      }
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get session for authentication
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can delete orders
    const isAdmin = payload.role === 'ADMIN';
    if (!isAdmin) {
      return NextResponse.json({ 
        error: 'Only administrators can delete orders' 
      }, { status: 403 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    // Get order with user info before deleting
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        user: true,
        product: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Delete the order
    await prisma.order.delete({ where: { id: orderId } });

    // Send email notification to user about the order deletion
    if (order.user?.email) {
      await sendOrderStatusUpdateEmail(order.user.email, {
        ...order,
        wasDeleted: true,
        status: 'DELETED' // Override status for email purposes
      });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}