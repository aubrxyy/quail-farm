import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateExtraCostSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().optional(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const parsed = updateExtraCostSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    
    const extraCost = await prisma.extraCost.update({
      where: { id: parseInt(params.id) },
      data: {
        name: parsed.data.name,
        amount: parsed.data.amount,
        category: parsed.data.category,
        ...(parsed.data.date && { date: new Date(parsed.data.date) }),
      }
    });
    
    return NextResponse.json(extraCost);
  } catch (error) {
    console.error('Error updating extra cost:', error);
    return NextResponse.json({ error: 'Failed to update extra cost' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.extraCost.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Extra cost deleted successfully' });
  } catch (error) {
    console.error('Error deleting extra cost:', error);
    return NextResponse.json({ error: 'Failed to delete extra cost' }, { status: 500 });
  }
}