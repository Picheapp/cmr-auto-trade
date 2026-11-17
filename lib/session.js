import { SignJWT, jwtVerify } from 'jose';

export const COOKIE = 'cmr_session';
function key() {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'dev-only-secret-change-me');
}
export async function signSession(user) {
  return new SignJWT({ id: user.id, role: user.role, name: user.name || '', email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('14d')
    .sign(key());
}
export async function verifySession(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload;
  } catch {
    return null;
  }
}
export const STAFF = ['admin', 'sales'];
