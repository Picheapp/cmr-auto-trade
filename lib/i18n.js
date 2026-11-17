import { cookies } from 'next/headers';

export function getLang() {
  const l = cookies().get('lang')?.value;
  return l === 'en' ? 'en' : 'es';
}
export * from './shared';
