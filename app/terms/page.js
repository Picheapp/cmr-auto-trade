import { getLang } from '@/lib/i18n';
export const metadata = { title: 'Términos y condiciones' };
export default function Page() {
  const es = getLang() === 'es';
  return (<main>
    <section className="phead"><div className="wrap"><h1>{es ? 'Términos y condiciones' : 'Terms & conditions'}</h1><p className="sub">{es ? 'Borrador sujeto a revisión legal.' : 'Draft subject to legal review.'}</p></div></section>
    <div className="wrap section prose">{es ? (<>
      <h2>Inventario y precios</h2><p>El inventario, precios y especificaciones pueden cambiar sin previo aviso y están sujetos a disponibilidad. Verifica todos los detalles con un asesor antes de comprar.</p>
      <h2>Estimados de pago</h2><p>Los pagos mostrados son ilustrativos, no constituyen una oferta de crédito y están sujetos a aprobación de la institución financiera.</p>
      <h2>Trade-in</h2><p>Las evaluaciones de trade-in son preliminares hasta inspeccionar el vehículo en persona.</p>
      <h2>Citas</h2><p>Las citas pueden reprogramarse por disponibilidad. Te contactaremos de ser necesario.</p>
    </>) : (<>
      <h2>Inventory and prices</h2><p>Inventory, prices and specifications may change without notice and are subject to availability. Verify all details with an advisor before purchase.</p>
      <h2>Payment estimates</h2><p>Payments shown are illustrative, not an offer of credit, and subject to lender approval.</p>
      <h2>Trade-in</h2><p>Trade-in evaluations are preliminary until the vehicle is inspected in person.</p>
      <h2>Appointments</h2><p>Appointments may be rescheduled based on availability. We will contact you if needed.</p>
    </>)}</div>
  </main>);
}
