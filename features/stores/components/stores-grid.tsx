'use client';

/**
 * Stores Grid Component
 *
 * Grid container that displays StoreCard components with optional NewStoreCard.
 * Handles empty state with FirstStoreCTA.
 *
 * @example
 * ```tsx
 * <StoresGrid stores={stores} accountType="FREE" totalCount={5} />
 * ```
 */

import { FirstStoreCTA } from '@/features/stores/components/first-store-cta';
import { NewStoreCard } from '@/features/stores/components/new-store-card';
import { StoreCard } from '@/features/stores/components/store-card';
import type { StoresGridProps } from '@/features/stores/types';

const DEFAULT_ANIMATION_DELAY = 0.1;

export function StoresGrid({
  stores,
  accountType,
  totalCount,
  animationDelay = DEFAULT_ANIMATION_DELAY,
  showNewStoreCard = true,
}: StoresGridProps) {
  const hasStores = stores.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Store Cards */}
      {stores.map((store, index) => (
        <StoreCard
          key={store.id}
          store={store}
          index={index}
          animationDelay={animationDelay}
        />
      ))}

      {/* New Store Card - Only show if user has existing stores */}
      {hasStores && showNewStoreCard && (
        <NewStoreCard
          currentStoreCount={totalCount}
          accountType={accountType}
          index={stores.length}
          animationDelay={animationDelay}
        />
      )}

      {/* First Store CTA - Only show if no stores */}
      {!hasStores && (
        <FirstStoreCTA currentStoreCount={0} accountType={accountType} />
      )}
    </div>
  );
}
