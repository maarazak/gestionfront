import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register');
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard') ||
                      request.nextUrl.pathname.startsWith('/projects') ||
                      request.nextUrl.pathname.startsWith('/tasks');

  // Rediriger vers login si pas de token et route protégée
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Rediriger vers dashboard si token et sur page auth
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/projects/:path*', '/tasks/:path*', '/login', '/register'],
};
