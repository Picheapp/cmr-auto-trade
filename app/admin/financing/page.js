import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ser } from '@/lib/admin';
import AdminTable from '@/components/admin/AdminTable';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole();
  const rows = await q(`select f.*, v.stock, concat_ws(' ', f.employer, nullif(f.job_title,''), nullif(f.years_employed,'')) empl from financing f left join vehicles v on v.id=f.vehicle_id order by f.created_at desc`);
  return (<><h1>Solicitudes de financiamiento</h1>
    <p className="note" style={{ marginBottom: 14 }}>Información sensible: compártela solo con instituciones financieras autorizadas por el cliente. No se solicita el Seguro Social en el sitio.</p>
    <AdminTable entity="financing" title="solicitud" rows={ser(rows)} canDelete={u.role === 'admin'}
      columns={[{ key: 'created_at', label: 'Fecha', fmt: 'date' }, { key: 'name', label: 'Cliente' }, { key: 'phone', label: 'Teléfono', fmt: 'wa' }, { key: 'email', label: 'Email' }, { key: 'stock', label: 'Vehículo' }, { key: 'vehicle_price', label: 'Precio', fmt: 'money' }, { key: 'down_payment', label: 'Pronto', fmt: 'money' }, { key: 'term', label: 'Plazo' }, { key: 'empl', label: 'Empleo' }, { key: 'monthly_income', label: 'Ingreso/mes', fmt: 'money' }, { key: 'housing', label: 'Vivienda' }, { key: 'housing_payment', label: 'Pago vivienda', fmt: 'money' }, { key: 'address', label: 'Dirección' }, { key: 'notes', label: 'Notas', fmt: 'long' }, { key: 'status', label: 'Estado', fmt: 'pill' }]}
      fields={[{ key: 'status', label: 'Estado', type: 'select', options: ['Received', 'In Review', 'Submitted to Lender', 'Approved', 'Declined', 'Closed'] }, { key: 'notes', label: 'Notas internas', type: 'textarea' }]} />
  </>);
}
