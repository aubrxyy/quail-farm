import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { generateSlug } from '@/lib/utils';

const createProductSchema = z.object({
  name: z.string().min(1),
  gambar: z.string().min(1),
  deskripsi: z.string().min(1),
  harga: z.number().positive(),
  stock: z.number().int().min(0),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stockFilter = searchParams.get('stock');
    
    // Handle filtering by stock level
    if (stockFilter === 'low') {
      const lowStockThreshold = parseInt(process.env.LOW_STOCK_THRESHOLD || '20');
      
      const products = await prisma.product.findMany({
        where: {
          stock: {
            lte: lowStockThreshold
          }
        },
        orderBy: {
          stock: 'asc'
        }
      });
      
      return NextResponse.json(products);
    }
    
    // No filters, return all products
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    
    // Generate slug from product name
    const slug = generateSlug(parsed.data.name);
    
    // Check if slug already exists
    const existingProduct = await prisma.product.findFirst({
      where: { slug }
    });
    
    if (existingProduct) {
      return NextResponse.json({ error: 'A product with this name already exists' }, { status: 400 });
    }
    
    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        slug
      }
    });
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}