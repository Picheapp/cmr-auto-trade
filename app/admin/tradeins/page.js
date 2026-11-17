import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ser } from '@/lib/admin';
import AdminTable from '@/components/admin/AdminTable';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole();
  const rows = await q(`select *, concat_ws(' ', year, make, model) veh from tradeins order by created_at desc`);
  return (<><h1>Trade-ins</h1>
    <AdminTable entity="tradeins" title="trade-in" rows={ser(rows)} canDelete={u.role === 'admin'}
      columns={[{ key: 'created_at', label: 'Fecha', fmt: 'date' }, { key: 'veh', label: 'Vehículo' }, { key: 'mileage', label: 'Millaje' }, { key: 'condition', label: 'Condición' }, { key: 'vin', label: 'VIN' }, { key: 'photos', label: 'Fotos', fmt: 'photos' }, { key: 'name', label: 'Cliente' }, { key: 'phone', label: 'Teléfono', fmt: 'wa' }, { key: 'email', label: 'Email' }, { key: 'notes', label: 'Notas', fmt: 'long' }, { key: 'estimate', label: 'Estimado', fmt: 'money' }, { key: 'status', label: 'Estado', fmt: 'pill' }]}
      fields={[{ key: 'status', label: 'Estado', type: 'select', options: ['Received', 'Reviewing', 'Offer Sent', 'Accepted', 'Declined'] }, { key: 'estimate', label: 'Estimado de valor (USD)', type: 'number' }, { key: 'notes', label: 'Notas', type: 'textarea' }]} />
  </>);
}
