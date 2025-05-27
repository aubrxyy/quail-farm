import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateSlug } from '@/lib/utils';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const createProductSchema = z.object({
  name: z.string().min(1),
  gambar: z.string().optional().default(''),
  deskripsi: z.string().optional().default(''),
  harga: z.number().positive(),
  stok: z.number().int().min(0),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stockFilter = searchParams.get('stok');
    
    if (stockFilter === 'low') {
      const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD || '20');
      
      const products = await prisma.product.findMany({
        where: {
          stok: {
            lte: lowStockThreshold
          }
        },
        orderBy: {
          stok: 'asc'
        }
      });
      
      return NextResponse.json(products);
    }
    
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

async function saveImage(imageFile: File): Promise<string> {
  // Create uploads directory
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  const timestamp = Date.now();
  const extension = path.extname(imageFile.name);
  const filename = `${timestamp}${extension}`;
  const filepath = path.join(uploadDir, filename);

  // Save file
  const bytes = await imageFile.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filepath, buffer);

  // Return public URL
  return `/uploads/${filename}`;
}

export async function POST(request: NextRequest) {
  try {
    // Parse form data (multipart)
    const formData = await request.formData();
    
    // Get form fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const imageFile = formData.get('image') as File | null;

    // Handle image upload
    let imagePath = '';
    if (imageFile && imageFile.size > 0) {
      imagePath = await saveImage(imageFile);
    }

    // Validate data
    const productData = {
      name,
      gambar: imagePath,
      deskripsi: description || '',
      harga: price,
      stok: stock,
    };

    const parsed = createProductSchema.safeParse(productData);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    // Generate slug
    const slug = generateSlug(parsed.data.name);
    
    // Check if slug exists
    const existingProduct = await prisma.product.findFirst({
      where: { slug }
    });
    
    if (existingProduct) {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        slug
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    
    // Get product ID (for updates)
    const id = formData.get('id');
    
    if (!id) {
      // No ID = create new product (same as POST)
      return POST(request);
    }

    // Get form fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const imageFile = formData.get('image') as File | null;

    // Get existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Handle image upload
    let imagePath = existingProduct.gambar; // Keep existing image by default
    if (imageFile && imageFile.size > 0) {
      imagePath = await saveImage(imageFile);
    }

    // Update product
    const product = await prisma.product.update({
      where: { id: Number(id) },
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
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}