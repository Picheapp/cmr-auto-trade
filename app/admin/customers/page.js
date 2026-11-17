import { q } from '@/lib/db';
import { ser } from '@/lib/admin';
import AdminTable from '@/components/admin/AdminTable';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const rows = await q(`select coalesce(nullif(lower(email),''), phone) id, max(name) name, max(phone) phone, max(email) email, count(*)::int leads, max(created_at) last, string_agg(distinct type, ', ') types,
    bool_or(user_id is not null) registered from leads group by coalesce(nullif(lower(email),''), phone) order by max(created_at) desc`);
  return (<><h1>Clientes</h1><p className="note" style={{ marginBottom: 14 }}>Base de datos de clientes generada a partir de todos los leads (agrupados por email o teléfono).</p>
    <AdminTable entity="customers" rows={ser(rows)} columns={[{ key: 'name', label: 'Nombre' }, { key: 'phone', label: 'Teléfono', fmt: 'wa' }, { key: 'email', label: 'Email' }, { key: 'leads', label: 'Consultas' }, { key: 'types', label: 'Tipos' }, { key: 'registered', label: 'Cuenta', fmt: 'bool' }, { key: 'last', label: 'Último contacto', fmt: 'date' }]} />
  </>);
}
