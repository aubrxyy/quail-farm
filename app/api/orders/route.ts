import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get URL search parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause based on user role
    let whereClause: any = {};

    // If user is not admin, only show their own orders
    if (payload.role !== 'ADMIN') {
      whereClause.userId = payload.id;
    }

    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (search) {
      // Create OR conditions for search
      const searchConditions: any[] = [
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerAddress: { contains: search, mode: 'insensitive' } },
      ];

      // For admin users, include user search
      if (payload.role === 'ADMIN') {
        searchConditions.push(
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { user: { email: { contains: search, mode: 'insensitive' } } }
        );
      }

      // Search in related product data
      searchConditions.push(
        { product: { name: { contains: search, mode: 'insensitive' } } }
      );

      // Add ID search if the search term is a number
      if (!isNaN(Number(search))) {
        searchConditions.push({ id: Number(search) });
      }

      whereClause.OR = searchConditions;
    }

    // Fetch orders with product, user, and full address information
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
        },
        address: true // include all address fields
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}