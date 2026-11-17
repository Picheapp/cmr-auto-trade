import { getLang, dict } from '@/lib/i18n';
import CompareView from '@/components/CompareView';
export const metadata = { title: 'Comparar vehículos' };
export default function Page() {
  const lang = getLang(); const t = dict(lang);
  return (<main>
    <section className="phead"><div className="wrap"><div className="kick">CMR Auto Trade</div><h1>{t.compare_title}</h1></div></section>
    <div className="wrap section"><CompareView t={t} lang={lang} /></div>
  </main>);
}
