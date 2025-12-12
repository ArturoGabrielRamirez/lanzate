import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['es', 'en'/* , 'pt' */],

    // Used when no locale matches
    defaultLocale: 'en'

    // The locale to redirect to when the requested locale could not be found
    
});

export type Locale = (typeof routing.locales)[number];