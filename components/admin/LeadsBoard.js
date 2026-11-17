'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from './AdminTable';

const STAGES = ['New', 'Contacted', 'Qualified', 'Appointment Scheduled', 'Negotiating', 'Sold', 'Lost'];
const ES = { New: 'Nuevo', Contacted: 'Contactado', Qualified: 'Calificado', 'Appointment Scheduled': 'Cita agendada', Negotiating: 'Negociando', Sold: 'Vendido', Lost: 'Perdido' };
const OPEN = STAGES.slice(0, 5);
const TYPES = ['Walk-in', 'Llamada', 'WhatsApp', 'Facebook Marketplace', 'Facebook', 'Instagram', 'Referido', 'Otro'];
const when = (d) => new Date(d).toLocaleString('es-PR', { timeZone: 'America/Puerto_Rico', dateStyle: 'short', timeStyle: 'short' });
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Puerto_Rico' }).format(new Date());
const digits = (p) => { const d = (p || '').replace(/\D/g, ''); return d.length === 10 ? '1' + d : d; };
const money = (n) => (n == null || n === '' ? '' : '$' + Number(n).toLocaleString('en-US'));
function dueClass(d) { if (!d) return ''; const t = today(); return d < t ? 'late' : d === t ? 'today' : ''; }

export default function LeadsBoard({ leads: initial, notes, staff, vehicles, canDelete, me }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initial);
  useEffect(() => setLeads(initial), [initial]);
  const [view, setView] = useState('board');
  const [open, setOpen] = useState(null);
  const [creating, setCreating] = useState(false);
  const [type, setType] = useState('');
  const [who, setWho] = useState('');
  const [qq, setQ] = useState('');
  const [over, setOver] = useState('');
  const [err, setErr] = useState('');
  const types = [...new Set(leads.map((l) => l.type).filter(Boolean))];
  const list = leads.filter((l) => (!type || l.type === type) && (!who || (who === 'me' ? l.assigned_to === me : who === 'none' ? !l.assigned_to : String(l.assigned_to || '') === who)) && (!qq || JSON.stringify(l).toLowerCase().includes(qq.toLowerCase())));
  const tasks = useMemo(() => list.filter((l) => l.next_action_at && OPEN.includes(l.status)).sort((a, b) => a.next_action_at.localeCompare(b.next_action_at)), [list]);
  const noFollow = list.filter((l) => !l.next_action_at && OPEN.includes(l.status));
  const staffName = (id) => { const s = staff.find((x) => x.id === id); return s ? s.name || s.email : '—'; };

  async function move(id, status) {
    const prev = leads;
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
    try { await api('leads', 'PUT', { id, status }); router.refresh(); } catch (e) { setLeads(prev); setErr(e.message); }
  }
  function patchLocal(id, patch) { setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l))); setOpen((o) => (o && o.id === id ? { ...o, ...patch } : o)); }

  return (
    <div>
      <div className="toolbar">
        <input className="inp q" placeholder="Buscar nombre, teléfono, vehículo…" value={qq} onChange={(e) => setQ(e.target.value)} />
        <select className="inp" style={{ width: 'auto' }} value={type} onChange={(e) => setType(e.target.value)}><option value="">Todos los tipos</option>{types.map((t) => <option key={t}>{t}</option>)}</select>
        <select className="inp" style={{ width: 'auto' }} value={who} onChange={(e) => setWho(e.target.value)}>
          <option value="">Todos los vendedores</option><option value="me">Mis leads</option><option value="none">Sin asignar</option>
          {staff.map((s) => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['board', 'Tablero'], ['tasks', `Seguimientos (${tasks.filter((l) => dueClass(l.next_action_at)).length})`], ['list', 'Lista']].map(([k, l]) => <button key={k} className={'btn sm ' + (view === k ? '' : 'ghost')} onClick={() => setView(k)}>{l}</button>)}
          <button className="btn sm" onClick={() => setCreating(true)}>+ Nuevo lead</button>
        </div>
      </div>
      {err && <div className="alert err" style={{ marginBottom: 12 }}>{err}</div>}

      {view === 'board' && (
        <div className="kanban">{STAGES.map((s) => {
          const col = list.filter((l) => l.status === s);
          const val = col.reduce((a, l) => a + (Number(l.value) || 0), 0);
          return (
            <div key={s} className={'kcol' + (over === s ? ' drop' : '')}
              onDragOver={(e) => { e.preventDefault(); setOver(s); }} onDragLeave={() => setOver('')}
              onDrop={(e) => { e.preventDefault(); setOver(''); const id = Number(e.dataTransfer.getData('text/plain')); const l = leads.find((x) => x.id === id); if (l && l.status !== s) move(id, s); }}>
              <h4>{ES[s]}<span>{col.length}{val ? ` · ${money(val)}` : ''}</span></h4>
              {col.map((l) => (
                <div className="kcard" key={l.id} draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', String(l.id))} onClick={() => setOpen(l)}>
                  <b>{l.name || '—'}</b>{l.value ? <span style={{ float: 'right', color: 'var(--blue2)' }}>{money(l.value)}</span> : null}
                  <div className="note">{l.type}{l.source ? ` · ${l.source}` : ''}</div>
                  {l.stock && <div className="note">🚗 {l.stock} {l.vtitle}</div>}
                  {l.assigned_to && <div className="note">👤 {staffName(l.assigned_to)}</div>}
                  {l.next_action_at && OPEN.includes(l.status) && <span className={'due ' + dueClass(l.next_action_at)}>⏰ {l.next_action_at}{l.next_action ? ` · ${l.next_action}` : ''}</span>}
                </div>
              ))}
            </div>
          );
        })}</div>
      )}

      {view === 'tasks' && (
        <div className="grid2" style={{ marginTop: 0 }}>
          <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>Próximos seguimientos</h3>
            {tasks.length ? tasks.map((l) => (
              <div key={l.id} className="kcard" onClick={() => setOpen(l)}>
                <span className={'due ' + dueClass(l.next_action_at)} style={{ marginTop: 0, marginBottom: 6 }}>⏰ {l.next_action_at}{dueClass(l.next_action_at) === 'late' ? ' · VENCIDO' : dueClass(l.next_action_at) === 'today' ? ' · HOY' : ''}</span>
                <div><b>{l.name}</b> — {l.next_action || 'Dar seguimiento'}</div>
                <div className="note">{ES[l.status]} · {l.phone}{l.stock ? ` · ${l.stock}` : ''}</div>
              </div>)) : <div className="note">No hay seguimientos programados.</div>}
          </div>
          <div className="box"><h3 className="h2" style={{ fontSize: 22, marginBottom: 12 }}>Leads abiertos sin seguimiento ({noFollow.length})</h3>
            {noFollow.length ? noFollow.map((l) => (
              <div key={l.id} className="kcard" onClick={() => setOpen(l)}><b>{l.name}</b><div className="note">{ES[l.status]} · {l.type} · recibido {when(l.created_at)}</div></div>
            )) : <div className="note">Todos los leads abiertos tienen seguimiento. 👍</div>}
          </div>
        </div>
      )}

      {view === 'list' && (
        <div className="scroll-x"><table className="tbl"><thead><tr><th>Fecha</th><th>Cliente</th><th>Teléfono</th><th>Tipo</th><th>Fuente</th><th>Vehículo</th><th>Valor</th><th>Etapa</th><th>Vendedor</th><th>Seguimiento</th><th /></tr></thead>
          <tbody>{list.map((l) => <tr key={l.id}><td>{when(l.created_at)}</td><td>{l.name}</td><td>{l.phone}</td><td>{l.type}</td><td>{l.source || '—'}</td><td>{l.stock ? `${l.stock} ${l.vtitle}` : '—'}</td><td>{money(l.value) || '—'}</td><td><span className="pill blue">{ES[l.status] || l.status}</span></td><td>{staffName(l.assigned_to)}</td><td>{l.next_action_at ? <span className={'pill ' + (dueClass(l.next_action_at) === 'late' ? 'red' : dueClass(l.next_action_at) === 'today' ? 'amber' : '')}>{l.next_action_at}</span> : '—'}</td><td><button className="btn ghost sm" onClick={() => setOpen(l)}>Abrir</button></td></tr>)}
            {!list.length && <tr><td colSpan={11} className="note" style={{ padding: 24 }}>Sin leads todavía.</td></tr>}</tbody></table></div>
      )}

      {open && <LeadModal lead={open} notes={notes.filter((n) => n.lead_id === open.id)} staff={staff} canDelete={canDelete}
        onClose={() => setOpen(null)} onPatch={(p) => patchLocal(open.id, p)} onDeleted={() => { setLeads(leads.filter((l) => l.id !== open.id)); setOpen(null); router.refresh(); }} onChange={() => router.refresh()} />}
      {creating && <NewLead vehicles={vehicles} staff={staff} me={me} onClose={() => setCreating(false)} onCreated={() => { setCreating(false); router.refresh(); }} />}
    </div>
  );
}

function NewLead({ vehicles, staff, me, onClose, onCreated }) {
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function save(e) {
    e.preventDefault(); setBusy(true); setErr('');
    const o = Object.fromEntries(new FormData(e.target).entries());
    try { await api('leads', 'POST', { ...o, status: 'New', source: o.source || o.type }); onCreated(); } catch (x) { setErr(x.message); setBusy(false); }
  }
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}><div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}><h2 className="h2" style={{ fontSize: 26 }}>Nuevo lead</h2><button className="icon-btn" onClick={onClose}>✕</button></div>
      <p className="note" style={{ marginBottom: 12 }}>Para clientes que llegan por teléfono, WhatsApp, Marketplace o en persona. Los del sitio web entran solos.</p>
      <form className="form" onSubmit={save}>
        <div className="two"><label className="f">Nombre *<input name="name" required /></label><label className="f">Teléfono<input name="phone" type="tel" /></label></div>
        <div className="two"><label className="f">Email<input name="email" type="email" /></label>
          <label className="f">Origen<select name="type">{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label></div>
        <div className="two">
          <label className="f">Vehículo de interés<select name="vehicle_id" defaultValue=""><option value="">—</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.stock} · {v.vtitle}</option>)}</select></label>
          <label className="f">Valor estimado del negocio (USD)<input name="value" type="number" min="0" step="100" /></label>
        </div>
        <div className="two">
          <label className="f">Asignar a<select name="assigned_to" defaultValue={me || ''}><option value="">Sin asignar</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}</select></label>
          <label className="f">Próximo seguimiento<input name="next_action_at" type="date" defaultValue={today()} /></label>
        </div>
        <label className="f">Próxima acción<input name="next_action" placeholder="Ej. Llamar para coordinar prueba de manejo" /></label>
        <label className="f">Notas<textarea name="message" rows={3} /></label>
        {err && <div className="alert err">{err}</div>}
        <button className="btn" disabled={busy}>{busy ? 'Guardando…' : 'Crear lead'}</button>
      </form>
    </div></div>
  );
}

function LeadModal({ lead, notes, staff, canDelete, onClose, onPatch, onDeleted, onChange }) {
  const [note, setNote] = useState('');
  const [local, setLocal] = useState([]);
  const [err, setErr] = useState('');
  const [saved, setSaved] = useState('');
  async function update(patch) {
    setErr(''); onPatch(patch);
    try { await api('leads', 'PUT', { id: lead.id, ...patch }); setSaved('✓ Guardado'); setTimeout(() => setSaved(''), 1500); onChange(); } catch (e) { setErr(e.message); }
  }
  async function addNote(text) {
    if (!text.trim()) return;
    const r = await fetch('/api/admin/notes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lead_id: lead.id, note: text }) });
    if ((await r.json()).ok) { setLocal((x) => [{ id: 'n' + Date.now(), author: 'Tú', note: text, created_at: new Date().toISOString() }, ...x]); setNote(''); onChange(); }
  }
  async function del() { if (!window.confirm('¿Eliminar este lead?')) return; try { await api('leads', 'DELETE', null, lead.id); onDeleted(); } catch (e) { setErr(e.message); } }
  const first = (lead.name || '').split(' ')[0];
  const veh = lead.vtitle ? ` ${lead.vtitle}` : '';
  const templates = [
    ['Saludo', `Hola ${first}, te habla CMR Auto Trade. Recibimos tu consulta${veh ? ' sobre la' + veh : ''}. ¿Cuándo te viene bien hablar?`],
    ['Cita', `Hola ${first}, ¿te gustaría venir a ver${veh ? ' la' + veh : ' la unidad'} esta semana? Tenemos disponibilidad para prueba de manejo.`],
    ['Seguimiento', `Hola ${first}, ¿pudiste pensar en${veh ? ' la' + veh : ' la unidad'}? Quedo pendiente para cualquier pregunta.`],
  ];
  const d = digits(lead.phone);
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div><div className="kick">Lead #{lead.id} · {lead.type}{lead.source ? ` · ${lead.source}` : ''}</div><h2 className="h2" style={{ fontSize: 28 }}>{lead.name}</h2></div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span className="note">{saved}</span><button className="icon-btn" onClick={onClose}>✕</button></div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {lead.phone && <a className="btn sm" href={`tel:${lead.phone}`} onClick={() => addNote('📞 Llamada realizada')}>📞 Llamar</a>}
          {d && templates.map(([l, txt]) => <a key={l} className="btn wa sm" href={`https://wa.me/${d}?text=${encodeURIComponent(txt)}`} target="_blank" rel="noreferrer" onClick={() => addNote(`💬 WhatsApp enviado (${l})`)}>WhatsApp: {l}</a>)}
          {lead.email && <a className="btn ghost sm" href={`mailto:${lead.email}`}>✉ Email</a>}
        </div>
        <dl className="kv" style={{ marginBottom: 16 }}>
          <dt>Teléfono</dt><dd>{lead.phone || '—'}</dd>
          <dt>Email</dt><dd>{lead.email || '—'}</dd>
          <dt>Vehículo</dt><dd>{lead.vehicle_id ? <a className="link" href={`/vehicle/${lead.vehicle_id}`} target="_blank" rel="noreferrer">{lead.stock} {lead.vtitle}</a> : '—'}</dd>
          <dt>Recibido</dt><dd>{when(lead.created_at)}</dd>
          <dt>Mensaje</dt><dd style={{ whiteSpace: 'pre-line' }}>{lead.message || '—'}</dd>
        </dl>
        <div className="form">
          <div className="two">
            <label className="f">Etapa<select value={lead.status} onChange={(e) => update({ status: e.target.value })}>{STAGES.map((s) => <option key={s} value={s}>{ES[s]}</option>)}</select></label>
            <label className="f">Vendedor asignado<select value={lead.assigned_to || ''} onChange={(e) => update({ assigned_to: e.target.value ? Number(e.target.value) : null })}><option value="">Sin asignar</option>{staff.map((s) => <option key={s.id} value={s.id}>{s.name || s.email}</option>)}</select></label>
          </div>
          <div className="three">
            <label className="f">Próximo seguimiento<input type="date" defaultValue={lead.next_action_at || ''} onBlur={(e) => e.target.value !== (lead.next_action_at || '') && update({ next_action_at: e.target.value })} /></label>
            <label className="f">Próxima acción<input defaultValue={lead.next_action || ''} placeholder="Ej. Enviar fotos del interior" onBlur={(e) => e.target.value !== (lead.next_action || '') && update({ next_action: e.target.value })} /></label>
            <label className="f">Valor del negocio (USD)<input type="number" min="0" step="100" defaultValue={lead.value || ''} onBlur={(e) => String(e.target.value) !== String(lead.value || '') && update({ value: e.target.value })} /></label>
          </div>
        </div>
        <h3 style={{ fontFamily: 'var(--head)', textTransform: 'uppercase', fontSize: 20, margin: '20px 0 10px' }}>Notas y actividad</h3>
        <form className="form" onSubmit={(e) => { e.preventDefault(); addNote(note); }} style={{ marginBottom: 12 }}>
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Quiere ver la unidad el sábado, tiene trade-in…" />
          <button className="btn sm" style={{ justifySelf: 'start' }}>Añadir nota</button>
        </form>
        <div style={{ display: 'grid', gap: 8 }}>{[...local, ...notes].map((n) => <div key={n.id} className="box" style={{ padding: 12 }}><div className="note">{n.author} · {when(n.created_at)}</div><div style={{ whiteSpace: 'pre-line', fontSize: 14 }}>{n.note}</div></div>)}
          {!notes.length && !local.length && <div className="note">Sin actividad todavía.</div>}</div>
        {err && <div className="alert err" style={{ marginTop: 12 }}>{err}</div>}
        {canDelete && <button className="btn ghost sm" style={{ marginTop: 18, borderColor: 'var(--err)', color: 'var(--err)' }} onClick={del}>Eliminar lead</button>}
      </div>
    </div>
  );
}
