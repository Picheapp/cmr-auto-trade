import Link from 'next/link';
import { q } from '@/lib/db';
import { LEAD_STAGES } from '@/lib/admin';
export const dynamic = 'force-dynamic';
export default async function Dash() {
  const [[c], inv, stages, types, upcoming, recent, missing] = await Promise.all([
    q(`select (select count(*)::int from vehicles) vehicles, (select count(*)::int from leads where created_at > now() - interval '30 days') leads30,
       (select count(*)::int from leads where status='New') new_leads, (select count(*)::int from financing where status in ('Received','In Review')) fin_open,
       (select count(*)::int from tradeins where status in ('Received','Reviewing')) trade_open, (select count(*)::int from appointments where date >= (now() at time zone 'America/Puerto_Rico')::date and status in ('Scheduled','Confirmed')) appts,
       (select count(*)::int from users where role='customer') customers, (select count(*)::int from leads where status='Sold') sold`),
    q(`select status, count(*)::int n from vehicles group by status`),
    q(`select status, count(*)::int n from leads group by status`),
    q(`select type, count(*)::int n from leads group by type order by n desc`),
    q(`select a.*, a.date::text as date, v.stock from appointments a left join vehicles v on v.id=a.vehicle_id where a.date >= (now() at time zone 'America/Puerto_Rico')::date and a.status in ('Scheduled','Confirmed') order by a.date, a.time limit 8`),
    q(`select l.*, v.stock from leads l left join vehicles v on v.id=l.vehicle_id order by l.created_at desc limit 8`),
    q(`select count(*)::int n from vehicles where (price is null or mileage is null or year is null) and status <> 'Sold'`),
  ]);
  const totalLeads = stages.reduce((a, s) => a + s.n, 0) || 1;
  const stat = (n, l, href) => <Link href={href} className="stat"><b>{n}</b><small>{l}</small></Link>;
  return (<>
    <h1>Resumen</h1>
    {missing[0].n > 0 && <div className="alert err" style={{ marginBottom: 18 }}>⚠ {missing[0].n} vehículo(s) sin precio, millaje o año. <Link className="link" href="/admin/inventory">Completar en Inventario →</Link></div>}
    <div className="stats">
      {stat(c.vehicles, 'Vehículos en sistema', '/admin/inventory')}{stat(c.new_leads, 'Leads nuevos sin atender', '/admin/leads')}{stat(c.leads30, 'Leads últimos 30 días', '/admin/leads')}
      {stat(c.appts, 'Citas próximas', '/admin/appointments')}{stat(c.fin_open, 'Solicitudes de financiamiento abiertas', '/admin/financing')}{stat(c.trade_open, 'Trade-ins por evaluar', '/admin/tradeins')}
      {stat(c.customers, 'Clientes registrados', '/admin/customers')}{stat(c.sold, 'Leads vendidos', '/admin/leads')}
    </div>
    <div className="contact-grid">
      <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 14 }}>Embudo de leads</h3>
        {LEAD_STAGES.map((s) => { const n = stages.find((x) => x.status === s)?.n || 0; return <div key={s} style={{ marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{s}</span><b>{n}</b></div><div className="bar"><i style={{ width: `${(n / totalLeads) * 100}%` }} /></div></div>; })}
        <h3 className="h2" style={{ fontSize: 22, margin: '22px 0 10px' }}>Por tipo</h3>
        {types.length ? types.map((t) => <div key={t.type} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '4px 0' }}><span>{t.type}</span><b>{t.n}</b></div>) : <div className="note">Sin leads todavía.</div>}
      </div>
      <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 14 }}>Inventario por estado</h3>
        {['Available', 'Reserved', 'Pending', 'Sold'].map((s) => <div key={s} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0', borderBottom: '1px solid var(--line)' }}><span>{s}</span><b>{inv.find((x) => x.status === s)?.n || 0}</b></div>)}
        <h3 className="h2" style={{ fontSize: 22, margin: '22px 0 10px' }}>Próximas citas</h3>
        {upcoming.length ? upcoming.map((a) => <div key={a.id} style={{ fontSize: 14, padding: '6px 0', borderBottom: '1px solid var(--line)' }}><b>{a.date} · {a.time}</b> — {a.name} ({a.type}){a.stock ? ` · ${a.stock}` : ''}</div>) : <div className="note">Sin citas próximas.</div>}
      </div>
    </div>
    <div className="box" style={{ marginTop: 20 }}><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>Leads recientes</h3>
      {recent.length ? <div className="scroll-x"><table className="tbl"><tbody>{recent.map((l) => <tr key={l.id}><td>{new Date(l.created_at).toLocaleString('es-PR', { timeZone: 'America/Puerto_Rico', dateStyle: 'short', timeStyle: 'short' })}</td><td>{l.name}</td><td>{l.phone}</td><td>{l.type}</td><td>{l.stock || '—'}</td><td><span className="pill blue">{l.status}</span></td></tr>)}</tbody></table></div> : <div className="note">Sin leads todavía. Los formularios del sitio los crean automáticamente.</div>}
    </div>
  </>);
}
