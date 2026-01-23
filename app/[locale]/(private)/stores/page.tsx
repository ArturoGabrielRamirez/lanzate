import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { StoresListContainer } from '@/features/stores/components/stores-list-container';
import { StoresListSkeleton } from '@/features/stores/components/stores-list-skeleton';
import { createClient } from '@/lib/supabase/server';

/**
 * Stores List Page
 *
 * Displays all stores owned by the authenticated user.
 * Uses Suspense for loading state with skeleton fallback.
 */
export default async function StoresPage() {
  // Check authentication status
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="bg-[#f8f5f2] px-2 dark:bg-background">
      <main className="container mx-auto py-8">
        <Suspense fallback={<StoresListSkeleton />}>
          <StoresListContainer />
        </Suspense>
      </main>
    </div>
  );
}
