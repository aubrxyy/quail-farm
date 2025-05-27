import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function saveImage(imageFile: File): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const extension = path.extname(imageFile.name);
  const filename = `${timestamp}${extension}`;
  const filepath = path.join(uploadDir, filename);

  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  return `/uploads/${filename}`;
}

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);

    // Parse form data
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const imageFile = formData.get('image') as File | null;

    // Get existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Handle image upload
    let imagePath = existingProduct.gambar;
    if (imageFile && imageFile.size > 0) {
      imagePath = await saveImage(imageFile);
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: name || existingProduct.name,
        gambar: imagePath,
        deskripsi: description || existingProduct.deskripsi,
        harga: price || existingProduct.harga,
        stok: stock !== undefined ? stock : existingProduct.stok,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const productId = parseInt(id);

    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}