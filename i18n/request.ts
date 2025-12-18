import { cookies } from 'next/headers';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {

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