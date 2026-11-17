'use client';
export function LogoutButton({ label }) {
  return <button className="btn ghost sm" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/'; }}>{label}</button>;
}
export function DeleteSearch({ id, label }) {
  return <button className="btn ghost sm" onClick={async () => { await fetch('/api/saved-searches?id=' + id, { method: 'DELETE' }); window.location.reload(); }}>{label}</button>;
}
