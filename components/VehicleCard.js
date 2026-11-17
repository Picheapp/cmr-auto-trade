import Link from 'next/link';
import { money, fmtNum, vTitle } from '@/lib/shared';
import { FavButton, CompareButton } from './VehicleActions';

export default function VehicleCard({ v, t, lang, fav = false, loggedIn = false }) {
  const price = money(v.price, lang);
  return (
    <Link href={`/vehicle/${v.id}`} className="vcard fade-in">
      <div className="ph">
        {v.photos?.[0] ? <img src={v.photos[0]} alt={vTitle(v)} loading="lazy" /> : null}
        <span className="badge">{v.stock}</span>
        <span className={'badge st ' + v.status}>{t['st_' + v.status] || v.status}</span>
        {v.photos?.length ? <span className="cnt">📷 {v.photos.length}</span> : null}
      </div>
      <div className="bd">
        <h3>{vTitle(v)}</h3>
        <div className="meta">
          {v.mileage != null && <span>{fmtNum(v.mileage, lang)} {t.miles}</span>}
          {v.ext_color && <span>{v.ext_color}</span>}
          {v.condition && <span>{t['cond_' + v.condition] || v.condition}</span>}
        </div>
        <div className="foot">
          {price ? <span className="price">{price}</span> : <span className="price cp">{t.call_price}</span>}
          <span className="acts">
            <CompareButton id={v.id} label={t.compare_add} labelOn={t.compare_on} />
            <FavButton id={v.id} initial={fav} label={t.fav_add} labelOn={t.fav_on} loggedIn={loggedIn} />
          </span>
        </div>
      </div>
    </Link>
  );
}
