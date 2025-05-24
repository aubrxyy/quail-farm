import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get URL search parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const whereClause: any = {};

    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (search) {
      // Create OR conditions for search
      const searchConditions: any[] = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerAddress: { contains: search, mode: 'insensitive' } },
        // Search in related user data
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        // Search in related product data
        { product: { name: { contains: search, mode: 'insensitive' } } }
      ];

      // Add ID search if the search term is a number
      if (!isNaN(Number(search))) {
        searchConditions.push({ id: Number(search) });
      }

      whereClause.OR = searchConditions;
    }

    // Fetch orders with product and user information
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            gambar: true,
            harga: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}