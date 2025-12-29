import { defineRouting } from 'next-intl/routing';

/**
 * Configure internationalization routing for the application.
 *
 * This configuration defines the supported locales and default locale
 * for the Lanzate e-commerce platform.
 *
 * Supported Locales:
 * - 'es': Spanish (default)
 * - 'en': English
 *
 * Routing Strategy:
 * - URL path-based routing (e.g., /es/dashboard, /en/dashboard)
 * - Spanish is the default locale
 * - Locale prefix is always shown in URL for consistency
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es', 'en'],

  // Used when no locale matches
  defaultLocale: 'es',
});

/**
 * Type-safe Locale type for use throughout the application.
 *
 * This ensures that only valid locale strings are used in components,
 * Server Actions, and utility functions.
 *
 * @example
 * const locale: Locale = 'es'; // Valid
 * const locale: Locale = 'fr'; // TypeScript error
 */
export type Locale = (typeof routing.locales)[number];
