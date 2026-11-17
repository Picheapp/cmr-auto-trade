'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AutoSubmitSelect({ name, value, options }) {
  return (
    <select className="inp" style={{ width: 'auto' }} name={name} defaultValue={value} form="filters"
      onChange={(e) => e.target.form.requestSubmit()}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}
export function MobileFilterToggle({ label }) {
  return <button type="button" className="btn ghost sm mfilter" onClick={() => document.getElementById('filters').classList.toggle('open')}>⚙ {label}</button>;
}
export function SaveSearch({ query, label, savedLabel, loggedIn }) {
  const [done, setDone] = useState(false);
  const router = useRouter();
  async function save() {
    if (!loggedIn) { router.push('/login?next=' + encodeURIComponent('/inventory?' + query)); return; }
    const name = window.document.title.split('|')[0].trim();
    const r = await fetch('/api/saved-searches', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ query, name }) });
    if ((await r.json()).ok) setDone(true);
  }
  return <button type="button" className="btn ghost sm" onClick={save} disabled={done}>{done ? '✓ ' + savedLabel : '☆ ' + label}</button>;
}
