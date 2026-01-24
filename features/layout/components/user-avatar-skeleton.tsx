/**
 * UserAvatar Skeleton Component
 *
 * Loading skeleton for the user avatar.
 * Displayed while the UserAvatarContainer is loading data.
 */

import { Skeleton } from '@/features/shadcn/components/ui/skeleton';

export function UserAvatarSkeleton() {
  return (
    <Skeleton className="h-8 w-8 rounded-full" />
  );
}
