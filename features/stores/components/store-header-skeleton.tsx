/**
 * Store Header Skeleton Component
 *
 * Loading skeleton for the store header.
 * Displayed while the StoreHeaderBar is loading data.
 */

import { Skeleton } from '@/features/shadcn/components/ui/skeleton';

export function StoreHeaderSkeleton() {
  return (
    <div className="bg-card shadow-sm">
      {/* Cover skeleton */}
      <Skeleton className="h-48 w-full md:h-56 lg:h-64" />

      {/* Avatar skeleton - overlapping */}
      <div className="relative -mt-12 container mx-auto">
        <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
      </div>

      {/* Store info skeleton */}
      <div className="space-y-4 pt-4 pb-6 container mx-auto">
        {/* Name skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Description skeleton */}
        <Skeleton className="h-4 w-64" />

        {/* Buttons skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
