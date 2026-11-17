import bcrypt from 'bcryptjs';
import { q, one } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ENTITIES, clean, LEAD_STAGES } from '@/lib/admin';
import { ok, bad, int, str, isEmail } from '@/lib/http';

function pick(cfg, body) {
  const out = {};
  for (const [k, type] of Object.entries(cfg.fields)) { const v = clean(type, body[k]); if (v !== undefined) out[k] = v; }
  return out;
}
const STATUS = { vehicles: ['Available', 'Reserved', 'Pending', 'Sold'], leads: LEAD_STAGES, financing: ['Received', 'In Review', 'Submitted to Lender', 'Approved', 'Declined', 'Closed'], tradeins: ['Received', 'Reviewing', 'Offer Sent', 'Accepted', 'Declined'], appointments: ['Scheduled', 'Confirmed', 'Completed', 'No Show', 'Cancelled'] };

export async function POST(req, { params }) {
  const cfg = ENTITIES[params.entity]; if (!cfg) return bad('Entidad desconocida', 404);
  const user = await requireRole(cfg.write); if (!user) return bad('Sin permiso', 403);
  const body = await req.json().catch(() => ({}));
  if (params.entity === 'users') {
    const email = str(body.email, 160).toLowerCase();
    if (!isEmail(email) || !body.password || String(body.password).length < 8) return bad('Email y contraseña (mín. 8) requeridos');
    if (!['admin', 'sales', 'customer'].includes(body.role)) return bad('Rol inválido');
    if (await one('select id from users where email=$1', [email])) return bad('Ese email ya existe');
    const r = await one('insert into users (email, name, phone, role, password_hash) values ($1,$2,$3,$4,$5) returning id', [email, str(body.name, 120), str(body.phone, 30), body.role, await bcrypt.hash(String(body.password), 10)]);
    return ok({ id: r.id });
  }
  const d = pick(cfg, body);
  for (const r of cfg.required || []) if (!d[r]) return bad(`Campo requerido: ${r}`);
  if (STATUS[params.entity] && d.status && !STATUS[params.entity].includes(d.status)) return bad('Estado inválido');
  const keys = Object.keys(d);
  if (!keys.length) return bad('Sin datos');
  try {
    const r = await one(`insert into ${cfg.table} (${keys.join(',')}) values (${keys.map((_, i) => '$' + (i + 1)).join(',')}) returning id`, keys.map((k) => d[k]));
    return ok({ id: r.id });
  } catch (e) { return bad(e.message.includes('unique') ? 'Ya existe un registro con ese Stock #' : e.message); }
}

export async function PUT(req, { params }) {
  const cfg = ENTITIES[params.entity]; if (!cfg) return bad('Entidad desconocida', 404);
  const user = await requireRole(cfg.write); if (!user) return bad('Sin permiso', 403);
  const body = await req.json().catch(() => ({}));
  const id = int(body.id); if (!id) return bad('ID requerido');
  const d = pick(cfg, body);
  if (params.entity === 'users') {
    if (d.role && !['admin', 'sales', 'customer'].includes(d.role)) return bad('Rol inválido');
    if (id === user.id && d.role && d.role !== 'admin') return bad('No puedes quitarte el rol de admin a ti mismo');
    if (body.password) { if (String(body.password).length < 8) return bad('Contraseña mín. 8'); d.password_hash = await bcrypt.hash(String(body.password), 10); }
  }
  if (STATUS[params.entity] && d.status && !STATUS[params.entity].includes(d.status)) return bad('Estado inválido');
  const keys = Object.keys(d); if (!keys.length) return bad('Sin cambios');
  const sets = keys.map((k, i) => `${k}=$${i + 1}`); if (cfg.touch) sets.push('updated_at=now()');
  try {
    await q(`update ${cfg.table} set ${sets.join(',')} where id=$${keys.length + 1}`, [...keys.map((k) => d[k]), id]);
  } catch (e) { return bad(e.message.includes('unique') ? 'Ya existe un registro con ese Stock #' : e.message); }
  if (params.entity === 'leads' && d.status) await q('insert into lead_notes (lead_id, author, note) values ($1,$2,$3)', [id, user.name || user.email, `Etapa → ${d.status}`]);
  return ok();
}

export async function DELETE(req, { params }) {
  const cfg = ENTITIES[params.entity]; if (!cfg) return bad('Entidad desconocida', 404);
  const user = await requireRole(cfg.del); if (!user) return bad('Sin permiso', 403);
  const id = int(req.nextUrl.searchParams.get('id')); if (!id) return bad('ID requerido');
  if (params.entity === 'users' && id === user.id) return bad('No puedes borrar tu propia cuenta');
  await q(`delete from ${cfg.table} where id=$1`, [id]);
  if (params.entity === 'vehicles') await q('delete from favorites where vehicle_id=$1', [id]);
  if (params.entity === 'leads') await q('delete from lead_notes where lead_id=$1', [id]);
  return ok();
}
