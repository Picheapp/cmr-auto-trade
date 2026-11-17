import { NextResponse } from 'next/server';
import { COOKIE, verifySession, STAFF } from './lib/session';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const user = await verifySession(req.cookies.get(COOKIE)?.value);
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith('/admin') && !STAFF.includes(user.role)) {
    return NextResponse.redirect(new URL('/account', req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ['/admin/:path*', '/account/:path*'] };
