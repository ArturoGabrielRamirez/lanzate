/**
 * Store Stats Container Component
 *
 * Server Component that fetches user stores data and passes it to StoreStats.
 * Used with Suspense boundary for loading state.
 */

import { getUserStoresAction } from '@/features/dashboard/actions';
import { StoreStats } from '@/features/dashboard/components/store-stats';

export async function StoreStatsContainer() {
  const result = await getUserStoresAction();

  // Handle error or no data case
  if (result.hasError || !result.payload) {
    return (
      <StoreStats
        stores={[]}
        accountType="FREE"
        totalCount={0}
      />
    );
  }

  const { stores, accountType, totalCount } = result.payload;

  return (
    <StoreStats
      stores={stores}
      accountType={accountType}
      totalCount={totalCount}
    />
  );
}
