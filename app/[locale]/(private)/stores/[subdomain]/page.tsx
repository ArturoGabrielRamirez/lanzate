import { notFound, redirect } from 'next/navigation';

import { getStoreDetailAction } from '@/features/stores/actions/getStoreDetail.action';
import { StoreDetail } from '@/features/stores/components/store-detail';
import { createClient } from '@/lib/supabase/server';

interface StoreDetailPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

/**
 * Store Detail Page
 *
 * Displays detailed information about a store owned by the user.
 * Verifies ownership before showing store data.
 */
export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const { subdomain } = await params;

  // Check authentication status
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
