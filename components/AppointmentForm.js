'use client';
import { useEffect, useState } from 'react';
import { useSubmit, formObj } from './useSubmit';

export default function AppointmentForm({ t, lang, vehicles, vehicleId, type, user }) {
  const today = new Date(); const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState(null);
  const [time, setTime] = useState('');
  const [st, submit] = useSubmit();
  useEffect(() => {
    if (!date) { setSlots(null); return; }
    setTime(''); setSlots(null);
    fetch('/api/slots?date=' + date).then((r) => r.json()).then((j) => setSlots(j.slots || [])).catch(() => setSlots([]));
  }, [date]);
  async function onSubmit(e) {
    e.preventDefault();
    if (!time) return;
    await submit({ kind: 'appointment', ...formObj(e.target), date, time });
  }
  if (st.ok) return <div className="alert ok">✓ {t.appt_ok}<br />{date} · {time}</div>;
  const sunday = date && new Date(date + 'T12:00:00').getDay() === 0;
  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="f">{t.appt_type} *<select name="type" defaultValue={type || 'test_drive'}>
        <option value="test_drive">{t.at_test}</option><option value="consultation">{t.at_consult}</option><option value="financing">{t.at_fin}</option><option value="showroom">{t.at_showroom}</option>
      </select></label>
      <label className="f">{t.vehicle_interest}<select name="vehicle_id" defaultValue={vehicleId || ''}>
        <option value="">{t.none}</option>
        {vehicles.map((v) => <option key={v.id} value={v.id}>{v.stock} · {[v.year, v.make, v.model, v.trim].filter(Boolean).join(' ')}</option>)}
      </select></label>
      <label className="f">{t.date} *<input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} required /></label>
      <div className="f" style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--mut)' }}>{t.time} *
        {!date ? <span className="note">{t.pick_date}</span> : sunday ? <span className="note">{t.closed_sunday}</span> : slots === null ? <span className="note">…</span> : slots.length === 0 ? <span className="note">{t.no_slots}</span> : (
          <div className="slots">{slots.map((s) => <button type="button" key={s} className={'slot' + (time === s ? ' on' : '')} onClick={() => setTime(s)}>{s}</button>)}</div>
        )}
      </div>
      <label className="f">{t.name} *<input name="name" required maxLength={120} defaultValue={user?.name || ''} /></label>
      <div className="two">
        <label className="f">{t.phone} *<input name="phone" type="tel" required minLength={7} maxLength={30} /></label>
        <label className="f">{t.email}<input name="email" type="email" maxLength={160} defaultValue={user?.email || ''} /></label>
      </div>
      <label className="f">{t.message}<textarea name="notes" rows={3} maxLength={1000} /></label>
      {st.error && <div className="alert err">{st.error}</div>}
      <button className="btn" disabled={st.loading || !time}>{st.loading ? t.sending : (lang === 'es' ? 'Confirmar cita' : 'Confirm appointment')}</button>
    </form>
  );
}
