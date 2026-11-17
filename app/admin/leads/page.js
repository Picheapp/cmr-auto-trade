import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import LeadsBoard from '@/components/admin/LeadsBoard';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole();
  const [leads, notes, staff] = await Promise.all([
    q(`select l.*, v.stock, concat_ws(' ', v.year, v.make, v.model, v.trim) vtitle from leads l left join vehicles v on v.id=l.vehicle_id order by l.created_at desc limit 1000`),
    q(`select * from lead_notes order by created_at desc limit 5000`),
    q(`select id, name, email from users where role in ('admin','sales') order by name`),
  ]);
  const ser = (r) => ({ ...r, created_at: new Date(r.created_at).toISOString() });
  return (<><h1>Leads / CRM</h1><LeadsBoard leads={leads.map(ser)} notes={notes.map(ser)} staff={staff} canDelete={u.role === 'admin'} /></>);
}
