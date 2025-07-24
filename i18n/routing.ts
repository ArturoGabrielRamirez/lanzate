import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'es'/* , 'pt' */],

    // Used when no locale matches
    defaultLocale: 'es'
});

export type Locale = (typeof routing.locales)[number];