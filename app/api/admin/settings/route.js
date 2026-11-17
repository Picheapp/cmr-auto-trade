import { q, DEFAULT_SETTINGS } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ok, bad, str } from '@/lib/http';
export async function PUT(req) {
  const user = await requireRole(['admin']); if (!user) return bad('Sin permiso', 403);
  const b = await req.json().catch(() => ({}));
  for (const k of Object.keys(DEFAULT_SETTINGS)) {
    if (b[k] !== undefined) await q('insert into settings (key, value) values ($1,$2) on conflict (key) do update set value=excluded.value', [k, str(b[k], 500)]);
  }
  return ok();
}
