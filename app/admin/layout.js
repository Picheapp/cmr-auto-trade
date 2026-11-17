import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin', robots: { index: false } };
const NAV = [['/admin', '📊 Resumen'], ['/admin/inventory', '🚗 Inventario'], ['/admin/leads', '🎯 Leads / CRM'], ['/admin/appointments', '📅 Citas'], ['/admin/financing', '💳 Financiamiento'], ['/admin/tradeins', '⇄ Trade-ins'], ['/admin/customers', '👥 Clientes'], ['/admin/promotions', '📣 Promociones'], ['/admin/testimonials', '⭐ Testimonios'], ['/admin/users', '🔐 Usuarios', 'admin'], ['/admin/settings', '⚙ Ajustes', 'admin']];
export default async function AdminLayout({ children }) {
  const u = await requireRole();
  if (!u) redirect('/login?next=/admin');
  return (
    <div className="adm">
      <aside>
        <div className="note" style={{ padding: '0 12px 12px' }}>{u.name || u.email}<br /><span className="pill blue">{u.role}</span></div>
        {NAV.filter((n) => !n[2] || n[2] === u.role).map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}
        <Link href="/">↗ Ver sitio</Link>
      </aside>
      <main>{children}</main>
    </div>
  );
}
