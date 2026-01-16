
import {
  PLAN_CONFIG,
  PAID_PLANS,
  DEFAULT_ACCOUNT_TYPE,
  PLAN_HIERARCHY,
  ACCOUNT_TYPES,
  type PlanConfig,
  type PaidPlan,
} from '@/features/subscriptions/config/planPricing.constants';

import type { AccountType } from '@prisma/client';
/**
 * Plan pricing utility functions
 *
 * Helper functions for accessing plan configuration data.
 * Use these functions instead of accessing PLAN_CONFIG directly
 * when you need individual properties.
 *
 * @example
 * import { getPlanPrice, getPlanDisplayName } from '@/features/subscriptions/config';
 *
 * const proPrice = getPlanPrice('PRO'); // 10000
 * const proName = getPlanDisplayName('PRO'); // 'Business'
 */

/**
 * Get the monthly price for a plan
 */
export function getPlanPrice(plan: AccountType): number {
  return PLAN_CONFIG[plan].price;
}

/**
 * Get the display name for a plan
 */
export function getPlanDisplayName(plan: AccountType): string {
  return PLAN_CONFIG[plan].displayName;
}

/**
 * Get the currency for a plan
 */
export function getPlanCurrency(plan: AccountType): string {
  return PLAN_CONFIG[plan].currency;
}

/**
 * Get billing frequency in months
 */
export function getPlanBillingFrequency(plan: AccountType): number {
  return PLAN_CONFIG[plan].billingFrequency;
}

/**
 * Get full plan config
 */
export function getPlanConfig(plan: AccountType): PlanConfig {
  return PLAN_CONFIG[plan];
}

/**
 * Check if a plan is paid (not FREE)
 */
export function isPaidPlan(plan: AccountType): plan is PaidPlan {
  return plan !== ACCOUNT_TYPES.FREE;
}

/**
 * Get all paid plans
 */
export function getPaidPlans(): PaidPlan[] {
  return [...PAID_PLANS];
}

/**
 * Check if plan is FREE
 */
export function isFreePlan(plan: AccountType): boolean {
  return plan === ACCOUNT_TYPES.FREE;
}

/**
 * Check if plan is PRO
 */
export function isProPlan(plan: AccountType): boolean {
  return plan === ACCOUNT_TYPES.PRO;
}

/**
 * Check if plan is ENTERPRISE
 */
export function isEnterprisePlan(plan: AccountType): boolean {
  return plan === ACCOUNT_TYPES.ENTERPRISE;
}

/**
 * Get default account type for fallbacks
 */
export function getDefaultAccountType(): AccountType {
  return DEFAULT_ACCOUNT_TYPE;
}

/**
 * Get plan hierarchy level (useful for comparisons)
 */
export function getPlanHierarchyLevel(plan: AccountType): number {
  return PLAN_HIERARCHY[plan];
}

/**
 * Check if source plan can upgrade to target plan
 */
export function canUpgradeTo(
  currentPlan: AccountType,
  targetPlan: AccountType
): boolean {
  return PLAN_HIERARCHY[currentPlan] < PLAN_HIERARCHY[targetPlan];
}
