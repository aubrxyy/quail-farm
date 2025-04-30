import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session';

export async function middleware(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  const url = new URL(request.url);

  if (url.pathname === '/register' || url.pathname === '/login') {
    if (sessionToken) {
      try {
        const session = await decrypt(sessionToken);

        if (session?.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }

        return NextResponse.redirect(new URL('/', request.url));
      } catch (error) {
        console.error('Failed to verify session:', error);
      }
    }
    return NextResponse.next();
  }

  if (url.pathname === '/') {
    if (sessionToken) {
      try {
        const session = await decrypt(sessionToken);

        if (session?.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
      } catch (error) {
        console.error('Failed to verify session:', error);
      }
    }
    return NextResponse.next();
  }

  if (url.pathname.startsWith('/admin')) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      const session = await decrypt(sessionToken);

      if (session?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error('Failed to verify session:', error);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/register', '/login', '/'],
};