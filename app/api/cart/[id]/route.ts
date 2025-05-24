import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const cartId = parseInt(params.id);
  const { quantity } = await req.json();

  if (quantity < 1) {
    return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
  }

  // Get cart item and product stock
  const cartItem = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { product: true }
  });
  if (!cartItem) {
    return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
  }
  if (quantity > cartItem.product.stock) {
    return NextResponse.json({ error: `Stok tidak cukup. Maksimal ${cartItem.product.stock} item dapat ditambahkan ke keranjang.` }, { status: 400 });
  }

  const updated = await prisma.cart.update({
    where: { id: cartId },
    data: { quantity },
    include: { product: true }
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const cartId = parseInt(params.id);
  await prisma.cart.delete({ where: { id: cartId } });
  return NextResponse.json({ success: true });
}