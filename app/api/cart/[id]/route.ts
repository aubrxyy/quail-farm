import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cartId = parseInt(id);
  const { quantity } = await req.json();

  if (quantity < 1) {
    return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
  }

  // Get cart item and product stok
  const cartItem = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { product: true }
  });
  if (!cartItem) {
    return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
  }
  if (quantity > cartItem.product.stok) {
    return NextResponse.json({ error: `Stok tidak cukup. Maksimal ${cartItem.product.stok} item dapat ditambahkan ke keranjang.` }, { status: 400 });
  }

  const updated = await prisma.cart.update({
    where: { id: cartId },
    data: { quantity },
    include: { product: true }
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cartId = parseInt(id);
  await prisma.cart.delete({ where: { id: cartId } });
  return NextResponse.json({ success: true });
}