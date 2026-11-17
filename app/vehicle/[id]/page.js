import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVehicle, listVehicles, favIds } from '@/lib/vehicles';
import { getSettings } from '@/lib/db';
import { getLang, dict, money, fmtNum, vTitle, waLink } from '@/lib/i18n';
import { getUser } from '@/lib/auth';
import Gallery from '@/components/Gallery';
import PaymentCalc from '@/components/PaymentCalc';
import LeadForm from '@/components/LeadForm';
import Rail from '@/components/Rail';
import VehicleCard from '@/components/VehicleCard';
import { FavButton, CompareButton, ShareButton } from '@/components/VehicleActions';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const v = await getVehicle(params.id);
  if (!v) return { title: 'Vehículo no encontrado' };
  const title = `${vTitle(v)} (${v.stock})`;
  const desc = (v.description || `${vTitle(v)} ${v.ext_color || ''} disponible en CMR Auto Trade, Puerto Rico.`).slice(0, 160);
  return { title, description: desc, openGraph: { title, description: desc, images: v.photos?.slice(0, 1) || [] }, alternates: { canonical: `/vehicle/${v.id}` } };
}

function YouTube({ url }) {
  const m = String(url).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  if (m) return <iframe style={{ width: '100%', aspectRatio: '16/9', border: 0, borderRadius: 14 }} src={`https://www.youtube.com/embed/${m[1]}`} allowFullScreen title="video" />;
  return <video src={url} controls style={{ width: '100%', borderRadius: 14 }} />;
}

export default async function VehiclePage({ params }) {
  const v = await getVehicle(params.id);
  if (!v || !['Available', 'Reserved', 'Pending', 'Sold'].includes(v.status)) notFound();
  const lang = getLang(); const t = dict(lang);
  const user = await getUser();
  const [s, favs, similarA] = await Promise.all([
    getSettings(), favIds(user?.id),
    listVehicles({ category: v.categories?.[0], exclude: v.id, limit: 12 }),
  ]);
  const similar = similarA.length ? similarA : await listVehicles({ exclude: v.id, limit: 12 });
  const title = vTitle(v);
  const price = money(v.price, lang);
  const wa = waLink(s.whatsapp, `${lang === 'es' ? 'Hola, me interesa' : 'Hi, I am interested in'} ${title} (${v.stock}).`);
  const spec = [
    [t.year, v.year], [t.make, v.make], [t.model, v.model], [t.trim, v.trim], [t.mileage, v.mileage != null ? `${fmtNum(v.mileage, lang)} ${t.miles}` : null],
    [t.ext_color, v.ext_color], [t.int_color, v.int_color], [t.transmission, v.transmission], [t.engine, v.engine], [t.drivetrain, v.drivetrain],
    [t.fuel, v.fuel], [t.body_type, v.body_type], [t.condition, t['cond_' + v.condition] || v.condition], [t.vin, v.vin], [t.stock, v.stock], [t.status, t['st_' + v.status]],
  ];
  const ld = {
    '@context': 'https://schema.org', '@type': 'Car', name: title, brand: v.make, model: v.model, vehicleModelDate: v.year || undefined,
    color: v.ext_color || undefined, vehicleIdentificationNumber: v.vin || undefined, image: v.photos,
    mileageFromOdometer: v.mileage != null ? { '@type': 'QuantitativeValue', value: v.mileage, unitCode: 'SMI' } : undefined,
    offers: v.price ? { '@type': 'Offer', price: Number(v.price), priceCurrency: 'USD', availability: v.status === 'Sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock' } : undefined,
  };
  return (
    <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="crumbs"><Link href="/inventory">{t.nav_inventory}</Link> / {v.make} / {v.stock}</div>
      <div className="detail">
        <div style={{ display: 'grid', gap: 34, minWidth: 0 }}>
          <Gallery photos={v.photos || []} alt={title} />
          <section><h2 className="h2" style={{ fontSize: 28, marginBottom: 14 }}>{t.specs}</h2>
            <div className="specs">{spec.map(([k, val]) => <div key={k}><small>{k}</small>{val || <span style={{ color: 'var(--mut)' }}>{t.to_confirm}</span>}</div>)}</div>
          </section>
          {v.description && <section><h2 className="h2" style={{ fontSize: 28, marginBottom: 10 }}>{t.description}</h2><p style={{ whiteSpace: 'pre-line', color: '#d6dbe6' }}>{v.description}</p></section>}
          {v.features?.length > 0 && <section><h2 className="h2" style={{ fontSize: 28, marginBottom: 12 }}>{t.features}</h2><ul className="feats">{v.features.map((f) => <li key={f}>{f}</li>)}</ul></section>}
          {v.videos?.length > 0 && <section><h2 className="h2" style={{ fontSize: 28, marginBottom: 12 }}>{t.videos}</h2><div style={{ display: 'grid', gap: 14 }}>{v.videos.map((u) => <YouTube key={u} url={u} />)}</div></section>}
          <section className="box calc"><h2 className="h2" style={{ fontSize: 26, marginBottom: 14 }}>{t.estimator}</h2><PaymentCalc t={t} lang={lang} price={v.price ? Number(v.price) : ''} /></section>
        </div>
        <aside className="side">
          <div className="box" style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><span className="pill blue">{v.stock}</span><span className={'pill ' + (v.status === 'Available' ? 'green' : v.status === 'Sold' ? 'red' : 'amber')}>{t['st_' + v.status]}</span></div>
            <h1>{title}</h1>
            <div className="price">{price || <span style={{ fontSize: 20, color: 'var(--blue2)', fontFamily: 'var(--font-body)' }}>{t.call_price}</span>}</div>
            <div className="actions">
              <Link className="btn" href={`/financing?vehicle=${v.id}`}>{t.apply_fin}</Link>
              <Link className="btn ghost" href={`/appointments?vehicle=${v.id}&type=test_drive`}>{t.test_drive}</Link>
              <Link className="btn ghost" href={`/trade-in?vehicle=${v.id}`}>{t.tradein_btn}</Link>
              {wa && <a className="btn wa" href={wa} target="_blank" rel="noopener noreferrer">{t.wa_inquiry}</a>}
            </div>
            <div className="mini">
              <FavButton big id={v.id} initial={favs.has(v.id)} label={t.fav_add} labelOn={t.fav_on} loggedIn={!!user} />
              <CompareButton big id={v.id} label={t.compare_add} labelOn={t.compare_on} />
              <ShareButton title={title} label={t.share} copied={t.copied} />
            </div>
          </div>
          <div className="box"><h3 style={{ fontFamily: 'var(--head)', fontSize: 22, textTransform: 'uppercase', marginBottom: 12 }}>{t.inquiry}</h3><LeadForm t={t} vehicleId={String(v.id)} user={user} /></div>
        </aside>
      </div>
      {similar.length > 0 && <section className="section"><div className="row-head"><h2 className="h2">{t.similar}</h2></div><Rail>{similar.map((x) => <VehicleCard key={x.id} v={x} t={t} lang={lang} fav={favs.has(x.id)} loggedIn={!!user} />)}</Rail></section>}
    </main>
  );
}
