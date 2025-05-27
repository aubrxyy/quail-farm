import { prisma } from '@/lib/prisma';
import { decrypt } from '@/lib/session';
import { compare, hash } from 'bcrypt';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const userId = parseInt(id);

    // Get the session from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is updating their own password (only self-updates allowed for security)
    if (payload.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = updatePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ 
        error: parsed.error.issues[0].message 
      }, { status: 400 });
    }

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isCurrentPasswordValid = await compare(parsed.data.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ 
        error: 'Password saat ini tidak valid' 
      }, { status: 400 });
    }

    // Hash new password
    const hashedNewPassword = await hash(parsed.data.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return NextResponse.json({ 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ 
      error: 'Failed to update password' 
    }, { status: 500 });
  }
}