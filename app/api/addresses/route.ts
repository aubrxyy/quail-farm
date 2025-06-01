import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

// Define schema for address creation
const createAddressSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  address: z.string().min(1, 'Address is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
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
    const addressData: any = {
      userId: payload.id,
      label: parsed.data.label,
      address: parsed.data.address,
      city: parsed.data.city,
      district: parsed.data.district,
      postalCode: parsed.data.postalCode,
      country: parsed.data.country,
    };
    if (parsed.data.latitude !== undefined) {
      addressData.latitude = parsed.data.latitude;
    }
    if (parsed.data.longitude !== undefined) {
      addressData.longitude = parsed.data.longitude;
    }
    const address = await prisma.address.create({
      data: addressData
    });
    
    return NextResponse.json(address, { status: 201 });
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 });
  }
} 