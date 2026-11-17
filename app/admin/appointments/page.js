import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ser } from '@/lib/admin';
import { HOURS } from '@/lib/slots';
import AdminTable from '@/components/admin/AdminTable';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole();
  const rows = await q(`select a.*, a.date::text as date, v.stock from appointments a left join vehicles v on v.id=a.vehicle_id order by a.date desc, a.time`);
  return (<><h1>Citas</h1>
    <AdminTable entity="appointments" title="cita" rows={ser(rows)} canDelete={u.role === 'admin'}
      columns={[{ key: 'date', label: 'Fecha', fmt: 'day' }, { key: 'time', label: 'Hora' }, { key: 'type', label: 'Tipo' }, { key: 'name', label: 'Cliente' }, { key: 'phone', label: 'Teléfono', fmt: 'wa' }, { key: 'email', label: 'Email' }, { key: 'stock', label: 'Vehículo' }, { key: 'notes', label: 'Notas', fmt: 'long' }, { key: 'status', label: 'Estado', fmt: 'pill' }]}
      fields={[{ key: 'status', label: 'Estado', type: 'select', options: ['Scheduled', 'Confirmed', 'Completed', 'No Show', 'Cancelled'] }, { key: 'date', label: 'Fecha', type: 'date' }, { key: 'time', label: 'Hora', type: 'select', options: HOURS }, { key: 'notes', label: 'Notas', type: 'textarea' }]} />
  </>);
}
