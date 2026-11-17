import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { one } from '@/lib/db';
import { signSession, COOKIE } from '@/lib/session';
import { ok, bad, str } from '@/lib/http';
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const email = str(b.email, 160).toLowerCase(); const password = typeof b.password === 'string' ? b.password : '';
  const u = await one('select * from users where email=$1', [email]);
  if (!u || !(await bcrypt.compare(password, u.password_hash))) return bad('Email o contraseña incorrectos / Wrong email or password', 401);
  cookies().set(COOKIE, await signSession(u), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 14 });
  return ok({ role: u.role });
}
