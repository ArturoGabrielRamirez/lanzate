/**
 * Store Stats Skeleton Component
 *
 * Loading skeleton for the StoreStats component.
 * Displays placeholder cards while data is being fetched.
 */

import type { StoreStatsSkeletonProps } from '@/features/dashboard/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/features/shadcn/components/ui/card';
import { Skeleton } from '@/features/shadcn/components/ui/skeleton';


export function StoreStatsSkeleton({ cardCount = 3 }: StoreStatsSkeletonProps) {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-7 w-36" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Cards grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardCount }).map((_, index) => (
          <Card key={index} className="gap-2 py-3">
            <CardHeader className="gap-1 py-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter className="py-0">
              <div className="flex items-center gap-1">
                <Skeleton className="h-3 w-3 rounded" />
                <Skeleton className="h-3 w-16" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
