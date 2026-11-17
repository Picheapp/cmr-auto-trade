import { q } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { ok, bad, str, int } from '@/lib/http';
export async function POST(req) {
  const user = await getUser(); if (!user) return bad('Inicia sesión', 401);
  const b = await req.json().catch(() => ({}));
  await q('insert into saved_searches (user_id, name, query) values ($1,$2,$3)', [user.id, str(b.name, 120), str(b.query, 600)]);
  return ok();
}
export async function DELETE(req) {
  const user = await getUser(); if (!user) return bad('Inicia sesión', 401);
  await q('delete from saved_searches where id=$1 and user_id=$2', [int(req.nextUrl.searchParams.get('id')), user.id]);
  return ok();
}
