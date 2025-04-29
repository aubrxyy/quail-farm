import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerAddress: z.string().min(1),
  orderDate: z.string().transform(str => new Date(str)),
  orderType: z.string().min(1),
  orderAmount: z.number().int().positive(),
  totalPrice: z.number().positive(),
  status: z.string().min(1),
  productId: z.number().int().positive(),
});

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: { product: true }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    
    const order = await prisma.order.create({
      data: parsed.data,
      include: { product: true }
    });
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}