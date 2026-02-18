/**
 * Profile Header Skeleton Component
 *
 * Loading skeleton for the profile header.
 * Displayed while ProfileHeaderBar is loading data.
 */

import { Skeleton } from '@/features/shadcn/components/ui/skeleton';

export function ProfileHeaderSkeleton() {
  return (
    <div className="relative min-h-36 w-full border-b border-border/60 bg-linear-to-br from-background via-muted/25 to-muted/45 pt-16 pb-4 sm:pb-5">
      <div className="container mx-auto flex items-center justify-between gap-3 px-5 sm:px-7">
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="h-12 w-12 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}
