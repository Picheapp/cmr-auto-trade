import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ser } from '@/lib/admin';
import AdminTable from '@/components/admin/AdminTable';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole(); const a = u.role === 'admin';
  const rows = await q('select * from testimonials order by created_at desc');
  return (<><h1>Testimonios</h1><p className="note" style={{ marginBottom: 14 }}>Añade solo testimonios reales de clientes, con su permiso. La sección del inicio se muestra cuando hay al menos uno activo.</p>
    <AdminTable entity="testimonials" title="testimonio" createLabel="Nuevo testimonio" rows={ser(rows)} canCreate={a} canDelete={a}
      columns={[{ key: 'name', label: 'Cliente' }, { key: 'text', label: 'Testimonio', fmt: 'long' }, { key: 'rating', label: 'Estrellas' }, { key: 'active', label: 'Activo', fmt: 'bool' }]}
      fields={a ? [{ key: 'name', label: 'Nombre del cliente', required: true }, { key: 'text', label: 'Testimonio', type: 'textarea', required: true }, { key: 'rating', label: 'Estrellas', type: 'select', options: ['5', '4', '3', '2', '1'], default: '5' }, { key: 'active', label: 'Activo', type: 'checkbox' }] : []} />
  </>);
}
