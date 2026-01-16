/**
 * Stores List Container Component
 *
 * Server Component that fetches all user stores and passes to StoresList.
 * Used with Suspense boundary for loading state.
 */

import { getUserStoresAction } from '@/features/dashboard/actions';
import { StoresList } from '@/features/stores/components/stores-list';

export async function StoresListContainer() {
  // Pass undefined to get all stores (no limit)
  const result = await getUserStoresAction(undefined);

  // Handle error or no data case
  if (result.hasError || !result.payload) {
    return (
      <StoresList
        stores={[]}
        accountType="FREE"
        totalCount={0}
      />
    );
  }

  const { stores, accountType, totalCount } = result.payload;

  return (
    <StoresList
      stores={stores}
      accountType={accountType}
      totalCount={totalCount}
    />
  );
}
