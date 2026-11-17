import Link from 'next/link';
import { q, getSettings } from '@/lib/db';
import { listVehicles, favIds } from '@/lib/vehicles';
import { getLang, dict, CATEGORIES, BRANDS, NEW_BRANDS, PREMIUM, waLink } from '@/lib/i18n';
import { getUser } from '@/lib/auth';
import Rail from '@/components/Rail';
import VehicleCard from '@/components/VehicleCard';
import LeadForm from '@/components/LeadForm';
import { CatIcon } from '@/components/Icons';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const lang = getLang(); const t = dict(lang);
  const user = await getUser();
  const [all, promos, testi, s, favs] = await Promise.all([
    listVehicles({ limit: 300 }),
    q('select * from promotions where active = true order by created_at desc'),
    q('select * from testimonials where active = true order by created_at desc'),
    getSettings(),
    favIds(user?.id),
  ]);
  const featured = all.filter((v) => v.featured);
  const newest = all.slice(0, 10);
  const catCount = Object.fromEntries(CATEGORIES.map((c) => [c.key, all.filter((v) => (v.categories || []).includes(c.key)).length]));
  const brandCount = {};
  for (const v of all) brandCount[(v.make || '').toLowerCase()] = (brandCount[(v.make || '').toLowerCase()] || 0) + 1;
  const extraBrands = [...new Set(all.map((v) => v.make))].filter((m) => m && !BRANDS.some((b) => b.toLowerCase() === m.toLowerCase()));
  const brands = [...BRANDS, ...extraBrands].sort((a, b) => (brandCount[b.toLowerCase()] || 0) - (brandCount[a.toLowerCase()] || 0));
  const makes = [...new Set(all.map((v) => v.make).filter(Boolean))].sort();
  const tradeImg = all.find((v) => v.stock === 'L004-05')?.photos?.[0] || all.find((v) => v.body_type === 'Pickup')?.photos?.[0] || '/img/promo-comercial.jpg';
  const hero = featured.find((v) => v.stock === 'L007-18')?.photos?.[0] || all[0]?.photos?.[0] || '/img/promo-cmr.jpg';
  const card = (v) => <VehicleCard key={v.id} v={v} t={t} lang={lang} fav={favs.has(v.id)} loggedIn={!!user} />;
  const wa = waLink(s.whatsapp, lang === 'es' ? 'Hola CMR Auto Trade, quiero información.' : 'Hi CMR Auto Trade, I would like information.');

  return (
    <main>
      <section className="hero">
        <img className="bg" src={hero} alt="" />
        <div className="wrap in">
          <div className="kick">CMR Auto Trade · {t.slogan}</div>
          <h1>{lang === 'es' ? <>¡Encuentra tu <span>próximo auto!</span></> : <>Find your <span>next ride.</span></>}</h1>
          <p>{t.hero_sub}</p>
          <div className="ctas">
            <Link className="btn" href="/inventory">{t.search_inventory}</Link>
            <Link className="btn ghost" href="#featured">{t.browse}</Link>
          </div>
          <form className="qsearch" action="/inventory" method="get">
            <select name="make" defaultValue=""><option value="">{t.make}: {t.any}</option>{makes.map((m) => <option key={m}>{m}</option>)}</select>
            <select name="category" defaultValue=""><option value="">{t.category}: {t.any}</option>{CATEGORIES.filter((c) => catCount[c.key]).map((c) => <option key={c.key} value={c.key}>{c[lang]}</option>)}</select>
            <input name="price_max" type="number" min="0" step="1000" placeholder={t.price_max} />
            <input name="q" placeholder={t.search} />
            <button className="btn">{t.search_inventory}</button>
          </form>
        </div>
      </section>

      <section className="wrap">
        <div className="trust">
          <div><b>{all.length}</b><small>{lang === 'es' ? 'Unidades disponibles' : 'Units available'}</small></div>
          <div><b>{makes.length}</b><small>{lang === 'es' ? 'Marcas en inventario' : 'Brands in stock'}</small></div>
          <div><b>100%</b><small>{lang === 'es' ? 'Fotos reales de cada unidad' : 'Real photos of every unit'}</small></div>
          <div><b>{lang === 'es' ? 'Sí' : 'Yes'}</b><small>{lang === 'es' ? 'Financiamiento y trade-in' : 'Financing & trade-in'}</small></div>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: 56 }}>
        <div className="row-head"><h2 className="h2">{t.categories}</h2></div>
        <Rail>
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={`/inventory?category=${c.key}`} className="cat">
              <CatIcon name={c.icon} /><b>{c[lang]}</b><small>{catCount[c.key]} {lang === 'es' ? 'unidades' : 'units'}</small>
            </Link>
          ))}
        </Rail>
      </section>

      <section className="wrap section" style={{ paddingBottom: 0 }}>
        <div className="row-head"><h2 className="h2">{t.brands}</h2></div>
        <Rail>
          {brands.map((b) => {
            const n = brandCount[b.toLowerCase()] || 0;
            return <Link key={b} href={`/inventory?make=${encodeURIComponent(b)}`} className={'brand' + (n ? '' : ' dim')}>{b}{n ? <span className="n">{n}</span> : null}</Link>;
          })}
        </Rail>
      </section>

      {featured.length > 0 && (
        <section className="wrap section" id="featured">
          <div className="row-head"><div><div className="kick">CMR</div><h2 className="h2">{t.featured}</h2></div><Link className="btn ghost sm" href="/inventory">{t.browse} →</Link></div>
          <Rail>{featured.map(card)}</Rail>
        </section>
      )}

      {promos.length > 0 && (
        <section className="wrap section" style={{ paddingTop: 0 }}>
          <div className="row-head"><h2 className="h2">{t.offers}</h2></div>
          <Rail>
            {promos.map((p) => (
              <Link key={p.id} href={p.cta_link || '/inventory'} className="banner blue promo">
                {p.image ? <img src={p.image} alt="" /> : null}
                <h3>{p.title}</h3>{p.subtitle && <p>{p.subtitle}</p>}
                {p.cta_label && <span className="btn white sm" style={{ alignSelf: 'flex-start' }}>{p.cta_label}</span>}
              </Link>
            ))}
          </Rail>
        </section>
      )}

      <section className="wrap section" style={{ paddingTop: featured.length ? 0 : undefined }} id={featured.length ? undefined : 'featured'}>
        <div className="row-head"><div><div className="kick">{lang === 'es' ? 'Nuevo' : 'New'}</div><h2 className="h2">{t.new_arrivals}</h2></div></div>
        <Rail>{newest.map(card)}</Rail>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="banners">
          <div className="banner blue">
            <img src="/img/promo-cmr.jpg" alt="" />
            <div className="kick">{t.nav_financing}</div><h3>{t.fin_banner_t}</h3><p>{t.fin_banner_s}</p>
            <Link className="btn white" href="/financing" style={{ alignSelf: 'flex-start' }}>{t.fin_banner_b}</Link>
          </div>
          <div className="banner">
            <img src={tradeImg} alt="" />
            <div className="kick">Trade-In</div><h3>{t.trade_banner_t}</h3><p>{t.trade_banner_s}</p>
            <Link className="btn" href="/trade-in" style={{ alignSelf: 'flex-start' }}>{t.trade_banner_b}</Link>
          </div>
        </div>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="showcase">
          <img src="/img/promo-premium.jpg" alt="CMR Auto Trade Premium Collection" />
          <div>
            <div className="kick">{t.premium_kick}</div>
            <h3>{t.premium_t}</h3>
            <p>{t.premium_s}</p>
            <ul className="tags">{PREMIUM.map((b) => <li key={b}>{b}</li>)}</ul>
            <a className="btn" href={waLink(s.whatsapp, lang === 'es' ? 'Hola CMR, me interesa la línea premium. ¿Qué unidades tienen disponibles?' : 'Hi CMR, I am interested in the premium line. What units are available?') || '/#contact'} target="_blank" rel="noopener noreferrer">{t.premium_b}</a>
          </div>
        </div>
        <div className="showcase rev">
          <img src="/img/promo-comercial.jpg" alt="CMR Auto Trade unidades comerciales" />
          <div>
            <div className="kick">{lang === 'es' ? 'Comerciales' : 'Commercial'}</div>
            <h3>{t.commercial_t}</h3>
            <p>{t.commercial_s}</p>
            <Link className="btn" href="/inventory?category=commercial">{t.commercial_b} ({catCount.commercial + catCount.van})</Link>
          </div>
        </div>
      </section>

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="row-head"><h2 className="h2">{t.brands_t}</h2></div>
        <div className="contact-grid">
          <div className="box"><div className="kick">{t.brands_new}</div><ul className="tags" style={{ marginTop: 12 }}>{NEW_BRANDS.map((b) => <li key={b}><Link href={`/inventory?make=${encodeURIComponent(b)}`}>{b}</Link></li>)}</ul></div>
          <div className="box"><div className="kick">{t.brands_used}</div><h3 style={{ fontFamily: 'var(--head)', fontSize: 34, textTransform: 'uppercase', marginTop: 8 }}>{t.brands_used_all}</h3><p className="sub">{t.remote_s}</p></div>
        </div>
      </section>

      {testi.length > 0 && (
        <section className="wrap section" style={{ paddingTop: 0 }}>
          <div className="row-head"><h2 className="h2">{t.testimonials}</h2></div>
          <Rail>
            {testi.map((x) => (
              <div key={x.id} className="tcard">
                <div className="stars">{'★'.repeat(Math.max(1, Math.min(5, x.rating || 5)))}</div>
                <p>“{x.text}”</p><b>{x.name}</b>
              </div>
            ))}
          </Rail>
        </section>
      )}

      <section className="wrap section" style={{ paddingTop: 0 }}>
        <div className="row-head"><h2 className="h2">{t.why}</h2></div>
        <div className="why">
          <div><div className="ico">✓</div><h4>{t.why1_t}</h4><p>{t.why1_s}</p></div>
          <div><div className="ico">$</div><h4>{t.why2_t}</h4><p>{t.why2_s}</p></div>
          <div><div className="ico">⇄</div><h4>{t.why3_t}</h4><p>{t.why3_s}</p></div>
          <div><div className="ico">★</div><h4>{t.why4_t}</h4><p>{t.why4_s}</p></div>
          <div><div className="ico">🚚</div><h4>{t.remote_t}</h4><p>{t.remote_s}</p></div>
        </div>
      </section>

      <section className="wrap section" id="contact" style={{ paddingTop: 0 }}>
        <div className="row-head"><h2 className="h2">{t.contact}</h2></div>
        <div className="contact-grid">
          <div className="box">
            <dl className="kv">
              <dt>{t.phone}</dt><dd>{s.phone ? <a className="link" href={`tel:${s.phone}`}>{s.phone}</a> : t.to_confirm}</dd>
              <dt>{t.whatsapp}</dt><dd>{wa ? <a className="link" href={wa} target="_blank" rel="noopener noreferrer">{s.whatsapp}</a> : t.to_confirm}</dd>
              <dt>{t.email}</dt><dd>{s.email || t.to_confirm}</dd>
              <dt>{t.address}</dt><dd>{s.address || t.to_confirm}{s.maps_url ? <> · <a className="link" href={s.maps_url} target="_blank" rel="noopener noreferrer">Google Maps</a></> : null}</dd>
              <dt>{t.hours}</dt><dd>{lang === 'es' ? s.hours_es : s.hours_en}</dd>
            </dl>
            <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
              {wa && <a className="btn wa" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
              <Link className="btn ghost" href="/appointments">{t.nav_appointments}</Link>
            </div>
          </div>
          <div className="box">
            <h3 style={{ fontFamily: 'var(--head)', fontSize: 26, textTransform: 'uppercase', marginBottom: 14 }}>{t.inquiry}</h3>
            <LeadForm t={t} vehicles={all} user={user} />
          </div>
        </div>
      </section>
    </main>
  );
}
