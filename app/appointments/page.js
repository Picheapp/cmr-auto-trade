import { listVehicles } from '@/lib/vehicles';
import { getLang, dict } from '@/lib/i18n';
import { getUser } from '@/lib/auth';
import AppointmentForm from '@/components/AppointmentForm';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Citas', description: 'Agenda una prueba de manejo, consulta o visita al showroom de CMR Auto Trade.' };
export default async function Page({ searchParams }) {
  const lang = getLang(); const t = dict(lang); const user = await getUser();
  const vehicles = await listVehicles({ limit: 300 });
  return (<main>
    <section className="phead"><div className="wrap"><div className="kick">CMR Auto Trade</div><h1>{t.appt_title}</h1><p className="sub">{t.appt_sub}</p></div></section>
    <div className="wrap section" style={{ maxWidth: 760 }}><div className="box"><AppointmentForm t={t} lang={lang} vehicles={vehicles} vehicleId={searchParams.vehicle || ''} type={searchParams.type || ''} user={user} /></div></div>
  </main>);
}
