/**
 * Store Header Bar Component (Server Component)
 *
 * Autonomous server component that fetches store data
 * and renders the store header visual.
 * Used in the store layout to display the header.
 */

import { getStoreHeaderAction } from '@/features/stores/actions/get-store-header.action';
import { StoreHeaderVisual } from '@/features/stores/components/store-header-visual';

export interface StoreHeaderBarProps {
  subdomain: string;
}

export async function StoreHeaderBar({ subdomain }: StoreHeaderBarProps) {
  const result = await getStoreHeaderAction(subdomain);
  console.log("🚀 ~ StoreHeaderBar ~ result:", result)

  // Don't render anything if there's an error or no store found
  if (result.hasError || !result.payload) {
    return null;
  }

  return (
    <div className="bg-card shadow-sm">
      <StoreHeaderVisual store={result.payload} isOwner />
    </div>
  );
}
