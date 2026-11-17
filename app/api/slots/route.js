import { q } from '@/lib/db';
import { HOURS, prToday, prHourNow, to24, validDate, isSunday } from '@/lib/slots';
import { ok, bad } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function GET(req) {
  const d = req.nextUrl.searchParams.get('date');
  if (!validDate(d)) return bad('Fecha inválida');
  const today = prToday();
  if (d < today || isSunday(d)) return ok({ slots: [] });
  const taken = new Set((await q(`select time from appointments where date=$1 and status <> 'Cancelled'`, [d])).map((r) => r.time));
  const nowH = prHourNow();
  return ok({ slots: HOURS.filter((h) => !taken.has(h) && (d > today || to24(h) > nowH)) });
}
