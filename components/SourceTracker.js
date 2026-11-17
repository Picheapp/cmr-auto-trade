'use client';
import { useEffect } from 'react';
// Guarda de dónde vino el visitante (UTM, anuncios, redes) para atribuir cada lead en el CRM.
export default function SourceTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem('cmr_src')) return;
      const p = new URLSearchParams(location.search);
      const ref = document.referrer ? new URL(document.referrer).hostname : '';
      let src = '';
      if (p.get('utm_source')) src = [p.get('utm_source'), p.get('utm_medium'), p.get('utm_campaign')].filter(Boolean).join(' / ');
      else if (p.get('fbclid')) src = 'Facebook / Instagram (anuncio)';
      else if (p.get('gclid')) src = 'Google Ads';
      else if (/facebook|fb\./.test(ref)) src = 'Facebook';
      else if (/instagram/.test(ref)) src = 'Instagram';
      else if (/google\./.test(ref)) src = 'Google (orgánico)';
      else if (/tiktok/.test(ref)) src = 'TikTok';
      else if (/wa\.me|whatsapp/.test(ref)) src = 'WhatsApp';
      else if (ref && ref !== location.hostname) src = 'Referido: ' + ref;
      else src = 'Sitio web (directo)';
      sessionStorage.setItem('cmr_src', src.slice(0, 60));
    } catch {}
  }, []);
  return null;
}
