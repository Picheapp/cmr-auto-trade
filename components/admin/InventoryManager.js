'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './AdminTable';
import { uploadImages } from '../upload';
import { CATEGORIES, OPTIONS } from '@/lib/shared';

const ST_PILL = { Available: 'green', Reserved: 'amber', Pending: 'amber', Sold: 'red' };
const title = (v) => [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ');

export default function InventoryManager({ rows, canEdit }) {
  const router = useRouter();
  const [edit, setEdit] = useState(null);
  const [qq, setQ] = useState('');
  const [st, setSt] = useState('');
  const [err, setErr] = useState('');
  const list = rows.filter((v) => (!st || v.status === st) && (!qq || (title(v) + ' ' + (v.stock || '') + ' ' + (v.vin || '')).toLowerCase().includes(qq.toLowerCase())));

  async function quick(v, patch) {
    try { await api('vehicles', 'PUT', { id: v.id, ...patch }); router.refresh(); } catch (e) { setErr(e.message); }
  }
  return (
    <div>
      <div className="toolbar">
        <input className="inp q" placeholder="Buscar por stock, marca, modelo o VIN…" value={qq} onChange={(e) => setQ(e.target.value)} />
        <select className="inp" style={{ width: 'auto' }} value={st} onChange={(e) => setSt(e.target.value)}>
          <option value="">Todos los estados</option>{OPTIONS.status.map((s) => <option key={s}>{s}</option>)}
        </select>
        {canEdit && <button className="btn sm" onClick={() => setEdit({ status: 'Available', condition: 'Used', photos: [], categories: [], features: [], videos: [] })}>+ Añadir vehículo</button>}
      </div>
      {err && <div className="alert err" style={{ marginBottom: 12 }}>{err}</div>}
      <div className="scroll-x"><table className="tbl">
        <thead><tr><th>Foto</th><th>Stock</th><th>Vehículo</th><th>Precio</th><th>Millaje</th><th>Estado</th><th>Destacado</th><th>Fotos</th><th /></tr></thead>
        <tbody>{list.map((v) => (
          <tr key={v.id}>
            <td>{v.photos?.[0] ? <img src={v.photos[0]} alt="" style={{ width: 70, height: 52, objectFit: 'cover', borderRadius: 6 }} /> : '—'}</td>
            <td><b>{v.stock || '—'}</b><div className="note">{v.lot}</div></td>
            <td><a className="link" href={`/vehicle/${v.id}`} target="_blank" rel="noreferrer">{title(v)}</a><div className="note">{v.ext_color}</div></td>
            <td>{v.price ? '$' + Number(v.price).toLocaleString('en-US') : <span className="pill amber">Falta</span>}</td>
            <td>{v.mileage != null ? Number(v.mileage).toLocaleString('en-US') : <span className="pill amber">Falta</span>}</td>
            <td>{canEdit ? <select className="inp" style={{ padding: '6px 8px', width: 'auto' }} value={v.status} onChange={(e) => quick(v, { status: e.target.value })}>{OPTIONS.status.map((s) => <option key={s}>{s}</option>)}</select> : <span className={'pill ' + ST_PILL[v.status]}>{v.status}</span>}</td>
            <td>{canEdit ? <input type="checkbox" checked={!!v.featured} onChange={(e) => quick(v, { featured: e.target.checked })} style={{ accentColor: 'var(--blue)', width: 18, height: 18 }} /> : v.featured ? '✓' : ''}</td>
            <td>{v.photos?.length || 0}</td>
            <td>{canEdit && <button className="btn ghost sm" onClick={() => { setErr(''); setEdit(v); }}>Editar</button>}</td>
          </tr>
        ))}{!list.length && <tr><td colSpan={9} className="note" style={{ padding: 24 }}>Sin vehículos.</td></tr>}</tbody>
      </table></div>
      {edit && <Editor v={edit} onClose={() => setEdit(null)} onSaved={() => { setEdit(null); router.refresh(); }} />}
    </div>
  );
}

function Editor({ v, onClose, onSaved }) {
  const [photos, setPhotos] = useState(v.photos || []);
  const [cats, setCats] = useState(v.categories || []);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const move = (i, d) => { const a = [...photos]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; setPhotos(a); };
  async function addFiles(files) {
    setErr(''); setBusy(`Subiendo ${files.length} foto(s)…`);
    try { const urls = await uploadImages([...files], 'vehicles'); setPhotos((p) => [...p, ...urls]); }
    catch (e) { setErr(e.message); } finally { setBusy(''); }
  }
  async function save(e) {
    e.preventDefault(); setErr(''); setBusy('Guardando…');
    const o = Object.fromEntries(new FormData(e.target).entries());
    o.featured = e.target.elements.featured.checked;
    o.photos = photos; o.categories = cats;
    o.features = (o.features || '').split('\n'); o.videos = (o.videos || '').split('\n');
    try { await api('vehicles', v.id ? 'PUT' : 'POST', v.id ? { ...o, id: v.id } : o); onSaved(); }
    catch (x) { setErr(x.message); setBusy(''); }
  }
  async function del() {
    if (!window.confirm('¿Eliminar este vehículo del inventario? Si se vendió, es mejor marcarlo como "Sold".')) return;
    try { await api('vehicles', 'DELETE', null, v.id); onSaved(); } catch (x) { setErr(x.message); }
  }
  const I = (k, label, p = {}) => <label className="f">{label}<input name={k} defaultValue={v[k] ?? ''} {...p} /></label>;
  const S = (k, label, opts) => <label className="f">{label}<select name={k} defaultValue={v[k] ?? ''}><option value="">—</option>{opts.map((o) => <option key={o}>{o}</option>)}</select></label>;
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel" style={{ width: 'min(1000px,100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="h2" style={{ fontSize: 26 }}>{v.id ? `Editar ${v.stock || ''}` : 'Nuevo vehículo'}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <form className="form" onSubmit={save}>
          <div className="three">{I('stock', 'Stock # (ej. L001-05)')}{I('lot', 'Lote (L001–L007)')}{S('status', 'Estado', OPTIONS.status)}</div>
          <div className="three">{I('make', 'Marca *', { required: true })}{I('model', 'Modelo *', { required: true })}{I('trim', 'Versión / Trim')}</div>
          <div className="three">{I('year', 'Año', { type: 'number', min: 1970, max: 2030 })}{I('price', 'Precio (USD)', { type: 'number', min: 0, step: 1 })}{I('mileage', 'Millaje', { type: 'number', min: 0 })}</div>
          <div className="three">{I('ext_color', 'Color exterior')}{I('int_color', 'Color interior')}{I('vin', 'VIN', { maxLength: 17 })}</div>
          <div className="three">{S('condition', 'Condición', OPTIONS.condition)}{S('body_type', 'Carrocería', OPTIONS.body_type)}{S('transmission', 'Transmisión', OPTIONS.transmission)}</div>
          <div className="three">{I('engine', 'Motor (ej. 5.7L V8)')}{S('drivetrain', 'Tracción', OPTIONS.drivetrain)}{S('fuel', 'Combustible', OPTIONS.fuel)}</div>
          <div className="f" style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--mut)' }}>Categorías (para los filtros del inicio)
            <div className="chips" style={{ margin: 0 }}>{CATEGORIES.map((c) => <button type="button" key={c.key} className={'chip' + (cats.includes(c.key) ? ' on' : '')} onClick={() => setCats(cats.includes(c.key) ? cats.filter((x) => x !== c.key) : [...cats, c.key])}>{c.es}</button>)}</div>
          </div>
          <label className="f">Descripción<textarea name="description" rows={4} defaultValue={v.description || ''} /></label>
          <div className="two">
            <label className="f">Equipamiento (uno por línea)<textarea name="features" rows={5} defaultValue={(v.features || []).join('\n')} /></label>
            <label className="f">Videos (URL de YouTube o MP4, uno por línea)<textarea name="videos" rows={5} defaultValue={(v.videos || []).join('\n')} /></label>
          </div>
          <label className="chk"><input type="checkbox" name="featured" defaultChecked={!!v.featured} /> Mostrar en “Destacados” del inicio</label>
          <div className="f" style={{ display: 'grid', gap: 8, fontSize: 13, color: 'var(--mut)' }}>Fotos ({photos.length}) — la primera es la portada
            <div className="ph-grid">{photos.map((p, i) => (
              <div className="it" key={p + i}><img src={p} alt="" />
                <button type="button" className="x" onClick={() => setPhotos(photos.filter((_, k) => k !== i))}>✕</button>
                <div className="mv"><button type="button" onClick={() => move(i, -1)}>◀</button><button type="button" onClick={() => move(i, 1)}>▶</button></div>
              </div>))}
            </div>
            <input type="file" accept="image/*" multiple onChange={(e) => e.target.files.length && addFiles(e.target.files)} />
          </div>
          {err && <div className="alert err">{err}</div>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            <button className="btn" disabled={!!busy}>{busy || 'Guardar vehículo'}</button>
            {v.id && <button type="button" className="btn ghost" style={{ borderColor: 'var(--err)', color: 'var(--err)' }} onClick={del}>Eliminar</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
