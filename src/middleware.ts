// Commenting out the default export
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Protect /dashboard and /forms routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/forms')) {
    if (!session) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('callbackUrl', pathname); // Redirect back after sign-in
      return NextResponse.redirect(signInUrl);
    }
    // You could add role-based access control here if needed
    // if (session.role !== 'ADMIN') {
    //   return NextResponse.redirect(new URL('/unauthorized', req.url));
    // }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect all routes under /dashboard
    '/forms/:path*',     // Protect all routes under /forms
    // '/profile',
    // '/settings',
  ],
}; 