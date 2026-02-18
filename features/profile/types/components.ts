/**
 * Profile component type definitions
 */

import type { UserWithStores } from '@/features/auth/types';

export interface ProfileHeaderBarProps {}

export interface ProfileHeaderVisualProps {
  user: UserWithStores;
}

export interface ProfileHeaderToolbarProps {}
