'use client';
import { useState } from 'react';
import PaymentCalc from './PaymentCalc';
import { useSubmit, formObj } from './useSubmit';

export default function FinancingForm({ t, lang, vehicles, vehicleId, user }) {
  const pre = vehicles.find((v) => String(v.id) === String(vehicleId));
  const [calc, setCalc] = useState({ price: pre?.price ? Number(pre.price) : 35000, down: pre?.price ? Math.round(pre.price * 0.1) : 3500, term: 72 });
  const [st, submit] = useSubmit();
  async function onSubmit(e) {
    e.preventDefault();
    const o = formObj(e.target);
    await submit({ kind: 'financing', ...o, vehicle_price: calc.price, down_payment: calc.down, term: calc.term });
  }
  return (
    <div className="cols2">
      <div className="box" style={{ position: 'sticky', top: 88 }}>
        <h2 className="h2" style={{ fontSize: 26, marginBottom: 14 }}>{t.calc}</h2>
        <PaymentCalc t={t} lang={lang} price={pre?.price ? Number(pre.price) : ''} onChange={setCalc} />
      </div>
      <div className="box">
        <h2 className="h2" style={{ fontSize: 26, marginBottom: 14 }}>{t.application}</h2>
        {st.ok ? <div className="alert ok">{t.sent_ok}</div> : (
          <form className="form" onSubmit={onSubmit}>
            <fieldset><legend>{t.personal}</legend>
              <label className="f">{t.name} *<input name="name" required maxLength={120} defaultValue={user?.name || ''} /></label>
              <div className="two">
                <label className="f">{t.phone} *<input name="phone" type="tel" required minLength={7} maxLength={30} /></label>
                <label className="f">{t.email} *<input name="email" type="email" required maxLength={160} defaultValue={user?.email || ''} /></label>
              </div>
              <label className="f">{t.address}<input name="address" maxLength={250} /></label>
              <label className="f">{t.vehicle_interest}<select name="vehicle_id" defaultValue={vehicleId || ''}>
                <option value="">{t.none}</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.stock} · {[v.year, v.make, v.model, v.trim].filter(Boolean).join(' ')}</option>)}
              </select></label>
            </fieldset>
            <fieldset><legend>{t.employment}</legend>
              <div className="two">
                <label className="f">{t.employer} *<input name="employer" required maxLength={120} /></label>
                <label className="f">{t.job_title}<input name="job_title" maxLength={120} /></label>
                <label className="f">{t.years_employed}<input name="years_employed" maxLength={40} placeholder={lang === 'es' ? 'Ej. 3 años' : 'e.g. 3 years'} /></label>
                <label className="f">{t.monthly_income} *<input name="monthly_income" type="number" min="0" step="50" required /></label>
                <label className="f">{t.housing}<select name="housing"><option value="rent">{t.housing_rent}</option><option value="own">{t.housing_own}</option><option value="family">{t.housing_family}</option></select></label>
                <label className="f">{t.housing_payment}<input name="housing_payment" type="number" min="0" step="25" /></label>
              </div>
              <label className="f">{t.message}<textarea name="notes" rows={3} maxLength={1500} /></label>
            </fieldset>
            <p className="note">🔒 {t.secure_note}</p>
            <label className="chk"><input type="checkbox" name="consent" value="yes" required /> {t.consent}</label>
            {st.error && <div className="alert err">{st.error}</div>}
            <button className="btn" disabled={st.loading}>{st.loading ? t.sending : t.apply_fin}</button>
            <p className="note">{t.disclaimer}</p>
          </form>
        )}
      </div>
    </div>
  );
}
