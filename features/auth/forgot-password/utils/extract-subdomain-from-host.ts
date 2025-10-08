import { APP_CONFIG } from '@/features/global/constants';

export function extractSubdomainFromHost(host: string): string | null {
  const root = APP_CONFIG.ROOT_DOMAIN;
  if (host === root || host === `www.${root}`) return null;
  const sub = host.replace(`.${root}`, '');
  return sub !== host ? sub : null;
}
