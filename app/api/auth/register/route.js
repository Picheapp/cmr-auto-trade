import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { one } from '@/lib/db';
import { signSession, COOKIE } from '@/lib/session';
import { ok, bad, str, isEmail } from '@/lib/http';
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const email = str(b.email, 160).toLowerCase(); const name = str(b.name, 120); const phone = str(b.phone, 30);
  const password = typeof b.password === 'string' ? b.password : '';
  if (!name) return bad('Nombre requerido / Name required');
  if (!isEmail(email)) return bad('Email inválido / Invalid email');
  if (password.length < 8) return bad('La contraseña debe tener al menos 8 caracteres / Password must be at least 8 characters');
  if (await one('select id from users where email=$1', [email])) return bad('Ese email ya tiene cuenta / Email already registered');
  const u = await one(`insert into users (email, name, phone, password_hash, role) values ($1,$2,$3,$4,'customer') returning *`, [email, name, phone || null, await bcrypt.hash(password, 10)]);
  cookies().set(COOKIE, await signSession(u), { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 14 });
  return ok({ role: u.role });
}
