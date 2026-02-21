/**
 * Dashboard Messages Constants
 *
 * This file contains all user-facing message keys used across
 * the dashboard feature. Values are next-intl translation keys
 * so the client can call t(result.message) to display the translated string.
 */

/**
 * Success Message Keys
 *
 * Translation keys for successful dashboard operations.
 */
export const DASHBOARD_SUCCESS_MESSAGES = {
  DATA_FETCHED: 'dashboard.success.dataFetched',
  STORES_FETCHED: 'dashboard.success.storesFetched',
  NO_STORES: 'dashboard.success.noStores',
} as const;

/**
 * Error Message Keys
 *
 * Translation keys for failed dashboard operations.
 */
export const DASHBOARD_ERROR_MESSAGES = {
  NOT_AUTHENTICATED: 'dashboard.errors.notAuthenticated',
  GENERIC_ERROR: 'dashboard.errors.genericError',
} as const;

/**
 * Dashboard Config
 *
 * Constants used across dashboard actions and components.
 */
export const DASHBOARD_STORE_LIMIT = 2;
