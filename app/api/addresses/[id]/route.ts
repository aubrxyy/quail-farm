import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

// Define schema for address updates
const updateAddressSchema = z.object({
  street: z.string().min(1, 'Street is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  province: z.string().min(1, 'Province is required').optional(),
  postalCode: z.string().min(1, 'Postal code is required').optional(),
});

// Get a specific address
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Get the session from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = parseInt(context.params.id);

    // Get the address and verify ownership
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: payload.id,
      },
    });

    if (!address) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error fetching address:', error);
    return NextResponse.json({ error: 'Failed to fetch address' }, { status: 500 });
  }
}

// Update an address
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Get the session from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = parseInt(context.params.id);
    const body = await request.json();
    const parsed = updateAddressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }

    // Verify address ownership before updating
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: payload.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Update the address
    const address = await prisma.address.update({
      where: { id: addressId },
      data: parsed.data,
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// Delete an address
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    // Get the session from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addressId = parseInt(context.params.id);

    // Verify address ownership before deleting
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: payload.id,
      },
    });

    if (!existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // Delete the address
    await prisma.address.delete({
      where: { id: addressId },
    });

    return NextResponse.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}