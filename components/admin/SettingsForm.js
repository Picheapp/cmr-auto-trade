'use client';
import { useState } from 'react';
const F = [['business_name', 'Nombre del negocio'], ['phone', 'Teléfono (ej. 787-555-1234)'], ['whatsapp', 'WhatsApp (solo números, ej. 7875551234)'], ['email', 'Email de contacto'], ['address', 'Dirección (sin pueblo si lo prefieres)'], ['maps_url', 'Enlace de Google Maps'], ['hours_es', 'Horario (español)'], ['hours_en', 'Horario (inglés)'], ['facebook', 'Facebook (URL)'], ['instagram', 'Instagram (URL)'], ['tiktok', 'TikTok (URL)']];
export default function SettingsForm({ s }) {
  const [st, setSt] = useState('');
  async function save(e) {
    e.preventDefault(); setSt('Guardando…');
    const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(e.target).entries())) });
    const j = await r.json(); setSt(j.ok ? '✓ Guardado' : j.error);
  }
  return (
    <form className="form box" onSubmit={save} style={{ maxWidth: 720 }}>
      {F.map(([k, l]) => <label key={k} className="f">{l}<input name={k} defaultValue={s[k] || ''} /></label>)}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}><button className="btn">Guardar ajustes</button><span className="note">{st}</span></div>
    </form>
  );
}
