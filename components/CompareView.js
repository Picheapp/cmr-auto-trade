'use client';
import { useEffect, useState } from 'react';
import { getCompare } from './VehicleActions';

export default function CompareView({ t, lang }) {
  const [list, setList] = useState(null);
  function load() {
    const ids = getCompare();
    if (!ids.length) { setList([]); return; }
    fetch('/api/vehicles?ids=' + ids.join(',')).then((r) => r.json()).then((j) => setList(j.vehicles || []));
  }
  useEffect(load, []);
  function remove(id) { const ids = getCompare().filter((x) => x !== id); localStorage.setItem('cmr_compare', JSON.stringify(ids)); window.dispatchEvent(new Event('cmr-compare')); load(); }
  if (list === null) return <p className="sub">…</p>;
  if (!list.length) return <div className="box">{t.compare_empty} <a className="link" href="/inventory">{t.nav_inventory} →</a></div>;
  const money = (n) => n == null ? t.call_price : new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-PR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  const rows = [[t.price, (v) => money(v.price)], [t.year, (v) => v.year], [t.mileage, (v) => v.mileage != null ? v.mileage.toLocaleString() + ' ' + t.miles : null], [t.condition, (v) => t['cond_' + v.condition] || v.condition], [t.body_type, (v) => v.body_type], [t.ext_color, (v) => v.ext_color], [t.int_color, (v) => v.int_color], [t.engine, (v) => v.engine], [t.transmission, (v) => v.transmission], [t.drivetrain, (v) => v.drivetrain], [t.fuel, (v) => v.fuel], [t.status, (v) => t['st_' + v.status]], [t.stock, (v) => v.stock]];
  return (
    <div className="scroll-x"><table className="tbl">
      <thead><tr><th></th>{list.map((v) => <th key={v.id} style={{ minWidth: 220 }}>
        <a href={'/vehicle/' + v.id}>{v.photos?.[0] && <img src={v.photos[0]} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 10, marginBottom: 8 }} />}
        <b style={{ color: '#fff', fontSize: 15, textTransform: 'none', letterSpacing: 0 }}>{[v.year, v.make, v.model, v.trim].filter(Boolean).join(' ')}</b></a>
        <div><button className="btn ghost sm" style={{ marginTop: 8 }} onClick={() => remove(v.id)}>{t.remove}</button></div></th>)}</tr></thead>
      <tbody>{rows.map(([label, fn]) => <tr key={label}><td style={{ color: 'var(--mut)' }}>{label}</td>{list.map((v) => <td key={v.id}>{fn(v) ?? '—'}</td>)}</tr>)}</tbody>
    </table></div>
  );
}
