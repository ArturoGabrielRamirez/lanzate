/**
 * Billing Messages Constants
 *
 * This file contains all user-facing message keys used across
 * the billing feature. Values are next-intl translation keys
 * so the client can call t(result.message) to display the translated string.
 */

/**
 * Success Message Keys
 *
 * Translation keys for successful billing operations.
 */
export const BILLING_SUCCESS_MESSAGES = {
  CHECKOUT_CREATED: 'billing.success.checkoutCreated',
  INVOICE_GENERATED: 'billing.success.invoiceGenerated',
  BILLING_HISTORY_FETCHED: 'billing.success.billingHistoryFetched',
  SUBSCRIPTION_STATUS_FETCHED: 'billing.success.subscriptionStatusFetched',
  PLAN_CHANGE_LOGGED: 'billing.success.planChangeLogged',
} as const;

/**
 * Error Message Keys
 *
 * Translation keys for failed billing operations.
 */
export const BILLING_ERROR_MESSAGES = {
  PLAN_INVALID: 'billing.errors.planInvalid',
  NOT_AUTHENTICATED: 'billing.errors.notAuthenticated',
  PAYMENT_NOT_FOUND: 'billing.errors.paymentNotFound',
  INVOICE_NOT_FOUND: 'billing.errors.invoiceNotFound',
  SUBSCRIPTION_NOT_FOUND: 'billing.errors.subscriptionNotFound',
  GENERIC_ERROR: 'billing.errors.genericError',
} as const;
