import { Suspense } from 'react';

import { StoresListContainer } from '@/features/stores/components/stores-list-container';
import { StoresListSkeleton } from '@/features/stores/components/stores-list-skeleton';

/**
 * Stores List Page
 *
 * Displays all stores owned by the authenticated user.
 * Uses Suspense for loading state with skeleton fallback.
 */
export default async function StoresPage() {
  // Auth is handled by the parent layout

  return (
    <div className="flex-1 bg-[#f8f5f2] px-2 dark:bg-background">
      <div className="container mx-auto py-8">
        <Suspense fallback={<StoresListSkeleton />}>
          <StoresListContainer />
        </Suspense>
      </div>
    </div>
  );
}
