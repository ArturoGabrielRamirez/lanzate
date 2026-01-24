/**
 * UserAvatar Container Component (Server Component)
 *
 * Fetches user data and renders the UserAvatarMenu.
 * Used with Suspense for loading states.
 */

import { getCurrentUserAction } from '@/features/auth/actions/getCurrentUser.action';
import { UserAvatarMenu } from '@/features/layout/components/user-avatar-menu';
import { UserAvatarSkeleton } from '@/features/layout/components/user-avatar-skeleton';
import type { UserAvatarData } from '@/features/layout/types';

export async function UserAvatarContainer() {
  const result = await getCurrentUserAction();

  // If error or no user, show skeleton as fallback
  if (result.hasError || !result.payload) {
    return <UserAvatarSkeleton />;
  }

  const { authUser, user } = result.payload;

  // Build user data from auth and database user
  const userData: UserAvatarData = {
    name: user?.name || authUser.user_metadata?.full_name || null,
    email: authUser.email || '',
    image: user?.image || authUser.user_metadata?.avatar_url || null,
  };

  return <UserAvatarMenu user={userData} />;
}
