/**
 * Stores Messages Constants
 *
 * This file contains all user-facing message keys used across
 * the stores feature. Values are next-intl translation keys
 * so the client can call t(result.message) to display the translated string.
 */

/**
 * Success Message Keys
 *
 * Translation keys for successful store operations.
 */
export const STORE_SUCCESS_MESSAGES = {
  CREATED: 'stores.success.created',
  DELETED: 'stores.success.deleted',
  FOUND: 'stores.success.found',
  DATA_LOADED: 'stores.success.dataLoaded',
  PUBLIC_DATA_FETCHED: 'stores.success.publicDataFetched',
} as const;

/**
 * Error Message Keys
 *
 * Translation keys for failed store operations.
 */
export const STORE_ERROR_MESSAGES = {
  NOT_AUTHENTICATED: 'stores.errors.notAuthenticated',
  NOT_FOUND: 'stores.errors.notFound',
  SUBDOMAIN_REQUIRED: 'stores.errors.subdomainRequired',
  STORE_ID_REQUIRED: 'stores.errors.storeIdRequired',
  GENERIC_ERROR: 'stores.errors.genericError',
} as const;
