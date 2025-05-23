import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const SECRET = process.env.SESSION_SECRET!;

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const sessionCookie = cookie.split('; ').find(c => c.startsWith('session='));
  const token = sessionCookie?.split('=')[1];

  if (!token) {
    return NextResponse.json({ valid: false, error: 'No session token' }, { status: 401 });
  }

  try {
    const session = verify(token, SECRET) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return NextResponse.json({ valid: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ valid: true, user });
  } catch {
    return NextResponse.json({ valid: false, error: 'Invalid session' }, { status: 401 });
  }
}