/**
 * Authentication Messages Constants
 *
 * This file contains all success and error message keys used across
 * the authentication feature. Values are next-intl translation keys
 * so the client can call t(result.message) to display the translated string.
 *
 * These constants ensure consistent messaging across all auth flows
 * and make it easier to update messages in a single location.
 */

/**
 * Success Message Keys
 *
 * Translation keys for successful authentication operations.
 */
export const AUTH_SUCCESS_MESSAGES = {
  SIGNUP: 'auth.success.signup',
  LOGIN: 'auth.success.login',
  LOGOUT: 'auth.success.logout',
  PASSWORD_RESET_REQUEST: 'auth.success.passwordResetRequest',
  PASSWORD_RESET: 'auth.success.passwordReset',
  PROFILE_UPDATE: 'auth.success.profileUpdate',
  EMAIL_UPDATE: 'auth.success.emailUpdate',
  PASSWORD_UPDATE: 'auth.success.passwordUpdate',
  OAUTH_INITIATED: 'auth.success.oauthInitiated',
} as const;

/**
 * Error Message Keys
 *
 * Translation keys for failed authentication operations.
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'auth.errors.invalidCredentials',
  USER_ALREADY_EXISTS: 'auth.errors.userAlreadyExists',
  USER_NOT_FOUND: 'auth.errors.userNotFound',
  WEAK_PASSWORD: 'auth.errors.weakPassword',
  PASSWORDS_DO_NOT_MATCH: 'auth.errors.passwordsDoNotMatch',
  INVALID_EMAIL: 'auth.errors.invalidEmail',
  INVALID_TOKEN: 'auth.errors.invalidToken',
  SESSION_EXPIRED: 'auth.errors.sessionExpired',
  UNAUTHORIZED: 'auth.errors.unauthorized',
  GENERIC_ERROR: 'auth.errors.genericError',
  NETWORK_ERROR: 'auth.errors.networkError',
  OAUTH_ERROR: 'auth.errors.oauthError',
  OAUTH_CANCELLED: 'auth.errors.oauthCancelled',
  EMAIL_IN_USE: 'auth.errors.emailInUse',
  RATE_LIMIT_EXCEEDED: 'auth.errors.rateLimitExceeded',
  NOT_AUTHENTICATED: 'auth.errors.notAuthenticated',
  NO_REDIRECT_URL: 'auth.errors.noRedirectUrl',
} as const;

/**
 * Validation Message Keys
 *
 * Translation keys for form validation.
 */
export const AUTH_VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'auth.validation.emailRequired',
  EMAIL_INVALID: 'auth.validation.emailInvalid',
  PASSWORD_REQUIRED: 'auth.validation.passwordRequired',
  PASSWORD_MIN_LENGTH: 'auth.validation.passwordMinLength',
  PASSWORD_UPPERCASE: 'auth.validation.passwordUppercase',
  PASSWORD_NUMBER: 'auth.validation.passwordNumber',
  CONFIRM_PASSWORD_REQUIRED: 'auth.validation.confirmPasswordRequired',
  PASSWORDS_MUST_MATCH: 'auth.validation.passwordsMustMatch',
} as const;
