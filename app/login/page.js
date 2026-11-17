import { getLang, dict } from '@/lib/i18n';
import AuthForm from '@/components/AuthForm';
export const metadata = { title: 'Iniciar sesión', robots: { index: false } };
export default function Page({ searchParams }) {
  const t = dict(getLang());
  return <main className="wrap section"><AuthForm t={t} next={searchParams.next || ''} /></main>;
}
