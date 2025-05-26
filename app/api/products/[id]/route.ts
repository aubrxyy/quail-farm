import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  gambar: z.string().optional().default(''),
  harga: z.number().positive("Price must be positive"),
  deskripsi: z.string().optional().default(''),
  stok: z.number().min(0, "Stock cannot be negative"),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    console.log('🔍 Fetching product:', productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('✅ Product found:', product.name);
    return NextResponse.json(product);
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    console.log('🔍 Updating product:', productId);

    const formData = await request.formData();
    
    // Handle the image file properly
    const imageFile = formData.get('gambar') as File;
    const currentImage = formData.get('currentImage') as string;
    
    let imagePath = currentImage || ''; // Keep current image by default
    
    if (imageFile && imageFile.size > 0) {
      // New image uploaded - just use filename for now
      imagePath = `/images/${imageFile.name}`;
      console.log('📸 New image file received:', imageFile.name, 'Size:', imageFile.size);
    }
    
    const productData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || '',
      gambar: imagePath,
      harga: Number(formData.get('harga')),
      deskripsi: formData.get('deskripsi') as string || '',
      stok: Number(formData.get('stock')),
    };

    console.log('📝 Updating product with data:', productData);

    const parsed = updateProductSchema.safeParse(productData);
    
    if (!parsed.success) {
      console.log('❌ Validation errors:', parsed.error.issues);
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug || null,
        gambar: parsed.data.gambar,
        harga: parsed.data.harga,
        deskripsi: parsed.data.deskripsi,
        stok: parsed.data.stok,
      }
    });
    
    console.log('✅ Updated product:', product);
    return NextResponse.json(product);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    console.log('🗑️ Deleting product:', productId);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });
    
    console.log('✅ Product deleted successfully');
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}