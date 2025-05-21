
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware(request: Request) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  const url = new URL(request.url);

  if (


    url.pathname === '/register' ||


    url.pathname === '/login' ||


    url.pathname.startsWith('/api/auth')


  ) {
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

  // API route protection for ADMIN users
  if (url.pathname.startsWith('/api')) {
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const session = await decrypt(sessionToken);

      if (
        (url.pathname.startsWith('/api/employee') || url.pathname.startsWith('/api/users')) &&
        session?.role !== 'ADMIN'
      ) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Failed to verify session:', error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/',
    '/api/:path*',
  ],
  };
