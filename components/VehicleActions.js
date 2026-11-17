'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function getCompare() {
  try { return JSON.parse(localStorage.getItem('cmr_compare') || '[]'); } catch { return []; }
}
function setCompare(ids) {
  try { localStorage.setItem('cmr_compare', JSON.stringify(ids)); window.dispatchEvent(new Event('cmr-compare')); } catch {}
}

export function FavButton({ id, initial = false, label, labelOn, loggedIn, big }) {
  const [on, setOn] = useState(initial);
  const router = useRouter();
  async function toggle(e) {
    e.preventDefault(); e.stopPropagation();
    if (!loggedIn) { router.push('/login?next=' + encodeURIComponent(location.pathname)); return; }
    const r = await fetch('/api/favorites', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ vehicle_id: id }) });
    const j = await r.json(); if (j.ok) setOn(j.favorite);
  }
  if (big) return <button className={'btn ghost sm' + (on ? ' on' : '')} onClick={toggle}>{on ? '♥ ' + labelOn : '♡ ' + label}</button>;
  return <button className={'icon-btn' + (on ? ' on' : '')} title={on ? labelOn : label} aria-label={label} onClick={toggle}>{on ? '♥' : '♡'}</button>;
}

export function CompareButton({ id, label, labelOn, big }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const sync = () => setOn(getCompare().includes(id));
    sync(); window.addEventListener('cmr-compare', sync); return () => window.removeEventListener('cmr-compare', sync);
  }, [id]);
  function toggle(e) {
    e.preventDefault(); e.stopPropagation();
    let ids = getCompare();
    ids = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id].slice(-3);
    setCompare(ids);
  }
  if (big) return <button className="btn ghost sm" onClick={toggle}>{on ? '✓ ' + labelOn : '⇄ ' + label}</button>;
  return <button className={'icon-btn' + (on ? ' on' : '')} title={on ? labelOn : label} aria-label={label} onClick={toggle}>⇄</button>;
}

export function ShareButton({ title, label, copied }) {
  const [msg, setMsg] = useState('');
  async function share() {
    const url = location.href;
    try {
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url); setMsg(copied); setTimeout(() => setMsg(''), 2500);
    } catch {}
  }
  return <button className="btn ghost sm" onClick={share}>↗ {msg || label}</button>;
}

export function CompareBar({ label }) {
  const [n, setN] = useState(0);
  useEffect(() => { const s = () => setN(getCompare().length); s(); window.addEventListener('cmr-compare', s); return () => window.removeEventListener('cmr-compare', s); }, []);
  if (!n) return null;
  return <a href="/compare" className="btn" style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 50, boxShadow: '0 10px 30px rgba(0,0,0,.5)' }}>⇄ {label} ({n})</a>;
}
