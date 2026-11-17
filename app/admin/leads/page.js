import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ser } from '@/lib/admin';
import LeadsBoard from '@/components/admin/LeadsBoard';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole();
  const [leads, notes, staff, vehicles] = await Promise.all([
    q(`select l.*, l.next_action_at::text as next_action_at, v.stock, concat_ws(' ', v.year, v.make, v.model, v.trim) vtitle from leads l left join vehicles v on v.id=l.vehicle_id order by l.created_at desc limit 1500`),
    q(`select * from lead_notes order by created_at desc limit 8000`),
    q(`select id, name, email from users where role in ('admin','sales') order by name`),
    q(`select id, stock, concat_ws(' ', year, make, model, trim) vtitle from vehicles where status <> 'Sold' order by stock`),
  ]);
  return (<><h1>Leads / CRM</h1>
    <p className="note" style={{ marginBottom: 14 }}>Arrastra las tarjetas entre etapas. Cada formulario del sitio crea un lead con su fuente (Facebook, Google, directo…). Programa seguimientos para que ningún cliente se quede sin respuesta.</p>
    <LeadsBoard leads={ser(leads).map((l) => ({ ...l, value: l.value != null ? Number(l.value) : null }))} notes={ser(notes)} staff={staff} vehicles={vehicles} canDelete={u.role === 'admin'} me={u.id} />
  </>);
}
