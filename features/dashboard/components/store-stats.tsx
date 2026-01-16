'use client';

/**
 * Store Stats Component
 *
 * Displays the user's store cards in a compact layout.
 * Shows real store data and a "New store" card for creating more.
 *
 * Features:
 * - Compact card design using shadcn Card subcomponents
 * - Real store data (name, description, date)
 * - Animated card entrance with framer-motion
 * - "New store" card with dashed border
 * - Link to see all stores
 */

import { SectionHeader } from '@/features/dashboard/components/section-header';
import type { StoreStatsProps } from '@/features/dashboard/types';
import { StoresGrid } from '@/features/stores/components';

export function StoreStats({ stores, accountType, totalCount }: StoreStatsProps) {
  const hasStores = stores.length > 0;

  return (
    <div>
      <SectionHeader
        title="Your Stores"
        count={totalCount}
        href={hasStores ? '/stores' : undefined}
      />
      <StoresGrid
        stores={stores}
        accountType={accountType}
        totalCount={totalCount}
      />
    </div>
  );
}
