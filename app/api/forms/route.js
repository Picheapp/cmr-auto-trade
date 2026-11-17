import { q, one, createLead } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { HOURS, prToday, validDate, isSunday } from '@/lib/slots';
import { ok, bad, str, num, int, isEmail, isPhone } from '@/lib/http';

const BLOB_HOST = /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\//;

export async function POST(req) {
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== 'object') return bad('Solicitud inválida');
  if (b.website) return ok(); // honeypot
  const user = await getUser();
  const name = str(b.name, 120), phone = str(b.phone, 30), email = str(b.email, 160).toLowerCase();
  if (!name) return bad('Nombre requerido / Name required');
  if (!isPhone(phone)) return bad('Teléfono inválido / Invalid phone');
  if (email && !isEmail(email)) return bad('Email inválido / Invalid email');
  let vehicle_id = int(b.vehicle_id);
  if (vehicle_id && !(await one('select id from vehicles where id=$1', [vehicle_id]))) vehicle_id = null;
  const base = { name, phone, email, vehicle_id, user_id: user?.id || null };

  switch (b.kind) {
    case 'inquiry': {
      const id = await createLead({ ...base, type: 'Inquiry', message: str(b.message, 2000) });
      return ok({ lead_id: id });
    }
    case 'financing': {
      if (!email) return bad('Email requerido / Email required');
      if (b.consent !== 'yes') return bad('Debes autorizar el contacto / Consent required');
      const employer = str(b.employer, 120); const income = num(b.monthly_income);
      if (!employer || income == null) return bad('Completa empleo e ingreso / Employment and income required');
      const lead = await createLead({ ...base, type: 'Financing', message: str(b.notes, 1500) });
      await q(`insert into financing (lead_id, user_id, vehicle_id, name, email, phone, address, employer, job_title, years_employed, monthly_income, housing, housing_payment, vehicle_price, down_payment, term, notes)
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [lead, base.user_id, vehicle_id, name, email, phone, str(b.address, 250), employer, str(b.job_title, 120), str(b.years_employed, 40), income,
          ['own', 'rent', 'family'].includes(b.housing) ? b.housing : null, num(b.housing_payment), num(b.vehicle_price), num(b.down_payment), int(b.term), str(b.notes, 1500)]);
      return ok({ lead_id: lead });
    }
    case 'tradein': {
      const year = int(b.year), make = str(b.make, 60), model = str(b.model, 60), mileage = int(b.mileage);
      if (!year || year < 1970 || year > 2030 || !make || !model || mileage == null) return bad('Completa los datos del vehículo / Vehicle details required');
      const photos = (Array.isArray(b.photos) ? b.photos : []).filter((u) => typeof u === 'string' && BLOB_HOST.test(u)).slice(0, 8);
      const interest = int(b.interest_vehicle_id);
      const msg = `${year} ${make} ${model} · ${mileage} mi · ${str(b.condition, 20)}${b.want_estimate === 'yes' ? ' · Pide estimado / Wants estimate' : ''}${b.notes ? '\n' + str(b.notes, 1500) : ''}`;
      const lead = await createLead({ ...base, vehicle_id: interest || null, type: 'Trade-In', message: msg });
      await q(`insert into tradeins (lead_id, user_id, year, make, model, mileage, condition, vin, photos, name, phone, email, notes) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [lead, base.user_id, year, make, model, mileage, str(b.condition, 20), str(b.vin, 17).toUpperCase() || null, photos, name, phone, email || null, (b.want_estimate === 'yes' ? '[Estimado solicitado] ' : '') + str(b.notes, 1500)]);
      return ok({ lead_id: lead });
    }
    case 'appointment': {
      const date = str(b.date, 10), time = str(b.time, 10);
      const types = ['test_drive', 'consultation', 'financing', 'showroom'];
      const type = types.includes(b.type) ? b.type : 'consultation';
      if (!validDate(date) || date < prToday() || isSunday(date)) return bad('Fecha no disponible / Date not available');
      if (!HOURS.includes(time)) return bad('Hora inválida / Invalid time');
      const clash = await one(`select id from appointments where date=$1 and time=$2 and status <> 'Cancelled'`, [date, time]);
      if (clash) return bad('Esa hora acaba de ocuparse, elige otra / That time was just taken, pick another', 409);
      const lead = await createLead({ ...base, type: 'Appointment', message: `${type} · ${date} ${time}${b.notes ? '\n' + str(b.notes, 1000) : ''}` });
      await q(`update leads set status='Appointment Scheduled' where id=$1`, [lead]);
      await q(`insert into appointments (lead_id, user_id, vehicle_id, type, date, time, name, phone, email, notes) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [lead, base.user_id, vehicle_id, type, date, time, name, phone, email || null, str(b.notes, 1000)]);
      return ok({ lead_id: lead });
    }
    default:
      return bad('Tipo de formulario desconocido');
  }
}
