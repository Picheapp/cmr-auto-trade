'use client';
import { useState } from 'react';
export default function AuthForm({ t, next }) {
  const [mode, setMode] = useState('login');
  const [st, setSt] = useState({ loading: false, error: '' });
  async function onSubmit(e) {
    e.preventDefault();
    setSt({ loading: true, error: '' });
    const o = Object.fromEntries(new FormData(e.target).entries());
    const r = await fetch('/api/auth/' + mode, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(o) });
    const j = await r.json();
    if (!j.ok) { setSt({ loading: false, error: j.error }); return; }
    const dest = next && next.startsWith('/') && !next.startsWith('//') ? next : (j.role === 'customer' ? '/account' : '/admin');
    window.location.href = dest;
  }
  return (
    <div className="box" style={{ maxWidth: 440, margin: '0 auto' }}>
      <h1 className="h2" style={{ marginBottom: 18 }}>{mode === 'login' ? t.login : t.register}</h1>
      <form className="form" onSubmit={onSubmit}>
        {mode === 'register' && <>
          <label className="f">{t.name} *<input name="name" required maxLength={120} /></label>
          <label className="f">{t.phone}<input name="phone" type="tel" maxLength={30} /></label>
        </>}
        <label className="f">{t.email} *<input name="email" type="email" required autoComplete="email" /></label>
        <label className="f">{t.password} *<input name="password" type="password" required minLength={mode === 'register' ? 8 : 1} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
        {st.error && <div className="alert err">{st.error}</div>}
        <button className="btn" disabled={st.loading}>{st.loading ? '…' : mode === 'login' ? t.login : t.register}</button>
      </form>
      <p className="note" style={{ marginTop: 14 }}>
        {mode === 'login' ? t.no_account : t.have_account}{' '}
        <button className="link" style={{ background: 'none', border: 0, cursor: 'pointer' }} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setSt({ loading: false, error: '' }); }}>{mode === 'login' ? t.register : t.login}</button>
      </p>
    </div>
  );
}
