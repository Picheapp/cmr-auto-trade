export const HOURS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
export function prToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Puerto_Rico' }).format(new Date());
}
export function prHourNow() {
  return Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Puerto_Rico', hour: 'numeric', hour12: false }).format(new Date()));
}
export function to24(h) { const [t, ap] = h.split(' '); let n = Number(t.split(':')[0]); if (ap === 'PM' && n !== 12) n += 12; if (ap === 'AM' && n === 12) n = 0; return n; }
export function validDate(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d || '') && !isNaN(new Date(d + 'T12:00:00').getTime()); }
export function isSunday(d) { return new Date(d + 'T12:00:00Z').getUTCDay() === 0; }
