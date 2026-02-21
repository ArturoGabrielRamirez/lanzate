/**
 * Profile Messages Constants
 *
 * This file contains all user-facing message keys used across
 * the profile feature. Values are next-intl translation keys
 * so the client can call t(result.message) to display the translated string.
 */

/**
 * Success Message Keys
 *
 * Translation keys for successful profile operations.
 */
export const PROFILE_SUCCESS_MESSAGES = {
  HEADER_FETCHED: 'profile.success.headerFetched',
} as const;

/**
 * Error Message Keys
 *
 * Translation keys for failed profile operations.
 */
export const PROFILE_ERROR_MESSAGES = {
  NOT_AUTHENTICATED: 'profile.errors.notAuthenticated',
  USER_NOT_FOUND: 'profile.errors.userNotFound',
  GENERIC_ERROR: 'profile.errors.genericError',
} as const;
