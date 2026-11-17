import { listVehicles } from '@/lib/vehicles';
import { ok } from '@/lib/http';
export const dynamic = 'force-dynamic';
export async function GET(req) {
  const ids = (req.nextUrl.searchParams.get('ids') || '').split(',').map(Number).filter(Boolean).slice(0, 6);
  if (!ids.length) return ok({ vehicles: [] });
  const vehicles = await listVehicles({ ids, includeSold: true });
  return ok({ vehicles: vehicles.map((v) => ({ ...v, price: v.price != null ? Number(v.price) : null })) });
}
