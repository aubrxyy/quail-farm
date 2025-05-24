import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';
import path from 'path';
import { z } from 'zod';

// Validation schema
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  harga: z.number().positive("Price must be positive"),
  stock: z.number().min(0, "Stock cannot be negative"),
  deskripsi: z.string().min(1, "Description is required"),
});

// GET all products with search functionality
export async function GET(request: Request) {
  try {
    // Get URL search parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    // Build where clause
    let whereClause: any = {};

    if (search) {
      // Create OR conditions for search
      const searchConditions = [
        { name: { contains: search, mode: 'insensitive' } },
        { deskripsi: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } }
      ];

      // Add ID search if the search term is a number
      if (!isNaN(Number(search))) {
        searchConditions.push({ id: Number(search) });
      }

      whereClause.OR = searchConditions;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// CREATE new product
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const harga = Number(formData.get('harga'));
    const stock = Number(formData.get('stock'));
    const deskripsi = formData.get('deskripsi') as string;
    const file = formData.get('gambar') as File;

    // Validate data
    const validation = productSchema.safeParse({
      name,
      slug: slug || undefined,
      harga,
      stock,
      deskripsi
    });

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues }, { status: 400 });
    }

    let imagePath = '';

    // Handle image upload if provided
    if (file && file.size > 0) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create upload directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
      
      // Generate unique filename
      const fileExtension = path.extname(file.name);
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
      const filepath = path.join(uploadDir, filename);
      
      await writeFile(filepath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        harga,
        stock,
        deskripsi,
        gambar: imagePath,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}