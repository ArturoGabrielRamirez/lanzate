import { notFound, redirect } from 'next/navigation';

import { getAuthUser } from '@/features/auth/utils';
import { getStoreDetailAction } from '@/features/stores/actions/get-store-detail.action';
import { StoreDetail } from '@/features/stores/components/store-detail';
import type { StorefrontPageProps } from '@/features/stores/types';

/**
 * Store Detail Page
 *
 * Displays detailed information about a store owned by the user.
 * Verifies ownership before showing store data.
 */
export default async function StoreDetailPage({ params }: StorefrontPageProps) {
  const { subdomain } = await params;

  // Check authentication status
  const user = await getAuthUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Fetch store detail with ownership verification
  const result = await getStoreDetailAction(subdomain);

  // Handle not found
  if (result.hasError || !result.payload) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8f5f2] px-2 dark:bg-background">
      <main className="container mx-auto py-8">
        <StoreDetail store={result.payload} />
      </main>
    </div>
  );
}
