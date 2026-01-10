import type { AccountType } from '@prisma/client';

/**
 * Props for CreateStoreButtonGate component
 *
 * Wraps CreateStoreButton with access control based on account limits
 */
export interface CreateStoreButtonGateProps {
  /** Current number of stores the user has */
  currentStoreCount: number;
  /** User's account type (FREE, PRO, ENTERPRISE) */
  accountType: AccountType;
  /** Optional className for styling customization */
  className?: string;
}
