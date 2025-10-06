import { APP_CONFIG } from '@/features/global/constants';

export function getBaseUrlAndLocale(request: Request) {
  const url = new URL(request.url);
  const locale = url.pathname.split('/')[1] || 'en';
  const baseUrl = `${APP_CONFIG.PROTOCOL}://${APP_CONFIG.ROOT_DOMAIN}`;
  return { baseUrl, locale } as const;
}

export function buildRedirect(baseUrl: string, locale: string, path: string) {
  return `${baseUrl}/${locale}${path.startsWith('/') ? path : `/${path}`}`;
}


