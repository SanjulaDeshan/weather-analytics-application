import { auth0 } from './app/lib/auth0'; 
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    '/auth/:path*', 
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};