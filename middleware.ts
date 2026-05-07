import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'cfiel_cajero_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /cajero/login y /api/* no necesitan protección
  if (pathname.startsWith('/cajero/login')) {
    return NextResponse.next();
  }

  const isAuth = request.cookies.get(COOKIE_NAME)?.value === '1';
  if (!isAuth) {
    return NextResponse.redirect(new URL('/cajero/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cajero', '/cajero/:path*'],
};
