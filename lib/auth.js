import { cookies } from 'next/headers';
import { COOKIE, verifySession, STAFF } from './session';

export async function getUser() {
  return verifySession(cookies().get(COOKIE)?.value);
}
export async function requireRole(roles = STAFF) {
  const u = await getUser();
  if (!u || !roles.includes(u.role)) return null;
  return u;
}
export function isStaff(u) {
  return !!u && STAFF.includes(u.role);
}
