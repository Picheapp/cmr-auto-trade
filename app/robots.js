export default function robots() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://cmr-auto-trade.vercel.app';
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/account', '/api', '/login'] }], sitemap: base + '/sitemap.xml' };
}
