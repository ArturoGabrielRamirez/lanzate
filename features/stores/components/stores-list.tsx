'use client';

/**
 * Stores List Component
 *
 * Displays all user's stores in a grid layout.
 * Used on the /stores page to show all stores without limit.
 *
 * Features:
 * - Grid layout with store cards
 * - Animated card entrance with framer-motion
 * - "New store" card with dashed border
 * - Link to store detail page
 */

import { SectionHeader } from '@/features/dashboard/components/section-header';
import { StoresGrid } from '@/features/stores/components/stores-grid';
import type { StoresListProps } from '@/features/stores/types';

export function StoresList({ stores, accountType, totalCount }: StoresListProps) {
  return (
    <div>
      <SectionHeader title="Tus Tiendas" count={totalCount} />
      <StoresGrid
        stores={stores}
        accountType={accountType}
        totalCount={totalCount}
        animationDelay={0.05}
      />
    </div>
  );
}
