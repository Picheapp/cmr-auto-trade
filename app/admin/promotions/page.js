import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import { ser } from '@/lib/admin';
import AdminTable from '@/components/admin/AdminTable';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole(); const a = u.role === 'admin';
  const rows = await q('select * from promotions order by created_at desc');
  return (<><h1>Promociones y banners</h1><p className="note" style={{ marginBottom: 14 }}>Las promociones activas aparecen en “Ofertas especiales” del inicio. Para la imagen, usa la URL de una foto (por ejemplo, copia la de un vehículo del inventario).</p>
    <AdminTable entity="promotions" title="promoción" createLabel="Nueva promoción" rows={ser(rows)} canCreate={a} canDelete={a}
      columns={[{ key: 'title', label: 'Título' }, { key: 'subtitle', label: 'Subtítulo' }, { key: 'cta_label', label: 'Botón' }, { key: 'cta_link', label: 'Enlace' }, { key: 'active', label: 'Activa', fmt: 'bool' }]}
      fields={a ? [{ key: 'title', label: 'Título', required: true }, { key: 'subtitle', label: 'Subtítulo' }, { key: 'cta_label', label: 'Texto del botón', placeholder: 'Ver ofertas' }, { key: 'cta_link', label: 'Enlace del botón', placeholder: '/inventory?category=pickup' }, { key: 'image', label: 'URL de imagen', placeholder: '/img/promo-premium.jpg' }, { key: 'active', label: 'Activa', type: 'checkbox' }] : []} />
  </>);
}
