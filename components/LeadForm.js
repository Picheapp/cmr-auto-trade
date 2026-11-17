'use client';
import { useSubmit, formObj } from './useSubmit';

export default function LeadForm({ t, vehicles = [], vehicleId = '', user, compact }) {
  const [st, submit] = useSubmit();
  async function onSubmit(e) {
    e.preventDefault();
    const o = formObj(e.target);
    const r = await submit({ kind: 'inquiry', ...o });
    if (r) e.target.reset();
  }
  if (st.ok) return <div className="alert ok">{t.sent_ok}</div>;
  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="f">{t.name} *<input name="name" required defaultValue={user?.name || ''} maxLength={120} /></label>
      <div className="two">
        <label className="f">{t.phone} *<input name="phone" type="tel" required minLength={7} maxLength={30} /></label>
        <label className="f">{t.email}<input name="email" type="email" defaultValue={user?.email || ''} maxLength={160} /></label>
      </div>
      {vehicleId ? <input type="hidden" name="vehicle_id" value={vehicleId} /> : vehicles.length ? (
        <label className="f">{t.vehicle_interest}<select name="vehicle_id" defaultValue="">
          <option value="">{t.none}</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.stock} · {[v.year, v.make, v.model, v.trim].filter(Boolean).join(' ')}</option>)}
        </select></label>
      ) : null}
      {!compact && <label className="f">{t.message}<textarea name="message" rows={4} maxLength={2000} /></label>}
      {st.error && <div className="alert err">{st.error}</div>}
      <button className="btn" disabled={st.loading}>{st.loading ? t.sending : t.send}</button>
    </form>
  );
}
