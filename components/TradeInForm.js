'use client';
import { useState } from 'react';
import { useSubmit, formObj } from './useSubmit';
import { uploadImages } from './upload';

export default function TradeInForm({ t, vehicleId, user }) {
  const [files, setFiles] = useState([]);
  const [up, setUp] = useState('');
  const [st, submit, setSt] = useSubmit();
  async function onSubmit(e) {
    e.preventDefault();
    const o = formObj(e.target); delete o.photos_input;
    let photos = [];
    try { if (files.length) { setUp(t.uploading); photos = await uploadImages(files.slice(0, 8), 'tradeins'); } }
    catch (err) { setUp(''); setSt({ loading: false, ok: false, error: err.message }); return; }
    setUp('');
    await submit({ kind: 'tradein', ...o, photos, interest_vehicle_id: vehicleId || '' });
  }
  if (st.ok) return <div className="alert ok">{t.sent_ok}</div>;
  return (
    <form className="form" onSubmit={onSubmit}>
      <fieldset><legend>{t.your_vehicle}</legend>
        <div className="three">
          <label className="f">{t.year} *<input name="year" type="number" min="1970" max="2030" required /></label>
          <label className="f">{t.make} *<input name="make" required maxLength={60} /></label>
          <label className="f">{t.model} *<input name="model" required maxLength={60} /></label>
        </div>
        <div className="three">
          <label className="f">{t.mileage} *<input name="mileage" type="number" min="0" required /></label>
          <label className="f">{t.condition} *<select name="condition" required defaultValue="">
            <option value="" disabled>—</option><option value="Excellent">{t.cond_excellent}</option><option value="Good">{t.cond_good}</option><option value="Fair">{t.cond_fair}</option><option value="Poor">{t.cond_poor}</option>
          </select></label>
          <label className="f">{t.vin}<input name="vin" maxLength={17} minLength={11} pattern="[A-HJ-NPR-Za-hj-npr-z0-9]{11,17}" /></label>
        </div>
        <label className="f">{t.upload_photos}<input name="photos_input" type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files].slice(0, 8))} /></label>
        {files.length > 0 && <div className="note">{files.length} {t.photos}</div>}
        <label className="chk"><input type="checkbox" name="want_estimate" value="yes" defaultChecked /> {t.want_estimate}</label>
        <label className="f">{t.message}<textarea name="notes" rows={3} maxLength={1500} /></label>
      </fieldset>
      <fieldset><legend>{t.contact_info}</legend>
        <label className="f">{t.name} *<input name="name" required maxLength={120} defaultValue={user?.name || ''} /></label>
        <div className="two">
          <label className="f">{t.phone} *<input name="phone" type="tel" required minLength={7} maxLength={30} /></label>
          <label className="f">{t.email}<input name="email" type="email" maxLength={160} defaultValue={user?.email || ''} /></label>
        </div>
      </fieldset>
      {(st.error) && <div className="alert err">{st.error}</div>}
      <button className="btn" disabled={st.loading || !!up}>{up || (st.loading ? t.sending : t.send)}</button>
    </form>
  );
}
