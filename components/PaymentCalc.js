'use client';
import { useState } from 'react';
export function payment(price, down, apr, months) {
  const P = Math.max(0, (Number(price) || 0) - (Number(down) || 0));
  const n = Number(months) || 0; const r = (Number(apr) || 0) / 100 / 12;
  if (!P || !n) return 0;
  return r ? (P * r) / (1 - Math.pow(1 + r, -n)) : P / n;
}
export default function PaymentCalc({ t, lang, price = '', compact, onChange }) {
  const [v, setV] = useState({ price: price || 35000, down: price ? Math.round(price * 0.1) : 3500, apr: 7.9, term: 72 });
  const set = (k) => (e) => { const nv = { ...v, [k]: e.target.value }; setV(nv); onChange && onChange(nv); };
  const m = payment(v.price, v.down, v.apr, v.term);
  const fmt = new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-PR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  return (
    <div className="calc form">
      <div className="two">
        <label className="f">{t.vehicle_price}<input type="number" min="0" step="500" value={v.price} onChange={set('price')} /></label>
        <label className="f">{t.down}<input type="number" min="0" step="250" value={v.down} onChange={set('down')} /></label>
        <label className="f">{t.rate}<input type="number" min="0" max="30" step="0.1" value={v.apr} onChange={set('apr')} /></label>
        <label className="f">{t.term}<select value={v.term} onChange={set('term')}>{[24, 36, 48, 60, 72, 84].map((x) => <option key={x} value={x}>{x}</option>)}</select></label>
      </div>
      <div><div className="note">{t.monthly}</div><div className="out">{fmt.format(m)}<small style={{ fontSize: 18, color: 'var(--mut)' }}>/{lang === 'en' ? 'mo' : 'mes'}</small></div></div>
      <p className="note">{t.disclaimer}</p>
    </div>
  );
}
