import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  salary: z.number().positive(),
  position: z.string().optional().default('Staff'),
  phone: z.string().optional().default(''),
  status: z.enum(['Active', 'Inactive']).optional().default('Active'),
  hireDate: z.string().optional().default(new Date().toISOString()),
});

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createEmployeeSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    
    // Auto-generate employeeId
    const lastEmployee = await prisma.employee.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    
    const nextId = (lastEmployee?.id || 0) + 1;
    const employeeId = `EMP${nextId.toString().padStart(3, '0')}`;
    
    // Create employee with auto-generated employeeId
    const employee = await prisma.employee.create({
      data: {
        employeeId: employeeId,
        name: parsed.data.name,
        email: parsed.data.email,
        salary: parsed.data.salary,
        position: parsed.data.position,
        phone: parsed.data.phone,
        status: parsed.data.status,
        hireDate: new Date(parsed.data.hireDate),
      }
    });
    
    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}