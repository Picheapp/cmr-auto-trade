import { listVehicles } from '@/lib/vehicles';
import { getLang, dict } from '@/lib/i18n';
import { getUser } from '@/lib/auth';
import FinancingForm from '@/components/FinancingForm';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Financiamiento', description: 'Calcula tu pago estimado y solicita financiamiento para tu próximo auto en CMR Auto Trade.' };
export default async function Page({ searchParams }) {
  const lang = getLang(); const t = dict(lang); const user = await getUser();
  const vehicles = await listVehicles({ limit: 300 });
  return (<main>
    <section className="phead"><div className="wrap"><div className="kick">CMR Auto Trade</div><h1>{t.fin_title}</h1><p className="sub">{t.fin_sub}</p></div></section>
    <div className="wrap section"><FinancingForm t={t} lang={lang} vehicles={vehicles} vehicleId={searchParams.vehicle || ''} user={user} /></div>
  </main>);
}
