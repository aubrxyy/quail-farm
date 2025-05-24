import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import { unlink } from 'fs/promises';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function DELETE(
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

    const productId = parseInt(params.id);

    // Get product to check if it has an image
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete the product from database
    await prisma.product.delete({
      where: { id: productId }
    });

    // Delete image file if it exists
    if (product.gambar && product.gambar.startsWith('/uploads/')) {
      try {
        const imagePath = path.join(process.cwd(), 'public', product.gambar);
        await unlink(imagePath);
      } catch (error) {
        // Image file might not exist, continue anyway
        console.log('Could not delete image file:', error);
      }
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(
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

    const productId = parseInt(params.id);
    const { name, deskripsi, harga, stock, gambar } = await request.json();

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        deskripsi,
        harga,
        stock,
        gambar,
        slug: name.toLowerCase().replace(/\s+/g, '-')
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}