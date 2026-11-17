import { q } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import InventoryManager from '@/components/admin/InventoryManager';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole();
  const rows = await q('select * from vehicles order by created_at desc, id desc');
  return (<><h1>Inventario</h1><InventoryManager rows={rows.map((r) => ({ ...r, price: r.price != null ? Number(r.price) : null, created_at: String(r.created_at), updated_at: String(r.updated_at) }))} canEdit={u.role === 'admin'} /></>);
}
