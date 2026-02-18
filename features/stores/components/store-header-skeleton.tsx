/**
 * Store Header Skeleton Component
 *
 * Loading skeleton for the store header.
 * Displayed while the StoreHeaderBar is loading data.
 * Mirrors the EntityBanner lg + overlap-bottom + container layout.
 */

import { Skeleton } from '@/features/shadcn/components/ui/skeleton';

export function StoreHeaderSkeleton() {
  return (
    <div className="relative min-h-48 w-full border-b border-border/60 bg-linear-to-br from-background via-muted/25 to-muted/45 pt-16 pb-4 sm:pb-5">
      <div className="container mx-auto flex items-end justify-between gap-3 px-5 sm:px-7">
        <div className="flex-1 space-y-1.5 pb-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      {/* Avatar overlap-bottom */}
      <div className="absolute bottom-0 left-6 hidden translate-y-1/2 md:block">
        <Skeleton className="h-28 w-28 rounded-full border-4 border-background" />
      </div>
    </div>
  );
}
