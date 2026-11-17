'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const fmt = {
  date: (v) => (v ? new Date(v).toLocaleString('es-PR', { timeZone: 'America/Puerto_Rico', dateStyle: 'medium', timeStyle: 'short' }) : '—'),
  day: (v) => v || '—',
  money: (v) => (v == null || v === '' ? '—' : '$' + Number(v).toLocaleString('en-US')),
  bool: (v) => (v ? '✓' : '—'),
  pill: (v) => <span className="pill blue">{v}</span>,
  photos: (v) => (v?.length ? <span style={{ display: 'flex', gap: 4 }}>{v.slice(0, 3).map((u) => <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" style={{ width: 44, height: 34, objectFit: 'cover', borderRadius: 4 }} /></a>)}{v.length > 3 ? ` +${v.length - 3}` : ''}</span> : '—'),
  wa: (v) => (v ? <a className="link" href={`https://wa.me/${(v.replace(/\D/g, '').length === 10 ? '1' : '') + v.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{v}</a> : '—'),
  long: (v) => (v ? <span style={{ whiteSpace: 'pre-line', display: 'block', maxWidth: 360, fontSize: 13 }}>{v}</span> : '—'),
};

export async function api(entity, method, body, id) {
  const r = await fetch(`/api/admin/${entity}${id ? `?id=${id}` : ''}`, { method, headers: { 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json(); if (!j.ok) throw new Error(j.error || 'Error'); return j;
}

export default function AdminTable({ entity, rows, columns, fields = [], canCreate, canDelete, createLabel = 'Nuevo', title, search = true }) {
  const router = useRouter();
  const [edit, setEdit] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [qq, setQ] = useState('');
  const list = qq ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(qq.toLowerCase())) : rows;

  async function save(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const o = {};
    for (const f of fields) {
      const el = e.target.elements[f.key]; if (!el) continue;
      o[f.key] = f.type === 'checkbox' ? el.checked : el.value;
    }
    try { await api(entity, edit.id ? 'PUT' : 'POST', edit.id ? { ...o, id: edit.id } : o); setEdit(null); router.refresh(); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  async function del(id) {
    if (!window.confirm('¿Eliminar este registro? No se puede deshacer.')) return;
    try { await api(entity, 'DELETE', null, id); setEdit(null); router.refresh(); } catch (x) { setErr(x.message); }
  }

  return (
    <div>
      <div className="toolbar">
        {search ? <input className="inp q" placeholder="Buscar…" value={qq} onChange={(e) => setQ(e.target.value)} /> : <span />}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="note">{list.length} registros</span>{canCreate && <button className="btn sm" onClick={() => setEdit({})}>+ {createLabel}</button>}</div>
      </div>
      {err && !edit && <div className="alert err" style={{ marginBottom: 12 }}>{err}</div>}
      <div className="scroll-x"><table className="tbl">
        <thead><tr>{columns.map((c) => <th key={c.key}>{c.label}</th>)}{fields.length > 0 && <th />}</tr></thead>
        <tbody>
          {list.map((r) => (
            <tr key={r.id}>
              {columns.map((c) => <td key={c.key}>{c.fmt ? fmt[c.fmt](r[c.key]) : (r[c.key] ?? '—')}</td>)}
              {fields.length > 0 && <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}><button className="btn ghost sm" onClick={() => { setErr(''); setEdit(r); }}>Editar</button></td>}
            </tr>
          ))}
          {!list.length && <tr><td colSpan={columns.length + 1} className="note" style={{ padding: 24 }}>Sin registros todavía.</td></tr>}
        </tbody>
      </table></div>
      {edit && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setEdit(null)}>
          <div className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 className="h2" style={{ fontSize: 26 }}>{edit.id ? `Editar ${title || ''} #${edit.id}` : `${createLabel}`}</h2>
              <button className="icon-btn" onClick={() => setEdit(null)}>✕</button>
            </div>
            <form className="form" onSubmit={save}>
              {fields.map((f) => (
                f.type === 'checkbox'
                  ? <label key={f.key} className="chk"><input type="checkbox" name={f.key} defaultChecked={edit.id ? !!edit[f.key] : f.default !== false} /> {f.label}</label>
                  : <label key={f.key} className="f">{f.label}{f.required ? ' *' : ''}
                    {f.type === 'select' ? <select name={f.key} defaultValue={edit[f.key] ?? f.default ?? ''}>{f.options.map((o) => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o} value={o}>{o}</option>)}</select>
                      : f.type === 'textarea' ? <textarea name={f.key} rows={f.rows || 4} defaultValue={edit[f.key] ?? ''} />
                        : <input name={f.key} type={f.type || 'text'} required={f.required && !(f.key === 'password' && edit.id)} defaultValue={f.type === 'password' ? '' : edit[f.key] ?? ''} placeholder={f.placeholder} disabled={f.createOnly && edit.id} />}
                  </label>
              ))}
              {err && <div className="alert err">{err}</div>}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <button className="btn" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
                {canDelete && edit.id && <button type="button" className="btn ghost" style={{ borderColor: 'var(--err)', color: 'var(--err)' }} onClick={() => del(edit.id)}>Eliminar</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
