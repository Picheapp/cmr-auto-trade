import Link from 'next/link';
import { redirect } from 'next/navigation';
import { q } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { getLang, dict, vTitle } from '@/lib/i18n';
import VehicleCard from '@/components/VehicleCard';
import { LogoutButton, DeleteSearch } from '@/components/AccountActions';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Mi cuenta', robots: { index: false } };

const fmtDate = (d, lang) => d ? new Date(d).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-PR', { timeZone: 'America/Puerto_Rico' }) : '';

export default async function Account() {
  const user = await getUser();
  if (!user) redirect('/login?next=/account');
  const lang = getLang(); const t = dict(lang);
  const em = (user.email || '').toLowerCase();
  const [favs, searches, leads, fin, appts, trades] = await Promise.all([
    q('select v.* from favorites f join vehicles v on v.id=f.vehicle_id where f.user_id=$1 order by f.created_at desc', [user.id]),
    q('select * from saved_searches where user_id=$1 order by created_at desc', [user.id]),
    q(`select l.*, v.stock, v.make, v.model, v.year, v.trim from leads l left join vehicles v on v.id=l.vehicle_id where l.user_id=$1 or lower(l.email)=$2 order by l.created_at desc limit 50`, [user.id, em]),
    q(`select * from financing where user_id=$1 or lower(email)=$2 order by created_at desc`, [user.id, em]),
    q(`select a.*, a.date::text as date, v.stock from appointments a left join vehicles v on v.id=a.vehicle_id where a.user_id=$1 or lower(a.email)=$2 order by a.date desc`, [user.id, em]),
    q(`select * from tradeins where user_id=$1 or lower(email)=$2 order by created_at desc`, [user.id, em]),
  ]);
  const Sec = ({ title, children, empty }) => (<section style={{ marginBottom: 40 }}><h2 className="h2" style={{ fontSize: 26, marginBottom: 14 }}>{title}</h2>{empty ? <div className="box note">{t.empty}</div> : children}</section>);
  return (<main>
    <section className="phead"><div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
      <div><div className="kick">{t.nav_account}</div><h1>{user.name || user.email}</h1><p className="sub">{user.email}</p></div>
      <LogoutButton label={t.logout} />
    </div></section>
    <div className="wrap section">
      <Sec title={t.my_favorites} empty={!favs.length}><div className="grid">{favs.map((v) => <VehicleCard key={v.id} v={v} t={t} lang={lang} fav loggedIn />)}</div></Sec>
      <Sec title={t.my_searches} empty={!searches.length}><div className="scroll-x"><table className="tbl"><tbody>{searches.map((s) => <tr key={s.id}><td><Link className="link" href={'/inventory?' + (s.query || '')}>{s.query ? decodeURIComponent(s.query).replace(/&/g, ' · ') : t.any}</Link></td><td>{fmtDate(s.created_at, lang)}</td><td style={{ textAlign: 'right' }}><DeleteSearch id={s.id} label={t.delete} /></td></tr>)}</tbody></table></div></Sec>
      <Sec title={t.my_inquiries} empty={!leads.length}><div className="scroll-x"><table className="tbl"><thead><tr><th>{t.date}</th><th>Tipo / Type</th><th>{t.vehicle_interest}</th><th>{t.status}</th></tr></thead><tbody>{leads.map((l) => <tr key={l.id}><td>{fmtDate(l.created_at, lang)}</td><td>{l.type}</td><td>{l.stock ? `${l.stock} · ${vTitle(l)}` : '—'}</td><td><span className="pill blue">{l.status}</span></td></tr>)}</tbody></table></div></Sec>
      <Sec title={t.my_financing} empty={!fin.length}><div className="scroll-x"><table className="tbl"><thead><tr><th>{t.date}</th><th>{t.vehicle_price}</th><th>{t.status}</th></tr></thead><tbody>{fin.map((f) => <tr key={f.id}><td>{fmtDate(f.created_at, lang)}</td><td>{f.vehicle_price ? '$' + Number(f.vehicle_price).toLocaleString() : '—'}</td><td><span className="pill amber">{f.status}</span></td></tr>)}</tbody></table></div></Sec>
      <Sec title={t.my_appointments} empty={!appts.length}><div className="scroll-x"><table className="tbl"><thead><tr><th>{t.date}</th><th>{t.time}</th><th>{t.appt_type}</th><th>{t.vehicle_interest}</th><th>{t.status}</th></tr></thead><tbody>{appts.map((a) => <tr key={a.id}><td>{a.date}</td><td>{a.time}</td><td>{a.type}</td><td>{a.stock || '—'}</td><td><span className="pill green">{a.status}</span></td></tr>)}</tbody></table></div></Sec>
      <Sec title={t.my_tradeins} empty={!trades.length}><div className="scroll-x"><table className="tbl"><thead><tr><th>{t.date}</th><th>{t.your_vehicle}</th><th>{t.status}</th></tr></thead><tbody>{trades.map((x) => <tr key={x.id}><td>{fmtDate(x.created_at, lang)}</td><td>{[x.year, x.make, x.model].join(' ')}</td><td><span className="pill amber">{x.status}{x.estimate ? ` · $${Number(x.estimate).toLocaleString()}` : ''}</span></td></tr>)}</tbody></table></div></Sec>
    </div>
  </main>);
}
