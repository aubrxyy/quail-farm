import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function GET() {
  const carts = await prisma.cart.findMany({
    include: { user: true, product: true },
  });
  return NextResponse.json(carts);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { userId, productId, quantity } = data;

  if (!userId || !productId) {
    return NextResponse.json({ error: 'userId and productId are required' }, { status: 400 });
  }

  const cart = await prisma.cart.create({
    data: {
      userId,
      productId,
      quantity: quantity ?? 1,
    },
  });

  return NextResponse.json(cart, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, quantity } = data;

  if (!id || typeof quantity !== 'number') {
    return NextResponse.json({ error: 'id and quantity are required' }, { status: 400 });
  }

  const cart = await prisma.cart.update({
    where: { id },
    data: { quantity },
  });

  return NextResponse.json(cart);
}

export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { id } = data;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  await prisma.cart.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Cart item deleted' });
}