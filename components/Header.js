'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ t, lang, user, staff }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const links = [
    ['/inventory', t.nav_inventory], ['/financing', t.nav_financing], ['/trade-in', t.nav_tradein],
    ['/appointments', t.nav_appointments], ['/compare', t.nav_compare], ['/#contact', t.nav_contact],
  ];
  const other = lang === 'es' ? 'en' : 'es';
  return (
    <header className="hdr">
      <div className="wrap">
        <Link href="/" className="logo" aria-label="CMR Auto Trade"><img src="/img/logo.jpg" alt="CMR Auto Trade" /></Link>
        <nav>{links.map(([h, l]) => <Link key={h} href={h} className={path.startsWith(h) && h !== '/#contact' ? 'on' : ''}>{l}</Link>)}</nav>
        <div className="tools">
          <a className="lang" href={`/api/lang?l=${other}`} aria-label="Language">
            {lang === 'es' ? <><b>ES</b> / EN</> : <>ES / <b>EN</b></>}
          </a>
          {staff && <Link className="btn ghost sm hide-m" href="/admin">{t.nav_admin}</Link>}
          <Link className="btn sm hide-m" href={user ? '/account' : '/login'}>{user ? t.nav_account : t.nav_login}</Link>
        </div>
        <button className="burger" aria-label="Menú" onClick={() => setOpen(!open)}>☰</button>
      </div>
      <div className={'mnav' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
        {links.map(([h, l]) => <Link key={h} href={h}>{l}</Link>)}
        <Link href={user ? '/account' : '/login'}>{user ? t.nav_account : t.nav_login}</Link>
        {staff && <Link href="/admin">{t.nav_admin}</Link>}
      </div>
    </header>
  );
}
