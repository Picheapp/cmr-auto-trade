export const CATEGORIES = [
  { key: 'suv', es: 'SUVs', en: 'SUVs', icon: 'suv' },
  { key: 'sedan', es: 'Sedanes', en: 'Sedans', icon: 'sedan' },
  { key: 'sports', es: 'Deportivos', en: 'Sports Cars', icon: 'sports' },
  { key: 'luxury', es: 'Lujo', en: 'Luxury', icon: 'luxury' },
  { key: 'coupe', es: 'Coupés', en: 'Coupes', icon: 'coupe' },
  { key: 'pickup', es: 'Pickups', en: 'Pickup Trucks', icon: 'pickup' },
  { key: 'electric', es: 'Eléctricos', en: 'Electric', icon: 'electric' },
  { key: 'hybrid', es: 'Híbridos', en: 'Hybrid', icon: 'hybrid' },
  { key: 'convertible', es: 'Convertibles', en: 'Convertibles', icon: 'convertible' },
  { key: 'van', es: 'Vans', en: 'Vans', icon: 'van' },
  { key: 'minivan', es: 'Minivans', en: 'Minivans', icon: 'minivan' },
  { key: 'commercial', es: 'Comerciales', en: 'Commercial', icon: 'commercial' },
];

export const BRANDS = ['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Porsche', 'Ford', 'Chevrolet', 'Jeep', 'RAM', 'GMC', 'Volkswagen', 'Mazda', 'Subaru', 'Tesla', 'Mitsubishi', 'Acura'];

export const OPTIONS = {
  body_type: ['SUV', 'Sedan', 'Coupe', 'Pickup', 'Convertible', 'Hatchback', 'Wagon', 'Van', 'Minivan', 'Commercial'],
  transmission: ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'],
  fuel: ['Gasoline', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric'],
  drivetrain: ['FWD', 'RWD', 'AWD', '4WD'],
  condition: ['New', 'Used', 'Certified'],
  status: ['Available', 'Reserved', 'Pending', 'Sold'],
};

const L = {
  es: {
    nav_inventory: 'Inventario', nav_financing: 'Financiamiento', nav_tradein: 'Trade-In', nav_appointments: 'Citas', nav_compare: 'Comparar', nav_contact: 'Contacto', nav_account: 'Mi cuenta', nav_login: 'Entrar', nav_admin: 'Admin',
    hero_title: '¡ENCUENTRA TU PRÓXIMO AUTO!', hero_sub: 'Pickups, SUVs, deportivos y lujo en Puerto Rico. Fotos reales de cada unidad, financiamiento y trade-in en un solo lugar.',
    search_inventory: 'Buscar inventario', browse: 'Ver vehículos', categories: 'Categorías', brands: 'Marcas', featured: 'Destacados', new_arrivals: 'Recién llegados', offers: 'Ofertas especiales',
    fin_banner_t: 'Financiamiento a tu medida', fin_banner_s: 'Calcula tu pago y solicita en minutos. Trabajamos con varias instituciones financieras.', fin_banner_b: 'Solicitar financiamiento',
    trade_banner_t: '¿Tienes un auto para entregar?', trade_banner_s: 'Envíanos los datos y fotos de tu vehículo y te contactamos con una evaluación.', trade_banner_b: 'Evaluar mi trade-in',
    testimonials: 'Lo que dicen nuestros clientes', why: '¿Por qué CMR Auto Trade?',
    why1_t: 'Unidades verificadas', why1_s: 'Cada vehículo se inspecciona y fotografía en persona.', why2_t: 'Financiamiento', why2_s: 'Te ayudamos a encontrar el plan que se ajuste a tu presupuesto.', why3_t: 'Trade-in justo', why3_s: 'Usa tu vehículo actual como pronto.', why4_t: 'Atención personal', why4_s: 'Un asesor te acompaña de principio a fin.',
    contact: 'Contacto y ubicación', phone: 'Teléfono', whatsapp: 'WhatsApp', email: 'Email', address: 'Dirección', hours: 'Horario', to_confirm: 'Por confirmar',
    call_price: 'Consultar precio', miles: 'millas', photos: 'fotos', view: 'Ver detalles', results: 'resultados', no_results: 'No encontramos vehículos con esos filtros.',
    filters: 'Filtros', clear: 'Limpiar', apply: 'Aplicar', sort: 'Ordenar', sort_newest: 'Más recientes', sort_price_asc: 'Menor precio', sort_price_desc: 'Mayor precio', sort_miles: 'Menor millaje',
    any: 'Cualquiera', price_min: 'Precio mín.', price_max: 'Precio máx.', year_min: 'Año desde', year_max: 'Año hasta', make: 'Marca', model: 'Modelo', mileage_max: 'Millaje máx.', body_type: 'Carrocería', transmission: 'Transmisión', fuel: 'Combustible', drivetrain: 'Tracción', condition: 'Condición', search: 'Buscar marca o modelo', category: 'Categoría', save_search: 'Guardar búsqueda', saved: 'Guardado',
    year: 'Año', trim: 'Versión', price: 'Precio', mileage: 'Millaje', ext_color: 'Color exterior', int_color: 'Color interior', engine: 'Motor', vin: 'VIN', stock: 'Stock #', status: 'Estado', description: 'Descripción', features: 'Equipamiento', specs: 'Especificaciones', videos: 'Videos', similar: 'Vehículos similares',
    st_Available: 'Disponible', st_Reserved: 'Reservado', st_Pending: 'Pendiente', st_Sold: 'Vendido', cond_New: 'Nuevo', cond_Used: 'Usado', cond_Certified: 'Certificado',
    estimator: 'Estimado de pago mensual', down: 'Pronto', rate: 'Tasa estimada (APR %)', term: 'Plazo (meses)', monthly: 'Pago mensual estimado', disclaimer: 'Los pagos son estimados ilustrativos, no constituyen una oferta de crédito y están sujetos a aprobación de la institución financiera. Tasa, plazo y pronto final pueden variar.',
    apply_fin: 'Solicitar financiamiento', tradein_btn: 'Evaluar trade-in', test_drive: 'Agendar prueba de manejo', wa_inquiry: 'Preguntar por WhatsApp', share: 'Compartir', copied: '¡Enlace copiado!', fav_add: 'Guardar', fav_on: 'Guardado', compare_add: 'Comparar', compare_on: 'En comparación', inquiry: 'Pedir información', send: 'Enviar', sending: 'Enviando…', sent_ok: '¡Recibido! Un asesor te contactará pronto.',
    name: 'Nombre completo', message: 'Mensaje', vehicle_interest: 'Vehículo de interés', none: 'Ninguno en particular', required: 'Campo requerido', invalid_email: 'Email inválido', invalid_phone: 'Teléfono inválido',
    fin_title: 'Centro de financiamiento', fin_sub: 'Calcula tu pago estimado y envía tu solicitud. Un especialista te contactará.', calc: 'Calculadora', vehicle_price: 'Precio del vehículo', application: 'Solicitud de crédito', personal: 'Información personal', employment: 'Empleo e ingresos', employer: 'Patrono', job_title: 'Puesto', years_employed: 'Tiempo en el empleo', monthly_income: 'Ingreso mensual bruto', housing: 'Vivienda', housing_own: 'Propia', housing_rent: 'Alquilada', housing_family: 'Con familiares', housing_payment: 'Pago de vivienda mensual', consent: 'Autorizo a CMR Auto Trade a contactarme y a compartir esta información con instituciones financieras para evaluar mi solicitud.', secure_note: 'Por tu seguridad, no te pedimos tu Seguro Social en este formulario. Un especialista lo solicitará por un canal seguro si es necesario.',
    trade_title: 'Centro de Trade-In', trade_sub: 'Cuéntanos sobre tu vehículo actual y recibe una evaluación.', your_vehicle: 'Tu vehículo', cond_excellent: 'Excelente', cond_good: 'Bueno', cond_fair: 'Regular', cond_poor: 'Necesita trabajo', upload_photos: 'Fotos del vehículo (hasta 8)', uploading: 'Subiendo fotos…', want_estimate: 'Deseo un estimado de valor de trade-in', contact_info: 'Tus datos de contacto',
    appt_title: 'Agenda tu cita', appt_sub: 'Elige el tipo de cita, la fecha y una hora disponible.', appt_type: 'Tipo de cita', at_test: 'Prueba de manejo', at_consult: 'Consulta de vehículo', at_fin: 'Consulta de financiamiento', at_showroom: 'Visita al showroom', date: 'Fecha', time: 'Hora', no_slots: 'No hay horarios disponibles ese día.', pick_date: 'Selecciona una fecha', closed_sunday: 'Cerrado los domingos.', appt_ok: '¡Cita confirmada! Te esperamos.',
    compare_title: 'Comparar vehículos', compare_empty: 'Aún no has añadido vehículos. Usa “Comparar” en el inventario (máx. 3).', remove: 'Quitar',
    login: 'Iniciar sesión', register: 'Crear cuenta', password: 'Contraseña', logout: 'Cerrar sesión', no_account: '¿No tienes cuenta?', have_account: '¿Ya tienes cuenta?', bad_login: 'Email o contraseña incorrectos.',
    my_favorites: 'Favoritos', my_searches: 'Búsquedas guardadas', my_inquiries: 'Mis consultas', my_financing: 'Mis solicitudes de financiamiento', my_appointments: 'Mis citas', my_tradeins: 'Mis trade-ins', empty: 'Nada por aquí todavía.', delete: 'Eliminar',
    footer_about: 'CMR Auto Trade: venta de vehículos de todo tipo en Puerto Rico, con inventario real, financiamiento y trade-in.', privacy: 'Política de privacidad', terms: 'Términos y condiciones', about: 'Sobre nosotros', rights: 'Todos los derechos reservados.',
  },
  en: {
    nav_inventory: 'Inventory', nav_financing: 'Financing', nav_tradein: 'Trade-In', nav_appointments: 'Appointments', nav_compare: 'Compare', nav_contact: 'Contact', nav_account: 'My account', nav_login: 'Sign in', nav_admin: 'Admin',
    hero_title: 'FIND YOUR NEXT RIDE.', hero_sub: 'Pickups, SUVs, sports and luxury vehicles in Puerto Rico. Real photos of every unit, financing and trade-in in one place.',
    search_inventory: 'Search inventory', browse: 'Browse vehicles', categories: 'Categories', brands: 'Brands', featured: 'Featured vehicles', new_arrivals: 'New arrivals', offers: 'Special offers',
    fin_banner_t: 'Financing that fits you', fin_banner_s: 'Estimate your payment and apply in minutes. We work with multiple lenders.', fin_banner_b: 'Apply for financing',
    trade_banner_t: 'Have a car to trade in?', trade_banner_s: 'Send us your vehicle details and photos and we will contact you with an evaluation.', trade_banner_b: 'Value my trade-in',
    testimonials: 'What our customers say', why: 'Why choose CMR Auto Trade',
    why1_t: 'Verified units', why1_s: 'Every vehicle is inspected and photographed in person.', why2_t: 'Financing', why2_s: 'We help you find a plan that fits your budget.', why3_t: 'Fair trade-in', why3_s: 'Use your current vehicle as a down payment.', why4_t: 'Personal service', why4_s: 'An advisor guides you from start to finish.',
    contact: 'Contact & location', phone: 'Phone', whatsapp: 'WhatsApp', email: 'Email', address: 'Address', hours: 'Hours', to_confirm: 'To be confirmed',
    call_price: 'Call for price', miles: 'miles', photos: 'photos', view: 'View details', results: 'results', no_results: 'No vehicles match those filters.',
    filters: 'Filters', clear: 'Clear', apply: 'Apply', sort: 'Sort', sort_newest: 'Newest', sort_price_asc: 'Lowest price', sort_price_desc: 'Highest price', sort_miles: 'Lowest mileage',
    any: 'Any', price_min: 'Min price', price_max: 'Max price', year_min: 'Year from', year_max: 'Year to', make: 'Make', model: 'Model', mileage_max: 'Max mileage', body_type: 'Body type', transmission: 'Transmission', fuel: 'Fuel type', drivetrain: 'Drivetrain', condition: 'Condition', search: 'Search make or model', category: 'Category', save_search: 'Save search', saved: 'Saved',
    year: 'Year', trim: 'Trim', price: 'Price', mileage: 'Mileage', ext_color: 'Exterior color', int_color: 'Interior color', engine: 'Engine', vin: 'VIN', stock: 'Stock #', status: 'Status', description: 'Description', features: 'Features', specs: 'Specifications', videos: 'Videos', similar: 'Similar vehicles',
    st_Available: 'Available', st_Reserved: 'Reserved', st_Pending: 'Pending', st_Sold: 'Sold', cond_New: 'New', cond_Used: 'Used', cond_Certified: 'Certified',
    estimator: 'Monthly payment estimator', down: 'Down payment', rate: 'Estimated rate (APR %)', term: 'Term (months)', monthly: 'Estimated monthly payment', disclaimer: 'Payments are illustrative estimates, not an offer of credit, and are subject to lender approval. Final rate, term and down payment may vary.',
    apply_fin: 'Apply for financing', tradein_btn: 'Value my trade-in', test_drive: 'Schedule test drive', wa_inquiry: 'Ask on WhatsApp', share: 'Share', copied: 'Link copied!', fav_add: 'Save', fav_on: 'Saved', compare_add: 'Compare', compare_on: 'Comparing', inquiry: 'Request information', send: 'Send', sending: 'Sending…', sent_ok: 'Received! An advisor will contact you soon.',
    name: 'Full name', message: 'Message', vehicle_interest: 'Vehicle of interest', none: 'None in particular', required: 'Required', invalid_email: 'Invalid email', invalid_phone: 'Invalid phone',
    fin_title: 'Financing center', fin_sub: 'Estimate your payment and submit your application. A specialist will contact you.', calc: 'Calculator', vehicle_price: 'Vehicle price', application: 'Credit application', personal: 'Personal information', employment: 'Employment & income', employer: 'Employer', job_title: 'Job title', years_employed: 'Time at job', monthly_income: 'Gross monthly income', housing: 'Housing', housing_own: 'Own', housing_rent: 'Rent', housing_family: 'Live with family', housing_payment: 'Monthly housing payment', consent: 'I authorize CMR Auto Trade to contact me and share this information with lenders to evaluate my application.', secure_note: 'For your security we do not ask for your Social Security number on this form. A specialist will request it through a secure channel if needed.',
    trade_title: 'Trade-In center', trade_sub: 'Tell us about your current vehicle and get an evaluation.', your_vehicle: 'Your vehicle', cond_excellent: 'Excellent', cond_good: 'Good', cond_fair: 'Fair', cond_poor: 'Needs work', upload_photos: 'Vehicle photos (up to 8)', uploading: 'Uploading photos…', want_estimate: 'I want an estimated trade-in value', contact_info: 'Your contact information',
    appt_title: 'Book an appointment', appt_sub: 'Choose the appointment type, date and an available time.', appt_type: 'Appointment type', at_test: 'Test drive', at_consult: 'Vehicle consultation', at_fin: 'Financing consultation', at_showroom: 'Showroom visit', date: 'Date', time: 'Time', no_slots: 'No times available that day.', pick_date: 'Pick a date', closed_sunday: 'Closed on Sundays.', appt_ok: 'Appointment confirmed! See you soon.',
    compare_title: 'Compare vehicles', compare_empty: 'You have not added vehicles yet. Use “Compare” in the inventory (max 3).', remove: 'Remove',
    login: 'Sign in', register: 'Create account', password: 'Password', logout: 'Sign out', no_account: 'No account yet?', have_account: 'Already have an account?', bad_login: 'Wrong email or password.',
    my_favorites: 'Favorites', my_searches: 'Saved searches', my_inquiries: 'My inquiries', my_financing: 'My financing applications', my_appointments: 'My appointments', my_tradeins: 'My trade-ins', empty: 'Nothing here yet.', delete: 'Delete',
    footer_about: 'CMR Auto Trade: vehicles of every type in Puerto Rico, with real inventory, financing and trade-in.', privacy: 'Privacy policy', terms: 'Terms & conditions', about: 'About us', rights: 'All rights reserved.',
  },
};

export function dict(lang) {
  return L[lang] || L.es;
}

export function money(n, lang = 'es') {
  if (n == null || n === '') return null;
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-PR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n));
}
export function fmtNum(n, lang = 'es') {
  if (n == null || n === '') return null;
  return new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-PR').format(Number(n));
}
export function vTitle(v) {
  return [v.year, v.make, v.model, v.trim].filter(Boolean).join(' ');
}
export function waLink(number, text) {
  const d = (number || '').replace(/\D/g, '');
  if (!d) return null;
  const full = d.length === 10 ? '1' + d : d;
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}
