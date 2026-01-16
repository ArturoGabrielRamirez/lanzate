/**
 * Stores List Skeleton Component
 *
 * Loading skeleton for the StoresList component.
 * Displays placeholder cards while data is being fetched.
 */

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/features/shadcn/components/ui/card';
import { Skeleton } from '@/features/shadcn/components/ui/skeleton';

interface StoresListSkeletonProps {
  cardCount?: number;
}

export function StoresListSkeleton({ cardCount = 6 }: StoresListSkeletonProps) {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-7 w-36" />
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
