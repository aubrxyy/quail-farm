import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

// Define schema for address creation
const createAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  province: z.string().min(1, 'Province is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

// Get all addresses for the authenticated user
export async function GET() {
  try {
    // Get the session from cookies
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get all addresses for the user
    const addresses = await prisma.address.findMany({
      where: { userId: payload.id },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// Create a new address
export async function POST(request: Request) {
  try {
    // Get the session from cookies
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const parsed = createAddressSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    
    // Create address
    const address = await prisma.address.create({
      data: {
        ...parsed.data,
        userId: payload.id,
      }
    });
    
    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
} 