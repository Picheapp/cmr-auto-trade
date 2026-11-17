import { redirect } from 'next/navigation';
import { getSettings } from '@/lib/db';
import { requireRole } from '@/lib/auth';
import SettingsForm from '@/components/admin/SettingsForm';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const u = await requireRole(['admin']); if (!u) redirect('/admin');
  return (<><h1>Ajustes del sitio</h1><p className="note" style={{ marginBottom: 14 }}>Esta información aparece en el inicio, el footer y los botones de WhatsApp. Si un campo queda vacío, el sitio muestra “Por confirmar” o lo oculta.</p><SettingsForm s={await getSettings()} /></>);
}
