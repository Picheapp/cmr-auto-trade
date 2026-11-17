// Configuración de entidades editables desde el panel admin.
const A = ['admin'], S = ['admin', 'sales'];
export const LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Appointment Scheduled', 'Negotiating', 'Sold', 'Lost'];
export const ENTITIES = {
  vehicles: {
    table: 'vehicles', write: A, del: A,
    fields: { stock: 'text', lot: 'text', make: 'text', model: 'text', year: 'int', trim: 'text', price: 'num', mileage: 'int', ext_color: 'text', int_color: 'text', transmission: 'text', engine: 'text', drivetrain: 'text', fuel: 'text', vin: 'text', condition: 'text', body_type: 'text', categories: 'arr', description: 'longtext', features: 'arr', photos: 'arr', videos: 'arr', status: 'text', featured: 'bool' },
    required: ['make', 'model'], touch: true,
  },
  promotions: { table: 'promotions', write: A, del: A, fields: { title: 'text', subtitle: 'text', cta_label: 'text', cta_link: 'text', image: 'text', active: 'bool' }, required: ['title'] },
  testimonials: { table: 'testimonials', write: A, del: A, fields: { name: 'text', text: 'longtext', rating: 'int', active: 'bool' }, required: ['name', 'text'] },
  leads: { table: 'leads', write: S, del: A, fields: { name: 'text', phone: 'text', email: 'text', vehicle_id: 'int', type: 'text', message: 'longtext', status: 'text', assigned_to: 'int' } },
  financing: { table: 'financing', write: S, del: A, fields: { status: 'text', notes: 'longtext' } },
  tradeins: { table: 'tradeins', write: S, del: A, fields: { status: 'text', estimate: 'num', notes: 'longtext' } },
  appointments: { table: 'appointments', write: S, del: A, fields: { status: 'text', date: 'date', time: 'text', notes: 'longtext' } },
  users: { table: 'users', write: A, del: A, fields: { name: 'text', phone: 'text', role: 'text' } },
};
export function clean(type, v) {
  if (v === undefined) return undefined;
  if (type === 'bool') return v === true || v === 'true' || v === 'on' || v === 1;
  if (type === 'int') { if (v === '' || v == null) return null; const n = parseInt(String(v).replace(/[^0-9\-]/g, ''), 10); return Number.isFinite(n) ? n : null; }
  if (type === 'num') { if (v === '' || v == null) return null; const n = Number(String(v).replace(/[^0-9.\-]/g, '')); return Number.isFinite(n) ? n : null; }
  if (type === 'arr') { const a = Array.isArray(v) ? v : String(v || '').split(/\n|,/); return a.map((x) => String(x).trim()).filter(Boolean).slice(0, 80); }
  if (type === 'date') return /^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v : null;
  if (type === 'longtext') return v == null ? null : String(v).slice(0, 8000);
  return v == null || v === '' ? null : String(v).trim().slice(0, 500);
}
// Convierte filas de la BD en objetos serializables para componentes cliente.
export function ser(rows) {
  return rows.map((r) => { const o = {}; for (const [k, v] of Object.entries(r)) o[k] = v instanceof Date ? v.toISOString() : v; return o; });
}
