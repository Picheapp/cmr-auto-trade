import { NextResponse } from 'next/server';
export async function GET(req) {
  const l = req.nextUrl.searchParams.get('l') === 'en' ? 'en' : 'es';
  let back = '/';
  try { const r = new URL(req.headers.get('referer') || ''); if (r.host === req.nextUrl.host) back = r.pathname + r.search; } catch {}
  const res = NextResponse.redirect(new URL(back, req.url));
  res.cookies.set('lang', l, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' });
  return res;
}
