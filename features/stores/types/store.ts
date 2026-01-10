/**
 * Store feature type definitions
 *
 * Re-exports Prisma types and creates extended types for relations
 * following models.md pattern for Prisma type reuse
 */

import type { Store as PrismaStore, User } from '@prisma/client';

/**
 * Base Store type from Prisma
 *
 * Re-exported from @prisma/client to maintain single source of truth
 */
export type Store = PrismaStore;

/**
 * Store with Owner (User) relation
 *
 * Extended type that includes the user who owns this store
 * Used when querying stores with owner data included
 * Includes subdomain and description fields from the Store model
 */
export interface StoreWithOwner extends PrismaStore {
  owner: User;
}

/**
 * Input type for creating a new store
 *
 * Omits auto-generated fields (id, createdAt, updatedAt)
 * Used in forms and server actions for store creation
 */
export type CreateStoreInput = Omit<Store, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Props for CreateStoreForm component
 *
 * Optional className for styling customization
 */
export interface CreateStoreFormProps {
  className?: string;
}

/**
 * Props for CreateStoreButton component
 *
 * Simple button + dialog without access control logic
 */
export interface CreateStoreButtonProps {
  /** Optional className for styling customization */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
}

/**
 * Props for FirstStoreCTA component
 *
 * CTA card displayed when user has no stores
 */
export interface FirstStoreCTAProps {
  /** Current number of stores the user has */
  currentStoreCount: number;
  /** User's account type (FREE, PRO, ENTERPRISE) */
  accountType: 'FREE' | 'PRO' | 'ENTERPRISE';
}

