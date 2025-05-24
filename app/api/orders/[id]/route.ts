import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { sendOrderStatusUpdateEmail } from '@/lib/email';
import { updateInventoryOnStatusChange } from '@/lib/inventory';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        user: true
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    const { status } = await request.json();

    // Get current order
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        user: true
      }
    });

    if (!currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        product: true,
        user: true
      }
    });

    // Handle inventory changes based on status
    await updateInventoryOnStatusChange(currentOrder, status);

    // Send email notification
    try {
      await sendOrderStatusUpdateEmail(updatedOrder.user.email, updatedOrder);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}