export { default } from "next-auth/middleware";

// Alternatively, for more complex logic, you can define your own middleware function:
/*
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // Example: Protect /dashboard and its sub-routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const signInUrl = new URL('/api/auth/signin', req.url);
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
*/

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect all routes under /dashboard
    // Add other paths you want to protect
    // '/profile',
    // '/settings',
  ],
}; 