import Link from 'next/link';
export default function Footer({ t, s, lang }) {
  const social = [['Facebook', s.facebook], ['Instagram', s.instagram], ['TikTok', s.tiktok]].filter(([, u]) => u);
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="cols">
          <div>
            <img src="/img/logo.jpg" alt="CMR Auto Trade" style={{ height: 52, borderRadius: 6, marginBottom: 14 }} />
            <p id="about">{t.footer_about}</p>
          </div>
          <div><h5>{t.nav_inventory}</h5><ul>
            <li><Link href="/inventory">{t.browse}</Link></li>
            <li><Link href="/inventory?category=suv">SUVs</Link></li>
            <li><Link href="/inventory?category=pickup">Pickups</Link></li>
            <li><Link href="/inventory?category=luxury">{lang === 'es' ? 'Lujo' : 'Luxury'}</Link></li>
          </ul></div>
          <div><h5>CMR</h5><ul>
            <li><Link href="/#about">{t.about}</Link></li>
            <li><Link href="/financing">{t.nav_financing}</Link></li>
            <li><Link href="/trade-in">{t.nav_tradein}</Link></li>
            <li><Link href="/appointments">{t.nav_appointments}</Link></li>
            <li><Link href="/#contact">{t.nav_contact}</Link></li>
          </ul></div>
          <div><h5>{t.nav_contact}</h5><ul>
            {s.phone ? <li>{t.phone}: <a href={`tel:${s.phone}`}>{s.phone}</a></li> : null}
            {s.email ? <li>{s.email}</li> : null}
            {s.address ? <li>{s.address}</li> : null}
            {social.map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}
            {!s.phone && !s.address ? <li><Link href="/#contact">{t.inquiry}</Link></li> : null}
          </ul></div>
        </div>
        <div className="bottom">
          <span>© {new Date().getFullYear()} CMR Auto Trade. {t.rights}</span>
          <span><Link href="/privacy">{t.privacy}</Link> · <Link href="/terms">{t.terms}</Link></span>
        </div>
      </div>
    </footer>
  );
}
