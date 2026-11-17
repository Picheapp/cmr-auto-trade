import Link from 'next/link';
import { q } from '@/lib/db';
import { LEAD_STAGES } from '@/lib/admin';
export const dynamic = 'force-dynamic';

const TZ = "'America/Puerto_Rico'";
const ES = { New: 'Nuevo', Contacted: 'Contactado', Qualified: 'Calificado', 'Appointment Scheduled': 'Cita agendada', Negotiating: 'Negociando', Sold: 'Vendido', Lost: 'Perdido' };
const money = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('en-US');

function Delta({ cur, prev }) {
  if (!prev && !cur) return <div className="delta">—</div>;
  if (!prev) return <div className="delta up">▲ nuevo</div>;
  const p = Math.round(((cur - prev) / prev) * 100);
  return <div className={'delta ' + (p >= 0 ? 'up' : 'down')}>{p >= 0 ? '▲' : '▼'} {Math.abs(p)}% vs periodo anterior</div>;
}

function DailyChart({ rows }) {
  const W = 760, H = 220, pl = 30, pb = 26, pt = 10;
  const max = Math.max(4, ...rows.map((r) => r.n));
  const step = Math.ceil(max / 4);
  const top = step * 4;
  const bw = (W - pl) / rows.length;
  const y = (v) => pt + (H - pt - pb) * (1 - v / top);
  const every = Math.ceil(rows.length / 10);
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Leads por día">
        {[0, 1, 2, 3, 4].map((i) => <g key={i}><line x1={pl} x2={W} y1={y(i * step)} y2={y(i * step)} stroke="var(--line)" strokeWidth="1" /><text x={pl - 6} y={y(i * step) + 4} textAnchor="end">{i * step}</text></g>)}
        {rows.map((r, i) => {
          const h = y(0) - y(r.n); const x = pl + i * bw + 2; const w = Math.max(2, bw - 4);
          return (
            <g key={r.d}>
              <rect x={pl + i * bw} y={pt} width={bw} height={H - pt - pb} fill="transparent"><title>{`${r.d}: ${r.n} lead(s)`}</title></rect>
              {r.n > 0 && <path className="bar-r" d={`M${x},${y(0)} v${-(h - 4)} q0,-4 4,-4 h${w - 8} q4,0 4,4 v${h - 4} z`}><title>{`${r.d}: ${r.n} lead(s)`}</title></path>}
              {i % every === 0 && <text x={pl + i * bw + bw / 2} y={H - 8} textAnchor="middle">{r.d.slice(5)}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function HBars({ rows, label = 'k' }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  if (!rows.length) return <div className="note">Sin datos en este periodo.</div>;
  return rows.map((r) => <div className="hbar" key={r[label] || '—'} title={`${r[label] || '—'}: ${r.n}`}><span>{r[label] || '—'}</span><div className="tr"><i style={{ width: `${(r.n / max) * 100}%` }} /></div><b style={{ textAlign: 'right' }}>{r.n}</b></div>);
}

export default async function Dash({ searchParams }) {
  const days = [7, 30, 90, 365].includes(Number(searchParams.d)) ? Number(searchParams.d) : 30;
  const P = [days];
  const cur = `created_at >= now() - make_interval(days => $1::int)`;
  const prev = `created_at < now() - make_interval(days => $1::int) and created_at >= now() - make_interval(days => $1::int * 2)`;
  const [[k], daily, sources, types, stages, topViews, topLeads, due, upcoming, recent, [inv], missing] = await Promise.all([
    q(`select
        (select count(*)::int from leads where ${cur}) leads, (select count(*)::int from leads where ${prev}) leads_p,
        (select count(*)::int from leads where status='Sold' and ${cur.replace('created_at', 'updated_at')}) sold, (select count(*)::int from leads where status='Sold' and ${prev.replaceAll('created_at', 'updated_at')}) sold_p,
        (select count(*)::int from appointments where ${cur}) appts, (select count(*)::int from appointments where ${prev}) appts_p,
        (select count(*)::int from financing where ${cur}) fin, (select count(*)::int from financing where ${prev}) fin_p,
        (select count(*)::int from tradeins where ${cur}) trade, (select count(*)::int from tradeins where ${prev}) trade_p,
        (select count(*)::int from leads where status='New') new_open,
        (select coalesce(sum(value),0) from leads where status in ('New','Contacted','Qualified','Appointment Scheduled','Negotiating')) pipeline,
        (select count(*)::int from leads where ${cur}) total_cur`, P),
    q(`select to_char(d, 'YYYY-MM-DD') d, coalesce(c.n, 0)::int n from generate_series((now() at time zone ${TZ})::date - ($1::int - 1), (now() at time zone ${TZ})::date, '1 day') d
       left join (select (created_at at time zone ${TZ})::date dd, count(*) n from leads where ${cur} group by 1) c on c.dd = d order by d`, P),
    q(`select coalesce(source,'Sin fuente') k, count(*)::int n from leads where ${cur} group by 1 order by n desc limit 8`, P),
    q(`select coalesce(type,'—') k, count(*)::int n from leads where ${cur} group by 1 order by n desc`, P),
    q(`select status k, count(*)::int n from leads group by status`),
    q(`select id, stock, concat_ws(' ', year, make, model, trim) t, coalesce(views,0)::int n from vehicles where status <> 'Sold' order by views desc nulls last limit 6`),
    q(`select v.id, v.stock, concat_ws(' ', v.year, v.make, v.model, v.trim) t, count(l.id)::int n from leads l join vehicles v on v.id=l.vehicle_id where l.${cur} group by v.id order by n desc limit 6`, P),
    q(`select l.id, l.name, l.phone, l.next_action, l.next_action_at::text d, l.status from leads l where l.next_action_at <= (now() at time zone ${TZ})::date and l.status in ('New','Contacted','Qualified','Appointment Scheduled','Negotiating') order by l.next_action_at limit 10`),
    q(`select a.*, a.date::text as date, v.stock from appointments a left join vehicles v on v.id=a.vehicle_id where a.date >= (now() at time zone ${TZ})::date and a.status in ('Scheduled','Confirmed') order by a.date, a.time limit 8`),
    q(`select l.*, v.stock from leads l left join vehicles v on v.id=l.vehicle_id order by l.created_at desc limit 8`),
    q(`select count(*) filter (where status='Available')::int avail, count(*) filter (where status in ('Reserved','Pending'))::int held, count(*) filter (where status='Sold')::int sold,
        coalesce(sum(price) filter (where status <> 'Sold'),0) value, coalesce(round(avg(extract(epoch from now()-created_at)/86400) filter (where status <> 'Sold')),0)::int age from vehicles`),
    q(`select count(*)::int n from vehicles where (price is null or mileage is null or year is null) and status <> 'Sold'`),
  ]);
  const conv = k.leads ? Math.round((k.sold / k.leads) * 100) : 0;
  const totalStage = stages.reduce((a, s) => a + s.n, 0) || 1;
  const kpi = (n, l, href, c, p) => <Link href={href} className="stat kpi"><b>{n}</b><small>{l}</small>{c !== undefined && <Delta cur={c} prev={p} />}</Link>;

  return (<>
    <div className="row-head" style={{ marginBottom: 18 }}>
      <h1 style={{ margin: 0 }}>Dashboard</h1>
      <div className="range">{[[7, '7 días'], [30, '30 días'], [90, '90 días'], [365, '12 meses']].map(([d, l]) => <Link key={d} href={`/admin?d=${d}`} className={'btn sm ' + (d === days ? '' : 'ghost')}>{l}</Link>)}</div>
    </div>
    {missing[0].n > 0 && <div className="alert err" style={{ marginBottom: 14 }}>⚠ {missing[0].n} vehículo(s) sin precio, millaje o año: los clientes ven “Consultar precio”. <Link className="link" href="/admin/inventory">Completar →</Link></div>}
    {due.length > 0 && <div className="alert err" style={{ marginBottom: 14, background: 'rgba(245,180,10,.1)', borderColor: 'rgba(245,180,10,.4)', color: '#ffd772' }}>⏰ {due.length} seguimiento(s) para hoy o vencidos. <Link className="link" href="/admin/leads">Ver en el CRM →</Link></div>}

    <div className="stats">
      {kpi(k.leads, `Leads (${days} días)`, '/admin/leads', k.leads, k.leads_p)}
      {kpi(k.sold, 'Ventas cerradas', '/admin/leads', k.sold, k.sold_p)}
      {kpi(conv + '%', 'Conversión lead → venta', '/admin/leads')}
      {kpi(k.appts, 'Citas agendadas', '/admin/appointments', k.appts, k.appts_p)}
      {kpi(k.fin, 'Solicitudes de financiamiento', '/admin/financing', k.fin, k.fin_p)}
      {kpi(k.trade, 'Trade-ins recibidos', '/admin/tradeins', k.trade, k.trade_p)}
      {kpi(k.new_open, 'Leads nuevos sin atender', '/admin/leads')}
      {kpi(money(k.pipeline), 'Valor en pipeline abierto', '/admin/leads')}
    </div>

    <div className="box"><div className="row-head" style={{ marginBottom: 10 }}><h3 className="h2" style={{ fontSize: 22 }}>Leads por día</h3><span className="note">{k.total_cur} en total · pasa el cursor sobre una barra</span></div><DailyChart rows={daily} /></div>

    <div className="grid2">
      <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>¿De dónde vienen los leads?</h3><HBars rows={sources} />
        <h3 className="h2" style={{ fontSize: 22, margin: '22px 0 12px' }}>Por tipo de solicitud</h3><HBars rows={types} /></div>
      <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>Embudo de ventas (todos)</h3>
        {LEAD_STAGES.map((s) => { const n = stages.find((x) => x.k === s)?.n || 0; return <div className="hbar" key={s}><span>{ES[s]}</span><div className="tr"><i style={{ width: `${(n / totalStage) * 100}%` }} /></div><b style={{ textAlign: 'right' }}>{n}</b></div>; })}
      </div>
    </div>

    <div className="grid2">
      <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>Inventario</h3>
        <div className="stats" style={{ marginBottom: 0 }}>
          <div className="stat"><b>{inv.avail}</b><small>Disponibles</small></div><div className="stat"><b>{inv.held}</b><small>Reservados / pendientes</small></div>
          <div className="stat"><b>{inv.sold}</b><small>Vendidos</small></div><div className="stat"><b>{money(inv.value)}</b><small>Valor en inventario (con precio)</small></div>
          <div className="stat"><b>{inv.age}</b><small>Días promedio en inventario</small></div>
        </div></div>
      <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>Vehículos más vistos</h3>
        <HBars rows={topViews.map((v) => ({ k: `${v.stock} ${v.t}`, n: v.n }))} />
        <h3 className="h2" style={{ fontSize: 22, margin: '22px 0 12px' }}>Con más leads ({days} días)</h3>
        <HBars rows={topLeads.map((v) => ({ k: `${v.stock} ${v.t}`, n: v.n }))} /></div>
    </div>

    <div className="grid2">
      <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>Seguimientos pendientes</h3>
        {due.length ? due.map((l) => <div key={l.id} style={{ fontSize: 14, padding: '7px 0', borderBottom: '1px solid var(--line)' }}><span className="pill amber">{l.d}</span> <b>{l.name}</b> — {l.next_action || 'Dar seguimiento'} <span className="note">({ES[l.status]})</span></div>) : <div className="note">Nada pendiente para hoy. 👍</div>}
        <h3 className="h2" style={{ fontSize: 22, margin: '22px 0 12px' }}>Próximas citas</h3>
        {upcoming.length ? upcoming.map((a) => <div key={a.id} style={{ fontSize: 14, padding: '7px 0', borderBottom: '1px solid var(--line)' }}><b>{a.date} · {a.time}</b> — {a.name} ({a.type}){a.stock ? ` · ${a.stock}` : ''}</div>) : <div className="note">Sin citas próximas.</div>}
      </div>
      <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>Leads recientes</h3>
        {recent.length ? recent.map((l) => <div key={l.id} style={{ fontSize: 14, padding: '7px 0', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', gap: 10 }}>
          <span><b>{l.name}</b> · {l.type}{l.stock ? ` · ${l.stock}` : ''}<br /><span className="note">{l.source || ''} · {new Date(l.created_at).toLocaleString('es-PR', { timeZone: 'America/Puerto_Rico', dateStyle: 'short', timeStyle: 'short' })}</span></span>
          <span className="pill blue" style={{ alignSelf: 'center' }}>{ES[l.status] || l.status}</span></div>) : <div className="note">Sin leads todavía. Los formularios del sitio los crean automáticamente.</div>}
      </div>
    </div>
  </>);
}
