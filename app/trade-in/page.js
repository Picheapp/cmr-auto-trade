import { getLang, dict } from '@/lib/i18n';
import { getUser } from '@/lib/auth';
import TradeInForm from '@/components/TradeInForm';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Trade-In', description: 'Envía los datos y fotos de tu vehículo para una evaluación de trade-in en CMR Auto Trade.' };
export default async function Page({ searchParams }) {
  const lang = getLang(); const t = dict(lang); const user = await getUser();
  return (<main>
    <section className="phead"><div className="wrap"><div className="kick">CMR Auto Trade</div><h1>{t.trade_title}</h1><p className="sub">{t.trade_sub}</p></div></section>
    <div className="wrap section" style={{ maxWidth: 860 }}><div className="box"><TradeInForm t={t} vehicleId={searchParams.vehicle || ''} user={user} /></div></div>
  </main>);
}
