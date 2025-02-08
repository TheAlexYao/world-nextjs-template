import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  
  // Redirect authenticated users from home to chat
  if (token && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/chat', request.url));
  }
  
  // Protect /chat route
  if (!token && request.nextUrl.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
