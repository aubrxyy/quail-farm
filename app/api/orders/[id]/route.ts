import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateOrderSchema = z.object({
  customerName: z.string().min(1).optional(),
  customerAddress: z.string().min(1).optional(),
  orderDate: z.string().transform(str => new Date(str)).optional(),
  orderType: z.string().min(1).optional(),
  orderAmount: z.number().int().positive().optional(),
  totalPrice: z.number().positive().optional(),
  status: z.string().min(1).optional(),
  productId: z.number().int().positive().optional(),
});

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params; // Await params
    const orderId = parseInt(id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params; // Await params
    const orderId = parseInt(id);
    const body = await request.json();

    const parsed = updateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: parsed.data,
      include: { product: true },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params; // Await params
    const orderId = parseInt(id);

    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}