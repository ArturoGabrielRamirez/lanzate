/**
 * Store feature type definitions
 *
 * Re-exports Prisma types and creates extended types for relations
 * following models.md pattern for Prisma type reuse
 */

import type { AccountType, Store as PrismaStore, User } from '@prisma/client';

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
    accountType: AccountType;
}

/**
 * Props for StorefrontPage component
 *
 * Page props for the subdomain-based storefront route
 */
export interface StorefrontPageProps {
    params: Promise<{ subdomain: string }>;
}

/**
 * Store Theme Configuration
 *
 * Defines the visual customization of a public storefront.
 * Today this is returned with static defaults from the data layer.
 * When a `store_themes` table is added to Prisma, only the data
 * function changes — no component updates needed.
 *
 * CSS custom properties are injected at the layout root, allowing
 * all child components to use `var(--sf-*)` without prop drilling.
 */
export interface StoreTheme {
    /** Primary accent color (used for buttons, links, highlights) */
    primaryColor: string;
    /** Page background color */
    backgroundColor: string;
    /** Default text color */
    textColor: string;
    /** Border radius applied consistently across cards and inputs */
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    /** Base font family for the storefront */
    fontFamily: 'sans' | 'serif' | 'mono';
    /** Alignment of the header content */
    headerLayout: 'centered' | 'left' | 'right';
    /** Whether to display the store logo in the header */
    showHeaderLogo: boolean;
    /** Whether to render the footer */
    showFooter: boolean;
}

/**
 * Store Public Data
 *
 * Combined type returned by the public data action.
 * Groups a store record with its associated theme configuration
 * so both are fetched in a single round-trip.
 */
export interface StorePublicData {
    store: Store;
    theme: StoreTheme;
}
