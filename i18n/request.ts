import { cookies } from 'next/headers';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from '@/i18n/routing';

/**
 * next-intl request configuration.
 *
 * This function is called on every request to load the appropriate
 * translation messages based on the detected locale.
 *
 * The messages are loaded dynamically from the messages/ directory
 * and cached by Next.js for optimal performance.
 *
 * @returns Configuration object with loaded messages
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  // If not valid or undefined, use the default locale
  const requested = await requestLocale;
  const requestCookies = await cookies()
  const localeCookie = requestCookies.get("NEXT_LOCALE")

  const requestedLocale = localeCookie?.value || requested

  const locale = requestedLocale && hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
