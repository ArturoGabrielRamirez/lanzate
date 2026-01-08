/**
 * Subscription feature type definitions
 *
 * Re-exports Prisma types and creates extended types for relations
 * following models.md pattern for Prisma type reuse
 */

import type { Subscription as PrismaSubscription, AccountType, User } from '@prisma/client';

/**
 * Base Subscription type from Prisma
 *
 * Re-exported from @prisma/client to maintain single source of truth
 */
export type Subscription = PrismaSubscription;

/**
 * AccountType enum from Prisma
 *
 * Possible values: FREE, PRO, ENTERPRISE
 */
export { AccountType };

/**
 * Subscription with User relation
 *
 * Extended type that includes the user associated with this subscription
 * Used when querying subscriptions with user data included
 */
export interface SubscriptionWithUser extends PrismaSubscription {
  user: User;
}
