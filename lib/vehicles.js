import { q, one } from './db';
export const PUBLIC_STATUSES = ['Available', 'Reserved', 'Pending'];
const COLS = 'id, stock, lot, make, model, year, trim, price, mileage, ext_color, int_color, transmission, engine, drivetrain, fuel, condition, body_type, categories, photos, status, featured, created_at';

export async function listVehicles(f = {}) {
  const w = ["status = any($1)"]; const p = [f.includeSold ? ['Available', 'Reserved', 'Pending', 'Sold'] : PUBLIC_STATUSES];
  const add = (sql, val) => { p.push(val); w.push(sql.replace('?', '$' + p.length)); };
  if (f.category) add('? = any(categories)', f.category);
  if (f.make) add('lower(make) = lower(?)', f.make);
  if (f.model) add('lower(model) = lower(?)', f.model);
  if (f.body_type) add('body_type = ?', f.body_type);
  if (f.transmission) add('transmission = ?', f.transmission);
  if (f.fuel) add('fuel = ?', f.fuel);
  if (f.drivetrain) add('drivetrain = ?', f.drivetrain);
  if (f.condition) add('condition = ?', f.condition);
  if (f.price_min) add('price >= ?', Number(f.price_min));
  if (f.price_max) add('price <= ?', Number(f.price_max));
  if (f.year_min) add('year >= ?', Number(f.year_min));
  if (f.year_max) add('year <= ?', Number(f.year_max));
  if (f.mileage_max) add('mileage <= ?', Number(f.mileage_max));
  if (f.q) add("(make || ' ' || model || ' ' || coalesce(trim,'') || ' ' || coalesce(stock,'')) ilike ?", '%' + f.q + '%');
  if (f.featured) w.push('featured = true');
  if (f.ids) add('id = any(?)', f.ids.map(Number).filter(Boolean));
  if (f.exclude) add('id <> ?', Number(f.exclude));
  const order = { price_asc: 'price asc nulls last, id desc', price_desc: 'price desc nulls last, id desc', miles: 'mileage asc nulls last, id desc' }[f.sort] || 'created_at desc, id desc';
  const lim = Math.min(Number(f.limit) || 200, 500);
  return q(`select ${COLS} from vehicles where ${w.join(' and ')} order by ${order} limit ${lim}`, p);
}
export async function getVehicle(id) {
  if (!/^\d+$/.test(String(id))) return null;
  return one('select * from vehicles where id = $1', [Number(id)]);
}
export async function facets() {
  return q(`select make, model, count(*)::int n from vehicles where status = any($1) group by make, model order by make, model`, [PUBLIC_STATUSES]);
}
export async function favIds(userId) {
  if (!userId) return new Set();
  const r = await q('select vehicle_id from favorites where user_id=$1', [userId]);
  return new Set(r.map((x) => x.vehicle_id));
}
