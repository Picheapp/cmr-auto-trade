'use client';
import { useState } from 'react';
export function useSubmit() {
  const [state, setState] = useState({ loading: false, ok: false, error: '' });
  async function submit(payload) {
    setState({ loading: true, ok: false, error: '' });
    try {
      const r = await fetch('/api/forms', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ source: getSource(), ...payload }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'Error');
      setState({ loading: false, ok: true, error: '' });
      return j;
    } catch (e) {
      setState({ loading: false, ok: false, error: e.message });
      return null;
    }
  }
  return [state, submit, setState];
}
export function getSource() {
  try { return sessionStorage.getItem('cmr_src') || 'Sitio web (directo)'; } catch { return 'Sitio web'; }
}
export function formObj(form) {
  const fd = new FormData(form); const o = {};
  for (const [k, v] of fd.entries()) o[k] = v;
  return o;
}
