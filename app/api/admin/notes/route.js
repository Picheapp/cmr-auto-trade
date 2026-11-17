import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ok, bad, int, str } from '@/lib/http';
export async function POST(req) {
  const user = await requireRole(); if (!user) return bad('Sin permiso', 403);
  const b = await req.json().catch(() => ({}));
  const lead_id = int(b.lead_id), note = str(b.note, 2000);
  if (!lead_id || !note) return bad('Nota vacía');
  await q('insert into lead_notes (lead_id, author, note) values ($1,$2,$3)', [lead_id, user.name || user.email, note]);
  return ok();
}
