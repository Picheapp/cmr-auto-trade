import { put } from '@vercel/blob';
import { getUser, isStaff } from '@/lib/auth';
import { ok, bad } from '@/lib/http';
export async function POST(req) {
  const fd = await req.formData().catch(() => null);
  const file = fd?.get('file');
  if (!file || typeof file === 'string') return bad('Archivo requerido');
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return bad('Solo imágenes JPG/PNG/WEBP');
  if (file.size > 4 * 1024 * 1024) return bad('Imagen demasiado grande (máx. 4 MB)');
  const user = await getUser();
  const folder = isStaff(user) && fd.get('folder') === 'vehicles' ? 'vehicles' : fd.get('folder') === 'promotions' && isStaff(user) ? 'promotions' : 'tradeins';
  const name = String(file.name || 'foto.jpg').replace(/[^\w.\-]/g, '_').slice(-60);
  const blob = await put(`${folder}/${Date.now()}-${name}`, file, { access: 'public', contentType: file.type, addRandomSuffix: true });
  return ok({ url: blob.url });
}
