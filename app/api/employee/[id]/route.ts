import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  salary: z.number().positive(),
  position: z.string().optional().default('Staff'),
  phone: z.string().optional().default(''),
  status: z.enum(['Active', 'Inactive']).optional().default('Active'),
  hireDate: z.string().optional(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await params to get the id
    const body = await request.json();
    const parsed = updateEmployeeSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    
    const employee = await prisma.employee.update({
      where: { id: parseInt(id) }, // Use the auto-incrementing id
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        salary: parsed.data.salary,
        position: parsed.data.position,
        phone: parsed.data.phone,
        status: parsed.data.status,
        ...(parsed.data.hireDate && { hireDate: new Date(parsed.data.hireDate) }),
      }
    });
    
    return NextResponse.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.employee.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}