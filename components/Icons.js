const P = {
  suv: 'M6 30h52M10 30v-8l6-10h26l8 10h4a4 4 0 0 1 4 4v4M16 12v10h34',
  sedan: 'M4 30h56M8 30v-6l10-10h22l12 9h4a4 4 0 0 1 4 4v3M18 14l-2 9h36',
  sports: 'M4 30h56M6 30v-5l14-8h18l14 6h6a2 2 0 0 1 2 2v5M20 17l-4 6h34',
  coupe: 'M4 30h56M8 30v-6l12-9h18l12 8h6a4 4 0 0 1 4 4v3',
  pickup: 'M4 30h56M6 30V20h26V10h14l8 10h4a2 2 0 0 1 2 2v8M32 20h22',
  van: 'M4 30h56M6 30V10h40l10 10h2a2 2 0 0 1 2 2v8M46 10v10h12M20 10v10',
  minivan: 'M4 30h56M6 30V16l10-6h30l10 10h2a2 2 0 0 1 2 2v8M16 10v10M46 10v10',
  convertible: 'M4 30h56M8 30v-6h40l8-2h2a2 2 0 0 1 2 2v6M26 24l6-8',
  commercial: 'M4 30h56M6 30V8h34v22M40 14h10l8 8v8M40 22h18',
  luxury: 'M32 4l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z',
  electric: 'M36 2L14 22h14l-4 16 22-20H32z',
  hybrid: 'M50 6C22 6 12 18 12 32c10-2 18-6 24-14-4 10-12 16-22 20 26 2 36-14 36-32z',
};
export function CatIcon({ name }) {
  const d = P[name] || P.suv;
  const wheels = !['luxury', 'electric', 'hybrid'].includes(name);
  return (
    <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
      {wheels && (<><circle cx="18" cy="31" r="5" fill="var(--card)" /><circle cx="48" cy="31" r="5" fill="var(--card)" /></>)}
    </svg>
  );
}
