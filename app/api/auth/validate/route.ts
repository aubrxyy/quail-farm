import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const SECRET = process.env.SESSION_SECRET!;

export async function GET(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const sessionCookie = cookie.split('; ').find(c => c.startsWith('session='));
  const token = sessionCookie?.split('=')[1];

  if (!token) {
    return NextResponse.json({ valid: false, error: 'No session token' }, { status: 401 });
  }

  try {
    const session = verify(token, SECRET);
    return NextResponse.json({ valid: true, session });
  } catch {
    return NextResponse.json({ valid: false, error: 'Invalid session' }, { status: 401 });
  }
}