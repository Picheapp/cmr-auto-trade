import { redirect } from 'next/navigation';
import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ser } from '@/lib/admin';
import AdminTable from '@/components/admin/AdminTable';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole(['admin']); if (!u) redirect('/admin');
  const rows = await q('select id, email, name, phone, role, created_at from users order by role, created_at desc');
  return (<><h1>Usuarios y roles</h1><p className="note" style={{ marginBottom: 14 }}>admin: acceso total · sales: leads, citas, financiamiento y trade-ins · customer: cliente del sitio.</p>
    <AdminTable entity="users" title="usuario" createLabel="Nuevo usuario" rows={ser(rows)} canCreate canDelete
      columns={[{ key: 'name', label: 'Nombre' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Teléfono' }, { key: 'role', label: 'Rol', fmt: 'pill' }, { key: 'created_at', label: 'Creado', fmt: 'date' }]}
      fields={[{ key: 'email', label: 'Email', type: 'email', required: true, createOnly: true }, { key: 'name', label: 'Nombre' }, { key: 'phone', label: 'Teléfono' }, { key: 'role', label: 'Rol', type: 'select', options: ['sales', 'admin', 'customer'], default: 'sales' }, { key: 'password', label: 'Contraseña (mín. 8; déjala vacía para no cambiarla)', type: 'password', required: true }]} />
  </>);
}
