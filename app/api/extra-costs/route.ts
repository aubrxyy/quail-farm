import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createExtraCostSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().min(1),
  date: z.string().optional().default(new Date().toISOString()),
});

export async function GET() {
  try {
    const extraCosts = await prisma.extraCost.findMany({
      orderBy: {
        date: 'desc'
      }
    });
    return NextResponse.json(extraCosts);
  } catch (error) {
    console.error('Error fetching extra costs:', error);
    return NextResponse.json({ error: 'Failed to fetch extra costs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createExtraCostSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    
    const extraCost = await prisma.extraCost.create({
      data: {
        name: parsed.data.name,
        amount: parsed.data.amount,
        category: parsed.data.category,
        date: new Date(parsed.data.date),
      }
    });
    
    return NextResponse.json(extraCost, { status: 201 });
  } catch (error) {
    console.error('Error creating extra cost:', error);
    return NextResponse.json({ error: 'Failed to create extra cost' }, { status: 500 });
  }
}