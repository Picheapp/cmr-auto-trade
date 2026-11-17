import { getLang } from '@/lib/i18n';
export const metadata = { title: 'Política de privacidad' };
export default function Page() {
  const es = getLang() === 'es';
  return (<main>
    <section className="phead"><div className="wrap"><h1>{es ? 'Política de privacidad' : 'Privacy policy'}</h1><p className="sub">{es ? 'Borrador sujeto a revisión legal.' : 'Draft subject to legal review.'}</p></div></section>
    <div className="wrap section prose">{es ? (<>
      <h2>Información que recopilamos</h2><p>Recopilamos los datos que nos envías en formularios (nombre, teléfono, email, información del vehículo, datos de empleo e ingresos para financiamiento, fotos de trade-in) y datos de tu cuenta si te registras.</p>
      <h2>Cómo la usamos</h2><p>Para responder tus consultas, coordinar citas, evaluar trade-ins y tramitar solicitudes de financiamiento con instituciones financieras, solo con tu autorización.</p>
      <h2>Con quién la compartimos</h2><p>No vendemos tu información. Solo la compartimos con instituciones financieras cuando solicitas financiamiento, y con proveedores que alojan este sitio.</p>
      <h2>Tus derechos</h2><p>Puedes pedirnos acceder, corregir o eliminar tus datos usando la sección de contacto.</p>
    </>) : (<>
      <h2>Information we collect</h2><p>We collect the data you submit in forms (name, phone, email, vehicle information, employment and income data for financing, trade-in photos) and your account data if you register.</p>
      <h2>How we use it</h2><p>To answer inquiries, schedule appointments, evaluate trade-ins and process financing applications with lenders, only with your authorization.</p>
      <h2>Who we share it with</h2><p>We do not sell your information. We only share it with lenders when you apply for financing, and with providers that host this site.</p>
      <h2>Your rights</h2><p>You can ask us to access, correct or delete your data through the contact section.</p>
    </>)}</div>
  </main>);
}
