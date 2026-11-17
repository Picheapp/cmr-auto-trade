'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './AdminTable';

const STAGES = ['New', 'Contacted', 'Qualified', 'Appointment Scheduled', 'Negotiating', 'Sold', 'Lost'];
const ES = { New: 'Nuevo', Contacted: 'Contactado', Qualified: 'Calificado', 'Appointment Scheduled': 'Cita agendada', Negotiating: 'Negociando', Sold: 'Vendido', Lost: 'Perdido' };
const when = (d) => new Date(d).toLocaleString('es-PR', { timeZone: 'America/Puerto_Rico', dateStyle: 'short', timeStyle: 'short' });
const wa = (p) => { const d = (p || '').replace(/\D/g, ''); return d ? `https://wa.me/${d.length === 10 ? '1' + d : d}` : null; };

export default function LeadsBoard({ leads, notes, staff, canDelete }) {
  const router = useRouter();
  const [view, setView] = useState('board');
  const [open, setOpen] = useState(null);
  const [type, setType] = useState('');
  const [who, setWho] = useState('');
  const [qq, setQ] = useState('');
  const types = [...new Set(leads.map((l) => l.type))];
  const list = leads.filter((l) => (!type || l.type === type) && (!who || String(l.assigned_to || '') === who) && (!qq || JSON.stringify(l).toLowerCase().includes(qq.toLowerCase())));
  const staffName = (id) => staff.find((s) => s.id === id)?.name || staff.find((s) => s.id === id)?.email || '—';
  return (
    <div>
      <div className="toolbar">
        <input className="inp q" placeholder="Buscar nombre, teléfono, vehículo…" value={qq} onChange={(e) => setQ(e.target.value)} />
        <select className="inp" style={{ width: 'auto' }} value={type} onChange={(e) => setType(e.target.value)}><option value="">Todos los tipos</option>{types.map((t) => <option key={t}>{t}</option>)}</select>
        <select className="inp" style={{ width: 'auto' }} value={who} onChange={(e) => setWho(e.target.value)}><option value="">Todos los vendedores</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}</select>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className={'btn sm ' + (view === 'board' ? '' : 'ghost')} onClick={() => setView('board')}>Tablero</button>
          <button className={'btn sm ' + (view === 'list' ? '' : 'ghost')} onClick={() => setView('list')}>Lista</button>
        </div>
      </div>
      {view === 'board' ? (
        <div className="kanban">{STAGES.map((s) => {
          const col = list.filter((l) => l.status === s);
          return (<div className="kcol" key={s}><h4>{ES[s]}<span>{col.length}</span></h4>
            {col.map((l) => (<div className="kcard" key={l.id} onClick={() => setOpen(l)}>
              <b>{l.name || '—'}</b><div className="note">{l.type} · {when(l.created_at)}</div>
              {l.stock && <div className="note">🚗 {l.stock} {l.vtitle}</div>}
              {l.assigned_to && <div className="note">👤 {staffName(l.assigned_to)}</div>}
            </div>))}
          </div>);
        })}</div>
      ) : (
        <div className="scroll-x"><table className="tbl"><thead><tr><th>Fecha</th><th>Cliente</th><th>Teléfono</th><th>Email</th><th>Tipo</th><th>Vehículo</th><th>Etapa</th><th>Vendedor</th><th /></tr></thead>
          <tbody>{list.map((l) => <tr key={l.id}><td>{when(l.created_at)}</td><td>{l.name}</td><td>{l.phone}</td><td>{l.email || '—'}</td><td>{l.type}</td><td>{l.stock ? `${l.stock} ${l.vtitle}` : '—'}</td><td><span className="pill blue">{ES[l.status] || l.status}</span></td><td>{staffName(l.assigned_to)}</td><td><button className="btn ghost sm" onClick={() => setOpen(l)}>Abrir</button></td></tr>)}
            {!list.length && <tr><td colSpan={9} className="note" style={{ padding: 24 }}>Sin leads todavía.</td></tr>}</tbody></table></div>
      )}
      {open && <LeadModal lead={open} notes={notes.filter((n) => n.lead_id === open.id)} staff={staff} canDelete={canDelete} onClose={() => setOpen(null)} onChange={() => { router.refresh(); }} />}
    </div>
  );
}

function LeadModal({ lead, notes, staff, canDelete, onClose, onChange }) {
  const [status, setStatus] = useState(lead.status);
  const [assigned, setAssigned] = useState(lead.assigned_to || '');
  const [note, setNote] = useState('');
  const [local, setLocal] = useState([]);
  const [err, setErr] = useState('');
  async function update(patch) { setErr(''); try { await api('leads', 'PUT', { id: lead.id, ...patch }); onChange(); } catch (e) { setErr(e.message); } }
  async function addNote(e) {
    e.preventDefault(); if (!note.trim()) return;
    const r = await fetch('/api/admin/notes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lead_id: lead.id, note }) });
    if ((await r.json()).ok) { setLocal([{ id: 'n' + Date.now(), author: 'Tú', note, created_at: new Date().toISOString() }, ...local]); setNote(''); onChange(); }
  }
  async function del() { if (!window.confirm('¿Eliminar este lead?')) return; try { await api('leads', 'DELETE', null, lead.id); onClose(); onChange(); } catch (e) { setErr(e.message); } }
  const link = wa(lead.phone);
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div><div className="kick">Lead #{lead.id} · {lead.type}</div><h2 className="h2" style={{ fontSize: 28 }}>{lead.name}</h2></div>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <dl className="kv" style={{ marginBottom: 16 }}>
          <dt>Teléfono</dt><dd>{lead.phone ? <a className="link" href={`tel:${lead.phone}`}>{lead.phone}</a> : '—'} {link && <a className="btn wa sm" style={{ marginLeft: 8 }} href={link} target="_blank" rel="noreferrer">WhatsApp</a>}</dd>
          <dt>Email</dt><dd>{lead.email ? <a className="link" href={`mailto:${lead.email}`}>{lead.email}</a> : '—'}</dd>
          <dt>Vehículo</dt><dd>{lead.vehicle_id ? <a className="link" href={`/vehicle/${lead.vehicle_id}`} target="_blank" rel="noreferrer">{lead.stock} {lead.vtitle}</a> : '—'}</dd>
          <dt>Recibido</dt><dd>{when(lead.created_at)}</dd>
          <dt>Mensaje</dt><dd style={{ whiteSpace: 'pre-line' }}>{lead.message || '—'}</dd>
        </dl>
        <div className="form"><div className="two">
          <label className="f">Etapa<select value={status} onChange={(e) => { setStatus(e.target.value); update({ status: e.target.value }); }}>{STAGES.map((s) => <option key={s} value={s}>{ES[s]}</option>)}</select></label>
          <label className="f">Vendedor asignado<select value={assigned} onChange={(e) => { setAssigned(e.target.value); update({ assigned_to: e.target.value }); }}><option value="">Sin asignar</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}</select></label>
        </div></div>
        <h3 style={{ fontFamily: 'var(--head)', textTransform: 'uppercase', fontSize: 20, margin: '20px 0 10px' }}>Notas y seguimiento</h3>
        <form className="form" onSubmit={addNote} style={{ marginBottom: 12 }}>
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Llamé, quiere ver la unidad el sábado…" />
          <button className="btn sm" style={{ justifySelf: 'start' }}>Añadir nota</button>
        </form>
        <div style={{ display: 'grid', gap: 8 }}>{[...local, ...notes].map((n) => <div key={n.id} className="box" style={{ padding: 12 }}><div className="note">{n.author} · {when(n.created_at)}</div><div style={{ whiteSpace: 'pre-line', fontSize: 14 }}>{n.note}</div></div>)}
          {!notes.length && !local.length && <div className="note">Sin notas.</div>}</div>
        {err && <div className="alert err" style={{ marginTop: 12 }}>{err}</div>}
        {canDelete && <button className="btn ghost sm" style={{ marginTop: 18, borderColor: 'var(--err)', color: 'var(--err)' }} onClick={del}>Eliminar lead</button>}
      </div>
    </div>
  );
}
