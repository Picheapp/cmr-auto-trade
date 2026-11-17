import { q, one } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { ok, bad, int } from '@/lib/http';
export async function POST(req) {
  const user = await getUser(); if (!user) return bad('Inicia sesión', 401);
  const { vehicle_id } = await req.json().catch(() => ({})); const id = int(vehicle_id);
  if (!id) return bad('Vehículo inválido');
  const ex = await one('select 1 from favorites where user_id=$1 and vehicle_id=$2', [user.id, id]);
  if (ex) { await q('delete from favorites where user_id=$1 and vehicle_id=$2', [user.id, id]); return ok({ favorite: false }); }
  await q('insert into favorites (user_id, vehicle_id) values ($1,$2) on conflict do nothing', [user.id, id]);
  return ok({ favorite: true });
}
