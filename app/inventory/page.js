import Link from 'next/link';
import { listVehicles, facets, favIds } from '@/lib/vehicles';
import { getLang, dict, CATEGORIES, OPTIONS } from '@/lib/i18n';
import { getUser } from '@/lib/auth';
import VehicleCard from '@/components/VehicleCard';
import { AutoSubmitSelect, MobileFilterToggle, SaveSearch } from '@/components/InventoryControls';

export const dynamic = 'force-dynamic';
const KEYS = ['q', 'category', 'make', 'model', 'body_type', 'transmission', 'fuel', 'drivetrain', 'condition', 'price_min', 'price_max', 'year_min', 'year_max', 'mileage_max', 'sort'];

export async function generateMetadata({ searchParams }) {
  const bits = [searchParams.make, searchParams.model, searchParams.category].filter(Boolean).join(' ');
  return { title: bits ? `${bits} — Inventario` : 'Inventario de vehículos', description: 'Busca y filtra el inventario de CMR Auto Trade en Puerto Rico.' };
}

export default async function Inventory({ searchParams }) {
  const lang = getLang(); const t = dict(lang);
  const user = await getUser();
  const f = {}; for (const k of KEYS) if (searchParams[k]) f[k] = String(searchParams[k]).slice(0, 80);
  const [list, fc, favs] = await Promise.all([listVehicles(f), facets(), favIds(user?.id)]);
  const makes = [...new Set(fc.map((x) => x.make))].filter(Boolean);
  const models = [...new Set(fc.filter((x) => !f.make || x.make?.toLowerCase() === f.make.toLowerCase()).map((x) => x.model))].filter(Boolean);
  const qs = new URLSearchParams(f).toString();
  const sel = (name, opts, label, labelFn = (o) => o) => (
    <label>{label}
      <select name={name} defaultValue={f[name] || ''}>
        <option value="">{t.any}</option>
        {opts.map((o) => <option key={o} value={o}>{labelFn(o)}</option>)}
      </select>
    </label>
  );
  const chipHref = (key) => { const p = new URLSearchParams(f); if (key) p.set('category', key); else p.delete('category'); return '/inventory?' + p.toString(); };

  return (
    <main>
      <section className="phead"><div className="wrap"><div className="kick">CMR Auto Trade</div><h1>{t.nav_inventory}</h1></div></section>
      <div className="wrap section" style={{ paddingTop: 30 }}>
        <div className="chips">
          <Link href={chipHref('')} className={'chip' + (!f.category ? ' on' : '')}>{t.any}</Link>
          {CATEGORIES.map((c) => <Link key={c.key} href={chipHref(c.key)} className={'chip' + (f.category === c.key ? ' on' : '')}>{c[lang]}</Link>)}
        </div>
        <div className="inv">
          <form id="filters" className="filters" method="get" action="/inventory">
            <h4>{t.filters}</h4>
            {f.category && <input type="hidden" name="category" value={f.category} />}
            <label>{t.search}<input name="q" defaultValue={f.q || ''} placeholder="Jeep, RAM, BMW…" /></label>
            {sel('make', makes, t.make)}
            {sel('model', models, t.model)}
            <div className="two">
              <label>{t.price_min}<input name="price_min" type="number" min="0" step="500" defaultValue={f.price_min || ''} /></label>
              <label>{t.price_max}<input name="price_max" type="number" min="0" step="500" defaultValue={f.price_max || ''} /></label>
              <label>{t.year_min}<input name="year_min" type="number" min="1980" max="2030" defaultValue={f.year_min || ''} /></label>
              <label>{t.year_max}<input name="year_max" type="number" min="1980" max="2030" defaultValue={f.year_max || ''} /></label>
            </div>
            <label>{t.mileage_max}<input name="mileage_max" type="number" min="0" step="1000" defaultValue={f.mileage_max || ''} /></label>
            {sel('body_type', OPTIONS.body_type, t.body_type)}
            {sel('transmission', OPTIONS.transmission, t.transmission)}
            {sel('fuel', OPTIONS.fuel, t.fuel)}
            {sel('drivetrain', OPTIONS.drivetrain, t.drivetrain)}
            {sel('condition', OPTIONS.condition, t.condition, (o) => t['cond_' + o] || o)}
            <button className="btn">{t.apply}</button>
            <Link className="btn ghost" href="/inventory">{t.clear}</Link>
          </form>
          <div>
            <div className="toolbar">
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <MobileFilterToggle label={t.filters} />
                <b>{list.length}</b> <span className="sub" style={{ margin: 0 }}>{t.results}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <SaveSearch query={qs} label={t.save_search} savedLabel={t.saved} loggedIn={!!user} />
                <AutoSubmitSelect name="sort" value={f.sort || ''} options={[['', t.sort_newest], ['price_asc', t.sort_price_asc], ['price_desc', t.sort_price_desc], ['miles', t.sort_miles]]} />
              </div>
            </div>
            {list.length ? (
              <div className="grid">{list.map((v) => <VehicleCard key={v.id} v={v} t={t} lang={lang} fav={favs.has(v.id)} loggedIn={!!user} />)}</div>
            ) : <div className="box">{t.no_results} <Link className="link" href="/inventory">{t.clear}</Link></div>}
          </div>
        </div>
      </div>
    </main>
  );
}
