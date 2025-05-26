import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().optional(),
  gambar: z.string().optional().default(''),
  harga: z.number().positive("Price must be positive"),
  deskripsi: z.string().optional().default(''),
  stok: z.number().min(0, "Stock cannot be negative"),
});

export async function GET(request: Request) {
  try {
    console.log('🔍 Fetching products...');
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let whereClause = {};
    
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { deskripsi: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Found ${products.length} products`);
    return NextResponse.json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔍 Creating new product...');
    
    const formData = await request.formData();
    
    // Handle the image file properly - just get the name for now
    const imageFile = formData.get('gambar') as File;
    let imagePath = '';
    
    if (imageFile && imageFile.size > 0) {
      // For now, just use the filename. You can implement proper file upload later
      imagePath = `/images/${imageFile.name}`;
      console.log('📸 Image file received:', imageFile.name, 'Size:', imageFile.size);
    }
    
    const productData = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string || '',
      gambar: imagePath,
      harga: Number(formData.get('harga')),
      deskripsi: formData.get('deskripsi') as string || '',
      stok: Number(formData.get('stock')), // Form field is 'stock' but database is 'stok'
    };

    console.log('📝 Product data:', productData);
    
    const parsed = createProductSchema.safeParse(productData);
    
    if (!parsed.success) {
      console.log('❌ Validation errors:', parsed.error.issues);
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: parsed.error.issues 
      }, { status: 400 });
    }
    
    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug || null,
        gambar: parsed.data.gambar,
        harga: parsed.data.harga,
        deskripsi: parsed.data.deskripsi,
        stok: parsed.data.stok,
      }
    });
    
    console.log('✅ Created product:', product);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}