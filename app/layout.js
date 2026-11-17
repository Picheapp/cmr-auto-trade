import './globals.css';
import { Barlow_Condensed, Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CompareBar } from '@/components/VehicleActions';
import SourceTracker from '@/components/SourceTracker';
import { waLink } from '@/lib/shared';
import { getLang, dict } from '@/lib/i18n';
import { getUser, isStaff } from '@/lib/auth';
import { getSettings, DEFAULT_SETTINGS } from '@/lib/db';

const head = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-head' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://cmr-auto-trade.vercel.app';
  return {
    metadataBase: new URL(base),
    title: { default: 'CMR Auto Trade | Autos en Puerto Rico', template: '%s | CMR Auto Trade' },
    description: 'Inventario de pickups, SUVs, deportivos y autos de lujo en Puerto Rico. Financiamiento, trade-in y citas en línea.',
    openGraph: { siteName: 'CMR Auto Trade', type: 'website', images: ['/img/promo-cmr.jpg'] },
    icons: { icon: '/img/logo.jpg' },
  };
}

export default async function RootLayout({ children }) {
  const lang = getLang();
  const t = dict(lang);
  const user = await getUser();
  let s = DEFAULT_SETTINGS;
  try { s = await getSettings(); } catch (e) { console.error('settings', e.message); }
  return (
    <html lang={lang} className={`${head.variable} ${body.variable}`}>
      <body>
        <Header t={t} lang={lang} user={user ? { name: user.name } : null} staff={isStaff(user)} />
        {children}
        <Footer t={t} s={s} lang={lang} />
        <CompareBar label={t.nav_compare} />
        <SourceTracker />
        {(() => {
          const wa = waLink(s.whatsapp, lang === 'es' ? 'Hola CMR Auto Trade, quiero información.' : 'Hi CMR Auto Trade, I would like information.');
          return wa
            ? <a className="fab wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>
            : <a className="fab" href="/#contact" aria-label={t.nav_contact}>💬</a>;
        })()}
      </body>
    </html>
  );
}
