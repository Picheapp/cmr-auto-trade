import { q } from '@/lib/db';
export const dynamic = 'force-dynamic';
export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://cmr-auto-trade.vercel.app';
  let vs = [];
  try { vs = await q(`select id, updated_at from vehicles where status <> 'Sold'`); } catch {}
  return [
    ...['', '/inventory', '/financing', '/trade-in', '/appointments', '/privacy', '/terms'].map((p) => ({ url: base + p, changeFrequency: 'daily' })),
    ...vs.map((v) => ({ url: `${base}/vehicle/${v.id}`, lastModified: v.updated_at })),
  ];
}
